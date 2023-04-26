function N2=petscat(R,x1,y1,x2,y2,N,seed) 
%N2=PETSCAT creates uniformily distributed scatteres within
%   a circle around the mobile  bounded by R, the radius.
%   INPUTS: 
%     R: radius of circle around mobile in meters 
%     x1,y1: location in meters of the base station
%     x2,y2: location in meters of the base mobile
%     N:     number of scatterers
%		seed:	 seed for random number generator
%   OUTPUT:  
%     N2:  an Nx2 matrix with the x and y coordinates of all 
%          the scatterers

% Kai Dietze

%% finding the locations of the scatterers within the circle of radius R
%% around the mobile

N2=[];
n=0;
rand('seed',seed);		% initialize random number generator
while n~=N,              %  creates N random number pairs (x and y)
 q=rand(1,1)-0.5;        %  centered about the origin.
 r=rand(1,1)-0.5;
 x=2*q*R+x2;                % creation of the x and y coordinates
 y=2*r*R+y2;
 if ((x-x2)^2+(y-y2)^2)<=R^2 % criterion to see if the point lies within the
     N2=[N2;[x y]];        % circle.
    n=n+1;
 end;
end;