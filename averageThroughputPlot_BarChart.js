/* This code defines an object named `AverageThroughputPlot_BarChart` in JavaScript. The object
contains methods for initializing a bar chart, generating dataset, creating the chart on a canvas
element, updating the plot with new data, and removing the plot. */
"use strict";

//
// sig:
//
//   is the signal that we are getting the Spectral Efficiency Plot for
//
//
//
//
var schemes = conf.schemes;

const AverageThroughputPlot_BarChart = {
  dataset: [],
  signal_list: [],
  avgThroughput_chart: null,

  init: function (
    signal_list,
    canvas_id,
    labels,
    threshold = null,
    backgroundColors = null
  ) {
    this.signal_list = signal_list;
    let data = this.generate_dataset(this.signal_list);
    this.dataset = data;
    this.create_chart(canvas_id, labels, data, threshold, backgroundColors);
    this.update_plot();

    return this;
  },

  generate_dataset: function (signal_list) {
    let dataset = [];
    for (let i = 0; i < signal_list.length; i++) {
      let R = signal_list[i].rate;
      dataset.push(R);
    }
    return dataset;
  },

  get_total_throughput: function (signal_list) {
    let rate = 0;
    for (let i = 0; i < signal_list.length; i++) {
      rate += signal_list[i].rate;
    }
    return rate;
  },

  create_chart: function (
    canvas_id,
    labels,
    data,
    threshold,
    backgroundColors
  ) {
    // thresholdLine plugin block
    this.thresholdLine = {
      id: "thresholdLine",
      beforeDatasetsDraw(chart, args, options) {
        const {
          ctx,
          chartArea: { top, right, bottom, left, width, height },
          scales: { x, y },
        } = chart;

        ctx.save();
        ctx.strokeStyle = "yellow";
        ctx.setLineDash([10, 20]);
        if (threshold)
          ctx.strokeRect(left, y.getPixelForValue(threshold * 1e6), width, 0);
        ctx.restore();
      },
    };

    this.avgThroughput_chart = new Chart(document.getElementById(canvas_id), {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Data Rate (bits/sec)",
            barThickness: 50,
            maxBarThickness: 70,
            backgroundColor: function () {
              if (backgroundColors) {
                return backgroundColors;
              }
              return [
                "rgb(200,56,56)",
                "rgb(0,176,240)",
                "rgb(36,124,76)",
                "rgb(255,192,0)",
                "#8e5ea2",
              ];
            },
            data: data,
          },
        ],
      },
      options: {
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: "Average Data Throughput",
            color: "#fff",
          },
          datalabels: {
            anchor: "end",
            align: "top",
            formatter: Math.round,
            font: {
              weight: "bold",
            },
          },
        },

        scales: {
          x: {
            ticks: {
              color: "#fff",
            },
            grid: {
              color: "#666",
            },
            //   title: {
            //     display: true,
            //     text: 'Your Title',
            //     color: "#fff"
            //   }
          },
          y: {
            type: "logarithmic",
            min: 100e3,
            max: 400e6,
            ticks: {
              display: true,
              color: "#fff",
              callback: function (value) {
                var val = [
                  100e3, 400e3, 1e6, 2e6, 4e6, 10e6, 20e6, 40e6, 100e6, 200e6,
                  400e6,
                ].includes(value)
                  ? value
                  : undefined;
                if (val == undefined) return undefined;
                let [s, u] = scale_units(val);
                return val * s + u;
              },
            },
            grid: {
              color: "#666",
            },
            title: {
              display: true,
              text: "bits / sec",
              color: "#fff",
            },
          },
        },
      },
      plugins: [this.thresholdLine],
    });
  },

  update_plot: function (data_bits = null) {
    if (data_bits == null) {
      for (let i = 0; i < signal_list.length; i++) {
        AverageThroughputPlot_BarChart.avgThroughput_chart.data.datasets[0].data[
          i
        ] = 0;
      }
      AverageThroughputPlot_BarChart.avgThroughput_chart.update();
      return;
    }

    var bits = data_bits.bits_list;

    for (let i = 0; i < bits.length; i++) {
      let dataRate = bits[i] / data_bits.timeElapsed;
      AverageThroughputPlot_BarChart.avgThroughput_chart.data.datasets[0].data[
        i
      ] = dataRate;
    }

    AverageThroughputPlot_BarChart.avgThroughput_chart.update();
  },

  remove_plot: function () {
    if (AverageThroughputPlot_BarChart.avgThroughput_chart != null) {
      AverageThroughputPlot_BarChart.avgThroughput_chart.destroy();
      AverageThroughputPlot_BarChart.dataset = [];
      AverageThroughputPlot_BarChart.signal_list = [];
    }
  },
};
