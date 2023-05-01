%[phi_term1,phi_term2,phi_R,bsd,msd]=aoadist(term1_loc,term2_loc,scatterer_loc)
%Calculates angles and distances for propagation models  
%   Outputs:
%     phi_term1:  Angles in radians to each scatterer (ccw from x-axis)
%                 at terminal 1
%     phi_term2:  Angles in radians to each scatterer (ccw from x-axis)
%                 at terminal 2
%     phi_R:  Reflection angles in radians from normal at each scatterer
%     ds1:  Path lengths from scatterers to terminal 1
%     ds2:  Path lengths from scatterers to terminal 2
%   Inputs:
%     term1_loc:  The (x,y) coordinates of terminal 1
%     term2_loc:  The (x,y) coordinates of terminal 2
%     scatterer_loc:  Each row contains the (x,y) coordinates of one scatterer

% Carl Dietrich 5-19-98

function [phi_term1,phi_term2,phi_R,ds1,ds2]...
        =aoadist(term1_loc,term2_loc,scatterer_loc)

M=size(scatterer_loc,1);	% number of scatterers

phi_term1=zeros(M,1);
phi_term2=zeros(M,1);
phi_R=zeros(M,1);
ds1=zeros(M,1);
ds2=zeros(M,1);

phi_term1=rem(2*pi+atan2(scatterer_loc(:,2)-term1_loc(2),...
                     scatterer_loc(:,1)-term1_loc(1)),2*pi);

phi_term2=rem(2*pi+atan2(scatterer_loc(:,2)-term2_loc(2),...
                     scatterer_loc(:,1)-term2_loc(1)),2*pi);

ds1=sqrt((scatterer_loc(:,1)-term1_loc(1)).^2+(scatterer_loc(:,2)-term1_loc(2)).^2);

ds2=sqrt((scatterer_loc(:,1)-term2_loc(1)).^2+(scatterer_loc(:,2)-term2_loc(2)).^2);

phi_R=acos(((term1_loc(:,1)-scatterer_loc(:,1)).*(term2_loc(:,1)-scatterer_loc(:,1))+...
   (term1_loc(:,2)-scatterer_loc(:,2)).*(term2_loc(:,2)-scatterer_loc(:,2))) ...
   ./(ds1.*ds2))/2;    

%phi0=rem(2*pi+atan2(term2_loc(2)-term1_loc(2),...
%                    term2_loc(1)-term1_loc(1)),2*pi);%phi1=abs(phi_term1-phi0);
%phi1=min(2*pi-phi1,phi1);
%phi2=abs(rem(pi+phi0,2*pi)-phi_term2);
%phi2=min(2*pi-phi2,phi2);
%phi_R=(pi-phi1-phi2)/2;

return;