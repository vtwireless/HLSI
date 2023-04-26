% f=resample(R,Theta,Phi)
% Resamples antenna pattern contained in R,Theta,and Phi matrices.
% writes pattern to matrix f.
% "R" is a thetadim X phidim matrix containing E-field phasor
% at each sampled point in the antenna pattern.
% "Theta" is a thetadim X phidim matrix containing the theta
% coordinate of each sampled point in the pattern.
% "Phi" is a thetadim X phidim matrix containing the phi
% coordinate of each sampled point in the pattern.
% M-files required:  This file is called by rotpatvh.m
% Other files required:  rotpatvh also requires rcpat, rotate,
% polarize, and wcpat

% Carl Dietrich (carld@birch.ee.vt.edu)
% Antenna Group
% Center for Wireless Telecommunications
% Virginia Tech
% 3-8-96 

function frot=resample(R,Theta,Phi)

tic

thetadim=size(R,1);
phidim=size(R,2);

% resample pattern
'Resampling pattern.'
for k=1:thetadim
   for m=1:phidim
      theta=pi*(k-1)/(thetadim-1);
      phi=2*pi*(m-1)/(phidim-1);
      mindistsq=2*(2*pi)^2;
      kprime=1;
      mprime=1;
      for kk=1:thetadim
         for mm=1:phidim
            distsq=(theta-Theta(kk,mm))^2+(phi-Phi(kk,mm))^2;
            if distsq<mindistsq
              mindistsq=distsq;
              kprime=kk;
              mprime=mm;
            end;
         end;
      end;
      frot(k,m)=R(kprime,mprime);
      if frot(k,m)==0 & R(2,2)~=0
        k
        m
      end;
   end;
end;

toc

return;
