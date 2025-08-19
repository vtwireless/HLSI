/**
 * The `onTabChange` function handles tab changes in a web application, updating the display and
 * performing various actions based on the selected tab.
 *
 * @param {Event} evt - The event that triggered the tab change, such as a click or keypress event.
 * This parameter provides access to details about the triggering event and allows event handling
 * specific to the tab elements.
 * @param {string} tabName - The name of the tab that triggered the change event. It is used to determine
 * which tab content to display or hide based on the selected tab.
 * @param {Array<Object>} signals - An array of signal data used to generate plots and charts related to
 * throughput and capacity in the application. The function uses this data to visualize and analyze the
 * performance of different signal types in various scenarios.
 * @returns {void} This function does not return a value. It updates the display and performs actions
 * based on the selected tab.
 */

"use strict";

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
    rate_threshold =
      document.getElementById("rate_threshold") != null
        ? document.getElementById("rate_threshold").value
        : null;

    if (
      rate_threshold &&
      rate_threshold.length > 0 &&
      pu_mode === "comms_primary_user"
    ) {
      rate_threshold = Number(rate_threshold);
    } else {
      rate_threshold = null;
    }
  }

  if (tabName === "timer") {
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
    if (document.getElementById("pu_mode") !== null) {
      switch (pu_mode) {
        case "interference":
        case "noninterferer":
        case "radar_primary_user":
          if (signals.length === 2) {
            avgThroughput_chart = AverageThroughputPlot_BarChart.init(
              signals,
              "avg-throughput-bar-chart",
              ["User Signal"],
              rate_threshold,
              ["rgb(48, 25, 72)", "rgba(230,97,0)"]
            );
          } else {
            avgThroughput_chart = AverageThroughputPlot_BarChart.init(
              signals,
              "avg-throughput-bar-chart",
              ["Link 1", "Link 2", "Link 3", "Link 4"],
              rate_threshold
            );
          }

          break;
        case "comms_primary_user":
          if (signals.length === 2) {
            avgThroughput_chart = AverageThroughputPlot_BarChart.init(
              signals,
              "avg-throughput-bar-chart",
              ["User Signal", "Primary User"],
              rate_threshold,
              ["rgb(48, 25, 72)", "rgba(230,97,0)"]
            );
          } else {
            avgThroughput_chart = AverageThroughputPlot_BarChart.init(
              signals,
              "avg-throughput-bar-chart",
              ["Link 1", "Link 2", "Link 3", "Link 4", "Primary User"],
              rate_threshold
            );
          }

          break;
      }
    } else {
      avgThroughput_chart = AverageThroughputPlot_BarChart.init(
        signals,
        "avg-throughput-bar-chart",
        ["Link 1", "Link 2", "Link 3", "Link 4"]
      );
    }

    CapacityRunner_MultiSignal(
      signals,
      "#capacityRunner",
      avgThroughput_chart,
      funcs,
      { tStep: 0.3 /*seconds*/ }
    );

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
      if (pu_mode === "comms_primary_user") {
        ThroughputPlot(signal_list, [], rate_threshold);
      } else {
        ThroughputPlot(signal_list);
      }
    }

    if (document.getElementById("hoppingInterferer") != null) {
      HoppingInterferer.stopClick = false;
      HoppingInterferer(interferer, "#hoppingInterferer");
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

  if (evt != null) evt.currentTarget.className += " active";
  else {
    var timerTab = document.getElementsByClassName("tablinks");
    if (timerTab) {
      timerTab[1].className += " active";
    }
  }
}
