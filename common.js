'use strict';

// All the plots use these length parameters and they are used in other
// files too.
//
var plot = {
    margin: { top: 10, right: 50, bottom: 50, left: 50 },
};

plot.width = 720 - plot.margin.left - plot.margin.right; // Use the window's width
plot.height = 320 - plot.margin.top - plot.margin.bottom; // Use the window's height

Object.freeze(plot);


// parentElement is a CSS selector for the parent node that we will append
// the d3 <svg> plot element to.
//
function svg_create(_xscale, _yscale, parentElement=null)
{

    if(parentElement === null) parentElement = "body";

    // We need to add data to the object that is what we are given, svg.
    // We did not start this fun code so in order to refactor it without
    // braking it we need to use kludgey methods like so:

    // 1. Add the SVG (time) to the page and employ #2
    var svg = d3.select(parentElement).append("svg")
        .attr("width",  plot.width  + plot.margin.left + plot.margin.right)
        .attr("height", plot.height + plot.margin.top +  plot.margin.bottom)
        .append("g")
	.attr("class", "graph-svg-component")
        .attr("transform", "translate(" + plot.margin.left + "," + plot.margin.top + ")");

    // create axes
    svg.append("g").attr("class", "x axis")
        .attr("transform", "translate(0," + plot.height + ")")
        .call(d3.axisBottom(_xscale));
    svg.append("g").attr("class", "y axis")
        .call(d3.axisLeft(_yscale));

    svg.append("rect")
        .attr("width", "86.2%")
	.attr("height", "81%")
	.attr("fill", "black");

    // create grid lines
    svg.append("g").attr("class","grid").call(d3.axisBottom(_xscale).tickFormat("").tickSize( plot.height));
    svg.append("g").attr("class","grid").call(d3.axisLeft  (_yscale).tickFormat("").tickSize(- plot.width));

    return svg;
}


function svg_add_labels(_svg, _xlabel, _ylabel)
{
    // create x-axis axis label
    _svg.append("text")
        .attr("transform","translate("+(plot.width/2)+","+(plot.height + 0.75*plot.margin.bottom)+")")
        .attr("dy","-0.3em")
        .style("text-anchor","middle")
	.attr("fill", "white")
        .text(_xlabel);

    // create y-axis label
    _svg.append("text")
        .attr("transform","rotate(-90)")
        .attr("y", 0 - plot.margin.left)
        .attr("x", 0 - (plot.height/2))
        .attr("dy", "1em")
        .style("text-anchor","middle")
        .attr("fill", "white")
        .text(_ylabel);
}


// determine scale and units for sample value v; use p to adjust cut-off threshold
function scale_units(v,p=1)
{
    let r = v * p;
    if      (r >= 1e+12) { return [1e-12, 'T']; }
    else if (r >= 1e+09) { return [1e-09, 'G']; }
    else if (r >= 1e+06) { return [1e-06, 'M']; }
    else if (r >= 1e+03) { return [1e-03, 'k']; }
    else if (r >= 1e+00) { return [1e+00, '' ]; }
    else if (r >= 1e-03) { return [1e+03, 'm']; }
    else if (r >= 1e-06) { return [1e+06, 'u']; }
    else if (r >= 1e-09) { return [1e+09, 'n']; }
    else if (r >= 1e-12) { return [1e+12, 'p']; }
    else                 { return [1e+16, 'f']; }
}

// normal random number
function randn()
{
    let u1 = 0, u2 = Math.random();
    while (u1 == 0) { u1 = Math.random(); }
    return Math.sqrt(-2*Math.log(u1)) * Math.sin(2*Math.PI*u2);
}

// sinc(x) = sin(pi x) / (pi x)
function sinc(x)
{
    let r = Math.max(1e-6,Math.abs(Math.PI * x));
    return Math.sin(r) / r;
}

// generate sample i of cosine window, length 2*_m+1 with exponent _beta
function cwindow(_i, _m, _beta)
{
    if (_i < 0 || _i > 2*_m) {
        throw "invalid index for cosine window, i=" + _i + ", m=" + _m;
    }
    return Math.cos(0.5*Math.PI*(_i-_m)/_m)**(_beta==null ? 2 : _beta);
}

// generate sample i of windowed pulse, length 2*_m+1 with bandwidth _bw
function pulse(_i, _m, _bw, _beta)
{
    if (_i < 0 || _i > 2*_m) {
        throw "invalid index for pulse, i=" + _i + ", m=" + _m;
    }
    return sinc(_bw*(_i-_m)) * cwindow(_i, _m, _beta);
}

// generate pulse into buffer (adding on top of existing signals)
function add_pulse(_m, _fc, _bw, _gain, _xi, _xq, _beta) {
    let gain = Math.pow(10,_gain/20);
    for (var i=0; i<2*_m+1; i++) {
        let p = pulse(i, _m, _bw, _beta);
        _xi[i] += gain * Math.cos(2*Math.PI*_fc*i) * p;
        _xq[i] += gain * Math.sin(2*Math.PI*_fc*i) * p;
    }
}

// generate tone into buffer (adding on top of existing signals)
function add_tone(_m, _fc, _gain, _xi, _xq, _beta) {
    let gain = (_gain==null ? 1 : Math.pow(10,_gain/20)) / _m;
    for (var i=0; i<2*_m+1; i++) {
        let p = cwindow(i, _m, _beta);
        _xi[i] += gain * Math.cos(2*Math.PI*_fc*i) * p;
        _xq[i] += gain * Math.sin(2*Math.PI*_fc*i) * p;
    }
}

// mu-law compression
function compress_mulaw(_x, _mu) {
    if      (_mu == null || _mu == 0) { return _x; }
    else if (_mu < 0) { throw "invalid mu value for compression: " + _mu; }

    let x_abs = Math.abs(_x);
    return Math.sign(_x) * Math.log(1 + _mu*x_abs) / Math.log(1 + _mu);
}

// clear sample buffer
function clear_buffer(buf,n) {
    for (let i=0; i<n; i++) { buf[i] = 0; }
}

// function class to generate signals, power spectral density
function siggen(nfft)
{
    this.nfft = nfft;
    this.fft  = new FFTNayuki(nfft);
    this.xi   = new Array(nfft);
    this.xq   = new Array(nfft);
    this.psd  = new Array(nfft);
    this.m    = Math.min(120,Math.floor(0.4*nfft)); // filter semi-length
    this.beta = 2;    // filter window exponent parameter
    this.mu   = null; // mu-law compression (set to 'null' to disable)

    // clear internal buffer
    this.clear = function() {
        clear_buffer(this.xi, this.nfft);
        clear_buffer(this.xq, this.nfft);
    }

    // generate signals in the time-domain buffer
    this.add_signal = function(_fc, _bw, _gain) {
        add_pulse(this.m, _fc, _bw, _gain, this.xi, this.xq, this.beta);
    }

    // add tone in time-domain buffer
    this.add_tone = function(_fc, _gain) {
        add_tone(this.m, _fc, _gain, this.xi, this.xq, this.beta);
    }

    // add noise to time-domain buffer
    this.add_noise = function(noise_floor_dB) {
        // compute noise standard deviation, compensating for fft size and I/Q components
        let nstd = Math.pow(10.,noise_floor_dB/20) / Math.sqrt(2 * this.nfft);
        for (var i=0; i<this.nfft; i++) {
            this.xi[i] += randn() * nstd;
            this.xq[i] += randn() * nstd;
        }
    }

    // run fft, adding noise floor as appropriate
    this.generate = function(noise_floor_dB) {
        // compute noise floor (minimum prevents possibility of log of zero)
        if (noise_floor_dB==null)
            { noise_floor_dB = -120; }
        let noise_floor = Math.max(1e-12, Math.pow(10.,noise_floor_dB/10));

        // apply compression
        if (this.mu != null) {
            for (var i=0; i<nfft; i++) {
                this.xi[i] = compress_mulaw(this.xi[i], this.mu);
                this.xq[i] = compress_mulaw(this.xq[i], this.mu);
            }
        }

        // compute transform in place
        this.fft.forward(this.xi,this.xq);

        // convert to dB (adding noise floor as appropriate), and apply fft shift
        for (var i=0; i<this.nfft; i++) {
            let x2 = this.xi[i]**2 + this.xq[i]**2;
            this.psd[(i+this.nfft/2)%nfft] = 10*Math.log10(noise_floor + x2);
        }
    }
}

// basic pseudo-random number generator based on Blum Blum Shub algorithm
function prng_bbs()
{
    this.p   = (1<<17)-1;
    this.q   = (1<<19)-1;
    this.M   = this.p * this.q;
    this.res = 1<<8; // small number of unique values
    this.v   = 3;

    this.reset = function(seed) {
        this.v = seed==null ? 3 : seed;
    }

    this.step = function() {
        this.v = (this.v * this.v) % this.M;
        return (this.v & (this.res-1)) / this.res;
    }
}

function power_spectral_density_3d_checkbox_change(){
    if (document.getElementById('psd_3d_checkbox').checked) 
    {
      PowerSpectrumPlot_3D();
    } else {
      PowerSpectrumPlot_2D();
    }
}