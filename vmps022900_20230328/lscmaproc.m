function lscmaproc(lscmapas,lscmabl,Ebrec,usu,mult1,anglemult1,mult2,anglemult2,mult3,anglemult3,mult4,anglemult4,mult5,anglemult5,mult6,anglemult6,active)
%  creating x
block=lscmabl;
%bits=4000;
%soi=90     %degree of signal of interest
%asoi=1      %amplitude of desired signal
%aoa1=160    %degrees of desired signal
%amp1=0.5    %amp of interferer 1 coming form 90 degrees
%aoa2=120     %angle of interferer 2
%amp2=0.5    %amplitude of interferer 2
%vari=0.0001  %variance of noise
%aoa3=45    %angle of interferer 3
%amp3=0.5    %amplitude of interferer 3
%aoa4=10     %angle of interferer 3
%amp4=0.5    %amplitude of interferer 3

y=[];
%mu=0.01;
%NRZ=[];
%NRZ1=[];
%NRZ2=[];
%NRZ3=[];
%NRZ4=[];

%samp=1;  % number of samples
%rand('seed',0);
%oo=rand(1,bits);
%for h=1:length(oo),
% if oo(h)>0.5
%    NRZ=[NRZ ones(1,samp)];
%  else
%    NRZ=[NRZ -1*ones(1,samp)];
%  end
%end 

%oo=rand(1,bits);
%for h=1:length(oo),
%  if oo(h)>0.5
%    NRZ1=[NRZ1 ones(1,samp)];
%  else
%    NRZ1=[NRZ1 -1*ones(1,samp)];
%  end
%end

%oo=rand(1,bits);
%for h=1:length(oo),
%  if oo(h)>0.5
%    NRZ2=[NRZ2 ones(1,samp)];
%  else
%    NRZ2=[NRZ2 -1*ones(1,samp)];
%  end
%end

%oo=rand(1,bits);
%for h=1:length(oo),
%  if oo(h)>0.5
%    NRZ3=[NRZ3 ones(1,samp)];
%  else
%    NRZ3=[NRZ3 -1*ones(1,samp)];
%  end
%end

%oo=rand(1,bits);
%for h=1:length(oo),
%  if oo(h)>0.5
%    NRZ4=[NRZ4 ones(1,samp)];
%  else
%    NRZ4=[NRZ4 -1*ones(1,samp)];
%  end
%end



%x(1,:)=asoi*NRZ*exp(-j*pi*4*cos(soi/180*pi));
%x(2,:)=asoi*NRZ*exp(-j*pi*3*cos(soi/180*pi));
%x(3,:)=asoi*NRZ*exp(-j*pi*2*cos(soi/180*pi));
%x(4,:)=asoi*NRZ*exp(-j*pi*1*cos(soi/180*pi));
%x(5,:)=asoi*NRZ;



%i1(1,:)=amp1*NRZ1*exp(-j*pi*4*cos(aoa1/180*pi));
%i1(2,:)=amp1*NRZ1*exp(-j*pi*3*cos(aoa1/180*pi));
%i1(3,:)=amp1*NRZ1*exp(-j*pi*2*cos(aoa1/180*pi));
%i1(4,:)=amp1*NRZ1*exp(-j*pi*1*cos(aoa1/180*pi));
%i1(5,:)=amp1*NRZ1;
%x=x+i1;
%sz=size(x);
%x=x+normrnd(0,vari,sz(1),sz(2))+i*normrnd(0,vari,sz(1),sz(2));
%i2(1,:)=amp2*NRZ2*exp(-j*pi*4*cos(aoa2/180*pi));
%i2(2,:)=amp2*NRZ2*exp(-j*pi*3*cos(aoa2/180*pi));
%i2(3,:)=amp2*NRZ2*exp(-j*pi*2*cos(aoa2/180*pi));
%i2(4,:)=amp2*NRZ2*exp(-j*pi*1*cos(aoa2/180*pi));
%i2(5,:)=amp2*NRZ2*exp(-j*pi*0*cos(aoa2/180*pi));
%x=x+i2;
%i3(1,:)=amp3*NRZ3*exp(-j*pi*4*cos(aoa3/180*pi));
%i3(2,:)=amp3*NRZ3*exp(-j*pi*3*cos(aoa3/180*pi));
%i3(3,:)=amp3*NRZ3*exp(-j*pi*2*cos(aoa3/180*pi));
%i3(4,:)=amp3*NRZ3*exp(-j*pi*1*cos(aoa3/180*pi));
%i3(5,:)=amp3*NRZ3*exp(-j*pi*0*cos(aoa3/180*pi));
%x=x+i3;
%i4(1,:)=amp4*NRZ4*exp(-j*pi*4*cos(aoa4/180*pi));
%i4(2,:)=amp4*NRZ4*exp(-j*pi*3*cos(aoa4/180*pi));
%i4(3,:)=amp4*NRZ4*exp(-j*pi*2*cos(aoa4/180*pi));
%i4(4,:)=amp4*NRZ4*exp(-j*pi*1*cos(aoa4/180*pi));
%i4(5,:)=amp4*NRZ4*exp(-j*pi*0*cos(aoa4/180*pi));
%x=x+i4;

% initial w
%load filtersnomove
%load filters
%load filtersaccell
x(1,:)=sum(Ebrec(1:3,:));
x(2,:)=sum(Ebrec(4:6,:));
x(3,:)=sum(Ebrec(7:9,:));

wn=[0; 0; 1]
w=wn;
for h=1:floor(length(x)/block);
   for g=1:lscmapas,
   	yn=conj(wn.')*x(:,(h-1)*block+1:h*block);
      delta=yn./abs(yn);
      for g=1:min(size(x)),
         for gi=1:min(size(x)),
          phi(g,gi)=sum(x(g,(h-1)*block+1:h*block).*conj(x(gi,(h-1)*block+1:h*block)));
         end
      end
      S=x(:,(h-1)*block+1:h*block)*conj(delta.');
      wn=inv(phi)*S;
%  using qr decomp to approximate solution(see help qr):
%  R=qr(phi);
%  wn = R\(R'\(phi'*S));
%  r = S - phi*wn;
%  e = R\(R'\(phi'*r));
%  wn=wn+e;
%  [q,r]=qr(phi);
%  wn=inv(r)*q'*S;
%  h
  end
   y=[y yn];
   w=[w wn];
end;
figure
plot(abs(y))
figure
c=3e8
X2Y2=[0 0.5*(c/2e9);0 0; 0 -0.5*(c/2e9)]
lambda=3e8/2e9;

subplot(2,2,1)
antennapat3(X2Y2,lambda,w(:,1),mult1,anglemult1,mult2,anglemult2,mult3,anglemult3,mult4,anglemult4,mult5,anglemult5,mult6,anglemult6,usu,active)
title('1st Iteration')
hold on
subplot(2,2,2)
antennapat3(X2Y2,lambda,w(:,2),mult1,anglemult1,mult2,anglemult2,mult3,anglemult3,mult4,anglemult4,mult5,anglemult5,mult6,anglemult6,usu,active)
title('2nd Iteration')
hold on
subplot(2,2,3)
antennapat3(X2Y2,lambda,w(:,3),mult1,anglemult1,mult2,anglemult2,mult3,anglemult3,mult4,anglemult4,mult5,anglemult5,mult6,anglemult6,usu,active)
title('3rd Iteration')
hold on
subplot(2,2,4)
antennapat3(X2Y2,lambda,w(:,4),mult1,anglemult1,mult2,anglemult2,mult3,anglemult3,mult4,anglemult4,mult5,anglemult5,mult6,anglemult6,usu,active)
title('4th Iteration')
size(w)

%for h=1:length(x);
%  yn=conj(wn)*x(:,h);
%  en=yn-yn*abs(yn)^2;
%  en=yn/abs(yn)-yn;
%  wn1=wn+mu*x(:,h)'*conj(en);
%  wn=wn1;
%  y=[y yn];
%end;


%figure
%plot(abs(y))
%figure
%plot(angle(y))
%figure
%plot(NRZ)



% plotting pattern
%step=0.2;
%theta=-180:step:180-step;
%n=0:3;
%p=conj(wn(1))*exp(-j*pi*4.*cos(theta/180*pi))+ ...
%  conj(wn(2))*exp(-j*pi*3.*cos(theta/180*pi)) ...
%  +conj(wn(3))*exp(-j*pi*2.*cos(theta/180*pi)) ...
%  +conj(wn(4))*exp(-j*pi*1.*cos(theta/180*pi)) ...
%  +conj(wn(5)); %...
%   +conj(wn(5))*exp(j*pi*1.*cos(theta/180*pi))+conj(wn(6));
%  +conj(wn(6))*exp(-j*pi*3.*cos(theta/180*pi)) ...
%  +conj(wn(7))*exp(-j*pi*2.*sin(theta/180*pi)) ...
%   +conj(wn(8))*exp(-j*pi*1.*sin(theta/180*pi))+conj(wn(9));

%p=(wn(1))*exp(-j*pi*5.*cos(theta/180*pi))+(wn(2))*exp(-j*pi*4.*cos(theta/180*pi)) ...
%  +(wn(3))*exp(-j*pi*3.*cos(theta/180*pi)) ...
%  +(wn(4))*exp(-j*pi*2.*cos(theta/180*pi)) ...
%   +(wn(5))*exp(-j*pi*1.*cos(theta/180*pi))+(wn(6));

%p=conj(wn)*[exp(-j*pi*3.*sin(theta/180*pi));exp(-j*pi*2.*sin(theta/180*pi)); ...
%     exp(-j*pi*3.*sin(theta/180*pi));1];
%[n,theta]=meshgrid(n,theta);
%p=flipud(exp(-j*pi.*n.*sin(theta/180*pi))');
%polar(theta*pi/180,abs(p))
