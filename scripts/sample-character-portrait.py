#!/usr/bin/env python3
"""Sample the supplied seated portrait into a terminal character grid."""

import argparse
import json
from pathlib import Path
import subprocess


GLYPHS = "~-+=*#%@"
ROWS = 35
CELL_WIDTH = 7.4
CELL_HEIGHT = 9.65
OPAQUE = 180


def read_cutout(source):
    stream_info = subprocess.check_output([
        "ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height",
        "-of", "json", str(source),
    ])
    dimensions = json.loads(stream_info)["streams"][0]
    width, height = dimensions["width"], dimensions["height"]
    pixels = subprocess.check_output([
        "ffmpeg", "-v", "error", "-i", str(source), "-frames:v", "1", "-f", "rawvideo",
        "-pix_fmt", "rgba", "pipe:1",
    ])
    if len(pixels) != width * height * 4 or all(alpha == 255 for alpha in pixels[3::4]):
        raise ValueError("The source must be a seated portrait cutout with a transparent background.")
    return width, height, pixels


def visible_bounds(width, height, pixels):
    left, right, top, bottom = width, 0, height, 0
    for index, alpha in enumerate(pixels[3::4]):
        if alpha >= OPAQUE:
            y, x = divmod(index, width)
            left = min(left, x)
            right = max(right, x + 1)
            top = min(top, y)
            bottom = max(bottom, y + 1)
    if left >= right or top >= bottom:
        raise ValueError("The source has no visible subject.")
    return left, top, right, bottom


def sample_cell(pixels, width, left, top, right, bottom):
    samples, sum_luminance = 0, 0.0
    for y in range(top, bottom):
        for x in range(left, right):
            index = (y * width + x) * 4
            red, green, blue, alpha = pixels[index:index + 4]
            if alpha >= OPAQUE:
                samples += 1
                sum_luminance += .2126 * red + .7152 * green + .0722 * blue
    if samples < (right - left) * (bottom - top) * .48:
        return None
    return sum_luminance / samples


def sample_grid(width, height, pixels):
    left, top, right, bottom = visible_bounds(width, height, pixels)
    # Keep the glasses and facial detail readable in a narrow terminal panel.
    bottom = top + round((bottom - top) * .82)
    columns = round((right - left) / (bottom - top) * ROWS * CELL_HEIGHT / CELL_WIDTH)
    xs = [left + round((right - left) * index / columns) for index in range(columns + 1)]
    ys = [top + round((bottom - top) * index / ROWS) for index in range(ROWS + 1)]
    luminance = [
        [sample_cell(pixels, width, x0, y0, x1, y1) for x0, x1 in zip(xs, xs[1:])]
        for y0, y1 in zip(ys, ys[1:])
    ]

    rows = []
    for y, line in enumerate(luminance):
        row = []
        for x, value in enumerate(line):
            if value is None:
                row.append(" ")
                continue
            surrounding = [
                luminance[other_y][other_x]
                for other_y in range(max(0, y - 1), min(ROWS, y + 2))
                for other_x in range(max(0, x - 1), min(columns, x + 2))
                if luminance[other_y][other_x] is not None
            ]
            sharpened = value + .4 * (value - sum(surrounding) / len(surrounding))
            contrast = max(0, min(1, (sharpened - 12) / 165)) ** .82
            row.append(GLYPHS[round(contrast * (len(GLYPHS) - 1))])
        rows.append("".join(row).rstrip())
    return rows


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path, help="Original microphone-free seated cutout")
    parser.add_argument("--output", type=Path, default=Path(__file__).resolve().parents[1] / "data/character-portrait.json")
    arguments = parser.parse_args()
    rows = sample_grid(*read_cutout(arguments.source))
    arguments.output.write_text(json.dumps(rows, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
