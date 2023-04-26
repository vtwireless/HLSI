% [RH3,TH3,PH3]=rotate(f,deltaphi,deltatheta,deltatau)
% Rotates an antenna pattern.
% The boresight of the original pattern is assumed to be 
% aligned with the positive x-axis.
% "RH3" is a thetadim X phidim matrix containing E-field phasor
% at each sampled point in the rotated antenna pattern.
% "TH3" is a thetadim X phidim matrix containing the theta
% coordinate of each sampled point in the rotated pattern.
% "PH3" is a thetadim X phidim matrix containing the phi
% coordinate of each sampled point in the rotated pattern.
% "deltaphi" is the azimuth rotation angle about the z axis
% "deltatheta" is the elevation rotation angle of the boresight 
% down from the x-y plane after the pattern has been rotated in 
% azimuth.
% "deltatau" is a tilt angle measured counterclockwise about 
% the boresight (looking in at the origin).
% M-files required:  This file is called by rotpatvh.m
% Other files required:  rotpatvh also requires rcpat, resample, 
% polarize, and wcpat
 
% Carl Dietrich (carld@birch.ee.vt.edu)
% Antenna Group
% Center for Wireless Telecommunications
% Virginia Tech
% 3-8-96

function [RH3,TH3,PH3]=rotate(f,deltaphi,deltatheta,deltatau)

tic

'Rotating pattern'

thetadim=size(f,1);
phidim=size(f,2);

dph=pi*deltaphi/180;	% convert rotation angles to radians
dth=pi*deltatheta/180;
dta=pi*deltatau/180;

% form rotation matrices
R1=[cos(dph),-sin(dph),0;sin(dph),cos(dph),0;0,0,1];
R2=[cos(dth),0,sin(dth);0,1,0;-sin(dth),0,cos(dth)];
R3=[1,0,0;0,cos(dta),-sin(dta);0,sin(dta),cos(dta)];
R=R1*R2*R3;

frot=zeros(thetadim,phidim);
frotx=zeros(thetadim,phidim);
froty=zeros(thetadim,phidim);
frotz=zeros(thetadim,phidim);
RH3=zeros(thetadim,phidim);
TH3=zeros(thetadim,phidim);
PH3=zeros(thetadim,phidim);

for k=1:thetadim
   theta=pi*(k-1)/(thetadim-1);
   for m=1:phidim
      phi=2*pi*(m-1)/(phidim-1);
      x=f(k,m)*sin(theta)*cos(phi);		% transform to rectangular  
      y=f(k,m)*sin(theta)*sin(phi);
      z=f(k,m)*cos(theta);
      Pc=[x;y;z];
      Pc3=R*Pc;					% rotate pattern
      r3=sqrt(Pc3(1)^2+Pc3(2)^2+Pc3(3)^2);	% transform back to spherical
      th3=atan2(sqrt(Pc3(1)^2+Pc3(2)^2),Pc3(3));     
      ph3=atan2(Pc3(2),Pc3(1));
      
      if ph3<-2*pi | ph3>4*pi				% check for excessive rotation
        disp('Error!  Rotation in phi cannot exceed 360 degrees.')
        return;
      elseif th3<-pi | th3>2*pi
        disp('Error!  Rotation in theta cannot exceed 180 degrees.')
        return;
      end; 
      if th3>=0 & th3<=pi		% make sure theta,phi are within range
        if ph3<0
          ph3=ph3+2*pi;
        elseif ph3>2*pi
          ph3=ph3-2*pi;
        end;
      elseif th3<0
        th3=-th3;
        if ph3<-pi
          ph3=ph3+3*pi;
        elseif ph3>=-pi & ph3<=pi
          ph3=ph3+pi;
        elseif ph3>pi
          ph3=ph3-pi;
        end;
      elseif th3>pi
        th3=2*pi-th3;
        if ph3<-pi
          ph3=ph3+3*pi;
        elseif ph3>=-pi & ph3<=pi
          ph3=ph3+pi;
        elseif ph3>pi
          ph3=ph3-pi;
        end;  
      end;      
      RH3(k,m)=r3;
      TH3(k,m)=th3;
      PH3(k,m)=ph3;    
   end;
end;

toc
return;