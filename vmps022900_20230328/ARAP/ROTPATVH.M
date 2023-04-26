% rotpatvh('infilename','outfilename',deltaphi,deltatheta,deltatau)  
% Rotates and resamples an antenna pattern.  The boresight of the
% original pattern is assumed to be aligned with the positive x-axis.
% "infilename" is the path and filename of the file containing the
% vertically and horizontally polarized antenna patterns to be rotated.
% "outfilename" is the path and filename for the files containing the 
% rotated patterns.
% "deltaphi" is the azimuth rotation angle about the z axis
% "deltatheta" is the elevation rotation angle of the boresight down from
% the x-y plane after the pattern has been rotated in azimuth
% "deltatau" is a tilt angle measured counterclockwise about the boresight
% (looking in at the origin)
% M-files required:  rcpat, resample, rotate2, polarize, and wcpat
% Other files required:  <infilename>.vrt, <infilename>.hrz

% Carl Dietrich (carld@birch.ee.vt.edu)
% Antenna Group
% Center for Wireless Telecommunications
% Virginia Tech
% 5-27-96
% Modified to use complex patterns 5-28-96, cleaned up further 4-15-97
% modified to use single pattern file 8-17-98

function rotpatvh(infilename,outfilename,deltaphi,deltatheta,deltatau) 

tic	% time execution

[fvert,fhoriz]=rcpat(infilename);
 
s=size(fvert);
s2=size(fhoriz);
thetadim=s(1);
phidim=s(2);

if s2~=s
  disp('Error!  Vertical and horizontal patterns have different dimensions.')
  return;
end;

thetares=180/(thetadim-1);	% resolution in theta
phires=360/(phidim-1);		% resolution in phi

[RH3V,TH3V,PH3V]=rotate(fvert,deltaphi,deltatheta,deltatau);
[RH3H,TH3H,PH3H]=rotate(fhoriz,deltaphi,deltatheta,deltatau);

frotVP=resample2(RH3V,TH3V,PH3V); 
frotHP=resample2(RH3H,TH3H,PH3H);

% determine new vertically and horizontally polarized patterns
[frotV,frotH]=polarize(frotVP,frotHP,deltaphi,deltatheta,deltatau);

% fill in zeros left from rotation 5-27-96
for thetacount=1:thetadim
  if frotV(thetacount,1)==0 & frotV(thetacount,phidim)~=0
    frotV(thetacount,1)=frotV(thetacount,phidim);
  end;
  if frotH(thetacount,1)==0 & frotH(thetacount,phidim)~=0
    frotH(thetacount,1)=frotH(thetacount,phidim);
  end;
  if frotV(thetacount,phidim)==0 & frotV(thetacount,1)~=0
    frotV(thetacount,phidim)=frotV(thetacount,1);
  end;
  if frotH(thetacount,phidim)==0 & frotH(thetacount,1)~=0
    frotH(thetacount,phidim)=frotH(thetacount,1);
  end;
end;

% write patterns

wcpat(outfilename,frotV,frotH);

toc	% time execution 

return;
      
      
