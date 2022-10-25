
function CapacityBanner(sig, parentElement = null) {

    var id = (CapacityBanner.count++).toString() + '_cap';

    var innerHTML = '\
    <label for=signal_to_noise_ratio'+ id +'>'+ sig.snrLabel +': </label>\
        <output for=signal_to_noise_ratio'+ id +' id=snr'+ id +'></output>,\
    <label for=information_capacity'+ id +'>Capacity: </label>\
        <output for=information_capacity'+ id +' id=cap'+ id +'></output>,\
    <label for=spectral_efficiency'+ id +'>Spect. Eff.: </label>\
        <output for=spectral_efficiency'+ id +' id=eta'+ id +'></output>,\
    <label for=link_margin'+ id +'>Link Margin: </label>\
        <output for=link_margin'+ id +' id=margin'+ id +'></output>,\
    <label for=actual_rate'+ id +'>Actual Rate: </label>\
        <output for=actual_rate'+ id +' id=rate'+ id +'></output>\
';


    function getElement(sel) {
        return document.querySelector(sel + id);
    }


    if(parentElement === null) {
        parentElement = document.createElement('p');
        document.body.appendChild(parentElement);
    } else if(typeof(parentElement) === 'string') {
        parentElement = document.querySelector(parentElement);
    }

    parentElement.innerHTML = innerHTML;


    Label(sig, 'sinr', { element: '#snr'+ id });

    Label(sig, 'sinr', {
        func: function(sinr) {
            // sinr is SNR in dB
            let C = sig.bw * Math.log2(1 + Math.pow(10.0, sinr/10.));
            let [scale,units] = scale_units(C,0.1);
            return d3.format(".1f")(C*scale) + " " +
                units + "b/s";
        },
        element: '#cap'+ id
    });

    Label(sig, 'sinr', {
        func: function(sinr) {
            // sinr is SNR in dB
            let se = Math.log2(1 + Math.pow(10.0, sinr/10.0));
            return d3.format(".3f")(se) + " b/s/Hz";
        },
        element: '#eta'+ id
    });

    // This Label trigger a change from 2 signal parameters.
    var margin = getElement('#margin');
    Label(sig, [ 'sinr', 'mcs'], {
        func: function() {
            // sig.sinr is SNR in dB
            let m = sig.sinr - conf.schemes[sig.mcs].SNR;
            if(m <= 0) margin.className = 'red';
            else margin.className = '';
            return d3.format(".2f")(m) + " dB";
        },
        element: '#margin'+ id
    });

    // This Label triggers a change from 2 signal parameters.
    var rate = getElement('#rate');
    Label(sig, [ 'sinr', 'mcs'], {
        func: function() {

            let r = sig.rate;
           
            if(r <= 0) {
                rate.className = 'red';
                return "0 b/s";
            }

            rate.className = '';

            let [scale,units] = scale_units(r,1.0);
            let percent = 100.0 * r/(sig.bw *
                Math.log2(1 + Math.pow(10.0, sig.sinr/10.0)));

            if (percent > 100) {
                rate.className = 'red';
                return "0 b/s";
            }

            return d3.format(".2f")(r*scale) + " " +
                units + "b/s (" +
                d3.format(".1f")(percent) + "% capacity)";
        },
        element: '#rate'+ id
    });
}

// Used to get ids.
CapacityBanner.count = 0;
