import { mkdtemp, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { languageLogin, languageSnapshot, languageSource, validateLanguageSnapshot } from './language-chart.mjs';

async function github(url) {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'GitHub-profile-language-snapshot',
    },
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`GitHub returned HTTP ${response.status}.`);
  return response.json();
}

async function readRepositories() {
  const profile = await github(`https://api.github.com/users/${languageLogin}`);
  if (profile.login !== languageLogin || !Number.isSafeInteger(profile.public_repos) || profile.public_repos < 1) {
    throw new Error('Expected GitHub to report the public repository total.');
  }
  const pageSize = 100;
  const repositories = new Map();
  for (let page = 1; page <= Math.ceil(profile.public_repos / pageSize); page++) {
    const entries = await github(`${languageSource}&per_page=${pageSize}&page=${page}&sort=full_name`);
    if (!Array.isArray(entries) || entries.length > pageSize) throw new Error('Invalid GitHub repository page.');
    for (const entry of entries) {
      if (entry.owner?.login !== languageLogin || entry.private !== false || !Number.isSafeInteger(entry.id) ||
          repositories.has(entry.id) || typeof entry.fork !== 'boolean' || typeof entry.archived !== 'boolean' ||
          (entry.language !== null && typeof entry.language !== 'string')) {
        throw new Error('Unexpected or duplicate GitHub repository.');
      }
      repositories.set(entry.id, entry);
    }
  }
  if (repositories.size !== profile.public_repos) throw new Error('Repository pages do not match the public total.');
  return [...repositories.values()].filter(repo => !repo.fork && !repo.archived);
}

async function refresh() {
  const repositories = await readRepositories();
  const counts = new Map();
  for (const { language } of repositories) counts.set(language, (counts.get(language) ?? 0) + 1);
  const snapshot = {
    login: languageLogin,
    source: languageSource,
    fetchedAt: new Date().toISOString(),
    repositoryCount: repositories.length,
    languages: [...counts].sort(([first], [second]) => (first ?? '').localeCompare(second ?? '', 'en'))
      .map(([name, count]) => ({ name, count })),
  };
  validateLanguageSnapshot(snapshot);

  const output = fileURLToPath(languageSnapshot);
  const tempDirectory = await mkdtemp(path.join(path.dirname(output), '.languages-'));
  const temporary = path.join(tempDirectory, 'snapshot.json');
  try {
    await writeFile(temporary, `${JSON.stringify(snapshot, null, 2)}\n`);
    await rename(temporary, output);
  } finally {
    await rm(tempDirectory, { recursive: true, force: true });
  }
  console.log(`Refreshed primary languages across ${snapshot.repositoryCount} public repositories.`);
}

try {
  await refresh();
} catch (error) {
  console.error(`GitHub language refresh failed. Existing snapshot retained. ${error.message}`);
  process.exitCode = 1;
}
