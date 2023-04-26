%propagation=reflect(ds1,ds2,phi_R,freq,Gamma,epsilon_r)
%   Determines complex multipath components of received signal  
%   Outputs:
%     propagation:  Each row contains the horizontally and vertically
%                   polarized components of one complex multipath component
%   Inputs:
%     ds1:  Path lengths from reflecting objects to terminal 1 in m
%     ds2:  Path lengths from reflecting objects to terminal 2 in m
%     phi_R:  Reflection angles in radians from normal at each reflecting object 
%     freq:   Frequency in Hz
%     Gamma:  Reflection coefficients in horizontal and vertical polarization
%             or NaN if Fresnel coefficients are to be used
%     epsilon_r:  Relative permittivity of reflecting objects (scalar), NaN if 
%                 angle-independent reflection is assumed
%%     scat_phases:  Nx1 column of random scatterer phases (added 4/30/99 for test)

% Carl Dietrich, based on code by Kai Dietze

function propagation=reflect(ds1,ds2,phi_R,freq,Gamma,epsilon_r)

% speed of light in m/s
c=3e8; 

% total distance from base to mobile for each path
d=ds1+ds2;

% reduction in magnitude caused by propagation and the reflection, the phase
% factor caused by the propagation delay (this was done for each ray)
sig=(1./(4*pi.*d)).*exp(j*(2*pi/(c/freq)*d));

if max(size(Gamma))==2 & Gamma(1)~=NaN
   %  propagation=[sig.*exp(j*scat_phases).'*Gamma(1),sig.*exp(j*scat_phases).'*Gamma(2)];	% scat_phases 4/30/99
   propagation=[sig.*Gamma(1),sig.*Gamma(2)];

else
% get perpendicular and parallel (V and H) Fresnel coefficients
  Gamma=frescoef(epsilon_r,phi_R);
  Gamma=[Gamma(:,2),Gamma(:,1)];	% swap columns to H,V
  %  propagation=[sig.*Gamma(:,1).*exp(j*scat_phases),sig.*Gamma(:,2).*exp(j*scat_phases)];	% scat_phases 4/30/99
  propagation=[sig.*Gamma(:,1),sig.*Gamma(:,2)];
end;
