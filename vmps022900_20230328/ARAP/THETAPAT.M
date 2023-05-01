% thetapat('filename',theta)  Plots a theta cut of an antenna pattern 
% "filename" is the 8.3 character name of the file containing the 
% vertically and horizontally polarized patterns.  
% "theta" is the theta value for the pattern plot.
% The patterns are stored as 180/resolution+1 by 2*(360/resolution+1)
% matrices containing sampled complex antenna patterns.
% M-files required:  rcpat2
% Other files required:  <filename>.vrt, <filename>.hrz

% Carl Dietrich (carld@birch.ee.vt.edu)
% Antenna Group
% Center for Wireless Telecommunications
% Virginia Tech
% 5-6-96
% modified to read complex patterns 5-28-96
% modified to use one pattern file 8-17-98

function thetapat(filename,theta)

% read patterns
[fvert,fhoriz]=rcpat2(filename);
 
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
index=theta/thetares +1;
phi=0:2*pi/(phidim-1):2*pi;
h1=figure;
h2=polar(phi,abs(fvert(index,:)),'b-');
set(h1,'NumberTitle','off',...
   'Name',['Vertical Polarization Pattern, theta = ',num2str(theta),' degrees']);
set(h2,'LineWidth',2);
h3=figure;
pos=get(h1,'Position');
pos=[pos(1)+35 pos(2)-35 pos(3) pos(4)];
h4=polar(phi,abs(fhoriz(index,:)),'g-');
set(h3,'Position',pos,'NumberTitle','off',...
   'Name',['Horizontal Polarization Pattern, theta = ',num2str(theta),' degrees']);
set(h4,'LineWidth',2);
return;