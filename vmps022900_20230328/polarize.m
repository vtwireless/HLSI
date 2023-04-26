% [frotV,frotH]=polarize(frotVP,frotHP,deltaphi,
% deltatheta,deltatau)  Determines vertically and horizontally 
% polarized components after antenna pattern is rotated.
% "frotV" and "frotH" are the new vertically and horizontally 
% polarized patterns, respectively.
% "frotVP" and "frotHP" are the rotated versions of the original
% vertically and horizontally polarized patterns, respectively.
% "deltaphi" is the azimuth rotation angle.
% "deltatheta" is the elevation rotation angle.
% "deltatau" is the tilt angle.
% See rotpatvh for more detail.
% M-files required:  Called by rotpatvh
% Other files required:  rotpath also requires rcpat, rotate2,
% resample, and wcpat

% Carl Dietrich (carld@birch.ee.vt.edu)
% Antenna Group
% Center for Wireless Telecommunications
% Virginia Tech
% 3-8-96

function [frotV,frotH]=polarize(frotVP,frotHP,deltaphi,deltatheta,deltatau);
 
tic

'Calculating vertical and horizontal polarization patterns of rotated antenna.'

thetadim=size(frotVP,1);
phidim=size(frotVP,2);

dph=pi*deltaphi/180;	% convert rotation angles to radians
dth=pi*deltatheta/180;
dta=pi*deltatau/180;

% form rotation matrices
R1=[cos(dph),-sin(dph),0;sin(dph),cos(dph),0;0,0,1];
R2=[cos(dth),0,sin(dth);0,1,0;-sin(dth),0,cos(dth)];
R3=[1,0,0;0,cos(dta),-sin(dta);0,sin(dta),cos(dta)];
R=R1*R2*R3;

yhatP=R*[0;1;0];	% y hat triple prime in orig. coord. sys.

zhatP=R*[0;0;1];	% z hat triple prime in original coordinate system
zhat=[0;0;1];		% z hat in original coordinate system

frotV=zeros(thetadim,phidim);
frotH=zeros(thetadim,phidim);

% calculate new patterns
for k=1:thetadim
   theta=pi*(k-1)/(thetadim-1);
   for m=1:phidim
      phi=2*pi*(m-1)/(phidim-1);
      rhat=[sin(theta)*cos(phi);sin(theta)*sin(phi);cos(theta)];
      phihat=cross(zhat,rhat);
      if norm(phihat)~=0
        phihat=phihat/norm(phihat);
      elseif k==thetadim
        phihat=[0;-1;0];
      else
        phihat=[0;1;0];
      end;
      thetahat=cross(phihat,rhat);
      if norm(thetahat)==0
        disp('Error: norm of thetahat = 0')
      else
        thetahat=thetahat/norm(thetahat);
      end;
      phihatP=cross(zhatP,rhat);
      if norm(phihatP)==0
        disp('Norm of phihatP = 0')
        phihatP=[0;1;0];
      else
        phihatP=phihatP/norm(phihatP);
      end;
      thetahatP=cross(phihatP,rhat);
      if norm(thetahatP)==0
        disp('Norm of thetahatP = 0')
      else
        thetahatP=thetahatP/norm(thetahatP);
      end;
      frotV(k,m)=frotVP(k,m)*(thetahatP'*thetahat)+frotHP(k,m)*(phihatP'*thetahat);
      frotH(k,m)=frotVP(k,m)*(thetahatP'*phihat)+frotHP(k,m)*(phihatP'*phihat);
   end;
end;

return;
      
