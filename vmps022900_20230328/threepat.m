% threepat('filename')  Plots an antenna pattern f in (x,y,z),
% where f is a 180/resolution+1 by 2*(360/resolution+1)
% matrix containing a sampled complex antenna pattern
% "filename" is the path and file name of the pattern file.
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

function threepat(filename)

[fvert,fhoriz]=rcpat(filename);

s=size(fvert)
size(fhoriz)
if s~=size(fhoriz)
  'Error!  Different size vert. and horiz. pattern files.'
  return;
end;

thetadim=s(1);
phidim=s(2);

thetares=180/(thetadim-1);	% resolution in theta
phires=360/(phidim-1);		% resolution in phi

% plot pattern surface
xv=zeros(thetadim,phidim);
yv=xv;
zv=xv;
xh=xv;
yh=xv;
zh=xv;
for k=0:(thetadim-1)
   theta=pi*k*thetares/180;
   for m=0:(phidim-1)
      phi=pi*m*phires/180;
      rv=abs(fvert(k+1,m+1));
      xv(k+1,m+1)=rv*sin(theta)*cos(phi);
      yv(k+1,m+1)=rv*sin(theta)*sin(phi);
      zv(k+1,m+1)=rv*cos(theta);
      rh=abs(fhoriz(k+1,m+1));
      xh(k+1,m+1)=rh*sin(theta)*cos(phi);
      yh(k+1,m+1)=rh*sin(theta)*sin(phi);
      zh(k+1,m+1)=rh*cos(theta);
   end;
end;

% determine axis values
maxcoordv=max(max(max(abs(xv))),max(max(abs(yv))));
maxcoordv=max(maxcoordv,max(max(abs(zv))));
maxcoordh=max(max(max(abs(xh))),max(max(abs(yh))));
maxcoordh=max(maxcoordh,max(max(abs(zh))));
mc=max(maxcoordv,maxcoordh);
mc=ceil(2*mc)/2;	% round up to nearest 0.5

figure;
surf(xv,yv,zv,abs(fvert));
xlabel('x')
ylabel('y')
zlabel('z')
title('Vertical Polarization Pattern');
axis([-mc mc -mc mc -mc mc]);

figure;
surf(xh,yh,zh,abs(fhoriz));
xlabel('x')
ylabel('y')
zlabel('z')
title('Horizontal Polarization Pattern');
axis([-mc mc -mc mc -mc mc]);