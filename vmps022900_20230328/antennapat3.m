function maxpat=antennapat(X2Y2,lambda,ccoef,mult1,anglemult1,mult2,anglemult2,mult3,anglemult3,mult4,anglemult4,mult5,anglemult5,mult6,anglemult6,usu,active)
    
    step1=1;
    pat=[];
    handless=[];
    legendtext=[];
    avgx=sum(X2Y2(:,1))/length(X2Y2(:,1)); 
    avgy=sum(X2Y2(:,2))/length(X2Y2(:,2));
    rvect(:,1)=X2Y2(:,1)-avgx;
    rvect(:,2)=X2Y2(:,2)-avgy;
    theta1=0:step1:360-step1;
    for theta=theta1;
    kvect=[-sin(theta/180*pi)  -cos(theta/180*pi)];
      for tt=1:usu(1),
         EbAP(tt)=exp(-j*2*pi/lambda*dot(kvect,rvect(tt,:)))*sum(ccoef(tt,:));
      end
      pat=[pat abs(sum(EbAP))];
    end
    %figure
    maxpat=max(pat);
    pat=pat/maxpat;
    polar(theta1/180*pi,pat);
    hold on
    if ~isempty(find(active==1))
      for tt=1:length(mult1(1,:)),
       hhaa=polar([anglemult1(ceil(usu(1)/2),tt)*pi/180 ...
         anglemult1(ceil(usu(1)/2),tt)*pi/180 ...
         anglemult1(ceil(usu(1)/2),tt)*pi/180-2*pi/180 ...
         anglemult1(ceil(usu(1)/2),tt)*pi/180 ...
         anglemult1(ceil(usu(1)/2),tt)*pi/180+2*pi/180],[max(pat) ...
         max(pat)-max(pat)/6 max(pat)-max(pat)/10 max(pat)-max(pat)/6 ...
         max(pat)-max(pat)/10],'b');  
      end
      handless=[handless hhaa];
      legendtext=[legendtext;'Tx 1'];
    end
    if ~isempty(find(active==2))
      for tt=1:length(mult2(1,:)),  
       hhaa=polar([anglemult2(ceil(usu(1)/2),tt)*pi/180 ...
         anglemult2(ceil(usu(1)/2),tt)*pi/180 ...
         anglemult2(ceil(usu(1)/2),tt)*pi/180-2*pi/180 ...
         anglemult2(ceil(usu(1)/2),tt)*pi/180 ...
         anglemult2(ceil(usu(1)/2),tt)*pi/180+2*pi/180],[max(pat) ...
         max(pat)-max(pat)/6 max(pat)-max(pat)/10 max(pat)-max(pat)/6 ...
         max(pat)-max(pat)/10],'g');
      end
      handless=[handless hhaa];
      legendtext=[legendtext;'Tx 2'];
    end 
    if ~isempty(find(active==3))
      for tt=1:length(mult3(1,:)),  
       hhaa=polar([anglemult3(ceil(usu(1)/2),tt)*pi/180 ...
         anglemult3(ceil(usu(1)/2),tt)*pi/180 ...
         anglemult3(ceil(usu(1)/2),tt)*pi/180-2*pi/180 ...
         anglemult3(ceil(usu(1)/2),tt)*pi/180 ...
         anglemult3(ceil(usu(1)/2),tt)*pi/180+2*pi/180],[max(pat) ...
         max(pat)-max(pat)/6 max(pat)-max(pat)/10 max(pat)-max(pat)/6 ...
         max(pat)-max(pat)/10],'k');
      end
      handless=[handless hhaa];
      legendtext=[legendtext;'Tx 3'];
   end
    if ~isempty(find(active==4))
      for tt=1:length(mult4(1,:)),  
       hhaa=polar([anglemult4(ceil(usu(1)/2),tt)*pi/180 ...
         anglemult4(ceil(usu(1)/2),tt)*pi/180 ...
         anglemult4(ceil(usu(1)/2),tt)*pi/180-2*pi/180 ...
         anglemult4(ceil(usu(1)/2),tt)*pi/180 ...
         anglemult4(ceil(usu(1)/2),tt)*pi/180+2*pi/180],[max(pat) ...
         max(pat)-max(pat)/6 max(pat)-max(pat)/10 max(pat)-max(pat)/6 ...
         max(pat)-max(pat)/10],'m');
      end
      handless=[handless hhaa];
      legendtext=[legendtext;'Tx 4'];
   end
    if ~isempty(find(active==5))
      for tt=1:length(mult5(1,:)),  
       hhaa=polar([anglemult5(ceil(usu(1)/2),tt)*pi/180 ...
         anglemult5(ceil(usu(1)/2),tt)*pi/180 ...
         anglemult5(ceil(usu(1)/2),tt)*pi/180-2*pi/180 ...
         anglemult5(ceil(usu(1)/2),tt)*pi/180 ...
         anglemult5(ceil(usu(1)/2),tt)*pi/180+2*pi/180],[max(pat) ...
         max(pat)-max(pat)/6 max(pat)-max(pat)/10 max(pat)-max(pat)/6 ...
         max(pat)-max(pat)/10],'c');
      end
      handless=[handless hhaa];
      legendtext=[legendtext;'Tx 5'];
   end
    if ~isempty(find(active==6))
      for tt=1:length(mult6(1,:)),  
       hhaa=polar([anglemult6(ceil(usu(1)/2),tt)*pi/180 ...
         anglemult6(ceil(usu(1)/2),tt)*pi/180 ...
         anglemult6(ceil(usu(1)/2),tt)*pi/180-2*pi/180 ...
         anglemult6(ceil(usu(1)/2),tt)*pi/180 ...
         anglemult6(ceil(usu(1)/2),tt)*pi/180+2*pi/180],[max(pat) ...
         max(pat)-max(pat)/6 max(pat)-max(pat)/10 max(pat)-max(pat)/6 ...
         max(pat)-max(pat)/10],'y');
      end
      handless=[handless hhaa];
      legendtext=[legendtext;'Tx 6'];
   end
    legend(handless,legendtext);
    hold off
    return