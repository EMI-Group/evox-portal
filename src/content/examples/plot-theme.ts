// Relayout preserves frames, selected generations and the 3D camera.
type PlotlyApi = { relayout: (plot: HTMLElement, update: Record<string, unknown>) => Promise<unknown> };
export function syncPlotTheme(plot: HTMLElement) {
  const update = () => {
    const api = (window as unknown as { Plotly?: PlotlyApi }).Plotly;
    if (!api) return;
    const style = getComputedStyle(document.documentElement);
    const color = (name: string) => style.getPropertyValue(`--site-${name}`).trim();
    const values: Record<string, unknown> = {
      paper_bgcolor: color("bg"), plot_bgcolor: color("alt"),
      "font.color": color("ink"), "legend.bgcolor": color("bg"),
      "scene.bgcolor": color("bg"),
      "sliders[0].font.color": color("muted"),
      "sliders[0].currentvalue.font.color": color("ink"),
      "sliders[0].bgcolor": color("alt"), "sliders[0].bordercolor": color("line"),
      "sliders[0].activebgcolor": color("accent"),
    };
    for (const axis of ["xaxis", "yaxis", "scene.xaxis", "scene.yaxis", "scene.zaxis"]) {
      values[`${axis}.color`] = color("muted");
      values[`${axis}.gridcolor`] = color("line");
      values[`${axis}.linecolor`] = color("line");
      values[`${axis}.zerolinecolor`] = color("line");
      if (axis.startsWith("scene.")) values[`${axis}.backgroundcolor`] = color("alt");
    }
    return api.relayout(plot, values).catch(error => console.warn("Plot theme update failed", error));
  };
  new MutationObserver(update).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return update();
}
