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

