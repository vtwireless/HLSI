// Helper function to control the visibility of the sliders 
// Beginner mode - show only the frequency sliders
// Advanced mode - show all the slider

function onModeChange() {
    let mode = document.getElementById("mode").value;

    // beginner mode
    if (mode === 'beginner') {
        // show only frequeny sliders in beginner mode
        document.getElementById("bw1").style.display = "none";
        document.getElementById("gn1").style.display = "none";
        document.getElementById("mcs1").style.display = "none";

        document.getElementById("bw2").style.display = "none";
        document.getElementById("gn2").style.display = "none";
        document.getElementById("mcs2").style.display = "none";

        document.getElementById("bw3").style.display = "none";
        document.getElementById("gn3").style.display = "none";
        document.getElementById("mcs3").style.display = "none";

        document.getElementById("bw4").style.display = "none";
        document.getElementById("gn4").style.display = "none";
        document.getElementById("mcs4").style.display = "none";

    } else if (mode === 'advanced') {

        // show only frequeny sliders in beginner mode
        document.getElementById("bw1").style.display = "initial";
        document.getElementById("gn1").style.display = "initial";
        document.getElementById("mcs1").style.display = "initial";

        document.getElementById("bw2").style.display = "initial";
        document.getElementById("gn2").style.display = "initial";
        document.getElementById("mcs2").style.display = "initial";

        document.getElementById("bw3").style.display = "initial";
        document.getElementById("gn3").style.display = "initial";
        document.getElementById("mcs3").style.display = "initial";

        document.getElementById("bw4").style.display = "initial";
        document.getElementById("gn4").style.display = "initial";
        document.getElementById("mcs4").style.display = "initial";

    }

}


// Helper function to control the PU modes
function onPUModeChange() {
    let pu_mode = document.getElementById("pu_mode").value;

    if (pu_mode === 'interference') {
        document.getElementById("sinr_thresholdDiv").style.display = "none";
        document.getElementById("rate_thresholdDiv").style.display = "none";

        if (document.getElementById("sinr-bar-chart") !== null) {
            SinrPlot_BarChart.remove_plot();
            document.getElementById("sinr-bar-chart").remove();
        }

        if (document.getElementById("throughput-multisignal-plot") !== null) {
            document.getElementById("throughput-multisignal-plot").remove();
        }

        if (signalList.length === 2) {
            ThroughputPlot([sig]);
        } else {
            ThroughputPlot([sig1, sig2, sig3, sig4]);
        }
       
        const sinr_node = document.createElement("canvas");
        sinr_node.id = "sinr-bar-chart";
        sinr_node.setAttribute("style", "width: 100%; height: 100%;");

        document.getElementById("sinr_parent").appendChild(sinr_node);
        if (signalList.length === 2) {
            SinrPlot_BarChart.init([sig], "sinr-bar-chart", ["User Signal"], null, ["rgb(48, 25, 72)", "rgba(230,97,0)"]);
        } else {
            SinrPlot_BarChart.init([sig1, sig2, sig3, sig4], "sinr-bar-chart", ["Link 1", "Link 2", "Link 3", "Link 4"]);
        }
       
    } else if (pu_mode === 'radar_primary_user' || pu_mode === 'comms_primary_user') {
        document.getElementById("sinr_thresholdDiv").style.display = "initial";
        document.getElementById("rate_thresholdDiv").style.display = "initial";

        if (document.getElementById("sinr-bar-chart") !== null) {
            SinrPlot_BarChart.remove_plot();
            document.getElementById("sinr-bar-chart").remove();
        }

        if (document.getElementById("throughput-multisignal-plot") !== null) {
            document.getElementById("throughput-multisignal-plot").remove();
        }

        switch (pu_mode) {
            case 'comms_primary_user':
                document.getElementById("sinr_thresholdDiv").style.display = "none";
                document.getElementById("rate_thresholdDiv").style.display = "initial";
                var rate_threshold = document.getElementById("rate_threshold") != null ?
                    document.getElementById("rate_threshold").value : null;

                if (rate_threshold && rate_threshold.length > 0) {
                    rate_threshold = Number(rate_threshold);
                } else {
                    rate_threshold = null;
                }

                if (signalList.length === 2) {
                    ThroughputPlot([sig, interferer], [], rate_threshold);
                } else {
                    ThroughputPlot([sig1, sig2, sig3, sig4, interferer], [], rate_threshold);
                }
                break;
            case 'radar_primary_user':
                document.getElementById("sinr_thresholdDiv").style.display = "initial";
                document.getElementById("rate_thresholdDiv").style.display = "none";
                if (signalList.length === 2) {
                    ThroughputPlot([sig]);
                } else {
                    ThroughputPlot([sig1, sig2, sig3, sig4]);
                }
                break;
        }

        const sinr_node = document.createElement("canvas");
        sinr_node.id = "sinr-bar-chart";
        sinr_node.setAttribute("style", "width: 100%; height: 100%;");

        document.getElementById("sinr_parent").appendChild(sinr_node);

        var sinr_threshold = document.getElementById("sinr_threshold").value;
        if (sinr_threshold && sinr_threshold.length > 0 && pu_mode === 'radar_primary_user') {
            sinr_threshold = Number(sinr_threshold);
        } else {
            sinr_threshold = null;
        }
        if (signalList.length === 2) {
            SinrPlot_BarChart.init([sig, interferer], "sinr-bar-chart", ["User Signal", "Primary User"], sinr_threshold,
            ["rgb(48, 25, 72)", "rgba(230,97,0)"]);
        } else {
            SinrPlot_BarChart.init([sig1, sig2, sig3, sig4, interferer], "sinr-bar-chart", ["Link 1", "Link 2", "Link 3", "Link 4",
             "Primary User"], sinr_threshold);
        }
      
    }

    var activeTab = document.getElementsByClassName("tablinks active");
    if (activeTab != null && activeTab[0] != null && activeTab[0].innerHTML === 'Timer') {
        onTabChange(null, 'timer', signalList);
    }
}



