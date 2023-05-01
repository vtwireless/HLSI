function [fretrans,timefilt]=chatrans(maxmultres,tsamp,d,angl,PT,freq,gamma,los,ploty,movetime)

oversamp=2;
lngthfilt=maxmultres*oversamp+1;
samplerate=1/tsamp;
samplestep=samplerate/lngthfilt;

freqlgth=(freq-samplerate/2+samplestep/2):samplestep:(freq+samplerate/2-samplestep/2);
freqlgth=[freqlgth(ceil(lngthfilt/2):length(freqlgth)) freqlgth(1:floor(lngthfilt/2))];
for gg=1:length(freqlgth),
   if freqlgth(gg)~=0,
      ATP=delspr(d,angl,PT,freqlgth(gg),gamma,los);
      fretrans(gg)=sum(ATP(:,3));
   else
      fretrans(gg)=0;
   end
end
fretrans=fretrans.*exp(i*2*pi*movetime/lngthfilt*[0:lngthfilt-1]);
fretrans=fretrans*maxmultres;
%[freqlgth(1) freqlgth(7)]
timefilt=ifft(fretrans);
timefilt=timefilt(1:maxmultres+100);
if ploty==1
   figure
   subplot(2,1,1)
   plot(real(timefilt))
   title('real component')
   subplot(2,1,2)
   plot(imag(timefilt))
   title('imaginary component')
%   figure
%   plot(abs(timefilt))
end

return