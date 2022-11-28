'use strict';


//
// sig:
//
//   is the signal that we are getting the SINR Plot for
//
//
//
//
var schemes = conf.schemes;

const SinrPlot_BarChart = {
    dataset: [],
    signal_list: [],
    sinr_chart: null,

    init: function(signal_list, canvas_id, labels, threshold = null, backgroundColors = null){
        this.signal_list = signal_list;
        let data = this.generate_dataset(this.signal_list);
        this.dataset = data;
        this.create_chart(canvas_id, labels, data, threshold, backgroundColors);
        for(let i=0; i<this.signal_list.length; i++){
            this.signal_list[i].onChange("freq", this.update_plot);
            this.signal_list[i].onChange("rate", this.update_plot);
            this.signal_list[i].onChange("sinr", this.update_plot);
            this.signal_list[i].onChange("mcs", this.update_plot);
        }
    },

    generate_dataset: function(signal_list){
        let dataset = [];
        for(let i=0; i<signal_list.length; i++){
            // add SINR value
            let sinr = signal_list[i].sinr;
            dataset.push(sinr);
        }
        return dataset;
    },

    get_total_throughput: function(signal_list){
      let rate = 0;
      for(let i=0; i<signal_list.length; i++){
          rate += signal_list[i].rate;
      }
      return rate;
    },

    create_chart: function(canvas_id, labels, data, threshold, backgroundColors){
        // thresholdLine plugin block
        this.thresholdLine = {
          id: 'thresholdLine',
          beforeDatasetsDraw(chart, args, options) {
            const { ctx, chartArea: { top, right, bottom, left, width, height },
            scales: {x, y} } = chart;

            ctx.save();
            ctx.strokeStyle = 'yellow';
            ctx.setLineDash([10, 20]);
            ctx.strokeRect(left, y.getPixelForValue(threshold), width, 0);
            ctx.restore();
          }

        }

        this.sinr_chart = new Chart(document.getElementById(canvas_id), {
            type: 'bar',
            data: {
            labels: labels,
            datasets: [
                {
                    label: "SINR (dB)",
                    barThickness: 50,
                    maxBarThickness: 70,
                    backgroundColor: function() {
                      if (backgroundColors) {
                        return backgroundColors;
                      }
                      return ["rgb(200,56,56)", "rgb(0,176,240)","rgb(36,124,76)","rgb(255,192,0)","#8e5ea2"];
                    },
                    data: data
                }
            ]
            },
            options: {
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: 'SINR',
                        color: "#fff"
                    },
                    datalabels: {
                      anchor: 'end',
                      align: 'top',
                      formatter: Math.round,
                      font: {
                        weight: 'bold'
                      }
                    }
                },
                
                scales: {
                    x: {
                      ticks: {
                        color: "#fff"
                      },
                      grid: {
                        color: "#666"
                      },
                    //   title: {
                    //     display: true,
                    //     text: 'Your Title',
                    //     color: "#fff"
                    //   }
                    },
                    y: {
                      min: -20.0,
                      max: 50.0,
                      ticks: {
                        display: true,
                        color: "#fff"
                      },
                      grid: {
                        color: "#666"
                      },
                      title: {
                        display: true,
                        text: 'dB',
                        color: "#fff",
                      }
                    }
                  }
            },
            plugins: [this.thresholdLine]
        });
    },

    update_plot: function() {
        let cur_dataset = SinrPlot_BarChart.dataset;
        let new_dataset = SinrPlot_BarChart.generate_dataset(SinrPlot_BarChart.signal_list);
        
        // console.log(new_dataset);

        let max_freq = 0.0;
        let min_freq = 1000000000000;
        for(let i=0; i<cur_dataset.length; i++){
            let cur_value = cur_dataset[i];
            let new_value = new_dataset[i];

            if (new_value === Infinity) {
              new_value = SinrPlot_BarChart.sinr_chart.scales.y.max;
            } else if (new_value === -Infinity) {
              new_value = SinrPlot_BarChart.sinr_chart.scales.y.min;
            }

            if(new_value != cur_value){
              // clip values if they exceed the min or max values (inf or -inf)
              if (new_value > SinrPlot_BarChart.sinr_chart.scales.y.max) {
                new_value = SinrPlot_BarChart.sinr_chart.scales.y.max;
              } 

              if (new_value < SinrPlot_BarChart.sinr_chart.scales.y.min) {
                new_value = SinrPlot_BarChart.sinr_chart.scales.y.min;
              } 

              SinrPlot_BarChart.sinr_chart.data.datasets[0].data[i] = new_value;
            }
        }
       
        SinrPlot_BarChart.sinr_chart.update();
        SinrPlot_BarChart.dataset = new_dataset;
    },

    remove_plot: function() {
      SinrPlot_BarChart.sinr_chart.destroy();
      SinrPlot_BarChart.dataset = [];
      SinrPlot_BarChart.signal_list = [];
    }
}