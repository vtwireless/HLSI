% phipat('patterndir','filename',phi)  Plots a phi cut of an antenna pattern 
% "patterndir" is the directory in which the pattern is stored.
% "filename" is the 8.3 character name of the file containing 
% the vertically and horizontally polarized patterns.  
% "phi" is the phi value for the pattern plot in degrees and is between 
% 0 and 360.
% The patterns are stored as 180/resolution+1 by 2*(360/resolution+1)
% matrices containing sampled complex antenna patterns.
% M-files required:  rcpat
% Other files required:  <filename>.vrt, <filename>.hrz

% Carl Dietrich (carld@birch.ee.vt.edu)
% Antenna Group
% Center for Wireless Telecommunications
% Virginia Tech
% 5-6-96
% modified to read complex patterns 5-28-96
% modified to use one pattern file 8-17-98

function phipat(patterndir,filename,phi)

[fvert,fhoriz]=rcpat(patterndir,filename);
 
s=size(fvert)
if s~=size(fhoriz)
  'Error!  Different size vert. and horiz. pattern files.'
  return;
end;

thetadim=s(1);
phidim=s(2);

thetares=180/(thetadim-1);	% resolution in theta
phires=360/(phidim-1);		% resolution in phi

% plot pattern 

index1=phi/phires + 1;	% phi index for "front" half of pattern
if phi>=0 & phi<=180
   index2=(phi+180)/phires + 1;	% phi index for "back" half of pattern
elseif phi>180 & phi<=360
   index2=(phi-180)/phires +1;
else
   'Error!  phi must be between 0 and 360.'
end;
theta=0:pi/(thetadim-1):2*pi; 
vpattern=zeros(1,2*thetadim - 1);	% vertically polarized pattern for angle phi
hpattern=zeros(1,2*thetadim - 1);	% horizontally polarized pattern for angle phi

% load pattern vectors 
for i=1:thetadim
   vpattern(i)=fvert(i,index1);
   hpattern(i)=fhoriz(i,index1);
end;
for i=thetadim+1:(2*thetadim-1)
   vpattern(i)=fvert(2*thetadim-i,index2);
   hpattern(i)=fhoriz(2*thetadim-i,index2);
end;

figure;
polar(theta,abs(vpattern),'b-');
title(['Vertical Polarization Pattern, phi = ',num2str(phi),' degrees']);
figure;
polar(theta,abs(hpattern),'g-');
title(['Horizontal Polarization Pattern, phi = ',num2str(phi),' degrees']);
