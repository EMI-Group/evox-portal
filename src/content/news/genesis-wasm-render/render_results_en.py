"""Render the English chart from the original 2026-10-04 drawing parameters."""
from pathlib import Path
import xml.etree.ElementTree as ET

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.path import Path as MPath
from matplotlib.patches import PathPatch, FancyBboxPatch, Rectangle
from matplotlib.transforms import Affine2D
from matplotlib.font_manager import FontProperties, findfont
from fontTools.pens.basePen import BasePen
from fontTools.svgLib.path import parse_path

BASE = Path(__file__).resolve().parent
OUT = BASE
OUT.mkdir(exist_ok=True)
BRAND = BASE / "evox-mark.svg"
FONT = findfont(FontProperties(family="Microsoft YaHei"))
BOLD = findfont(FontProperties(family="Microsoft YaHei", weight="bold"))
BG, INK, MUTED, RED, PALE, LINE = "#fbfbfa", "#17191d", "#63676e", "#c8383c", "#f7eeee", "#dadbde"

class PathPen(BasePen):
    def __init__(self):
        super().__init__(None)
        self.points, self.codes, self.start = [], [], None
    def _moveTo(self, p):
        self.start = p
        self.points.append(p); self.codes.append(MPath.MOVETO)
    def _lineTo(self, p):
        self.points.append(p); self.codes.append(MPath.LINETO)
    def _curveToOne(self, a, b, c):
        self.points.extend([a, b, c]); self.codes.extend([MPath.CURVE4] * 3)
    def _qCurveToOne(self, a, b):
        self.points.extend([a, b]); self.codes.extend([MPath.CURVE3] * 2)
    def _closePath(self):
        self.points.append(self.start); self.codes.append(MPath.CLOSEPOLY)
    def _endPath(self):
        pass

logo_paths = []
for element in ET.parse(BRAND).getroot().iter("{http://www.w3.org/2000/svg}path"):
    if element.get("class") not in {"fil0", "fil1"}:
        continue  # The official X mark, keeping its original paths and colors.
    pen = PathPen()
    parse_path(element.get("d"), pen)
    logo_paths.append((MPath(pen.points, pen.codes), RED if element.get("class") == "fil1" else "#373435"))

def canvas(w, h):
    fig = plt.figure(figsize=(w / 100, h / 100), facecolor=BG)
    ax = fig.add_axes([0, 0, 1, 1], xlim=(0, w), ylim=(h, 0))
    ax.axis("off")
    return fig, ax

def text(ax, x, y, value, size=18, color=INK, bold=False, **kwargs):
    return ax.text(x, y, value, fontsize=size * .72,
                   fontproperties=FontProperties(fname=BOLD if bold else FONT),
                   color=color, va="center", **kwargs)

def logo(ax, x, y, height=46):
    transform = Affine2D().translate(-99913, 0).scale(height / 28473.72).translate(x, y)
    for path, color in logo_paths:
        ax.add_patch(PathPatch(path, facecolor=color, linewidth=0, transform=transform + ax.transData))

def export(fig, name):
    fig.savefig(OUT / (name + ".png"), dpi=120, facecolor=BG)
    fig.savefig(OUT / (name + ".svg"), facecolor=BG)
    svg = OUT / (name + ".svg")
    svg.write_text("\n".join(line.rstrip() for line in svg.read_text(encoding="utf-8").splitlines()) + "\n", encoding="utf-8")
    plt.close(fig)

fig, ax = canvas(900, 610)
logo(ax, 48, 28, 34)
text(ax, 106, 46, "EvoX Genesis", 26, bold=True)
text(ax, 852, 46, "WASM Render results", 16, color=MUTED, ha="right")
text(ax, 48, 108, "WebGL2.0: All 1,184 tests passed", 32, bold=True)
text(ax, 48, 149, "WebGL2.0 conformance test pass rate", 19, color=MUTED)

bar_x, bar_w = 48, 804
for y, label, note, rate, color in [
    (201, "Devin + Fable 5", "Official early trial · 12 hours", 20.5, "#8a8d93"),
    (321, "Genesis + DeepSeek V4 Flash", "Team results · About two days", 100, RED),
]:
    text(ax, 48, y, label, 23, bold=True)
    text(ax, 48, y + 30, note, 16, color=MUTED)
    text(ax, 852, y + 20, f"{rate:g}%", 31, color=color, bold=True, ha="right")
    ax.add_patch(Rectangle((bar_x, y + 55), bar_w, 16, color="#ececef", linewidth=0))
    ax.add_patch(Rectangle((bar_x, y + 55), bar_w * rate / 100, 16, color=color, linewidth=0))

for x, w, value, label in [(48, 247, "2,017/2,019", "Team Khronos CTS passes"),
                          (326, 247, "99.90%", "Team overall CTS pass rate"),
                          (604, 248, "1,184/1,184", "Team WebGL2.0 passes")]:
    ax.add_patch(FancyBboxPatch((x, 443), w, 98, boxstyle="round,pad=0,rounding_size=9", facecolor=PALE, linewidth=0))
    text(ax, x + 18, 477, value, 25 if "/" in value else 29, color=RED, bold=True)
    text(ax, x + 18, 516, label, 16, color=MUTED)
export(fig, "wasm-render-results-en")
