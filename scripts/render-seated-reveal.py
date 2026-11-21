#!/usr/bin/env python3
"""Render the profile's portrait WebP and GIF from a supplied transparent PNG using Pillow."""

import argparse
from math import exp
from pathlib import Path
from random import Random

from PIL import Image, ImageDraw, ImageFilter, ImageOps


WIDTH, HEIGHT = 672, 432
SIZE = WIDTH, HEIGHT
WINE = (16, 7, 12)
GLOW = (55, 23, 40)
BORDER = (84, 37, 58)
ACCENT = (176, 91, 131)


def backdrop():
    background = Image.new("RGB", (WIDTH // 3, HEIGHT // 3))
    colors = []
    for y in range(background.height):
        for x in range(background.width):
            horizontal = (x * 3 - WIDTH * .52) / (WIDTH * .33)
            vertical = (y * 3 - HEIGHT * .38) / (HEIGHT * .70)
            light = exp(-1.5 * (horizontal ** 2 + vertical ** 2))
            colors.append(tuple(round(edge + light * (center - edge)) for edge, center in zip(WINE, GLOW)))
    background.putdata(colors)
    return background.resize(SIZE, Image.Resampling.BICUBIC)


def framed(image):
    ImageDraw.Draw(image).rounded_rectangle((0, 0, WIDTH - 1, HEIGHT - 1), 20, outline=BORDER, width=2)
    return image


def seated_portrait(source, background):
    original = ImageOps.exif_transpose(Image.open(source)).convert("RGBA")
    matte = original.getchannel("A")
    if matte.getextrema() == (255, 255):
        raise ValueError("Supply the background-removed seated portrait with an alpha channel.")

    matte = matte.filter(ImageFilter.MinFilter(5)).filter(ImageFilter.GaussianBlur(.65))
    original.putalpha(matte)
    cutout = original.crop(matte.getbbox())
    subject_height = HEIGHT - 23
    subject_width = round(cutout.width * subject_height / cutout.height)
    subject = cutout.resize((subject_width, subject_height), Image.Resampling.LANCZOS)
    left = (WIDTH - subject_width) // 2
    top = 34

    result = background.copy()
    shadow = Image.new("L", SIZE)
    shadow.paste(subject.getchannel("A"), (left + 11, top + 9))
    result.paste(WINE, (0, 0, WIDTH, HEIGHT), shadow.filter(ImageFilter.GaussianBlur(16)))
    result.paste(subject, (left, top), subject)

    fade = Image.new("L", (1, HEIGHT))
    fade.putdata([0] * (HEIGHT - 44) + [round(79 * (index / 43) ** 2) for index in range(44)])
    result.paste(WINE, (0, 0, WIDTH, HEIGHT), fade.resize(SIZE, Image.Resampling.NEAREST))
    return framed(result)


def tile_reveal(background, finished):
    columns, rows = 12, 8
    boxes = [
        (column * WIDTH // columns, row * HEIGHT // rows,
         (column + 1) * WIDTH // columns, (row + 1) * HEIGHT // rows)
        for row in range(rows) for column in range(columns)
    ]
    Random(402).shuffle(boxes)

    idle = background.copy()
    draw = ImageDraw.Draw(idle)
    for left, top, _, _ in boxes:
        if left and top:
            draw.point((left, top), fill=(86, 39, 62))
    framed(idle)
    tiles = [(box, idle.crop(box), finished.crop(box)) for box in boxes]

    frames = [idle]
    durations = [500]
    steps, fade_steps = 22, 4
    for step in range(1, steps + fade_steps):
        frame = idle.copy()
        draw = ImageDraw.Draw(frame)
        for index, (box, dark_tile, final_tile) in enumerate(tiles):
            start = index * steps / len(tiles)
            opacity = max(0, min(1, (step - start) / fade_steps))
            if not opacity:
                continue
            frame.paste(Image.blend(dark_tile, final_tile, opacity), box)
            if .24 <= opacity <= .63:
                x, y, right, bottom = box
                draw.line((x + 6, y + 10, x + 6, y + 5, x + 11, y + 5), fill=ACCENT)
                draw.line((right - 12, bottom - 6, right - 7, bottom - 6, right - 7, bottom - 11), fill=ACCENT)
        frames.append(framed(frame))
        durations.append(70)

    frames.append(finished)
    durations.append(5500)
    for step in range(1, 9):
        frames.append(Image.blend(finished, idle, step / 9))
        durations.append(70)
    return frames, durations


def corner_mask():
    mask = Image.new("L", SIZE)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, WIDTH - 1, HEIGHT - 1), 20, fill=255)
    return mask


def write_gif(frames, durations, portrait, mask, destination):
    swatches = Image.new("RGB", (WIDTH, HEIGHT * 2 + 12), ACCENT)
    swatches.paste(frames[0], (0, 0))
    swatches.paste(portrait, (0, HEIGHT))
    gradient_levels = 44
    adaptive_colors = 255 - gradient_levels
    palette = swatches.quantize(colors=adaptive_colors, method=Image.Quantize.MEDIANCUT)
    gradient_colors = [
        round(edge + index * (center - edge) / (gradient_levels - 1))
        for index in range(gradient_levels) for edge, center in zip(WINE, GLOW)
    ]
    visible_colors = palette.getpalette()[:3 * adaptive_colors] + gradient_colors
    palette.putpalette(visible_colors + [0, 255, 0])
    transparent = ImageOps.invert(mask)
    indexed = []
    for frame in frames:
        converted = frame.quantize(palette=palette, dither=Image.Dither.NONE)
        converted.paste(255, (0, 0), transparent)
        converted.putpalette(visible_colors + list(WINE))
        indexed.append(converted)
    indexed[0].save(destination, save_all=True, append_images=indexed[1:], loop=0,
                    duration=durations, transparency=255, disposal=1, optimize=False)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path, help="Path to the supplied seated portrait cutout")
    parser.add_argument("--output", type=Path, default=Path(__file__).resolve().parents[1] / "assets/profile-motion")
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)

    background = backdrop()
    portrait = seated_portrait(args.source, background)
    frames, durations = tile_reveal(background, portrait)
    mask = corner_mask()
    poster = portrait.copy()
    poster.putalpha(mask)
    poster.save(args.output / "seated-portrait.webp", quality=92, method=6)
    write_gif(frames, durations, portrait, mask, args.output / "seated-reveal.gif")


if __name__ == "__main__":
    main()
