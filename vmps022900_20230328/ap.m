% ap(elements,'indir',infilenames,'outdir','outfilename')  Computes array 
% pattern for an N-element 3-dimensional antenna array, where the element
% patterns are stored in data files. 
% "elements" is Nx5 and contains one row for each element.  Each row 
% contains the sperical (r,theta,phi) coordinates of the element, 
% where r is in wavelengths and theta and phi are in degrees, the 
% current amplitude, phase shift in degrees for the element. 
% "indir" is the directory in which the input patterns are stored.
% "infilenames" is an array of 8-character (exactly) names of 
% files which contain vertically polarized (<filename>.vrt) and 
% horizontally polarized (<filename>.hrz) antenna patterns.  All 
% element patterns must have the same resolution.
% "outdir" is the directory in which the output patterns are stored.
% "outfilename" is the 8-character name of the array pattern files. 
% M-files required:  rcpat, wcpat 
% Other files required:  element pattern files

% Carl Dietrich (carld@birch.ee.vt.edu)
% Antenna Group
% Center for Wireless Telecommunications
% Virginia Tech
% 5-6-96
% 5-29-96 Modified to read and write complex pattern
% 8-5-96  Documentation updated
% 8-17-98 modified to use one pattern file

function ap(elements,indir,infilenames,outdir,outfilename)

% Error checking
n=size(elements);

if n(2)~=5	% check "elements"
	'Error!  Matrix "elements" should have 5 columns.'
	return;
end;
N=n(1);

[res,vpatterns,hpatterns]=readpats(indir,infilenames);
thetares=res(1);
phires=res(2);
thetadim=180/thetares+1;
phidim=360/phires+1;

if 90/thetares ~= round(90/thetares)	% check resolution
  'Warning.  Theta resolution does not divide evenly into 90 degrees.'
end;

% Calculate array pattern
APV=zeros(thetadim,phidim);	% vertically polarized array pattern
APH=APV;			% horizontally polarized array pattern
for thetacount=0:(180/thetares)
   thetadeg=thetacount*thetares;
   theta=pi*thetadeg/180;
   for phicount=0:(360/phires)
      phideg=phicount*phires;
      phi=pi*phideg/180;
      for(elcount=1:N)
	 rho=elements(elcount,1);		% r coord. of element
	 t=pi*elements(elcount,2)/180;	% theta coord. of element in radians
	 p=pi*elements(elcount,3)/180;	% phi coord. of element in radians
      	 I=elements(elcount,4);		% current amplitude of element
	 alpha=pi*elements(elcount,5)/180;	% current phase of element in radians
	 elphase=alpha+2*pi*rho*(sin(theta)*cos(phi)*sin(t)*cos(p)+sin(theta)*sin(phi)*sin(t)*sin(p)+cos(theta)*cos(t));
         gV=vpatterns((elcount-1)*thetadim+thetacount+1,phicount+1);
         gH=hpatterns((elcount-1)*thetadim+thetacount+1,phicount+1);
	 APV(thetacount+1,phicount+1)=APV(thetacount+1,phicount+1)+I*gV*exp(j*elphase);
         APH(thetacount+1,phicount+1)=APH(thetacount+1,phicount+1)+I*gH*exp(j*elphase);
      end;
   end;
end;

% normalize array pattern
APmax=max([max(max(abs(APV))),max(max(abs(APH)))]);
APV=APV./APmax;
APH=APH./APmax;	

% write patterns
wcpat(outdir,outfilename,APV,APH);

return;

