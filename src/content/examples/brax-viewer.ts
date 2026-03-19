/**
 * Build the Brax viewer HTML string.
 * This is in a separate .ts file to prevent Astro from
 * extracting <script> tags inside the template literal.
 */
import braxData from "./brax-data.json";

const braxDataString = JSON.stringify(braxData);

export const braxViewerHtml = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; }
      #brax-viewer { width: 100%; height: 100%; }
    </style>
    <script type="importmap">
      {
        "imports": {
          "three": "https://unpkg.com/three@0.150.1/build/three.module.js",
          "three/addons/": "https://unpkg.com/three@0.150.1/examples/jsm/",
          "lilgui": "https://cdn.jsdelivr.net/npm/lil-gui@0.18.0/+esm",
          "viewer": "https://cdn.jsdelivr.net/gh/google/brax@v0.14.0/brax/visualizer/js/viewer.js"
        }
      }
    </script>
    <script src="https://unpkg.com/pako@2.1.0/dist/pako.min.js"></script>
  </head>
  <body>
    <div id="brax-viewer"></div>
    <script type="module">
      import { Viewer } from "viewer";
      const system = ${braxDataString};
      const brax = document.getElementById("brax-viewer");
      const setFallback = (message) => {
        if (!brax) return;
        brax.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;padding:24px;box-sizing:border-box;background:linear-gradient(180deg,#0f172a,#111827);color:#e5e7eb;font:500 14px/1.6 system-ui,sans-serif;text-align:center;">' + message + "</div>";
      };
      const hasWebGLSupport = () => {
        try {
          const canvas = document.createElement("canvas");
          return Boolean(
            window.WebGLRenderingContext &&
            (canvas.getContext("webgl") ||
              canvas.getContext("experimental-webgl") ||
              canvas.getContext("webgl2")),
          );
        } catch {
          return false;
        }
      };
      if (brax) {
        if (!hasWebGLSupport()) {
          setFallback("3D preview is unavailable on this device or browser.");
        } else {
          try {
        if (system.geoms && system.geoms.world && system.geoms.world[0]) {
          system.geoms.world[0].size = [0, 0, 40];
        }
            const viewer = new Viewer(brax, system);
            if (viewer.animator && viewer.animator.mixer) {
              viewer.animator.mixer.timeScale = 0.1;
            }
          } catch {
            setFallback("3D preview could not be initialized in this browser.");
          }
        }
      }
    </script>
  </body>
</html>`;
