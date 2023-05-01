% scatterer_loc=leescatt(mobile_loc,M,R)
% Returns the locations of scatterers or reflecting objects uniformly spaced
% on a circle
% scatterer_loc is a matrix containing the 2-D scatterer coordinates in each row
% mobile_loc is a vector containing the 2-D coordinates of the mobile 
% (the center of the circle of scatterers)
% M is the number of scatterers
% R is the radius of the circle of scatterers

function scatterer_loc=leescatt(mobile_loc,M,R);

scatterer_loc=zeros(M,2);
for i=1:M
   scatterer_loc(i,1)=mobile_loc(1)+R*cos(2*pi*(i-1)/M);
   scatterer_loc(i,2)=mobile_loc(2)+R*sin(2*pi*(i-1)/M);
end;
return;