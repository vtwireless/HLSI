%[propagation,phi1,phi2]=los(term1_loc,term2_loc,freq)
%   Determines complex multipath components of received signal  
%   Outputs:
%     propagation:  Each row contains the horizontally and vertically
%                   polarized components of the complex LOS component
%     phi1:  Azimuth angle at terminal 1
%     phi2:  Azimuth angle at terminal 2
%   Inputs:
%     term1_loc:  location of terminal 1
%     term2_loc:  location of terminal 2
%     freq:   Frequency in Hz

% Carl Dietrich, based on code by Kai Dietze

function [propagation,phi1,phi2]=los(term1_loc,term2_loc,freq)

% speed of light in m/s
c=3e8; 

% distance from terminal 1 to terminal 2
d=sqrt((term1_loc(1)-term2_loc(1))^2 + (term1_loc(2)-term2_loc(2))^2);

% reduction in magnitude caused by propagation, and the phase
% factor caused by the propagation delay
sig=(1./(4*pi.*d)).*exp(j*(2*pi/(c/freq)*d));

propagation=[sig,sig];
phi1=rem(2*pi+atan2(term2_loc(2)-term1_loc(2),term2_loc(1)-term1_loc(1)),2*pi);
phi2=rem(phi1+pi,2*pi);
