% halfwave(thetares,phires,'patterndir','filename')  Generates 
% the pattern for a vertically oriented half-wave dipole. 
% "thetares" is the pattern sampling resolution in theta in degrees.
% "phires" is the pattern sampling resolution in phi in degrees.
% "patterndir" is the directory in which the patterns are stored.  
% "filename" is the 8.3 character name for the antenna pattern files.  
% The vertically and horizontally polarized patterns are
% sampled in a 180/thetares+1 by 2*(360/phires+1) matrix.
% M-files required:  wcpat
% Other files required:  None

% Carl Dietrich (carld@birch.ee.vt.edu)
% Antenna Group
% Center for Wireless Telecommunications
% Virginia Tech
% 5-6-96
% modified to write complex pattern 5-28-96
% modified to use one pattern file 8-17-98

function halfwave(thetares,phires,patterndir,filename);

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
      if k==1|k==thetadim
        fvert(k,m)=0;
      else
        fvert(k,m)= cos((pi/2)*cos(theta))/sin(theta);
      end;
   end;
end;

% write patterns
wcpat(patterndir,filename,fvert,fhoriz);

return; 
