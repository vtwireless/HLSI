function broadfunc(action)

switch action

case 'run1'
   runner(findobj('Name','VMPS:  Vector Multipath Propagation Simulator'));

case 'select'
  highlight(gcbo);

case 'pick' 
  highlight2(gcbo);

case 'savepar'
  savedata;

case 'savepar1'
  savedata1;

case 'loadpr'
  readdata;

case 'loadpr1'
   readdata1;
   
case 'update'
   updatescat;
   
case 'saveconvdat'
   savcondat;
   
case 'loadconvdat'     
   loacondat;
   
case 'closeit'
   closeitall;
   
end; 
return;

function closeitall
   killfig=findobj('NumberTitle','on');
   close(killfig);
return;

function savcondat

   [f,p]=uiputfile('*.cnv','Save convergence data, Do Not Include Extension');
   if f~=0,
      h3=findobj('Name','Wideband');
   	h2=findobj(h3,'Tag','fileconvdat');
   	%eval(['load ',[p,f],' -mat;']);
      set(h2,'String',[p,f]);
   end
return
   
function loacondat   
   [f,p]=uigetfile('*.cnv','Load convergence data, Do Not Include Extension');
   if f~=0,
      h3=findobj('Name','Wideband');
      h2=findobj(h3,'Tag','convflag');
      converg=get(h2,'Value');
      h2=findobj(h3,'Tag','lscmabl');
      lscmabl=eval([get(h2,'String')]);
      h2=findobj(h3,'Tag','lscmapas');
      lscmapas=eval([get(h2,'String')]);
      if converg==1,
         if lscmapas==0|lscmabl==0
            fprintf('LSCMA BLOCK LENGTH OR # OF ITERATIONS CAN NOT BE ZERO \n')
         else
      	   eval(['load ',[p,f],' -mat;']);	   
            lscmaproc(lscmapas,lscmabl,Ebrec,uussuu(1),mult1,anglemult1,mult2,anglemult2,mult3,anglemult3,mult4,anglemult4,mult5,anglemult5,mult6,anglemult6,active);
         end
      else
         fprintf('Note: IF YOU WANT TO PERFORM CONVERGENCE ON THE FILE YOU MUST ACTIVATE THE CONVERGENCE FLAG \n')
      end   
   end
return
function runner(h1)
   if isempty(h1)
      'EMPTY, figure not found, maybe figure name changed'
      return
   end
   h3=findobj('Name','Wideband');
   h2=findobj(h3,'Tag','freq');
   freq=eval([get(h2,'String')]);
   lambda=3e8/freq;
   active=[];
   model=[];
   X1Y1=[];
   X2Y2=[];
   x1=[];
   x2=[];
   XY1=[];
   XY2=[];
   XY3=[];
   XY4=[];
   txd=[];
   XY5=[];
   XY6=[];
   pwr=[];
   scat=[];
   dtau=[];
   seeded=[];
   gammah=[];
   gammav=[];
   LOS=[];
   h2=findobj(h1,'Tag','rx_x');
   rx_x=eval([get(h2,'String')]);
   h2=findobj(h1,'Tag','rx_y');
   rx_y=eval([get(h2,'String')]);
   for uu=1:8,
     eval(['h2=findobj(h1,''Tag'',''el_' num2str(uu) '_button'');']);
     val=get(h2,'Value');
        if val==1
            eval(['fprintf(''receiver ' num2str(uu) ' is active \n'');']) 
            eval(['h2=findobj(h1,''Tag'',''el_' num2str(uu) '_x'');']);
            XX=eval([get(h2,'String')]);
            eval(['h2=findobj(h1,''Tag'',''el_' num2str(uu) '_y'');']);
            YY=eval([get(h2,'String')]);
            X2Y2=[X2Y2;XX*lambda+rx_x YY*lambda+rx_y];
        end
   end
   for uu=1:6,
     eval(['h2=findobj(h1,''Tag'',''tx_' num2str(uu) '_button'');'])
     val=get(h2,'Value');
        if val==1
            eval(['fprintf(''transmitter ' num2str(uu) ' is active \n'');'])
            active=[active uu];
            eval(['h2=findobj(h1,''Tag'',''tx_' num2str(uu) '_power'');']);
            pwr=[pwr eval([get(h2,'String')])];
            eval(['h2=findobj(h1,''Tag'',''tx_' num2str(uu) '_x'');']);
            X1Y1a=eval([get(h2,'String')]);
            eval(['h2=findobj(h1,''Tag'',''tx_' num2str(uu) '_y'');']);
            X1Y1b=eval([get(h2,'String')]);
            X1Y1=[X1Y1;[X1Y1a X1Y1b]];
            eval(['h2=findobj(h1,''Tag'',''tx_' num2str(uu) '_model'');']);
            model=[model get(h2,'Value')];
            eval(['h2=findobj(h1,''Tag'',''tx_' num2str(uu) '_scat'');']);
            scat=[scat eval([get(h2,'String')])];
            eval(['h2=findobj(h1,''Tag'',''tx_' num2str(uu) '_dtau'');']);
            dtau=[dtau eval([get(h2,'String')])];
            eval(['h2=findobj(h1,''Tag'',''tx_' num2str(uu) '_seed'');']);
            seeded=[seeded eval([get(h2,'String')])];
            eval(['h2=findobj(h1,''Tag'',''tx_' num2str(uu) '_GammaH'');']);
            gammah=[gammah eval([get(h2,'String')])];
            eval(['h2=findobj(h1,''Tag'',''tx_' num2str(uu) '_GammaV'');']);
            gammav=[gammav eval([get(h2,'String')])];
            eval(['h2=findobj(h1,''Tag'',''tx_' num2str(uu) '_LOS'');']);
            LOS=[LOS get(h2,'Value')];
        end
    end
    if isempty(X2Y2) 
       fprintf('Cannot Proceed, no receivers have been selected \n')
       return;
    end
    if isempty(X1Y1)
       fprintf('Cannot Proceed, no transmitter has been selected \n')
       return;
    end
    avgy=sum(X2Y2(:,2))/length(X2Y2(:,2));
    avgx=sum(X2Y2(:,1))/length(X2Y2(:,1));
    fprintf('Receiver Coordinates \n')
    [X2Y2]
    fprintf('Transmitter Coordinate \n')  
    [X1Y1]
    h3=findobj('Name','Wideband');
    h4=findobj('Name','Scatterers');
    for tt=1:length(model),
      if model(tt)==1
        for uu=1:10,
           eval(['h2=findobj(h4,''Tag'',''c_' num2str(active(tt)) ...
                '_' num2str(uu) ''');']);
           val=get(h2,'Value');
              if val==1
                eval(['fprintf(''Scatterer ' num2str(uu) ' of' ...
                  ' transmitter ' num2str(active(tt)) ' is active \n'');'])
                eval(['h2=findobj(h4,''Tag'',''s_' num2str(active(tt)) ...
                  '_' num2str(uu) '_x'');']);
                XS=eval([get(h2,'String')]);
                eval(['h2=findobj(h4,''Tag'',''s_' num2str(active(tt)) ...
                  '_' num2str(uu) '_y'');']);
                YS=eval([get(h2,'String')]);
                eval(['XY' num2str(active(tt)) '=[XY' num2str(active(tt)) ...
                     ';[XS YS]];']);
              end
        end
      else
        eval(['XY' num2str(active(tt)) ...
           '=gbsbscat(dtau(tt)*1e-6,X1Y1(tt,1),X1Y1(tt,2),avgx,avgy,scat(tt));']);
      end
    end

    for ii=1:length(active),
       fprintf('Scatterer Coordinates of TX %d \n', active(ii))
       eval(['[XY' num2str(active(ii)) ']'])
       eval(['if isempty(XY' num2str(active(ii)) ');' ...
         'if LOS(ii)==1;' ...
           'fprintf(''No scatterers have been entered, only line of sight present \n'');' ...
         'else;' ...
           'fprintf(''No scatterers have been entered and no line of sight present \n'');' ...
           'fprintf(''THIS TRANSMITTER SHOULD NOT BE ACTIVE \n'');' ...
           'return;' ...
         'end;' ...
       'end;']);
    end
    h2=findobj(h3,'Tag','Ts');
    Ts=eval([get(h2,'String')]);
    h2=findobj(h3,'Tag','samp');
    samp=eval([get(h2,'String')]);
    h2=findobj(h3,'Tag','Menu');
    valmenu=get(h2,'Value');
    h2=findobj(h3,'Tag','taps');
    taps=eval([get(h2,'String')]);
    h2=findobj(h3,'Tag','ntap');
    ntaps=eval([get(h2,'String')]);
    h2=findobj(h3,'Tag','bits');
    bits=eval([get(h2,'String')]);
    h2=findobj(h3,'Tag','flag3');
    flag3=get(h2,'Value');
    h2=findobj(h3,'Tag','berflag');
    berflag=get(h2,'Value');
    h2=findobj(h3,'Tag','Ebo');
    Eborange=eval([get(h2,'String')]);
    h2=findobj(h3,'Tag','convflag');
    converg=get(h2,'Value');
    h2=findobj(h3,'Tag','convvel');
    convel=eval([get(h2,'String')]);
    h2=findobj(h3,'Tag','convdeg');
    condeg=eval([get(h2,'String')]);
    h2=findobj(h3,'Tag','convsamp');
    consamp=eval([get(h2,'String')]);
    h2=findobj(h3,'Tag','PGain');
    PGain=eval([get(h2,'String')]);
    h2=findobj(h3,'Tag','CDMAflag');
    CDMAflag=get(h2,'Value');
    h2=findobj(h3,'Tag','posflag');
    posflag=get(h2,'Value');
    h2=findobj(h3,'Tag','filepos');
    filepos=get(h2,'String');
    h2=findobj(h3,'Tag','fileconvdat');
    fileconvdat=get(h2,'String');
    h2=findobj(h3,'Tag','lscmabl');
    lscmabl=eval([get(h2,'String')]);
    h2=findobj(h3,'Tag','lscmapas');
    lscmapas=eval([get(h2,'String')]);
    
    handless=[];
    legendtext=[];
    if flag3==1
          figure
          bb=find(active==1); 
          if not(isempty(bb)),
             hhaa=plot(X1Y1(bb,1),X1Y1(bb,2),'bo');
             handless=[handless hhaa];
             legendtext=[legendtext; 'Tx 1'];
             hold on
             if not(isempty(XY1))
                plot(XY1(:,1),XY1(:,2),'bd')
                jjj=size(XY1);
                for bbb=1:jjj(1),
                   plot([X1Y1(bb,1) XY1(bbb,1) avgx],[X1Y1(bb,2) XY1(bbb,2) avgy],'b:')
                end
             end
             if LOS(bb)==1,
               plot([X1Y1(bb,1)  avgx], ...
                 [X1Y1(bb,2) avgy],'b--')
             end
          end

          bb=find(active==2);
          if not(isempty(bb)),
             hhaa=plot(X1Y1(bb,1),X1Y1(bb,2),'go');
             handless=[handless hhaa];
             legendtext=[legendtext; 'Tx 2'];
             hold on
             if not(isempty(XY2))
                plot(XY2(:,1),XY2(:,2),'gd')
                jjj=size(XY2);
                for bbb=1:jjj(1),
                   plot([X1Y1(bb,1) XY2(bbb,1) avgx],[X1Y1(bb,2) XY2(bbb,2) avgy],'g:')
                end                
             end
             if LOS(bb)==1,
               plot([X1Y1(bb,1)  avgx], ...
                 [X1Y1(bb,2) avgy],'g--')
             end
          end
          
          bb=find(active==3);
          if not(isempty(bb)),
             hhaa=plot(X1Y1(bb,1),X1Y1(bb,2),'ko');
             handless=[handless hhaa];
             legendtext=[legendtext; 'Tx 3'];
             hold on
             if not(isempty(XY3))
                plot(XY3(:,1),XY3(:,2),'kd')
                jjj=size(XY3);
                for bbb=1:jjj(1),
                   plot([X1Y1(bb,1) XY3(bbb,1) avgx],[X1Y1(bb,2) XY3(bbb,2) avgy],'k:')
                end   
             end
             if LOS(bb)==1,
               plot([X1Y1(bb,1)  avgx], ...
                 [X1Y1(bb,2) avgy],'k--')
             end
          end

          bb=find(active==4);
          if not(isempty(bb)),
             hhaa=plot(X1Y1(bb,1),X1Y1(bb,2),'mo');
             handless=[handless hhaa];
             legendtext=[legendtext; 'Tx 4'];
             hold on
             if not(isempty(XY4))
                plot(XY4(:,1),XY4(:,2),'md')
                jjj=size(XY4);
                for bbb=1:jjj(1),
                   plot([X1Y1(bb,1) XY4(bbb,1) avgx],[X1Y1(bb,2) XY4(bbb,2) avgy],'m:')
                end

             end
             if LOS(bb)==1,
               plot([X1Y1(bb,1)  avgx], ...
                 [X1Y1(bb,2) avgy],'m--')
             end
          end
          
          bb=find(active==5);
          if not(isempty(bb)),
             hhaa=plot(X1Y1(bb,1),X1Y1(bb,2),'co');
             handless=[handless hhaa];
             legendtext=[legendtext; 'Tx 5'];
             hold on
             if not(isempty(XY5))
                plot(XY5(:,1),XY5(:,2),'cd')
                jjj=size(XY5);
                for bbb=1:jjj(1),
                   plot([X1Y1(bb,1) XY5(bbb,1) avgx],[X1Y1(bb,2) XY5(bbb,2) avgy],'c:')
                end
                
             end
             if LOS(bb)==1,
               plot([X1Y1(bb,1)  avgx], ...
                 [X1Y1(bb,2) avgy],'c--')
             end
          end

          bb=find(active==6);
          if not(isempty(bb)),
             hhaa=plot(X1Y1(bb,1),X1Y1(bb,2),'yo');
             handless=[handless hhaa];
             legendtext=[legendtext; 'Tx 6'];
             hold on
             if not(isempty(XY6))
                plot(XY6(:,1),XY6(:,2),'yd')
                jjj=size(XY6);
                for bbb=1:jjj(1),
                   plot([X1Y1(bb,1) XY6(bbb,1) avgx],[X1Y1(bb,2) XY6(bbb,2) avgy],'y:')
                end
                
             end
             if LOS(bb)==1,
               plot([X1Y1(bb,1)  avgx], ...
                 [X1Y1(bb,2) avgy],'y--')
             end
          end


          plot(X2Y2(:,1),X2Y2(:,2),'rs')
          
          grid
          axis('square')
          %legend('Tx 1','Tx 2','Tx 3','Tx 4','Tx 5','Tx 6')
          legend(handless,legendtext)
          hold off
    end  

    h2=findobj(h3,'Tag','flag1');
    flag1=get(h2,'Value');
    h2=findobj(h3,'Tag','flag2');
    flag2=get(h2,'Value');
    h2=findobj(h3,'Tag','flagap');
    flagap=get(h2,'Value');
    h2=findobj(h3,'Tag','flagap1');
    flagap1=get(h2,'Value');
    h2=findobj(h3,'Tag','image');
    imflag=get(h2,'Value');
    for oo=1:6,
      eval(['h2=findobj(h3,''Tag'',''tx' num2str(oo) ''');'])
      txval=get(h2,'Value');
      if txval==1
         txd=oo;
      end
    end
    if isempty(txd)
      fprintf('No desired transmitter has been selected \n CANNOT CONTINUE \n');
      return;
    end
    if isempty(find(active==txd))
      fprintf('Desired Transmitter is not active \n CANNOT CONTINUE');
      return;
    end
    if converg==1,
       bpskconv(X1Y1,X2Y2,XY1,XY2,XY3,XY4,XY5,XY6,active,freq,samp,Ts,bits,Eborange,pwr,gammav,LOS,txd,consamp,convel,condeg,fileconvdat,posflag,filepos);
     return;   
    end
    
    switch valmenu
   
    case 4,
      bpskspat(X1Y1,X2Y2,XY1,XY2,XY3,XY4,XY5,XY6,active,freq,samp,Ts,bits,Eborange,pwr,gammav,LOS,flag1,flag2,berflag,flagap,flagap1,txd)

    case 5,
      if imflag==0
         bpsksptemp(X1Y1,X2Y2,XY1,XY2,XY3,XY4,XY5,XY6,active,freq,samp,Ts,taps,bits,Eborange,ntaps,pwr,gammav,LOS,flag1,flag2,berflag,flagap,flagap1,txd)
      else
         fprintf('Transforming Image into BITS \n')
         seq=jpgreader('kai.txt');
         fprintf('Done Transforming Image into BITS \n')
         bpsksptempim(X1Y1,X2Y2,XY1,XY2,XY3,XY4,XY5,XY6,active,freq,samp,Ts,taps,Eborange,ntaps,pwr,gammav,LOS,flag1,flag2,berflag,flagap,flagap1,txd,seq,'kairec')
      end

    case 3
      rr=size(X2Y2);
      if rr(1)>1
      fprintf('EQUALIZER HAS BEEN SELECTED BUT ONLY ONE RECEIVER ANTENNA SHOULD BE ACTIVE !!! \n')
        fprintf('CANNOT CONTINUE \n')
        return
     else
        bpskequal(X1Y1,X2Y2,XY1,XY2,XY3,XY4,XY5,XY6,active,freq,samp,Ts,taps,bits,Eborange,ntaps,pwr,gammav,LOS,flag1,flag2,berflag,flagap,flagap1,txd)
      end
      fprintf('performing equalizer computation')
   case 2
      rr=size(X2Y2);
      if rr(1)>1
        fprintf('SINGLE ANTENNA HAS BEEN SELECTED BUT ONLY ONE RECEIVER ANTENNA SHOULD BE ACTIVE !!! \n')
        fprintf('CANNOT CONTINUE \n')
        return
     else
        bpskant(X1Y1,X2Y2,XY1,XY2,XY3,XY4,XY5,XY6,active,freq,samp,Ts,bits,Eborange,pwr,gammav,LOS,flag1,flag2,berflag,flagap,flagap1,txd)
      end

      

   case 1
     fprintf('CANNOT CONTINUE WHAT RECEIVER STRUCTURE DO YOU WANT???????? \n')
   
   end 

%    if valmenu==5,
%       bpskspat(X1Y1,X2Y2,XY1,XY2,XY3,XY4,XY5,XY6,active,freq,samp,Ts,bits,Eborange,pwr,gammav,LOS,flag1,flag2,berflag,flagap,flagap1,txd)
%    elseif valmenu==4
%       bpsksptemp(X1Y1,X2Y2,XY1,XY2,XY3,XY4,XY5,XY6,active,freq,samp,Ts,taps,bits,Eborange,ntaps,pwr,gammav,LOS,flag1,flag2,berflag,flagap,flagap1,txd)
%    elseif valmenu==3
%      rr=size(X2Y2);
%      if rr(1)>1
%        fprintf('EQUALIZER HAS BEEN SELECTED, ONLY ONE RECEIVER ANTENNA SHOULD BE ACTIVE !!! \n')
%        fprintf('CANNOT CONTINUE \n')
%        return
%      end
%      fprintf('performing equalizer computation')
%    else
%       fprintf('CANNOT CONTINUE WHAT RECEIVER STRUCTURE DO YOU WANT???????? \n')
%    end

return;

function highlight(h1)
  val=get(h1,'Value');
  if val==1
    tagg=get(h1,'Tag');
    set(h1,'FontWeight','bold','BackgroundColor',[0.7 0.7 0.7]);
    eval(['h2=findobj(gcbf,''Tag'',''s_' tagg(3:length(tagg)) '_x'');']);
    set(h2,'FontWeight','bold','BackgroundColor',[0.7 0.7 0.7]);
    eval(['h2=findobj(gcbf,''Tag'',''s_' tagg(3:length(tagg)) '_y'');']);
    set(h2,'FontWeight','bold','BackgroundColor',[0.7 0.7 0.7]);
  else
    tagg=get(h1,'Tag');
    set(h1,'FontWeight','normal','BackgroundColor',[0.701961 0.701961 0.701961]);
    eval(['h2=findobj(gcbf,''Tag'',''s_' tagg(3:length(tagg)) '_x'');']);
    set(h2,'FontWeight','normal','BackgroundColor',[1 1 1]);
    eval(['h2=findobj(gcbf,''Tag'',''s_' tagg(3:length(tagg)) '_y'');']);
    set(h2,'FontWeight','normal','BackgroundColor',[1 1 1]);
  end
return;

function highlight2(h1)
  val=get(h1,'Value');
  if val==1
    tagg=get(h1,'Tag');
    set(h1,'FontWeight','bold','BackgroundColor',[1 0.6 0]);
    for uu=1:6,
      eval(['h2=findobj(gcbf,''Tag'',''tx' num2str(uu) ''');']);
      if uu~=str2num(tagg(3)),
        set(h2,'FontWeight','normal','BackgroundColor', ...
        [1 0.8 0],'Value',0); 
      end
    end
  else
    tagg=get(h1,'Tag');
    set(h1,'FontWeight','normal','BackgroundColor',[1 0.8 0]);
  end
return;


function savedata

[f,p]=uiputfile('*.sct','Save Scatterers Do Not Include Extension');
h4=findobj('Name','Scatterers');
if f~=0;
    for tt=1:6,
       for uu=1:10,
         eval(['h2=findobj(h4,''Tag'',''c_' num2str((tt)) ...
              '_' num2str(uu) ''');']);
         val(tt,uu)=get(h2,'Value');
         eval(['h2=findobj(h4,''Tag'',''s_' num2str((tt)) ...
         '_' num2str(uu) '_x'');']);
         XS(tt,uu)=eval([get(h2,'String')]);
         eval(['h2=findobj(h4,''Tag'',''s_' num2str((tt)) ...
         '_' num2str(uu) '_y'');']);
         YS(tt,uu)=eval([get(h2,'String')]);
       end
    end
    eval(['save ',[p,f],' YS XS val -mat;']);
end
return;

function updatescat

h4=findobj('Name','Scatterers');
XY1=[];
XY2=[];
XY3=[];
XY4=[];
XY5=[];
XY6=[];
for tt=1:6,
       for uu=1:10,
          eval(['h2=findobj(h4,''Tag'',''c_' num2str((tt)) ...
               '_' num2str(uu) ''');']);
          val(tt,uu)=get(h2,'Value');
        if val(tt,uu)==1
          eval(['h2=findobj(h4,''Tag'',''s_' num2str((tt)) ...
               '_' num2str(uu) '_x'');']);
          XS=eval([get(h2,'String')]);
          eval(['h2=findobj(h4,''Tag'',''s_' num2str((tt)) ...
              '_' num2str(uu) '_y'');']);
          YS=eval([get(h2,'String')]);
          eval(['XY' num2str(tt) '=[XY' num2str(tt) ';[XS YS]];'])
        end
       end
end
save update.sss XY1 XY2 XY3 XY4 XY5 XY6 -mat;
return;

function savedata1

[f,p]=uiputfile('*.wdb','Save Wideband Do Not Include Extension');
h3=findobj('Name','Wideband');
if f~=0;
  h2=findobj(h3,'Tag','freq');
  freq=get(h2,'String');
  h2=findobj(h3,'Tag','Ts');
  Ts=get(h2,'String');
  h2=findobj(h3,'Tag','samp');
  samp=get(h2,'String');
  h2=findobj(h3,'Tag','taps');
  taps=get(h2,'String');
  h2=findobj(h3,'Tag','ntap');
  ntaps=get(h2,'String');
  h2=findobj(h3,'Tag','bits');
  bits=get(h2,'String');
  h2=findobj(h3,'Tag','flag3');
  flag3=get(h2,'Value');
  h2=findobj(h3,'Tag','berflag');
  berflag=get(h2,'Value');
  h2=findobj(h3,'Tag','Ebo');
  Eborange=get(h2,'String');
  h2=findobj(h3,'Tag','flag1');
  flag1=get(h2,'Value');
  h2=findobj(h3,'Tag','flag2');
  flag2=get(h2,'Value');
  h2=findobj(h3,'Tag','flagap');
  flagap=get(h2,'Value');
  h2=findobj(h3,'Tag','image');
  imgflag=get(h2,'Value');
  h2=findobj(h3,'Tag','flagap1');
  flagap1=get(h2,'Value');
  for oo=1:6,
      eval(['h2=findobj(h3,''Tag'',''tx' num2str(oo) ''');'])
      txval(oo)=get(h2,'Value');
  end
  h2=findobj(h3,'Tag','Menu');
  valmenu=get(h2,'Value');
  
  h2=findobj(h3,'Tag','convflag');
  convflag=get(h2,'Value');
  h2=findobj(h3,'Tag','convvel');
  convvel=get(h2,'String');
  h2=findobj(h3,'Tag','convdeg');
  convdeg=get(h2,'String');
  h2=findobj(h3,'Tag','convsamp');
  convsamp=get(h2,'String');
  h2=findobj(h3,'Tag','posflag');
  posflag=get(h2,'Value');
  h2=findobj(h3,'Tag','filepos');
  filepos=get(h2,'String');
  h2=findobj(h3,'Tag','fileconvdat');
  fileconvdat=get(h2,'String');
  h2=findobj(h3,'Tag','lscmabl');
  lscmabl=get(h2,'String');
  h2=findobj(h3,'Tag','lscmapas');
  lscmapas=get(h2,'String');
  [p,f]
  eval(['save ' [p,f] ' freq Ts samp taps ntaps bits flag3 berflag' ...
        ' Eborange flag1 flag2 flagap flagap1 txval valmenu imgflag convflag convvel convdeg convsamp posflag filepos fileconvdat lscmabl lscmapas -mat;'])
end
return

function readdata1

[f,p]=uigetfile('*.wdb','Select Scatterer File');
h3=findobj('Name','Wideband');
if f~=0;
   eval(['load ',[p,f],' -mat;']);
   h2=findobj(h3,'Tag','freq');
   set(h2,'String',freq);
   h2=findobj(h3,'Tag','Ts');
   set(h2,'String',Ts);
   h2=findobj(h3,'Tag','samp');
   set(h2,'String',samp);
   h2=findobj(h3,'Tag','taps');
   set(h2,'String',taps);
   h2=findobj(h3,'Tag','ntap');
   set(h2,'String',ntaps);
   h2=findobj(h3,'Tag','bits');
   set(h2,'String',bits);
   h2=findobj(h3,'Tag','flag3');
   set(h2,'Value',flag3);
   h2=findobj(h3,'Tag','berflag');
   set(h2,'Value',berflag);
   h2=findobj(h3,'Tag','Ebo');
   set(h2,'String',Eborange);
   h2=findobj(h3,'Tag','flag1');
   set(h2,'Value',flag1);
   h2=findobj(h3,'Tag','flag2');
   set(h2,'Value',flag2);
   h2=findobj(h3,'Tag','flagap');
   set(h2,'Value',flagap);
   h2=findobj(h3,'Tag','flagap1');
   set(h2,'Value',flagap1);
   h2=findobj(h3,'Tag','image');
   set(h2,'Value',imgflag);
   for oo=1:6,
      eval(['h2=findobj(h3,''Tag'',''tx' num2str(oo) ''');'])
      set(h2,'Value',txval(oo));
      if txval(oo)==1
        highlight2(h2)
      end
   end
   h2=findobj(h3,'Tag','Menu');
   set(h2,'Value',valmenu);
   
   h2=findobj(h3,'Tag','convflag');
   set(h2,'Value',convflag);
   h2=findobj(h3,'Tag','convvel');
   set(h2,'String',convvel);
   h2=findobj(h3,'Tag','convdeg');
   set(h2,'String',convdeg);
   h2=findobj(h3,'Tag','convsamp');
   set(h2,'String',convsamp);
   h2=findobj(h3,'Tag','posflag');
   set(h2,'Value',posflag);
   h2=findobj(h3,'Tag','filepos');
   set(h2,'String',filepos);
   h2=findobj(h3,'Tag','fileconvdat');
   set(h2,'String',fileconvdat);
   h2=findobj(h3,'Tag','lscmabl');
   set(h2,'String',lscmabl);
   h2=findobj(h3,'Tag','lscmapas');
   set(h2,'String',lscmapas);
end
return

function readdata

[f,p]=uigetfile('*.sct','Select Scatterer File');
h4=findobj('Name','Scatterers');
if f~=0;
  eval(['load ',[p,f],' -mat;']);
  for tt=1:6,
     for uu=1:10,
       eval(['h2=findobj(h4,''Tag'',''c_' num2str((tt)) ...
            '_' num2str(uu) ''');']);
       set(h2,'Value',val(tt,uu));
       highlight(h2)
       eval(['h2=findobj(h4,''Tag'',''s_' num2str((tt)) ...
       '_' num2str(uu) '_x'');']);
       set(h2,'String',XS(tt,uu));
       eval(['h2=findobj(h4,''Tag'',''s_' num2str((tt)) ...
       '_' num2str(uu) '_y'');']);
       set(h2,'String',YS(tt,uu));
     end
  end
end
return
