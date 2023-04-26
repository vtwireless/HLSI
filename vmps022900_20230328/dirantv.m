% dirantv(thetares,phires,azbw,elbw,SLL,'patterndir','filename')  
% Generates the pattern for a vertically polarized directional 
% antenna with a flat main beam and uniform side lobe level.
% "thetares" is the pattern sampling resolution in theta in 
% degrees.
% "phires" is the pattern sampling resolution in phi in degrees.
% "azbw" is the azimuth beamwidth in degrees.
% "elbw" is the elevation beamwidth in degrees.
% "SLL" is the side lobe level in dB and must be <=0. -999 for no sidelobes 
% "patterndir" is the directory in which the patterns are stored. 
% "filename" is the 8.3 character name of the output files which 
% will contain the vertically and horizontally polarized antenna patterns.
% M-files required:  wcpat
% Other files required:  None

% The resulting antenna patterns are 180/thetares + 1 by 
% 360/phires + 1 matrices.

% Carl Dietrich (carld@birch.ee.vt.edu)
% Antenna Group
% Center for Wireless Telecommunications
% Virginia Tech 
% 5-6-96
% modified to write complex patterns 5-28-96
% modified to use on pattern file 8-17-98

function f=dirantv(thetares,phires,azbw,elbw,SLL,patterndir,filename)

if SLL > 0
  'Error!  SLL must be <= 0.'
  return;
end;
if 90/thetares ~= round(90/thetares)
  'Error!  theta resolution must divide evenly into 90 degrees.'
  return;
end;

thetadim=180/thetares +1;
phidim=360/phires +1;

fvert=zeros(thetadim,phidim);	% vertically polarized pattern
fhoriz=fvert;			% horizontally polarized pattern
for k=1:thetadim
   theta=pi*thetares*(k-1)/180;
   for m=1:phidim
      phi=pi*phires*(m-1)/180;
      if (abs(theta-pi/2)-pi*thetares/1800>pi*(elbw/2)/180)
        if SLL ~= -999	% else no sidelobes
          fvert(k,m)=10^(SLL/10);  
        end;
      elseif phi-pi*phires/1800>(azbw/2)*pi/180 & (2*pi-phi)>(azbw/2)*pi/180+pi*phires/1800;
        if SLL ~= -999 	% else no sidelobes
          fvert(k,m)=10^(SLL/10);
        end;
      else
        fvert(k,m)=1;
      end;
   end;
end;

% write patterns
wcpat(patterndir,filename,fvert,fhoriz);

return; 
