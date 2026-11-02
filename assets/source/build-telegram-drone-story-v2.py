from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ASSETS = Path(__file__).resolve().parents[1]
SOURCE = Path(__file__).with_name("telegram-drone-story-v2-sprite-sheet.png")
LOGO = ASSETS / "brigade_logo-site-style.png"
OUTPUT = ASSETS / "telegram-drone-story-v2.gif"
PREVIEW = Path(__file__).with_name("telegram-drone-story-v2-preview.png")

CANVAS = (540, 960)
COLORS = {
    "background": "#080a0f",
    "panel": "#11151d",
    "panel_alt": "#171c25",
    "text": "#f0f2f3",
    "muted": "#919caa",
    "amber": "#ffc247",
    "green": "#70d66b",
}

FONT_BOLD = Path(r"C:\Windows\Fonts\arialbd.ttf")
FONT_REGULAR = Path(r"C:\Windows\Fonts\arial.ttf")

SCENES = [
    ("ОТРИМУЄМО ДРОН", "Готовий дрон передаємо на модернізацію"),
    ("ЗАМОВЛЯЄМО КОМПЛЕКТУЮЧІ", "Комп’ютер, живлення, мережа, кабелі"),
    ("ЧАКЛУЄМО", "Троє техніків збирають систему"),
    ("ПІДРУБАЄМО STARLINK", "Налаштовуємо інтернет-зв’язок"),
    ("ПІЛОТ З ПУЛЬТОМ\nНА ФОНІ ДРОНА", "Система готова до роботи"),
    ("ДРОН КИДАЄ ГАРБУЗ\nУ ЗОМБІ", "БІЛЬШЕ ДРОНІВ — МЕНШЕ ЗОМБІ"),
]

DURATIONS = [1300, 1300, 1300, 1400, 1500, 2200]

FRAME_EXPORTS = [
    "telegram-drone-story-v2-frame-01-receive-drone.png",
    "telegram-drone-story-v2-frame-02-order-components.png",
    "telegram-drone-story-v2-frame-03-magic-work.png",
    "telegram-drone-story-v2-frame-04-connect-starlink.png",
    "telegram-drone-story-v2-frame-05-pilot-controller.png",
    "telegram-drone-story-v2-frame-06-pumpkin-zombie.png",
]


def font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size=size)


def fit_text(
    draw: ImageDraw.ImageDraw,
    text: str,
    max_width: int,
    start_size: int,
    minimum: int = 18,
) -> ImageFont.FreeTypeFont:
    for size in range(start_size, minimum - 1, -1):
        candidate = font(FONT_BOLD, size)
        box = draw.multiline_textbbox(
            (0, 0), text, font=candidate, spacing=4, align="center", stroke_width=1
        )
        if box[2] - box[0] <= max_width:
            return candidate
    return font(FONT_BOLD, minimum)


def wrap_text(
    draw: ImageDraw.ImageDraw,
    text: str,
    selected_font: ImageFont.FreeTypeFont,
    max_width: int,
) -> str:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        box = draw.textbbox((0, 0), candidate, font=selected_font)
        if current and box[2] - box[0] > max_width:
            lines.append(current)
            current = word
        else:
            current = candidate
    if current:
        lines.append(current)
    return "\n".join(lines)


def centered_multiline(
    draw: ImageDraw.ImageDraw,
    y: int,
    text: str,
    selected_font: ImageFont.FreeTypeFont,
    fill: str,
    spacing: int = 6,
    stroke: int = 0,
) -> None:
    box = draw.multiline_textbbox(
        (0, 0),
        text,
        font=selected_font,
        spacing=spacing,
        align="center",
        stroke_width=stroke,
    )
    width = box[2] - box[0]
    draw.multiline_text(
        ((CANVAS[0] - width) // 2, y),
        text,
        font=selected_font,
        fill=fill,
        spacing=spacing,
        align="center",
        stroke_width=stroke,
        stroke_fill=COLORS["background"],
    )


def build_frame(panel: Image.Image, index: int, logo: Image.Image) -> Image.Image:
    canvas = Image.new("RGB", CANVAS, COLORS["background"])
    draw = ImageDraw.Draw(canvas)

    draw.rectangle((0, 0, 539, 143), fill=COLORS["panel"])
    draw.rectangle((0, 142, 539, 147), fill=COLORS["amber"])
    draw.rectangle((0, 688, 539, 959), fill=COLORS["panel_alt"])

    logo_copy = logo.copy()
    logo_copy.thumbnail((82, 104), Image.Resampling.LANCZOS)
    canvas.paste(logo_copy, (26, (142 - logo_copy.height) // 2), logo_copy)

    draw.text(
        (126, 37),
        "ВАЖЛИВА ДЕТАЛЬ",
        font=font(FONT_BOLD, 27),
        fill=COLORS["text"],
    )
    draw.text(
        (126, 77),
        "МОДЕРНІЗАЦІЯ ДРОНУ · 65 ОМБР",
        font=font(FONT_BOLD, 14),
        fill=COLORS["amber"],
    )

    panel = panel.resize((540, 540), Image.Resampling.NEAREST)
    canvas.paste(panel, (0, 148))

    title, subtitle = SCENES[index]
    title_font = fit_text(draw, title, 486, 36, 20)
    title_y = 712 if "\n" in title else 728
    centered_multiline(
        draw,
        title_y,
        title,
        title_font,
        COLORS["amber"],
        spacing=3,
        stroke=1,
    )

    subtitle_font = font(FONT_BOLD if index == 5 else FONT_REGULAR, 22)
    wrapped = wrap_text(draw, subtitle, subtitle_font, 456)
    subtitle_y = 812 if "\n" in title else 790
    centered_multiline(
        draw,
        subtitle_y,
        wrapped,
        subtitle_font,
        COLORS["text"],
        spacing=5,
    )

    dot_y = 917
    total_width = 6 * 18 + 5 * 12
    start_x = (CANVAS[0] - total_width) // 2
    for dot in range(6):
        x = start_x + dot * 30
        fill = COLORS["amber"] if dot <= index else COLORS["muted"]
        draw.rectangle((x, dot_y, x + 17, dot_y + 8), fill=fill)

    return canvas


def main() -> None:
    sheet = Image.open(SOURCE).convert("RGB")
    if sheet.size != (1536, 1024):
        raise ValueError(f"Unexpected sprite-sheet size: {sheet.size}")

    logo = Image.open(LOGO).convert("RGBA")
    frames: list[Image.Image] = []
    for index in range(6):
        column = index % 3
        row = index // 3
        panel = sheet.crop(
            (column * 512, row * 512, (column + 1) * 512, (row + 1) * 512)
        )
        frames.append(build_frame(panel, index, logo))

    for frame, filename in zip(frames, FRAME_EXPORTS):
        frame_path = ASSETS / filename
        frame.save(frame_path, optimize=True)
        print(f"Saved {frame_path}")

    strip = Image.new("RGB", (CANVAS[0], CANVAS[1] * len(frames)))
    for index, frame in enumerate(frames):
        strip.paste(frame, (0, index * CANVAS[1]))
    palette = strip.quantize(
        colors=128,
        method=Image.Quantize.MEDIANCUT,
        dither=Image.Dither.FLOYDSTEINBERG,
    )
    gif_frames = [
        frame.quantize(palette=palette, dither=Image.Dither.FLOYDSTEINBERG)
        for frame in frames
    ]
    gif_frames[0].save(
        OUTPUT,
        save_all=True,
        append_images=gif_frames[1:],
        duration=DURATIONS,
        loop=0,
        disposal=2,
        optimize=False,
    )

    preview = Image.new("RGB", (810, 960), COLORS["background"])
    for index, frame in enumerate(frames):
        thumbnail = frame.resize((270, 480), Image.Resampling.LANCZOS)
        preview.paste(thumbnail, ((index % 3) * 270, (index // 3) * 480))
    preview.save(PREVIEW, optimize=True)

    print(f"Saved {OUTPUT}")
    print(f"Saved {PREVIEW}")
    print(
        f"Frames: {len(gif_frames)}; size: {CANVAS}; loop: 0; "
        f"duration: {sum(DURATIONS)} ms"
    )


if __name__ == "__main__":
    main()
