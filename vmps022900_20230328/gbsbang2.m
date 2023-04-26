function BMRDGH=gbsbang2(x1,y1,x2,y2,XY,anglestx,X2Y2INI)
%[BMRDGH]=gbsbang1(x1,y1,x2,y2,XY) Generates angles for GBSB propagation model  
%   Outputs:
%     Each row of the output BMRD corresponds to one scatterer.
%     The columns are:
%     B:  Angle in degrees from base station to scatterer (psi)
%     M:  Angle in degrees from mobile to scatterer (phi)
%     Note:  psi and phi are measured couterclockwise from the x axis.
%     R:  Reflection angle in degrees from normal (theta)
%     G: Distance from base to scatterer
%     H: Distance from mobile to scatterer
%     NOTE: See Liberti's model for angle descriptions.
%   Inputs:
%     x1,y1: location in meters of the base station
%     x2,y2: location in meters of the mobile
%     XY:  Each row contains the x and y coordinates in meters of one scatterer

% Kai Dietze
% modified by Kai Dietze 6-21-98


%% finding the angle between the base station and the scatterer:  
distBS=sqrt((XY(:,1)-x1).^2+(XY(:,2)-y1).^2);  
psi=atan2((XY(:,2)-y1),(XY(:,1)-x1))*180/pi;  

%% finding the angle between the mobile and the scatterer:  
%anglestx
projection=-[cos(anglestx'*pi/180),sin(anglestx'*pi/180)]*[x2-X2Y2INI(1);y2-X2Y2INI(2)];
distMS=sqrt((XY(:,1)-X2Y2INI(1)).^2+(XY(:,2)-X2Y2INI(2)).^2)+projection;  
phi=atan2((XY(:,2)-y2),(XY(:,1)-x2))*180/pi;  

%% finding the reflection angle at the scatterer:  
warning off
theta=acos(((x1-XY(:,1)).*(x2-XY(:,1))+(y1-XY(:,2)).*(y2-XY(:,2))) ...
  ./(distMS.*distBS))*180/pi/2;    
BMRDGH=[psi,phi,theta,distBS,distMS];
warning on
return