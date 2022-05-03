
// Works well with parentElement being an existing <p> that gets its'
// innerHTML over written.
//
HoppingInterferer.hopping_behaviour = "random";
function HoppingInterferer(interferer, parentElement = null, opts = null) {

    // Generate a unique id for HTML element ids.
    var id = "_" + (HoppingInterferer.count++).toString() + '_hzf_';

    var innerHTML = '\
    <label for="hop_rate'+id+'">Hop Rate</label>\
    <input class=slider_bw type="range" min="0.0"\
        max="4.0" id="hop_rate'+id+'" step="0.01">\
    <output for="hop_rate'+id+'" id="hr'+id+'"></output>\
';


    function getElement(sel) {
        var el = document.querySelector(sel + id);
        if(el === null) {
            let msg = "Can't get element with selector \""+ sel+ id + '"';
            console.log(msg);
            alert(msg);
        }
        return el;
    }

    if(parentElement === null) {
        parentElement = document.createElement('p');
        document.body.appendChild(parentElement);
    } else if(typeof(parentElement) === 'string') {
        parentElement = document.querySelector(parentElement);
    }


    parentElement.innerHTML = innerHTML;

console.log("parentElement.innerHTML=" + parentElement.innerHTML);


    var hopRate = 0.5; // Hz
    var itimer = null;

    var hopRateSlider = getElement('#hop_rate');
    var label = getElement('#hr'); // output label

    function Hop() {
        if(HoppingInterferer.hopping_behaviour == "periodic"){
            interferer.freq += 2e6;
            if(interferer.freq >= interferer.freq_max){
                interferer.freq = interferer.freq_min
            }
        }
        else{
            // console.log(interferer.freq);
            interferer.freq = interferer.freq_min +
            Math.random() * (interferer.freq_max - interferer.freq_min);
        }
        
    }

    hopRateSlider.value = hopRate;

    function UpdateLabel(rate) {
        label.value = d3.format(".2f")(rate) + " Hz"
    }

    function update_hop_rate() {

        var r = hopRateSlider.value;
        // r is the new hop rate in Hz
        if(r === hopRate) return;

        hopRate = r;
        UpdateLabel(r);

        clearInterval(itimer);

        if(hopRate < 0.01)
            return;
        itimer = setInterval(Hop, 1000.0/hopRate);
    }

    UpdateLabel(hopRate);

    hopRateSlider.oninput = update_hop_rate;

    itimer = setInterval(Hop, 1000.0/hopRate);
}


 HoppingInterferer.count = 0;