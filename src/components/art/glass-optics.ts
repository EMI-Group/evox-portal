/*!
 * Refraction profile and grey/alpha encoding adapted from css-liquid-glass:
 * https://github.com/nordify/css-liquid-glass/blob/main/src/glass/maps.ts
 * Copyright (c) 2026 Nordify
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
const SVG_NS = "http://www.w3.org/2000/svg";
const TILE_SIZE = 96;
export const REGULAR_BEZEL_RATIO = .55;
export const UNPACK_COORDINATES = "1 0 0 0 0  0 0 0 2 -1  0 0 0 0 0  0 0 0 0 1";
export type GlassTiles = { field: string[]; mask: string[] };
const smooth = (t: number) => { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); };
const BULGE_BAND = .39, LIP_BAND = .3, PROFILE_WIDTH = 1.1;
const refractionProfile = (t: number) => {
  const lip = Math.max(0, 1 - BULGE_BAND / LIP_BAND * t);
  const depth = PROFILE_WIDTH * (.5 * smooth(1 - t) + 5 * lip ** 5);
  const cap = 1.5 * (1 - BULGE_BAND * PROFILE_WIDTH * t);
  return depth / (1 + (depth / cap) ** 4) ** .25;
};
const PROFILE_PEAK = refractionProfile(0);

// Reparameterize the measured bulge + compressed lip over the material's bezel.
// Keep the entire folding band visible; fade only at its flat interior end.
export function rimSample(t: number) {
  if (t >= 1) return { displacement: 0, mask: 0 };
  t = Math.max(0, t);
  return {
    displacement: refractionProfile(t) / PROFILE_PEAK,
    mask: 1 - smooth((t - .72) / .28),
  };
}

// Grey X + alpha Y survive Chrome's Display-P3 conversion. Decode to R/G only
// immediately before displacement. Keep the blend mask in a separate image.
// Small shared tiles avoid retaining a full-panel canvas or resize history.
export function createGlassTiles(cornerRatio: number, bezelRatio: number) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d")!;
  const tiles: GlassTiles = { field: [], mask: [] };
  for (const side of ["tl", "tr", "bl", "br", "top", "bottom", "left", "right"]) {
    const corner = side.length === 2;
    const vertical = side === "left" || side === "right";
    // Horizontal edges vary vertically; vertical edges vary horizontally.
    canvas.width = corner || vertical ? TILE_SIZE : 1;
    canvas.height = corner || !vertical ? TILE_SIZE : 1;
    const image = context.createImageData(canvas.width, canvas.height);
    const rim = context.createImageData(canvas.width, canvas.height);
    for (let y = 0; y < canvas.height; y++) for (let x = 0; x < canvas.width; x++) {
      let distance: number, nx = 0, ny = 0;
      if (corner) {
        const px = side.endsWith("l") ? x + .5 : TILE_SIZE - x - .5;
        const py = side.startsWith("t") ? y + .5 : TILE_SIZE - y - .5;
        const radius = TILE_SIZE * cornerRatio;
        const qx = radius - px, qy = radius - py;
        const dx = Math.max(qx, 0), dy = Math.max(qy, 0);
        const length = Math.hypot(dx, dy);
        // A rounded-box distance field also covers straight sections when the
        // bezel extends farther inward than the outer corner radius.
        distance = radius - length - Math.min(Math.max(qx, qy), 0);
        nx = length ? dx / length : 0;
        ny = length ? dy / length : 0;
        const smoothing = (TILE_SIZE - radius) / 2;
        if (smoothing > 0 && length < smoothing) {
          const h = Math.max(0, Math.min(1, .5 + (py - px) / (2 * smoothing)));
          const t = length / smoothing, blend = t * t * (3 - 2 * t);
          nx = nx * blend + h * (1 - blend);
          ny = ny * blend + (1 - h) * (1 - blend);
          const normalLength = Math.hypot(nx, ny);
          nx /= normalLength; ny /= normalLength;
        }
        if (side.endsWith("r")) nx = -nx;
        if (side.startsWith("b")) ny = -ny;
      } else {
        const coordinate = vertical ? x : y;
        const reverse = side === "right" || side === "bottom";
        distance = reverse ? TILE_SIZE - coordinate - .5 : coordinate + .5;
        if (vertical) nx = reverse ? -1 : 1;
        else ny = reverse ? -1 : 1;
      }
      const { displacement, mask } = rimSample(distance / (TILE_SIZE * bezelRatio));
      const offset = (y * canvas.width + x) * 4;
      const xField = Math.round(127.5 + 127.5 * nx * displacement);
      image.data[offset] = image.data[offset + 1] = image.data[offset + 2] = xField;
      image.data[offset + 3] = Math.round(191.25 + 63.75 * ny * displacement);
      rim.data[offset] = rim.data[offset + 1] = rim.data[offset + 2] = 255;
      rim.data[offset + 3] = Math.round(mask * 255);
    }
    context.putImageData(image, 0, 0);
    tiles.field.push(canvas.toDataURL("image/png"));
    context.putImageData(rim, 0, 0);
    tiles.mask.push(canvas.toDataURL("image/png"));
  }
  return tiles;
}

export function glassMapUrl(radius: string, extent: string, tiles: string[], mask = false) {
  const [tl, tr, bl, br, top, bottom, left, right] = tiles;
  // An SVG with percentage intrinsic dimensions gets the feImage subregion as
  // its viewport. vw/vh and CSS geometry keep corners at their physical size.
  // Unlike a fixed-viewBox map, widening a pill does not stretch its end caps.
  const body = `<svg xmlns="${SVG_NS}" width="100%" height="100%">
    <style>
      :root { --r: min(${radius}, 50vw, 50vh); --s: min(max(var(--r), ${extent}), 50vw, 50vh); }
      image { width:var(--s); height:var(--s); }
      .right { x:calc(100% - var(--s)); }
      .bottom { y:calc(100% - var(--s)); }
      .horizontal { x:var(--s); width:max(0px, calc(100% - var(--s) - var(--s))); }
      .vertical { y:var(--s); height:max(0px, calc(100% - var(--s) - var(--s))); }
      .center { x:var(--s); y:var(--s); width:max(0px, calc(100% - var(--s) - var(--s))); height:max(0px, calc(100% - var(--s) - var(--s))); }
    </style>
    ${mask ? "" : '<rect class="center" fill="rgb(128,128,128)" fill-opacity=".75"/>'}
    <image href="${tl}" preserveAspectRatio="none"/>
    <image href="${tr}" class="right" preserveAspectRatio="none"/>
    <image href="${bl}" class="bottom" preserveAspectRatio="none"/>
    <image href="${br}" class="right bottom" preserveAspectRatio="none"/>
    <image href="${top}" class="horizontal" preserveAspectRatio="none"/>
    <image href="${bottom}" class="horizontal bottom" preserveAspectRatio="none"/>
    <image href="${left}" class="vertical" preserveAspectRatio="none"/>
    <image href="${right}" class="vertical right" preserveAspectRatio="none"/>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(body)}`;
}
