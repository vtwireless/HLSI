'use strict';

function onTabChange(evt, tabName, signals) {
    var i, tabcontent, tablinks;
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    
    let pu_mode = null;
    let rate_threshold = null;
    if (document.getElementById("pu_mode") != null) {
      pu_mode = document.getElementById("pu_mode").value;
      rate_threshold = document.getElementById("rate_threshold") != null ? 
        document.getElementById("rate_threshold").value : null;
  
      if (rate_threshold && rate_threshold.length > 0 && pu_mode === 'comms_primary_user') {
        rate_threshold = Number(rate_threshold);
      } else {
        rate_threshold = null;
      } 
    }
   
    if (tabName === 'timer') {
      document.getElementById("timer").style.display = "initial";

      if (document.getElementById("avg-throughput-bar-chart") !== null) {
        AverageThroughputPlot_BarChart.remove_plot();
        document.getElementById("avg-throughput-bar-chart").remove();
      }

      ThroughputPlot.timerMode = true;

      const avgT_node = document.createElement("canvas");
      avgT_node.id = "avg-throughput-bar-chart";
      avgT_node.setAttribute("style", "width: 100%; height: 100%;");

      document.getElementById("avg_throughput").appendChild(avgT_node);

      let avgThroughput_chart;
      if(document.getElementById("pu_mode") !== null) {
        switch(pu_mode) {
          case 'interference':
          case 'radar_primary_user':
            if (signals.length === 2) {
              avgThroughput_chart = AverageThroughputPlot_BarChart.init(signals, "avg-throughput-bar-chart",
                ["User Signal"], rate_threshold, ["rgb(48, 25, 72)", "rgba(230,97,0)"]);
            } else {
              avgThroughput_chart = AverageThroughputPlot_BarChart.init(signals, "avg-throughput-bar-chart",
                ["Link 1", "Link 2", "Link 3", "Link 4"], rate_threshold);
            }
          
            break;
          case 'comms_primary_user':
            if (signals.length === 2) {
              avgThroughput_chart = AverageThroughputPlot_BarChart.init(signals, "avg-throughput-bar-chart",
                ["User Signal", "Primary User"], rate_threshold, ["rgb(48, 25, 72)", "rgba(230,97,0)"]);
            } else {
              avgThroughput_chart = AverageThroughputPlot_BarChart.init(signals, "avg-throughput-bar-chart",
                ["Link 1", "Link 2", "Link 3", "Link 4", "Primary User"], rate_threshold);
            }
           
            break;
        }
       
      } else {
        avgThroughput_chart = AverageThroughputPlot_BarChart.init(signals, "avg-throughput-bar-chart",
       ["Link 1", "Link 2", "Link 3", "Link 4"]);
      }

      CapacityRunner_MultiSignal(signals, '#capacityRunner', avgThroughput_chart, funcs, { tStep: 0.3/*seconds*/ });

      if (document.getElementById("right_div") != null) {
        document.getElementById("right_div").style.display = "initial";
        document.getElementById("right_div").style.position = "absolute";
        document.getElementById("right_div").style.marginTop = "1%";
      }
      
    } else {
      document.getElementById("timer").style.display = "none";

      ThroughputPlot.timerMode = false;
      if (document.getElementById("throughput-multisignal-plot") !== null) {
        document.getElementById("throughput-multisignal-plot").remove();
        ThroughputPlot.timeLeft = -1;
        ThroughputPlot.stopClick = false;
        ThroughputPlot.isRunning = true;
        if (pu_mode === 'comms_primary_user') {
          ThroughputPlot(signal_list, [], rate_threshold);
        } else {
          ThroughputPlot(signal_list);
        }
      }

      if (document.getElementById("hoppingInterferer") != null) {
        HoppingInterferer.stopClick = false;
        HoppingInterferer(interferer, '#hoppingInterferer');
      }

      if (document.getElementById("scriptController") != null) {
        ScriptController.stopClick = false;
      }
     
      if (document.getElementById("avg-throughput-bar-chart") !== null) {
        AverageThroughputPlot_BarChart.remove_plot();
        document.getElementById("avg-throughput-bar-chart").remove();
      }

      if (document.getElementById("right_div") != null) {
        document.getElementById("right_div").style.display = "none";
      }
    }

    if (evt != null)
      evt.currentTarget.className += " active";
    else  {
      var timerTab = document.getElementsByClassName("tablinks");
      if (timerTab) {
        timerTab[1].className += " active";
      }
    }

  }