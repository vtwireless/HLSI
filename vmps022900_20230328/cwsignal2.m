% cwsignal2(sp_sig,f,fs,tmax)

function arraysignal=cwsignal2(sp_sig,f,fs,tmax)

t=0:(1/fs):tmax;
tlength=size(t,2);
signal=exp(j*2*pi*f*t);
spslength=size(sp_sig,2);
arraysize=size(sp_sig,1);
arraysignal=zeros(arraysize,tlength);
spsi=zeros(arraysize,tlength);

for i=1:arraysize
   spsi(i,:)=interp1(0:(spslength-1),sp_sig(i,:),(0:tlength-1)*(spslength-1)/(tlength-1));
   arraysignal(i,:)=signal.*spsi(i,:);   
end;

figure
plot(t(1:300),real(arraysignal(1,1:300)),'r-',t(1:300),real(arraysignal(2,1:300)),'b-')
xlabel('time in seconds')
ylabel('signals')

