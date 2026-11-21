"""Render the studio pass from the existing transparent standing portrait.

Requires FFmpeg, OpenCV and NumPy. Run with python3 scripts/render-studio-walk.py.
"""

import math
import subprocess
import tempfile
from pathlib import Path

import cv2
import numpy as np


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
WIDTH, HEIGHT = 800, 400
FPS, SECONDS = 12, 10
BACKGROUND = np.array([12, 7, 16], dtype=np.float32)


def smooth(start, end, time):
    fraction = float(np.clip((time - start) / (end - start), 0, 1))
    return fraction * fraction * (3 - 2 * fraction)


def portrait():
    image = cv2.imread(str(ASSETS / "user-standing-portrait.png"), cv2.IMREAD_UNCHANGED)
    if image is None or image.shape[2] != 4:
        raise ValueError("The studio pass needs the original transparent portrait")
    opacity = image[:, :, 3]
    _, components, bounds, _ = cv2.connectedComponentsWithStats((opacity > 10).astype(np.uint8))
    subject = int(np.argmax(bounds[1:, cv2.CC_STAT_AREA])) + 1
    x, y, width, height = bounds[subject, :4]
    mask = np.where(components == subject, opacity, 0).astype(np.uint8)
    mask = cv2.erode(mask, np.ones((5, 5), dtype=np.uint8))
    mask = cv2.GaussianBlur(mask, (5, 5), .65).astype(np.float32) / 255
    pixels = np.dstack((image[:, :, :3] * mask[:, :, None], mask))
    return pixels[y:y + height, x:x + width].astype(np.float32)


def studio_background():
    y, x = np.mgrid[:HEIGHT, :WIDTH].astype(np.float32)
    broad_light = np.exp(-.5 * (((x - 406) / 230) ** 2 + ((y - 154) / 154) ** 2))
    reflected_light = np.exp(-.5 * (((x - 549) / 204) ** 2 + ((y - 316) / 106) ** 2))
    ceiling_light = np.exp(-.5 * (((x - 249) / 308) ** 2 + ((y + 19) / 90) ** 2))
    return (BACKGROUND + broad_light[:, :, None] * (22, 14, 30) +
            reflected_light[:, :, None] * (10, 5, 12) + ceiling_light[:, :, None] * (4, 4, 8)).astype(np.float32)


def frames():
    photo = portrait()
    height, width = photo.shape[:2]
    y, x = np.mgrid[:height, :width].astype(np.float32)
    # The fabric shifts slightly around the forearms. The face uses the original pixels.
    forearm = np.exp(-.5 * ((y / height - .66) / .11) ** 2)
    left = forearm * np.exp(-.5 * ((x / width - .09) / .15) ** 2)
    right = forearm * np.exp(-.5 * ((x / width - .90) / .15) ** 2)
    wall = studio_background()

    for frame in range(FPS * SECONDS):
        time = frame / FPS
        entry = smooth(.05, 3.85, time)
        exit_ = smooth(5.15, 9.62, time)
        center = smooth(2.85, 3.85, time) * (1 - smooth(5.15, 6.2, time))
        moving = smooth(.17, .82, time) * (1 - center) * (1 - smooth(8.85, 9.62, time))
        opacity = smooth(.07, .91, time) * (1 - smooth(8.75, 9.67, time))
        phase = time * math.tau * 1.18
        swing = math.sin(phase) * moving
        shifted = cv2.remap(photo, x - 5 * (left - right) * swing, y - 4 * (left - right) * swing,
                            cv2.INTER_LINEAR)
        center_x = 105 + (399 - 105) * entry + (700 - 399) * exit_
        top = 29 - 7 * center + 1.35 * math.cos(phase * 2) * moving
        scale = (HEIGHT + 7 - top) / height
        transform = cv2.getRotationMatrix2D((width / 2, height * .54), .34 * swing, scale)
        transform[0, 2] += center_x - width / 2
        transform[1, 2] += top - height * .54 * (1 - scale)
        figure = cv2.warpAffine(shifted, transform, (WIDTH, HEIGHT), flags=cv2.INTER_LINEAR)
        alpha = figure[:, :, 3:4] * opacity
        yield np.rint(wall * (1 - alpha) + figure[:, :, :3] * opacity).astype(np.uint8)


def main():
    output = ASSETS / "profile-motion"
    with tempfile.TemporaryDirectory(prefix="studio-walk-") as temporary:
        images = Path(temporary)
        for index, frame in enumerate(frames()):
            cv2.imwrite(str(images / f"{index:03d}.png"), frame)
            if index == int(FPS * 4.4):
                cv2.imwrite(str(output / "studio-walk.webp"), frame, [cv2.IMWRITE_WEBP_QUALITY, 90])
        subprocess.run([
            "ffmpeg", "-v", "error", "-y", "-framerate", str(FPS), "-i", str(images / "%03d.png"),
            "-filter_complex_threads", "1", "-filter_complex",
            "split[a][b];[a]palettegen=max_colors=224[p];[b][p]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle",
            "-gifflags", "+transdiff", "-loop", "0", str(output / "studio-walk.gif"),
        ], check=True)


if __name__ == "__main__":
    main()
