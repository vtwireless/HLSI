% isovert(thetares,phires,'patterndir','filename')  Generates 
% the pattern for a vertically polarized isotropic radiator.
% "thetares" is the pattern sampling resolution in theta in
%  degrees.
% "phires" is the pattern sampling resolution in phi in degrees.  
% "patterndir" is the directory in which the pattern is stored.
% "filename" is the 8.3 character name of the files in which the 
% resulting vertically and horizontally polarized patterns are 
% stored. The sampled patterns are stored as 180/resolution+1 by 
% 2*(360/resolution+1) matrices.
% M-files required:  wcpat
% Other files required:  None

% Carl Dietrich (carld@birch.ee.vt.edu)
% Antenna Group
% Center for Wireless Telecommunications
% Virginia Tech
% 5-6-96
% modified to write complex pattern 5-28-96
% modified to use one pattern file 8-17-98

function isovert(thetares,phires,patterndir,filename)

if 90/thetares ~= round(90/thetares)
  'Error!  theta resolution must divide evenly into 90 degrees.'
  return;
end;

thetadim=180/thetares +1;
phidim=360/phires +1;

fvert=ones(thetadim,phidim);	% vertical polarization
fhoriz=zeros(thetadim,phidim);	% horizontal polarization

wcpat(patterndir,filename,fvert,fhoriz);

return; 
