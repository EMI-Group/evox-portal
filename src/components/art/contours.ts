// Marching-squares segments per case, as pairs of edges: 0 top, 1 right, 2 bottom, 3 left.
const SEGMENTS = [[], [3, 2], [2, 1], [3, 1], [0, 1], [0, 1, 3, 2], [0, 2], [3, 0], [3, 0], [0, 2], [3, 0, 2, 1], [0, 1], [3, 1], [2, 1], [3, 2], []];

// Traces iso-lines of a row-major height grid sampled every `cell` px, one Path2D per level.
export function traceContours(grid: Float32Array, cols: number, rows: number, cell: number, levels: number[]) {
  const paths = levels.map(() => new Path2D()), c = cell;
  let level = 0, a = 0, b = 0, d = 0, e = 0, x0 = 0, y0 = 0, ex = 0, ey = 0;
  const edge = (n: number) => {
    if (n === 0) { ex = x0 + c * (level - a) / (b - a); ey = y0; }
    else if (n === 1) { ex = x0 + c; ey = y0 + c * (level - b) / (e - b); }
    else if (n === 2) { ex = x0 + c * (level - d) / (e - d); ey = y0 + c; }
    else { ex = x0; ey = y0 + c * (level - a) / (d - a); }
  };
  for (let l = 0; l < levels.length; l++) {
    level = levels[l];
    const path = paths[l];
    for (let j = 0; j < rows - 1; j++) for (let i = 0; i < cols - 1; i++) {
      a = grid[j * cols + i]; b = grid[j * cols + i + 1]; d = grid[(j + 1) * cols + i]; e = grid[(j + 1) * cols + i + 1];
      const segs = SEGMENTS[(a > level ? 8 : 0) | (b > level ? 4 : 0) | (e > level ? 2 : 0) | (d > level ? 1 : 0)];
      if (!segs.length) continue;
      x0 = i * c; y0 = j * c;
      for (let s = 0; s < segs.length; s += 2) {
        edge(segs[s]); path.moveTo(ex, ey);
        edge(segs[s + 1]); path.lineTo(ex, ey);
      }
    }
  }
  return paths;
}

// Contour stroke: higher levels are stronger and every fifth level is an index contour.
export function strokeContours(ctx: CanvasRenderingContext2D, paths: Path2D[], ink: [number, number, number], dark: boolean, gain = 1) {
  const [r, g, b] = ink;
  for (let l = 0; l < paths.length; l++) {
    const t = paths.length > 1 ? l / (paths.length - 1) : 1, index = l % 5 === 4;
    const alpha = ((dark ? .05 : .045) + t * (dark ? .2 : .18) + (index ? .05 : 0)) * gain;
    ctx.lineWidth = index ? 1.2 : .8;
    ctx.strokeStyle = `rgba(${r},${g},${b},${Math.max(0, Math.min(1, alpha))})`;
    ctx.stroke(paths[l]);
  }
}
