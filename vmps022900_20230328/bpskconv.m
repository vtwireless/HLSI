function bpskconv(X1Y1,X2Y2,XY1,XY2,XY3,XY4,XY5,XY6,active,freq,samp,Ts,bits,Eborange,pwr,gamma,los,txd,consamp,convel,condeg,fileconvdat,posflag,filepos)
%%%
%%%
consamp
condeg
convel
tic
mult1=[];
mult2=[];
mult3=[];
mult4=[];
mult5=[];
mult6=[];
anglemult1=[];
anglemult2=[];
anglemult3=[];
anglemult4=[];
anglemult5=[];
anglemult6=[];
X2Y2INI=X2Y2(1,:)
%fprintf('Number of bits : %d \n',bits)
lambda=3e8/freq;
bitcount=0;
BBITS=[];
minmult=inf;
maxmult=0;
maxmult1=0;
maxATP=0;
bitsmemory=[];
Tsamp=Ts/samp;
tsamp=Tsamp;
los
for ll=1:length(los),
   if los(ll)==1,
     eval(['XY' num2str(active(ll)) '=[[X1Y1(ll,1) X1Y1(ll,2)];XY' ...
        num2str(active(ll)) ']'])
   end
end
uussuu=size(X2Y2);

for tt=1:length(active),
   eval(['XY=XY' num2str(active(tt)) ';']);
   for uu=1:uussuu(1),
     BMRDGH=gbsbang1(X1Y1(tt,1),X1Y1(tt,2),X2Y2(uu,1),X2Y2(uu,2),XY);
     eval(['ATP',num2str(active(tt)),num2str(uu),'=delspr(BMRDGH(:,4)+BMRDGH(:,5),BMRDGH(:,2),pwr(tt),freq,gamma(tt),los(tt));']);
     
     eval(['minmult=min([minmult min(ATP' num2str(active(tt)) ...
         num2str(uu) '(:,2))]);']);

     eval(['mult' num2str(active(tt)) '(uu,:)=transpose(ceil((ATP' ...
           num2str(active(tt)) num2str(uu) '(:,2)-minmult)/Tsamp));'])
     eval(['multshift' num2str(active(tt)) '=mult' num2str(active(tt)) ...
          '-samp*floor(min(min(mult' num2str(active(tt)) '))/samp);']) 
     eval(['multprev' num2str(active(tt)) '=ceil(multshift' ...
           num2str(active(tt)) '/samp);'])
     eval(['multprev' num2str(active(tt)) '(find(multprev' ...
           num2str(active(tt)) '==0))=1;']);
     eval(['ampmult' num2str(active(tt)) '(uu,:)=transpose(ATP' ...
           num2str(active(tt)) num2str(uu) '(:,3));'])
     eval(['anglemult' num2str(active(tt)) '(uu,:)=transpose(ATP' ...
           num2str(active(tt)) num2str(uu) '(:,1))-90;'])
     eval(['angleatrx' num2str(active(tt)) '(uu,:)=transpose(ATP' ...
           num2str(active(tt)) num2str(uu) '(:,1));'])
   end
   eval(['maxmult=max([maxmult max(max(mult' num2str(active(tt)) '))]);']);
   eval(['maxmult1=max([maxmult1 max(max(multshift' num2str(active(tt)) '))]);']);
   eval(['maxATP=max([maxATP max(max(abs(ampmult' ...
        num2str(active(tt)) ')))]);']);
   eval(['bitsmemory=[bitsmemory ceil((50+samp)/samp)+4+max(max(multprev' ...
        num2str(active(tt)) '))];']);
end


Ebint1=zeros(1,samp);
Ebint2=zeros(1,samp);
posflag
if posflag==0
   tttt=tsamp*(0:1:(consamp-1));
	dsampvert=convel*sin(condeg*pi/180)*tttt;
   dsamphorz=convel*cos(condeg*pi/180)*tttt;
else
   load
   eval(['load ',filepos,' -mat;']);
end
   
for zz=1:uussuu(1),
  X2Y2(zz:uussuu(1):uussuu*consamp,:)=[[X2Y2(zz,1)+dsamphorz.'] [X2Y2(zz,2)+dsampvert.']];
end
'fear no evil'
%X2Y2
size(X2Y2)
save X2Y2f X2Y2
%save X2Y2 X2Y2
%figure
%plot(X2Y2(:,1),X2Y2(:,2),'o')
%axis equal
%return

usu=size(X2Y2)
min_time_arrival=inf*ones(length(active),usu(1));
max_time_arrival=zeros(length(active),usu(1));

active
tic
for tt=1:length(active),
   eval(['XY=XY' num2str(active(tt)) ';']);
   for uu=1:usu(1),
      
      for ff=1:length(XY(:,1)),    
       valsamp=ceil((sqrt((XY(ff,1)-X1Y1(tt,1))^2+(XY(ff,2)-X1Y1(tt,2))^2)+sqrt((XY(ff,1)-X2Y2(uu,1))^2+(XY(ff,2)-X2Y2(uu,2))^2))/tsamp/3e8)+1;
   	 min_time_arrival(tt,uu)=min([min_time_arrival(tt,uu) valsamp]);
   	 max_time_arrival(tt,uu)=max([max_time_arrival(tt,uu) valsamp]);
   	 %fprintf('multipat = %d \n',valsamp)
      end
     
   end
end
size(min_time_arrival)
min_time_arrival=min(min_time_arrival,[],2);
max_time_arrival=max(max_time_arrival,[],2);
size(min_time_arrival)
toc
tic

toc
tic
'seeing how long filters take to be created'
%timefilt=zeros(usu(1)*length(active),max(max(max_time_arrival))+100-min(min(min_time_arrival)));
countnum=0;
max_time=max([max(max(max_time_arrival)) 100]);
min_time=min(min(min_time_arrival));
movetime=min_time_arrival(tt)-50;
ploty=0;
for tt=1:length(active),
   eval(['XY=XY' num2str(active(tt)) ';']);
   eval(['anglestx=angleatrx' num2str(active(tt)) '(1,:)']);
   for uu=1:usu(1),
      BMRDGH=gbsbang2(X1Y1(tt,1),X1Y1(tt,2),X2Y2(uu,1),X2Y2(uu,2),XY,anglestx,X2Y2INI);
      countnum=countnum+1;
      eval(['[freqfilt,timefilt(' num2str(countnum) ',1:(max_time+100))]=chatrans(max_time,tsamp,' ...
            'BMRDGH(:,4)+BMRDGH(:,5),BMRDGH(:,2),pwr(tt),freq,gamma(tt),los(tt),ploty,movetime);'])
   end
   %length(active)
   
   tt
   toc
end
consamp
size(timefilt)
'filters take to be created'
toc

%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%
%'ending'
%return
%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%

%for bbb=0:9,  
% figure
% subplot(2,1,1)
% plot(real(timefilt((bbb*3+1),:)))
% title('real component')
% subplot(2,1,2)
% plot(imag(timefilt((bbb*3+1),:)))
% title('imaginary component')
%end
%   figure
%   subplot(2,1,1)
%   plot(real(timefilt(37,:)))
%   title('real component')
%   subplot(2,1,2)
%   plot(imag(timefilt(37,:)))
%   title('imaginary component')


%%%%%%%

%for tt=1:length(active),
%    eval(['mult' num2str(active(tt)) ';'])
%    eval(['multshift' num2str(active(tt)) ';'])
%    eval(['multprev' num2str(active(tt)) ';'])
%    eval(['ampmult' num2str(active(tt)) ';'])
%    eval(['dimens=size(mult' num2str(active(tt)) ');']) %%%******
%    signaltot(active(tt))=dimens(2);       %%%******
%    maxmult
%    maxATP
%    eval(['anglemult' num2str(active(tt)) ';'])
%end

%no=1e-15;
%rand('state',0);
%randn('state',0);
%ERR=[];

%maxlgth=(max(bitsmemory)+(800))*samp
%maxlgth1=(max(bitsmemory))*samp;

%fprintf('creating uncorrelated bits for transmitters');

%grnd=rand(1,length(active));
%grnd(find(grnd>0.5))=1;
%grnd(find(grnd<=0.5))=-1;
%grndl=grnd';
%for pp=1:(samp-1),
%  grndl=[grndl grnd'];
%end
%xx=grndl;
%for ii=1:(800),
%   grnd=rand(1,length(active));
%   grnd(find(grnd>0.5))=1;
%   grnd(find(grnd<=0.5))=-1;
%   grndl=grnd';
%   for pp=1:(samp-1),
%     grndl=[grndl grnd'];
%   end
%   xx=[xx grndl];
%end
%yy=size(xx);
%xx*xx'/(yy(2)-1)


%fprintf('done creating uncorrelated bits for transmitters \n');


%%%%%%%%finding average Eb of each transmitter%%%%%%%%%%%%%%%

%for yyy=1:uussuu(1)*length(active),
%   Ebavg(yyy,:)=filter(timefilt(yyy,:),1,[ones(1,samp) zeros(1,length(timefilt(yyy,:)))]);
%end


%figure
%for yyy=1:usu(1)*length(active),
%plot(abs(Ebavg(yyy,:)))
%title('Ebavg conv')
%'pause'
%pause
%end
%Ebavg=sum((abs(Ebavg).^2),2)

%for tt=1:length(active),
%   avgEb(tt)=sum(Ebavg(((tt-1)*usu(1)+1):(tt)*usu(1)),1)/usu(1)
      
%   for uu=1:usu(1),
%      eval(['for u=1:length(mult' num2str(active(tt)) ...
%          '(uu,:)),' 'Ebavg' num2str(active(tt)) num2str(uu) ...
%          '(u,:)=[zeros(1,mult' num2str(active(tt)) ...
%          '(uu,u)' ') ATP' num2str(active(tt)) num2str(uu) ...
%          '(u,3)*ones(1,samp) zeros(1,maxlgth1-samp-mult' num2str(active(tt)) ...
%          '(uu,u)' ')];end;'])
%   end
%end

%for tt=1:length(active),
%    for uu=1:usu(1),
%      eval(['Ebavg' num2str(active(tt)) num2str(uu) ...
%       '=sum((abs(sum(Ebavg' num2str(active(tt)) num2str(uu) ',1))).^2);']);
%    end
%    eval(['avgEb' num2str(active(tt)) '=[];']);
%end

%for tt=1:length(active),
%    for uu=1:usu(1),
%      eval(['avgEb' num2str(active(tt)) '=[avgEb' num2str(active(tt)) ...
%      ' Ebavg' num2str(active(tt)) num2str(uu) '];'])
%    end 
%    eval(['avgEb' num2str(active(tt)) '=sum(avgEb' num2str(active(tt)) ...
%         ')/length(avgEb' num2str(active(tt)) ');'])
%end

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%fprintf('preparing filter coefficients \n');

%for tt=1:length(active),
%   eval(['mintemp=min(min(multshift' num2str(active(tt)) '));'])
%   %mintemp=0;
%   for uu=1:usu(1),
%      eval(['for u=1:length(multshift' num2str(active(tt)) ...
%          '(uu,:)),' 'Eb' num2str(active(tt)) num2str(uu) ...
%          '(u,:)=[zeros(1,multshift' num2str(active(tt)) ...
%          '(uu,u)-mintemp' ') ATP' num2str(active(tt)) num2str(uu) ...
%          '(u,3)*xx(tt,:) zeros(1,maxlgth-yy(2)-multshift' ...
%          num2str(active(tt)) '(uu,u)+mintemp' ')];end;'])
%      %eval(['size(Eb' num2str(active(tt)) num2str(uu) ')'])
%   end
%end
%clear xx
%xx(1,:)=[ones(1,samp) zeros(1,samp) ones(1,samp)];
%xx(2,:)=[ones(1,samp) zeros(1,2*samp)];
%xx(3,:)=[ones(1,2*samp) zeros(1,samp)];
%countnum=0;
%for tt=1:length(active),
%   for uu=1:usu(1),
%      countnum=countnum+1;
%      Ebfiltout(countnum,:)=filter(timefilt(countnum,:),1,[xx(tt,:) zeros(1,(max_time+100))]);
%   end
%end
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%% TO SEE IF IT IS THE SAME %%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%figure
%for yy=1:usu(1)*length(active),
%plot(abs(Ebfiltout(yy,:)))
%title('Ebfilt conv')
%'pause'
%pause
%end


%toc

%for uu=1:usu(1),
%   receivedbits(uu,:)=sum(Ebfiltout(uu:usu(1):usu(1)*length(active),:),1);
%end

%for uu=1:usu(1),
%  eval(['Eb' num2str(uu) '=zeros(1,maxlgth);']);
%end;

%for uu=1:usu(1),
%   for tt=1:length(active),
%      eval(['Eb' num2str(active(tt)) num2str(uu) ...
%         '=sum(Eb' num2str(active(tt)) num2str(uu) ',1);']);
%      eval(['Eb' num2str(uu) '=Eb' num2str(uu) '+Eb' num2str(active(tt)) ...
%         num2str(uu) ';'])
%   end
%   if flag1==1
%      figure
%      subplot(2,1,1)
%      eval(['stem(real(Eb' num2str(uu) '(10*samp+1:40*samp)))'])
%      eval(['title(''Real Component of Signal at Antenna ' num2str(uu) ...
%         'with no noise'')'])
%      xlabel('Samples')
%      ylabel('Amplitude')
%      subplot(2,1,2)
%      eval(['stem(imag(Eb' num2str(uu) '(10*samp+1:40*samp)))'])
%      eval(['title(''Imaginary Component of Signal at Antenna ' num2str(uu) ...
%         'with no noise'')'])
%      xlabel('Samples')
%      ylabel('Amplitude')
%   end
%end

%%%%%%%%%%%%%%%%%Creating Ryy%%%%%%%%%%%%%%%%%%
%for uu=1:usu(1),
%  Ebtemp=receivedbits(uu,50:length(receivedbits(1,:)));
%  'size(Ebtemp)'
%  if length(Ebtemp)<=maxlgth,
%     Ebtemp=[Ebtemp zeros(1,maxlgth-length(Ebtemp))];
%  else
%     Ebtemp=Ebtemp(1:maxlgth);
%  end
%  size(Ebtemp)
  
%  for hh=1:ntaps,
%     'taps*(hh-1)'
%     taps*(hh-1)
%     'maxlgth'
%     maxlgth
%     'maxlgth-taps*(hh-1)'
%     maxlgth-taps*(hh-1)
%     'pause'
%     pause
%     XT(uu,:)=Ebtemp;
%     'pause'
%     pause
%  end;
%end
%for uu=1:usu(1),
%  for pp=1:usu(1),
%    AVG(uu,pp)=(800)*samp;
%  end

   
%  for pp=1:ntaps*usu(1),
%    AVG(uu,pp)=(800+2*ceil(((taps-1)*(ntaps-1)+ntaps+1)/samp))*samp- ...
%      2*taps*abs((uu-(ceil(uu/ntaps)-1)*ntaps)-(pp-(ceil(pp/ntaps)-1)*ntaps));
%  end
%end
%Ryy=XT*XT';
%Ryy=Ryy./AVG;

%toc


%%%%%%%%%%%%%%%%%Creating Ray%%%%%%%%%%%%%%%%%%

%eval(['mintemp=min(min(multshift' num2str(txd) '))'])
%filtsampout=floor(ntaps/2)*taps
%excesssamp=(filtsampout+mintemp)-floor((filtsampout+mintemp)/samp)*samp+1
%excesssamp=(50)-floor((50)/samp)*samp;
%decisionbit=floor((filtsampout+mintemp+samp)/samp)+1
%decisionbit=floor((50+samp)/samp)+1;
%if excesssamp==0,
%   excesssamp=samp;
%   decisionbit=decisionbit-1;
%end
%excesssamp
%decisionbit
%'pause'
%pause

%for hh=1:usu(1), 
%  wanted(hh,:)=xx(find(active==txd),:);
%end


%desired=[maxATP*wanted zeros(usu(1),(maxlgth-yy(2)))];
%size(wanted)
%size(zeros(usu(1),(maxlgth-yy(2))))
%size(XT)


%Ray=sum((XT.*desired),2);
%for ii=1:ntaps*usu(1),
%  AVG1(ii)=(800+2*ceil(((taps-1)*(ntaps-1)+ntaps+1)/samp))*samp- ...
%     2*abs(taps*((ii-(ceil(ii/ntaps)-1)*ntaps)-1)-filtsampout);
%end
%for ii=1:usu(1),
%  AVG1(ii)=(800)*samp;
%end

%Ray=Ray./(AVG1.');
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%fprintf('done preparing filter coefficients \n');

%for oo=active,
%  eval(['fprintf(''Span of transmitter ' num2str(oo) ...
%      ' multipath in samples (assuming 1 bit sent) = %d \n'',' ...
%   'max(max(mult' num2str(oo) '))-min(min(mult' num2str(oo) '))+samp);']);
%  eval(['fprintf(''Average Eb arriving at receiver from transmitter ' ...
%     num2str(oo) ' = %d \n'',avgEb' num2str(oo) ');'])
%  eval(['fprintf(''Number of signals arriving from transmitter ' ...
%    num2str(oo) ' = %d \n \n'',length(mult' num2str(oo) '(1,:)));']);
%end
%fprintf('Number of antennas = %d \n', length(X2Y2(:,1)))


%fprintf('\n \n Computing filter coefficients \n')

%Ryyy=Ryy+diag(no/2*ones(1,usu(1)),0);

%c=inv(Ryyy)*Ray;
%fprintf('done computing filter coefficients \n \n')

%for hh=1:usu(1),
% ccoef(hh,:)=c((hh-1)*ntaps+1:hh*ntaps)';
%end
%filtcoeff=ccoef(:,1);

%for hh=2:ntaps,
%   filtcoeff=[filtcoeff zeros(usu(1),taps-1) ccoef(:,hh)];
%end;

%for hh=1:usu(1),
%  yfilt(hh,:)=conj(c(hh))*receivedbits(hh,1:50+(300+maxmult)*samp);
%end

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%countnum=0;
%for tt=1:length(active),
%   for uu=1:usu(1);
%      countnum=countnum+1;
%      totaltrans(countnum,:)=conv(timefilt(countnum,:),filtcoeff(uu,:));
%   end
%end
%'size(totaltrans)'
%size(totaltrans)
%for tt=1:length(active),
%   transfunc(tt,:)=sum(totaltrans(((tt-1)*usu(1)+1):tt*usu(1),:),1);
%end
%'size(transfunc)'
%size(transfunc)
%for tt=1:length(active),
%   outputtot(tt,:)=filter(transfunc(tt,:),[1],[xx(tt,:) zeros(1,length(transfunc(tt,:)))]);
%end
%outputtot=sum(outputtot,1);
%'size(outputtot)'
%size(outputtot)

%figure
%stem(real(outputtot((filtsampout+1+10*samp+50):(40*samp+filtsampout+50))));
%title('Real Value of the Output Pulse real(outputtot)')
%xlabel('Samples')
%ylabel('Amplitude')
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%Ebout=sum(yfilt,1);

%if flag2==1
%   figure
%   stem(real(Ebout((1+10*samp+50):(40*samp+50))));
%   title('Real Value of the Output Pulse after Filtering with no noise, real(Ebout)')
%   xlabel('Samples')
%   ylabel('Amplitude')
%   figure
%   stem(imag(Ebout((1+10*samp+50):(40*samp+50))));
%   title('Imaginary Value of the Output Pulse after Filtering with no noise, imag(Ebout)')
%   xlabel('Samples')
%   ylabel('Amplitude')
%   figure
%   stem(maxATP*xx(find(active==txd),(10*samp+1):(40*samp)))
%   title('Desired Output pulse Train');
%   xlabel('Samples')
%   ylabel('Amplitude')
%end


%if flagap1==1
%   antennapat(X2Y2,lambda,conj(c),mult1,anglemult1,mult2,anglemult2,mult3,anglemult3,mult4,anglemult4,mult5,anglemult5,mult6,anglemult6,usu,active);
%   eval(['title(''Antenna Pattern for Eb/no=' num2str(10*log10(Ebavg(find(active==txd))/no)) 'dB (desired) with all arriving Components'')']);
%end

toc
%Eb=sum(abs(Ebout).^2);

%yfilttot=[];
%bitstot=[];
%Ebrectot=[]
%usuu=size(filtcoeff);

%%transient of filter%%%
%transient=ceil((50)/samp+7)+decisionbit;
transient=ceil((max_time+100)/samp)+1;
%oo=rand(1,transient);
%for tt=1:(transient),
%  if oo(tt)>0.5
%     transbits(tt)='1';
%  else
%     transbits(tt)='0';
%  end
%end
%seq=[transbits(1:transient-decisionbit+1) seq transbits((transient-decisionbit+2):transient)];
%transient=7;

%if berflag==0
%   return;
%end
%toc

%clear xx;
%for Ebo=Eborange,
%tic
%er=0;

%EbNo=10^(Ebo/10); %Eb/No
%'varnorm'
%varnorm=avgEb(find(active==txd))/(2*EbNo);
%'pause'
%pause
%bitcount=0;

%fprintf('Computing filter coefficients \n')

%Ryyy=Ryy+diag(2*varnorm*ones(1,usu(1)),0);
%c=inv(Ryyy)*Ray;
%'pause'
%pause

%for hh=1:usu(1),
% ccoef(hh,:)=c((hh-1)*ntaps+1:hh*ntaps)';
%end
%filtcoeff=ccoef(:,1);
%for hh=2:ntaps,
%   filtcoeff=[filtcoeff zeros(usu(1),taps-1) ccoef(:,hh)];
%end;
%fprintf('done computing filter coefficients \n')
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%countnum=0;
%for tt=1:length(active),
%   for uu=1:usu(1),
%      countnum=countnum+1;
%      totaltrans(countnum,:)=timefilt(countnum,:)*conj(c(uu));
%   end
%end
%'size(totaltrans)'
%size(totaltrans)
%for tt=1:length(active),
%   transfunc(tt,:)=sum(totaltrans(((tt-1)*usu(1)+1):tt*usu(1),:),1);
%end
%'size(transfunc)'
%size(transfunc)
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%if flagap==1
%    step1=1;
%    pat=[];
%    avgx=sum(X2Y2(:,1))/length(X2Y2(:,1));
%    avgy=sum(X2Y2(:,2))/length(X2Y2(:,2));
%    rvect(:,1)=X2Y2(:,1)-avgx;
%    rvect(:,2)=X2Y2(:,2)-avgy;
%    theta1=0:step1:360-step1;
%    for theta=theta1;
%    kvect=[-sin(theta/180*pi)  -cos(theta/180*pi)];
%      for tt=1:usu(1),
%         EbAP(tt)=exp(-j*2*pi/lambda*dot(kvect,rvect(tt,:)))*sum(ccoef(tt,:));
%      end
%      pat=[pat abs(sum(EbAP))];
%    end
%    figure
%    polar(theta1/180*pi,pat);
%    hold on
%   antennapat(X2Y2,lambda,conj(c),mult1,anglemult1,mult2,anglemult2,mult3,anglemult3,mult4,anglemult4,mult5,anglemult5,mult6,anglemult6,usu,active)
%   eval(['title(''Antenna Pattern for Eb/No of ' num2str(Ebo) ''')'])
%    hold off
%end

%randprev=1;
%prvrndprev=-1;
%prevprevrnd=1;

%for nn=1:length(active),
%   eval(['prevbits' num2str(active(nn)) '=rand(1,max(bitsmemory));']);
%   eval(['prevbits' num2str(active(nn)) '(find(prevbits' ...
%       num2str(active(nn)) '>0.5))=1;']);
%   eval(['prevbits' num2str(active(nn)) '(find(prevbits' ...
%       num2str(active(nn)) '<=0.5))=-1;']);
%   eval(['rndprev(nn,:)=[0 prevbits' num2str(active(nn)) ...
%       '];']);
%end
%rndprev=[0 1 -1 1];
%transfunc=ones(usu(1)/uussuu(1));
%for hhh=1:length(active)*consamp;
%  for gg=1:uussuu(1), 
%     transfunc(hhh,:)=conv(transfunc(hhh,:),timefilt(hhh
%  end
%end
%tic
%txdin=find(active==txd);
%toc
%X2Y2
tic
save filterss timefilt active samp usu consamp transient uussuu max_time min_time fileconvdat mult1 anglemult1 mult2 anglemult2 mult3 anglemult3 mult4 anglemult4 mult5 anglemult5 mult6 anglemult6

toc
'loading'
clear all
tic
load filterss
toc


%zfilt=zeros((length(transfilt(1,:))-1),length(active));
%nfilt=zeros((usuu(2)-1),usu(1));
%'pause'
%pause

%yyyy=1:qq(1);
offset=0;
tic
'takes so long to create the bits'
bits=ceil(consamp/samp)+transient;

grnd=rand(1,length(active));
grnd(find(grnd>0.5))=1;
grnd(find(grnd<=0.5))=-1;
grndl=grnd';
for pp=1:(samp-1),
  grndl=[grndl grnd'];
end
xx=grndl;
for ii=1:(bits),
   grnd=rand(1,length(active));
   grnd(find(grnd>0.5))=1;
   grnd(find(grnd<=0.5))=-1;
   grndl=grnd';
   for pp=1:(samp-1),
     grndl=[grndl grnd'];
   end
   xx=[xx grndl];
end
'takes so long to create bits'
toc
%yy=size(xx);
%xx*xx'/(yy(2)-1)

%  Ebrec=zeros(usu(1),samp);
%  oo=rand(1,length(active));
%  for tt=1:length(active),
%     if oo(tt)>0.5
%        rndprev(tt,1)=1;
%     else
%        rndprev(tt,1)=-1;
%     end
%  end
  %%%%%%
  %%%%%%
  %%%%%%
  %%%%%%
%  for uu=1:usu(1),
%   for yy=1:qq(1),
%    template3(yy,:)=[template(yy,5+(uu-1)*6)*rndprev(template(yy,6+(uu-1)*6),...
%       template(yy,1+(uu-1)*6))*ones(1,template(yy,3+(uu-1)*6)) template(yy,5+(uu-1)*6)*...
%       rndprev(template(yy,6+(uu-1)*6),template(yy,2+(uu-1)*6))*ones(1,template(yy,4+(uu-1)*6))];
%   end
%   Ebrec(uu,:)=sum(template3,1);
%  end
  %%%%%%
  %%%%%%
  %%%%%%
  %%%%%%
  %%%%%%

  %************************************
  %************************************
  %************************************
  %for uu=1:usu(1),
  %  template3=repmat(template(:,5+(uu-1)*6).*sum(diag(ones(1,qq(1))).* ...
  %    rndprev(template(:,6+(uu-1)*6),template(:,1+(uu-1)*6)),2),1,samp).* ...
  %    template21(:,((uu-1)*samp+1):uu*samp)+repmat(template(:,5+(uu-1)*6).* ...
  %    sum(diag(ones(1,qq(1))).*rndprev(template(:,6+(uu-1)*6), ...
  %    template(:,2+(uu-1)*6)),2),1,samp).*template22(:,((uu-1)*samp+1):uu*samp);
  %  Ebrec(uu,:)=sum(template3,1);
  %end
  %************************************
  %************************************
  %************************************
  % filtcoeff
  %'pause'
  %pause
  %for uu=1:usu(1),
  %   noiseout(uu,:)=conj(c(uu))*[sqrt(varnorm)*randn(1,samp)+j*sqrt(varnorm)*randn(1,samp)];
  %end
       
  'takes so long to do filtering'
  tic
  for tt=1:(length(active)),
     for uuu=((tt-1)*usu(1)+1):tt*usu(1),
        %[Ebrec(uuu,:)]=filter(timefilt(uuu,:),[1],xx(tt,:));
        num1=floor(((uuu-(tt-1)*usu(1))-1)/uussuu(1))+1;
        antnum=uuu-floor((uuu-1)/uussuu(1))*uussuu(1);
        Ebrec(tt+(antnum-1)*length(active),num1)=sum(timefilt(uuu,:).*fliplr(xx(tt,num1:(max_time+100+num1-1))));
     end
  end
  'takes so long to do filtering'
  toc
  %Ebrec
  %figure
  %plot(real(Ebrec(1,:)))
  %figure
  %plot(real(Ebrec(2,:)))
  %figure
  %plot(real(Ebrec(3,:)))
  %figure
  %plot(real(Ebrec(4,:)))

  %figure
  %plot(abs(filter(timefilt(1,:),1,xx)))
  %figure
  %plot(real(filter(timefilt(1,:),1,xx)))
  %samp
  %xx
  %%%%%%%
  %%%%%%
  %'ending'
  %return
  %%%%%%%
  %%%%%%%
  
  %Ebrec=Ebrec(:,(length(timefilt(1,:))+1):length(Ebrec(1,:)));
  %ccc=size(Ebrec)
  %Ebrec1=zeros(ccc(1)/length(active),ccc(2));
  %for uu=1:uussuu(1),
     %Ebrec1(uu,:)=Ebrec(1,uu:uussuu(1)
  %      Ebrec1=Ebrec1+Ebrec(((tt-1)*usu(1)+1):tt*usu(1),:);
  %end
  %size(Ebrec1)
  %for gg=1:consamp,
  %   Ebrecfinal(1:length(active),gg)=Ebrec1(((gg-1)*length(active)+1):gg*length(active),gg);
  %end
  
  % toc
  eval(['save ',fileconvdat,' Ebrec mult1 anglemult1 mult2 anglemult2 mult3 anglemult3 mult4 anglemult4 mult5 anglemult5 mult6 anglemult6 uussuu active -mat;']);
  %save  Ebrec
 % save filters1 Ebrecfinal
  %%%%%%%%%%%%%%%%%%
  return
  %%%%%%%%%%%%%%%%%%
  
wn=[0; 0;0; 0; 1]
w=wn;
for h=1:floor(length(x)/block);
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
  y=[y yn];
  w=[w wn];
end;

  %Ebrec=Ebrec+sqrt(varnorm)*randn(usu(1),samp)+j*sqrt(varnorm)*randn(usu(1),samp);
  %for uu=1:usu(1),
  %  [Ebfilt(uu,:),zfilt(:,uu)]=filter(filtcoeff(uu,:),[1],Ebrec(uu,:),zfilt(:,uu));
  %end
  
  Ebfilt=sum(Ebrec,1)+sum(noiseout,1);%+...
  %zfilt
  %nfilt
  %sum(Ebrec,1)
  %sum(noiseout,1)
  %sum(Ebfilt,2)
  %h
  %'pause'
  %pause
  Ebint1=Ebint2;
  Ebint1(1,(samp-excesssamp+2):samp)=Ebfilt(1,1:excesssamp-1);
  Ebint2(1,1:samp-excesssamp+1)=Ebfilt(1,excesssamp:samp);
     
  if h>transient
     bitcount=bitcount+1;
     if (bitcount/10000)==floor(bitcount/10000);
       bitcount
       toc
       tic
     end
     %figure
     %stem(real(Ebint1))
     %title('real(Ebint1)')
     %xlabel(num2str(rndprev(txdin,decisionbit))) 
     %'pause'
     %pause
          
     dscphase=sign(real(sum(Ebint1)));
     %if dscphase==1,
     %  imgseq(bitcount-offset)='1';
     %else
     %  imgseq(bitcount-offset)='0';
     %end
     %if ((bitcount-offset)/6400)==floor((bitcount-offset)/6400),
     %    eval(['jpgwriter([filename ''ST'' ''' num2str(Ebo) ...
     %       ''' ''.txt''], imgseq);'])
     %    clear imgseq;
     %    offset=bitcount;
     %    bitcount
     %    toc
     %    tic
     %end

     if dscphase~=sign(rndprev(txdin,decisionbit))
        er=er+1; 
     end;
  end

  rndprev(:,2:length(rndprev(1,:)))=rndprev(:,1:length(rndprev(1,:))-1);

%for tt=1:length(active),
%  eval(['rndprev' num2str(active(tt)) '(2:length(rndprev' ...
%      num2str(active(tt)) '))=rndprev' num2str(active(tt)) ...
%      '(1:length(rndprev' num2str(active(tt)) ')-1);']);
%end;


toc
ERR=[ERR er]
BBITS=[BBITS bitcount]
%fprintf('Writing image to file \n')
%seq
%imgseq
%transbits
%Ebo
%eval(['[filename ''ST'' ''' num2str(Ebo) ''' ''.bmp'']'])
%eval(['jpgwriter([filename ''STv'' ''' num2str(Ebo) ''' ''.txt''],imgseq);'])
%clear imgseq
%bitstot

end
%figure
%stem(real(yfilttot))
%title('plot(real(yfilttot))')

%figure
%stem(abs(yfilttot))
%title('plot(abs(yfilttot))')

%figure
%stem(real(Ebrectot))
%title('plot(real(Ebrectot))')

%figure
%stem(abs(Ebrectot))
%title('plot(abs(Ebrectot))')

%figure
%stem(imag(Ebrectot))
%title('plot(imag(Ebrectot))')
toc
return
