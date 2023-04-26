function N2=gbsbscat(dtmax,x1,y1,x2,y2,N,seed) 
%N2=GBSBSCAT creates uniformily distributed scatteres within
%   an ellipse bounded by tmax, the maximum delay time.
%   INPUTS: 
%     dtmax: maximum excess delay time over LOS in seconds
%     x1,y1: location in meters of terminal 1
%     x2,y2: location in meters of terminal 2
%     N:     number of scatterers
%		seed:	 seed for random number generator
%   OUTPUT:  
%     N2:  an Nx2 matrix with the x and y coordinates of all 
%          the scatterers

% Kai Dietze
% modified by Carl Dietrich 6-16-97
% modified by Kai Dietze to include arbitrary location of mobile and base
% 6-19-98
% modified by Carl Dietrich to use excess delay 8-7-98

%% calculating a and b for the ellipse

c=3E8;
f=sqrt((x1-x2)^2+(y1-y2)^2)/2;
a=f+c*dtmax/2;
b=sqrt(a^2-f^2);
N2=[];
n=0;

rand('seed',seed);		% initialize random number generator
while n~=N,              %  creates N random number pairs (x and y)
 q=rand(1,1)-0.5;        %  centered about the origin.
 r=rand(1,1)-0.5;
 x=2*q*a+(x1+x2)/2;                % creation of the x and y coordinates
 y=2*r*a+(y1+y2)/2;
 if (sqrt((x-x1)^2+(y-y1)^2)+sqrt((x-x2)^2+(y-y2)^2))<=2*a % criterion to see if the point lies within the
     N2=[N2;[x y]];      % ellipse.
    n=n+1;
 end;
end;