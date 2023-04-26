% [lingain,dBgain]=gain('patterndir','filename') calculates gain of an antenna 
% "patterndir" is the directory in which the pattern is stored.
% "filename" is the name of the antenna pattern files and is 8.3 
% characters long.  
% M-files required: rcpat
% Other files required: Antenna pattern files

% Carl Dietrich (carld@birch.ee.vt.edu)
% Antenna Group
% Center for Wireless Telecommunications
% Virginia Tech
% 5-6-96
% fixed to handle complex patterns 5-28-96
% output format modified 12-16-96
% modified to use one pattern file 8-17-98

function g=gain(patterndir,filename)

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

U=zeros(thetadim,phidim);
Umax=0;		% max radiation intensity
kmax=0;		% k for boresight (if pattern has a single maximum)
mmax=0;		% m for boresight (if pattern has a single maximum)
 
% calculate radiation intensity and find boresight (if applicable)
for k=1:thetadim
   for m=1:phidim
      U(k,m)=fvert(k,m)^2+fhoriz(k,m)^2;
      if U(k,m)>Umax 
        Umax=U(k,m);
        kmax=k; 
	mmax=m;
      end;
   end;
end;

['Boresight (if applicable):  theta=',num2str((k-1)*180/(thetadim-1)),'  phi=',num2str((m-1)*180/(phidim-1))]

% calculate gain
Omega=0;
dtheta=pi*thetares/180;
dphi=pi*phires/180;
for m=1:phidim
   for k=1:thetadim
      theta=(k-1)*pi/(thetadim-1);
      Omega=Omega+(U(k,m)/Umax)*sin(theta)*dtheta*dphi;
   end;
end;

G=4*pi/Omega;
GdB=10*log10(G);
g=[G,GdB];

return;      
      
