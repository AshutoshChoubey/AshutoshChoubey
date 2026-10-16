import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const execute = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const config = JSON.parse(await readFile(path.join(root, 'profile.config.json'), 'utf8'));
const readme = await readFile(path.join(root, 'README.md'), 'utf8');
const urls = [...new Set([
  ...Object.values(config.links || {}),
  ...(config.projects || []).map(project => project.url),
  ...(config.resources || []).map(resource => resource.url),
  ...[...readme.matchAll(/\[[^\]]*\]\((https:\/\/[^\s)]+)/g)].map(match => match[1]),
])].filter(Boolean);

async function request(url, method) {
  const args = ['--silent', '--show-error', '--location', '--max-redirs', '6', '--connect-timeout', '10', '--max-time', '25', '--proto', '=https', '--proto-redir', '=https', '--output', '/dev/null', '--write-out', '%{json}', '--user-agent', 'GitHub-Profile-Link-Review/1.0'];
  if (method === 'HEAD') args.push('--head');
  args.push(url);
  let output;
  try { output = await execute('curl', args, { maxBuffer: 1024 * 1024 }); }
  catch (error) { output = { stdout: error.stdout || '', stderr: error.stderr || error.message }; }
  try {
    const data = JSON.parse(output.stdout);
    return { method, http: data.http_code || 0, finalUrl: data.url_effective || url, redirects: data.num_redirects || 0, durationSeconds: data.time_total, transportExit: data.exitcode || 0, error: data.errormsg || output.stderr?.trim() || null };
  } catch { return { method, http: 0, finalUrl: url, redirects: 0, transportExit: 1, error: output.stderr?.trim() || 'curl returned no machine-readable status' }; }
}
async function check(url) {
  if (!url.startsWith('https://')) return { url, status: 'invalid', attempts: [], reason: 'Only explicit HTTPS links are permitted' };
  const attempts = [await request(url, 'HEAD')];
  if ([403, 404, 405, 501, 999].includes(attempts[0].http)) attempts.push(await request(url, 'GET'));
  const result = attempts.at(-1);
  const status = result.transportExit !== 0 ? 'unresolved' : result.http >= 200 && result.http < 300 ? 'reachable' : [401, 403, 429, 999].includes(result.http) ? 'blocked' : 'broken';
  return { url, status, attempts, reason: status === 'reachable' ? 'HTTP reachability verified; content claims require manual source review' : status === 'blocked' ? 'Server restricted automated access; not counted as verified' : status === 'unresolved' ? 'Transport failure; not counted as verified' : `Unexpected HTTP status ${result.http}` };
}
const results = [];
let next = 0;
await Promise.all(Array.from({ length: Math.min(4, urls.length) }, async () => {
  while (next < urls.length) { const url = urls[next++]; const result = await check(url); results.push(result); console.log(`${result.status.toUpperCase()} ${url} (${result.attempts.map(attempt => `${attempt.method} ${attempt.http}`).join(', ')})`); }
}));
results.sort((a, b) => a.url.localeCompare(b.url));
const report = { checkedAt: new Date().toISOString(), scope: 'README, official contact links and configured projects/resources', note: 'Blocked and unresolved URLs need human verification; HTTP 2xx alone does not validate professional claims.', results };
await mkdir(path.join(root, 'reports'), { recursive: true });
await writeFile(path.join(root, 'reports/link-report.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(`Saved reports/link-report.json: ${results.filter(result => result.status === 'reachable').length}/${results.length} HTTP reachable.`);
if (results.some(result => ['broken', 'invalid'].includes(result.status)) || (process.argv.includes('--strict') && results.some(result => result.status !== 'reachable'))) process.exitCode = 1;
