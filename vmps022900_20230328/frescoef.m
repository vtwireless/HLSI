function GAMMA=frescoef(er,theta)
%[GAMMA]=frescoef(er,theta) Generates Fresnel reflection coefficients
%   Outputs:
%   -------
%     Each row of the output GAMMA corresponds to one reflection.
%     The columns are:
%     first col. :  Reflection coeff. for the perpendicular polarized wave
%     second col.:  Reflection coeff. for the parallel polarized wave
%   Inputs:
%   ------
%     er:     The relative permitivity of the reflecting building
%     theta:  Reflection angles in radians for each reflecting object

% Kai Dietze
% modified by Carl Dietrich

GAMMA=[];
u0=1.26e-6;            	% permeability of free space
e0=8.85e-12;           	% permittivity of free space
n1=sqrt(u0/e0);        	% free space eta
n2=sqrt(u0/(e0*er)); 	% eta inside the building
lgth=size(theta);

for J=1:max(lgth),
  %% finding the perpendicular(gammaper) and parallel(gammapar) reflec. coeff.  
  thetai=theta(J);
  thetat=asin(sin(thetai)/sqrt(er));
  gammaper=(n2*cos(thetai)-n1*cos(thetat))/(n2*cos(thetai)+n1*cos(thetat));
  gammapar=(-n1*cos(thetai)+n2*cos(thetat))/(n1*cos(thetai)+n2*cos(thetat)); 
  %% concatenating gammapar and gammaper in two columns  
  GAMMA=[GAMMA;[gammaper,gammapar]];
end;
