"use strict"; // A must for debugging code.

function PowerSpectrumPlot(sigs, noise) {
  if (!Array.isArray(sigs)) sigs = [sigs];
  if (sigs.length < 1) return;

  var freq_plot_min = sigs[0].freq_plot_min;
  var freq_plot_max = sigs[0].freq_plot_max;
  // Find the freq_plot_min and freq_plot_max for all signals.
  sigs.forEach(function (sig) {
    // TODO: Note we are doing sigs element 0 twice.
    if (freq_plot_min > sig.freq_plot_min) freq_plot_min = sig.freq_plot_min;
    if (freq_plot_max < sig.freq_plot_max) freq_plot_max = sig.freq_plot_max;
  });

  // filter semi-length(m), over-sampling rate(k), total length
  const m = 40, // ! increasing this value squares off the signal
    k = 20,
    n = 2 * k * m + 1;
  var bw = 0.2, // bw
    gn = 0.0; // gain
  var nfft = 2048,
    generator = new siggen(nfft);
  generator.m = m;

  // determine time and frequency scale/units
  var [scale_freq, units_freq] = scale_units(
    sigs[0].freq_init + sigs[0].bw_max * 0.5,
    0.1
  ); // freq scale

  // 5. X scale will use the index of our data
  var fScale = d3
    .scaleLinear()
    .domain([freq_plot_min * scale_freq, freq_plot_max * scale_freq])
    .range([0, plot.width]);

  // 6. Y scale will use the randomly generate number
  var pScale = d3.scaleLinear().domain([-60, 20]).range([plot.height, 0]);

  const df = (freq_plot_max - freq_plot_min) / (nfft - 1);

  // 7. d3's line generator
  var linef = d3
    .line()
    .x(function (d, i) {
      return fScale((freq_plot_min + i * df) * scale_freq);
    }) // map frequency
    .y(function (d) {
      return pScale(d.y);
    }); // map PSD

  // 8. An array of objects of length N. Each object has key -> value
  // pair, the key being "y" and the value is a random number
  var dataf = d3.range(0, nfft - 1).map(function (f) {
    return { y: 0 };
  });

  // create SVG objects

  var labelPrefix = "";
  // TODO: This prefix label needs fixing so it works well for all the
  // signals in "sigs'
  //if(sigs[0].name.length > 0)
  //    labelPrefix = sigs[0].name + " ";
  generator = new siggen(2048);
  generator.m = 40;
  // Iterate through signal array, calc values and pass to generator
  generator.clear();

  sigs.forEach(function (sig) {
    var fc =
      -0.5 +
      (sig.freq - sig.freq_plot_min) / (sig.freq_plot_max - sig.freq_plot_min);
    var bw = 0.1 + (0.8 * (sig.bw - sig.bw_min)) / (sig.bw_max - sig.bw_min);
    var gn = sig._gn;
    // ! bw (slider %) is limited to 90% range, as log(0) == inf
    generator.add_signal(fc, bw, gn + 10 * Math.log10(bw));
  });

  // use custom noise floor if given
  if (noise !== undefined) generator.generate(noise);
  // else default noise floor is used (-120db, see generator src)
  else generator.generate();
  dataf = d3.range(0, nfft - 1).map(function (i) {
    return { y: generator.psd[i] };
  });

  return linef(dataf);
}
