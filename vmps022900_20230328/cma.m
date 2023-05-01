load filters1
Ebtemp=Ebrecfinal;
size(Ebtemp)
y=[]
qq=size(Ebtemp)
Ebtemp=Ebtemp+5e-6*randn(qq(1),qq(2))+j*5e-6*randn(qq(1),qq(2));
%Ebtemp=Ebtemp(1:2,:);
block=25;
wn=[1; 0; 0]
w=wn;
for h=1:floor(qq(2)/block);
  yn=conj(wn.')*Ebtemp(:,(h-1)*block+1:h*block);
  delta=yn./abs(yn);
  for g=1:min(size(Ebtemp)),
     for gi=1:min(size(Ebtemp)),
       phi(g,gi)=sum(Ebtemp(g,(h-1)*block+1:h*block).*conj(Ebtemp(gi,(h-1)*block+1:h*block)));
     end
  end
  S=Ebtemp(:,(h-1)*block+1:h*block)*conj(delta.');
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
  y=[y yn];
  w=[w wn];
end;
size(w)
lambda=3e8/2e9;
load X2Y2f
%X2Y2(2998:3000,:)
conj(wn)
figure
subplot(2,2,1)
countnum=1;
for ggg=[1 2 3 8],
   subplot(2,2,countnum)
%antennapat2(X2Y2(2998:3000,:),lambda,conj(wn),3)
antennapat2(X2Y2(1:3,:),lambda,conj(w(:,ggg)),3)
    countnum=countnum+1;
 end
 figure
 antennapat2(X2Y2(1:3,:),lambda,conj(wn),3)
 figure
 antennapat2(X2Y2(1:3,:),lambda,conj(w(:,length(w)-1)),3)
step=0.2;
theta=-180:step:180-step;
n=0:3;
p= ... %conj(wn(1))*exp(-j*pi*4.*cos(theta/180*pi))+ ...
  ... %conj(wn(2))*exp(-j*pi*3.*cos(theta/180*pi)) ...
  +conj(wn(1))*exp(-j*pi*2.*cos(theta/180*pi)) ...
  +conj(wn(2))*exp(-j*pi*1.*cos(theta/180*pi)) ...
  +conj(wn(3));
%figure
%polar(theta*pi/180,abs(p))
