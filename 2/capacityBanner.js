
function CapacityBanner(sig, parentElement = null) {

    var innerHTML = '\n\
    <label for=signal_to_noise_ratio>SNR: </label>\n\
        <output for=signal_to_noise_ratio id=snr></output>,\n\
    <label for=information_capacity>Capacity: </label>\n\
        <output for=information_capacity id=cap></output>,\n\
    <label for=spectral_efficiency>Spect. Eff.: </label>\n\
        <output for=spectral_efficiency id=eta></output>,\n\
    <label for=link_margin>Margin: </label>\n\
        <output for=link_margin id=margin></output>,\n\
    <label for=actual_rate>Actual Rate: </label>\n\
        <output for=actual_rate id=rate></output>\n\
';


    if(parentElement === null) {
        parentElement = document.createElement('p');
        document.body.appendChild(parentElement);
    } else if(typeof(parentElement) === 'string') {
        parentElement = document.querySelector(parentElement);
    }

    parentElement.innerHTML = innerHTML;


    Label(sig, 'sinr', { element: '#snr' });

    Label(sig, 'sinr', {
        func: function(sinr) {
            // sinr is SNR in dB
            let C = sig.bw * Math.log2(1 + Math.pow(10.0, sinr/10.));
            let [scale,units] = scale_units(C,0.1);
            return d3.format(".1f")(C*scale) + " " +
                units + "b/s";
        },
        element: '#cap'
    });

    Label(sig, 'sinr', {
        func: function(sinr) {
            // sinr is SNR in dB
            let se = Math.log2(1 + Math.pow(10.0, sinr/10.0));
            return d3.format(".3f")(se) + " b/s/Hz";
        },
        element: '#eta'
    });

    // This Label trigger a change from 2 signal parameters.
    var margin = document.querySelector('#margin');
    Label(sig, [ 'sinr', 'mcs'], {
        func: function() {
            // sig.sinr is SNR in dB
            let m = sig.sinr - conf.schemes[sig.mcs].SNR;
            if(m <= 0) margin.className = 'red';
            else margin.className = '';
            return d3.format(".2f")(m) + " dB";
        },
        element: '#margin'
    });

    // This Label trigger a change from 2 signal parameters.
    var rate = document.querySelector('#rate');
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

            return d3.format(".2f")(r*scale) + " " +
                units + "b/s (" +
                d3.format(".1f")(percent) + "% capacity)";
        },
        element: '#rate'
    });
}
