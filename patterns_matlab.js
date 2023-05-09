
// **** Antenna pattern lookup tables *****
// fvert - vertical polarization
// fhoriz - horizontal polarization
// 'fvert' and 'fhoriz' represent the complex gain of the antenna at each phi and theta angle, 
// and are normalized to a maximum absolute value of 1.

let thetaresolution = 10;
let phiresolution = 10;

// vertically polarized isotropic antenna
function isovert(thetares, phires) {
  let patterns = [];
  if (90 % thetares !== 0) {
    console.log("Error! Theta resolution must divide evenly into 90 degrees.");
    return;
  }

  let thetadim = 180 / thetares + 1;
  let phidim = 360 / phires + 1;

  let fvert = Array(thetadim)
    .fill()
    .map(() => Array(phidim).fill(1)); // vertical polarization
  patterns.push(fvert);

  let fhoriz = Array(thetadim)
    .fill()
    .map(() => Array(phidim).fill(0)); // horizontal polarization
  patterns.push(fhoriz);
  // console.log(fvert);
  // console.log(fhoriz);

  return patterns;
}

// horizontally polarized isotropic antenna
function isohoriz(thetares, phires) {
  let patterns = [];
  if (90 % thetares !== 0) {
    console.log("Error! Theta resolution must divide evenly into 90 degrees.");
    return;
  }

  let thetadim = 180 / thetares + 1;
  let phidim = 360 / phires + 1;

  let fvert = Array(thetadim)
    .fill()
    .map(() => Array(phidim).fill(0)); // vertical polarization

  let fhoriz = Array(thetadim)
    .fill()
    .map(() => Array(phidim).fill(1)); // horizontal polarization

  patterns.push(fvert);
  patterns.push(fhoriz);
  // console.log(fvert);
  // console.log(fhoriz);

  return patterns;

}

// vertically oriented half-wave dipole antenna
function halfwave(thetares, phires) {
  let patterns = [];
  if (90 % thetares !== 0) {
    console.log("Error! Theta resolution must divide evenly into 90 degrees.");
    return;
  }

  let thetadim = 180 / thetares + 1;
  let phidim = 360 / phires + 1;

  let fvert = Array(thetadim)
    .fill()
    .map(() => Array(phidim).fill(0)); // vertical polarization
  let fhoriz = fvert.slice(); // horizontal polarization

  for (let k = 0; k < thetadim; k++) {
    let theta = (Math.PI * thetares * k) / 180;
    for (let m = 0; m < phidim; m++) {
      let phi = (Math.PI * phires * m) / 180;
      if (k === 0 || k === thetadim - 1) {
        fvert[k][m] = 0;
      } else {
        fvert[k][m] = Math.cos((Math.PI / 2) * Math.cos(theta)) / Math.sin(theta);
      }
    }
  }

  patterns.push(fvert);
  patterns.push(fhoriz);
  // console.log(fvert);
  // console.log(fhoriz);

  return patterns;

}

// vertically oriented small dipole antenna
function sloop(thetares, phires) {
  let patterns = [];
  if (90 / thetares !== Math.round(90 / thetares)) {
    console.log('Error!  theta resolution must divide evenly into 90 degrees.');
    return;
  }

  let thetadim = 180 / thetares + 1;
  let phidim = 360 / phires + 1;

  let fvert = [];
  let fhoriz = [];
  for (let i = 0; i < thetadim; i++) {
    fvert.push(new Array(phidim).fill(0));
    fhoriz.push(new Array(phidim).fill(0));
  }

  for (let k = 1; k <= thetadim; k++) {
    let theta = Math.PI * thetares * (k - 1) / 180;
    for (let m = 1; m <= phidim; m++) {
      let phi = Math.PI * phires * (m - 1) / 180;
      fvert[k - 1][m - 1] = Math.sin(theta);
    }
  }

  patterns.push(fvert);
  patterns.push(fhoriz);
  // console.log(fvert);
  // console.log(fhoriz);

  return patterns;

}

// directional, vertically polarized antenna with specified horizontal and vertical beamwidth and sidelobe level
// Generates the pattern for a vertically polarized directional antenna with a flat main beam and uniform side lobe level.
function dirantv(thetares, phires, azbw, elbw, SLL) {
  let patterns = [];
  if (SLL > 0) {
    console.log("Error! SLL must be <= 0.");
    return;
  }

  if (90 / thetares !== Math.round(90 / thetares)) {
    console.log("Error! theta resolution must divide evenly into 90 degrees.");
    return;
  }

  const thetadim = 180 / thetares + 1;
  const phidim = 360 / phires + 1;

  const fvert = Array.from({ length: thetadim }, () => Array.from({ length: phidim }).fill(0));
  const fhoriz = Array.from({ length: thetadim }, () => Array.from({ length: phidim }).fill(0));

  for (let k = 1; k <= thetadim; k++) {
    const theta = Math.PI * thetares * (k - 1) / 180;
    for (let m = 1; m <= phidim; m++) {
      const phi = Math.PI * phires * (m - 1) / 180;
      if (Math.abs(theta - Math.PI / 2) - Math.PI * thetares / 1800 > Math.PI * (elbw / 2) / 180) {
        if (SLL !== -999) {
          fvert[k - 1][m - 1] = 10 ** (SLL / 10);
        }
      } else if (phi - Math.PI * phires / 1800 > (azbw / 2) * Math.PI / 180 && (2 * Math.PI - phi) > (azbw / 2) * Math.PI / 180 + Math.PI * phires / 1800) {
        if (SLL !== -999) {
          fvert[k - 1][m - 1] = 10 ** (SLL / 10);
        }
      } else {
        fvert[k - 1][m - 1] = 1;
      }
    }
  }

  patterns.push(fvert);
  patterns.push(fhoriz);
  // console.log(fvert);
  // console.log(fhoriz);

  return patterns;

}

// invokes the method for the selected antenna pattern and looks up the value for corresp phi and theta
function getAntennaPatternValue(theta, phi, pattern) {
  let patterns;
  switch (pattern) {
    case 'vertical_isotropic':
      patterns = isovert(thetaresolution, phiresolution);
      break;
    case 'horizontal_isotropic':
      patterns = isohoriz(thetaresolution, phiresolution);
      break;
    case 'halfwave':
      patterns = halfwave(thetaresolution, phiresolution);
      break;
    case 'sdipole':
      patterns = sloop(thetaresolution, phiresolution);
      break;
    case 'dirAnt_sideLobe':
      patterns = dirantv(thetaresolution, phiresolution, 20, 20, -1.5);
      break;
    default:
      patterns = isovert(thetaresolution, phiresolution);
  }

  return lookupAntennaPatternValue(theta, phi, patterns);
}

// looks up the antenna pattern value from the table
function lookupAntennaPatternValue(theta, phi, patterns) {

  let fvert = patterns[0];
  let fhoriz = patterns[1];
  theta_index = Math.round(Number(theta) / thetaresolution) + 1;
  phi_index = Math.round(Number(phi) / phiresolution) + 1;

  let f_vert_val = fvert[theta_index][phi_index];
  let f_horiz_val = fhoriz[theta_index][phi_index];

  return [f_vert_val, f_horiz_val];

}

// method invocations
// isovert(thetaresolution, phiresolution);
// isohoriz(thetaresolution, phiresolution);
// halfwave(thetaresolution, phiresolution);
// sloop(thetaresolution, phiresolution);
// dirantv(thetaresolution, phiresolution, 20, 20, -1.5);

