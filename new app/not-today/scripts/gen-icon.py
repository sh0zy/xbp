"""
Not Today icon generator
- 512x512 / 192x192 PWA icons (rounded square)
- 1024x1024 listing thumbnail (square, no rounding)
- Themed: dark navy gradient + cyan hourglass + emerald sand
"""
from __future__ import annotations
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT_PWA = ROOT / "public" / "icons"
OUT_LIST = ROOT.parents[1] / "images" / "apps"

NAVY_TOP = (15, 23, 42)        # #0f172a
NAVY_BOT = (30, 41, 80)        # deeper midnight
CYAN = (56, 189, 248)          # #38bdf8 (sky-400)
CYAN_SOFT = (125, 211, 252)    # sky-300
EMERALD = (52, 211, 153)       # #34d399
WHITE = (241, 245, 249)        # slate-100
SLATE = (148, 163, 184)        # slate-400


def vertical_gradient(size: int, top: tuple[int, int, int], bottom: tuple[int, int, int]) -> Image.Image:
    img = Image.new("RGB", (size, size), top)
    px = img.load()
    for y in range(size):
        t = y / max(1, size - 1)
        r = int(top[0] + (bottom[0] - top[0]) * t)
        g = int(top[1] + (bottom[1] - top[1]) * t)
        b = int(top[2] + (bottom[2] - top[2]) * t)
        for x in range(size):
            px[x, y] = (r, g, b)
    return img


def radial_glow(size: int, center: tuple[int, int], radius: int, color: tuple[int, int, int], alpha: int) -> Image.Image:
    layer = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    cx, cy = center
    draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius], fill=(*color, alpha))
    return layer.filter(ImageFilter.GaussianBlur(radius // 2))


def rounded_mask(size: int, radius: int) -> Image.Image:
    m = Image.new("L", (size, size), 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, size, size], radius=radius, fill=255)
    return m


def hourglass(size: int, color: tuple[int, int, int], sand_color: tuple[int, int, int]) -> Image.Image:
    """Draw a stylized hourglass on a transparent canvas."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    cx = size // 2

    # geometry (relative to canvas)
    top_y = int(size * 0.12)
    bot_y = int(size * 0.88)
    half_w = int(size * 0.30)
    neck_y = int(size * 0.50)
    neck_w = int(size * 0.03)
    cap_h = int(size * 0.045)

    # frame thickness (stroke as polygon offsets)
    th = max(3, size // 64)

    # outer outline (two triangles meeting at neck) — drawn as polygon for crisp anti-aliasing
    top_tri = [(cx - half_w, top_y), (cx + half_w, top_y), (cx + neck_w, neck_y), (cx - neck_w, neck_y)]
    bot_tri = [(cx - neck_w, neck_y), (cx + neck_w, neck_y), (cx + half_w, bot_y), (cx - half_w, bot_y)]
    d.polygon(top_tri, outline=color, fill=None, width=th)
    d.polygon(bot_tri, outline=color, fill=None, width=th)

    # caps (top & bottom horizontal bars)
    d.rectangle([cx - half_w - th, top_y - cap_h, cx + half_w + th, top_y], fill=color)
    d.rectangle([cx - half_w - th, bot_y, cx + half_w + th, bot_y + cap_h], fill=color)

    # sand: fills bottom triangle ~60%
    sand_top_y = neck_y + int((bot_y - neck_y) * 0.40)
    sand_left = cx - int((half_w - neck_w) * ((bot_y - sand_top_y) / (bot_y - neck_y))) - neck_w
    sand_right = cx + int((half_w - neck_w) * ((bot_y - sand_top_y) / (bot_y - neck_y))) + neck_w
    # trapezoid sand shape with curved top
    sand_pts = [
        (sand_left, sand_top_y),
        (sand_right, sand_top_y),
        (cx + half_w - th * 2, bot_y - th),
        (cx - half_w + th * 2, bot_y - th),
    ]
    d.polygon(sand_pts, fill=sand_color)

    # small falling sand stream through neck
    stream_x = cx
    stream_top = neck_y + th
    stream_bot = sand_top_y - th // 2
    d.line([(stream_x, stream_top), (stream_x, stream_bot)], fill=sand_color, width=max(2, th // 2))

    return img


def add_text(img: Image.Image, text: str, y_frac: float, color, font_size: int, weight_paths=None):
    d = ImageDraw.Draw(img)
    font = None
    candidates = weight_paths or [
        "C:/Windows/Fonts/segoeuib.ttf",   # Segoe UI Bold
        "C:/Windows/Fonts/seguibl.ttf",    # Segoe UI Black
        "C:/Windows/Fonts/arialbd.ttf",    # Arial Bold
        "C:/Windows/Fonts/arial.ttf",
    ]
    for fp in candidates:
        try:
            font = ImageFont.truetype(fp, font_size)
            break
        except Exception:
            continue
    if font is None:
        font = ImageFont.load_default()
    W, H = img.size
    bbox = d.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    x = (W - tw) // 2 - bbox[0]
    y = int(H * y_frac) - th // 2 - bbox[1]
    d.text((x, y), text, font=font, fill=color)


def render_icon(size: int, rounded: bool, with_wordmark: bool) -> Image.Image:
    """Render at 4x for AA quality then downsample."""
    SCALE = 4
    big = size * SCALE

    # background gradient + soft radial glow
    bg = vertical_gradient(big, NAVY_TOP, NAVY_BOT).convert("RGBA")
    glow = radial_glow(big, (big // 2, int(big * 0.38)), int(big * 0.42), CYAN, alpha=90)
    bg = Image.alpha_composite(bg, glow)

    # hourglass
    hg = hourglass(big, CYAN, EMERALD)
    bg = Image.alpha_composite(bg, hg)

    # wordmark
    if with_wordmark:
        add_text(bg, "NOT TODAY", y_frac=0.94, color=WHITE, font_size=int(big * 0.085))

    # downsample
    final = bg.resize((size, size), Image.LANCZOS)

    if rounded:
        radius = int(size * 0.22)
        mask = rounded_mask(size, radius)
        out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        out.paste(final, (0, 0), mask)
        return out
    return final


def main():
    OUT_PWA.mkdir(parents=True, exist_ok=True)
    OUT_LIST.mkdir(parents=True, exist_ok=True)

    # PWA icons: rounded square with wordmark
    for sz in (192, 512):
        img = render_icon(sz, rounded=True, with_wordmark=True)
        path = OUT_PWA / f"icon-{sz}.png"
        img.save(path, "PNG", optimize=True)
        print(f"wrote {path} ({sz}x{sz})")

    # also save into dist/ so the deployed PWA picks it up without re-build
    dist_icons = ROOT / "dist" / "icons"
    if dist_icons.exists():
        for sz in (192, 512):
            src = OUT_PWA / f"icon-{sz}.png"
            (dist_icons / f"icon-{sz}.png").write_bytes(src.read_bytes())
            print(f"mirrored to {dist_icons / f'icon-{sz}.png'}")

    # Listing thumbnail (no rounding, larger)
    listing = render_icon(1024, rounded=True, with_wordmark=True)
    listing_path = OUT_LIST / "not-today.png"
    listing.save(listing_path, "PNG", optimize=True)
    print(f"wrote {listing_path}")


if __name__ == "__main__":
    main()
