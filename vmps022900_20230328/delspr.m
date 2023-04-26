function ATP=delspr(d,angl,PT,freq,gamma,los)

c=3e8;
lmda=c/freq;

%VR=sqrt(PT.*lmda^2./((4*pi.*d).^2)).*exp(-j*(2*pi/lmda*d))*gamma;
VR=sqrt(PT./((4*pi.*d).^2)).*exp(-j*(2*pi/lmda*d))*gamma;
if los==1
   %VR(2:length(VR),1)=VR(2:length(VR),1)*gamma;
   VR(1)=VR(1)/gamma;
%else
   %VR=VR*gamma;
end
tme=d/c;
%y=find(min(tme));
%VR=VR.*conj(VR(y))/abs(VR(y));
ATP=[angl,tme,VR];
