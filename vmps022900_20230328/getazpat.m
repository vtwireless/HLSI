%[hpat,vpat]=getazpat(filename)
%determines horizontally and vertically polarized antenna pattern 
%values at angles phi, assumes theta=pi/2
%   Outputs:
%     hpat:  a row vector containing the horizontally polarized azimuth 
%            pattern, sampled at equal increments from 0 to 2*pi 
%     vpat:  a row vector containing the vertically polarized azimuth
%            pattern, sampled at equal increments from 0 to 2*pi 
%   Inputs:
%     filename:  path and 8.3 character name of the pattern file

function [hpat,vpat]=getazpat(filename)

[vpat1,hpat1]=rcpat2(filename);
thetadim=size(hpat1,1);
phidim=size(hpat1,2);
theta_index=1+(thetadim-1)/2;	% index for theta=90 degrees
hpat=hpat1(theta_index,:);
vpat=vpat1(theta_index,:);

return;