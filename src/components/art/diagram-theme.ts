export function readDiagramPalette() {
  const style = getComputedStyle(document.documentElement);
  const color = (name: string) => style.getPropertyValue(`--diagram-${name}`).trim();
  return { bg: color("bg"), fill: color("fill"), ink: color("ink"), muted: color("muted"), line: color("line"), red: color("red"), bright: color("bright"), soft: color("soft") };
}

export function diagramAlpha(hex: string, alpha: number) {
  const raw = hex.slice(1);
  const expanded = raw.length === 3 ? [...raw].map(value => value + value).join("") : raw;
  const channels = expanded.match(/.{2}/g)!.map(value => parseInt(value, 16));
  return `rgba(${channels.join(",")},${Math.max(0, Math.min(1, alpha))})`;
}
