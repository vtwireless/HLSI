% sdipole(thetares,phires,'filename')  
% Generates the pattern for a vertically oriented small dipole antenna.  
% "thetares" is the sampling resolution in theta in degrees.
% "phires" is the sampling resolution in phi in degrees.
% "patterndir" is the directory in which the pattern is stored.
% "filename" is the 8.3 character name for the antenna pattern files.  
% The vertically and horizontally polarized patterns will be 
% stored in 180/thetares+1 by 2*(360/phires+1) matrices.
% M-files required:  wcpat
% Other files required:  None

% Carl Dietrich (carld@ee.vt.edu)

function f=sloop(thetares,phires,filename)

if 90/thetares ~= round(90/thetares)
  'Error!  theta resolution must divide evenly into 90 degrees.'
  return;
end;

thetadim=180/thetares +1;
phidim=360/phires +1;

fvert=zeros(thetadim,phidim);	% vertical polarization
fhoriz=fvert;			% horizontal polarization

for k=1:thetadim
   theta=pi*thetares*(k-1)/180;
   for m=1:phidim
      phi=pi*phires*(m-1)/360;
      fvert(k,m)=sin(theta);
   end;
end;

% write patterns
wcpat(filename,fvert,fhoriz);
 
return; 
