'use strict';


//
// sig:
//
//   is the signal that we are getting the Spectral Efficiency Plot for
//
//
//
//
var schemes = conf.schemes;

const SpectralEfficiencyPlot_BarChart = {
    dataset: [],
    signal_list: [],
    se_chart: null,

    init: function(signal_list, canvas_id, labels){
        this.signal_list = signal_list;
        let data = this.generate_dataset(this.signal_list);
        this.dataset = data;
        this.create_chart(canvas_id, labels, data);
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
            // let R = schemes[signal_list[i].mcs].rate;
            // console.log(signal_list[i].rate);
            // let R = schemes[signal_list[i].mcs].rate/(signal_list[i].bw);
            let R = signal_list[i].rate/(signal_list[i].bw);
            // console.log(i, R, signal_list[i].rate, signal_list[i].bw);
            dataset.push(R);
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

    create_chart: function(canvas_id, labels, data){
        this.se_chart = new Chart(document.getElementById(canvas_id), {
            type: 'bar',
            data: {
            labels: labels,
            datasets: [
                {
                    label: "Spectral Efficiency (bytes/sec/Hz)",
                    barThickness: 50,
                    maxBarThickness: 70,
                    backgroundColor: ["rgb(200,56,56)", "rgb(0,176,240)","rgb(36,124,76)","rgb(255,192,0)","#8e5ea2"],
                    data: data
                }
            ]
            },
            options: {
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: 'Spectral Efficiency',
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
                      min: 0.0,
                      max: 8.0,
                      ticks: {
                        display: true,
                        color: "#fff"
                      },
                      grid: {
                        color: "#666"
                      },
                      title: {
                        display: true,
                        text: 'bits / sec / Hz',
                        color: "#fff",
                      }
                    }
                  }
            }
        });
    },

    update_plot: function() {
        let cur_dataset = SpectralEfficiencyPlot_BarChart.dataset;
        let new_dataset = SpectralEfficiencyPlot_BarChart.generate_dataset(SpectralEfficiencyPlot_BarChart.signal_list);
        
        // console.log(new_dataset);

        let total_rate = SpectralEfficiencyPlot_BarChart.get_total_throughput(SpectralEfficiencyPlot_BarChart.signal_list);
        let total_bw = 0.0;
        let max_freq = 0.0;
        let min_freq = 1000000000000;
        for(let i=0; i<cur_dataset.length; i++){
            let cur_value = cur_dataset[i];
            let new_value = new_dataset[i];
            if(new_value != cur_value){
                SpectralEfficiencyPlot_BarChart.se_chart.data.datasets[0].data[i] = new_value;
            }
            total_rate += new_value;
            total_bw += SpectralEfficiencyPlot_BarChart.signal_list[i].bw / 1000000;    

            let signal_freq = SpectralEfficiencyPlot_BarChart.signal_list[i]._freq;
            let signal_freq_left_limit = signal_freq - (SpectralEfficiencyPlot_BarChart.signal_list[i].bw/2);
            let signal_freq_right_limit = signal_freq + (SpectralEfficiencyPlot_BarChart.signal_list[i].bw/2);
            
            if(signal_freq_right_limit > max_freq)
              max_freq = signal_freq_right_limit;
            if(signal_freq_left_limit < min_freq)
              min_freq = signal_freq_left_limit;
        }
        // console.log(max_freq, min_freq);
        // let average_se = total_rate / total_bw;
        // console.log(total_rate);
        let average_se = total_rate / ((max_freq - min_freq));
        // console.log("AVG: ", average_se);
        SpectralEfficiencyPlot_BarChart.se_chart.data.datasets[0].data[4] = average_se;
        SpectralEfficiencyPlot_BarChart.se_chart.update();
        SpectralEfficiencyPlot_BarChart.dataset = new_dataset;
    },

    remove_plot: function() {
      SpectralEfficiencyPlot_BarChart.se_chart.destroy();
      SpectralEfficiencyPlot_BarChart.dataset = [];
      SpectralEfficiencyPlot_BarChart.signal_list = [];
    }

}