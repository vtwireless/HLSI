% vmpsproc01(action)
% callback function for vmps gui

function vmpsproc01(action)

disp(action);

switch action
   
case 'run'
   vmpsrun;
   
case 'select_run_option' 	% select type of data to generate
   selectoption;
   
case 'geometry'				% draw current geometry
   drawgeometry;
   
case 'saveparam'			 	% save current parameters
   writeparam;
        
case 'loadparam'				% load parameters from a file
   readparam;
   
case 'select'					% activate an element or transmitter
   highlightselected(gcbo);
   
case 'patternfile'			% select an antenna pattern file
   getpatternfile;
   
case 'select_output_file'
   selectoutputfile;
   
   
end; % switch
return;
   
   
   
   function vmpsrun()
   h1=findobj('Tag','vmps_output_file');
   outputfile=get(h1,'String');
   h1=findobj('Tag','run_option');
   option=get(h1,'Value');
   h1=findobj('Tag','vmps_duration_s');
   duration=get(h1,'String');
   duration=(str2num(duration));
   switch option
      case 1
         vmpsmain(option,duration,outputfile);
      case 2
         vmpsmain(option,duration,outputfile);
      case 3
         broadgui1;
   end;
   return;
   
   
   
   function selectoption()
   h1=findobj('Name','VMPS Run Options');
   if isempty(h1)
      vmpsrunoptions;
   else 
      figure(h1);
   end;
   return;
   
   
   
   function drawgeometry()
      h1=findobj('Name','VMPS Initial Geometry');	% get figure
   if isempty(h1)
      h1=figure;
      set(h1,'Name','VMPS Initial Geometry','NumberTitle','off',...
         'Position',[200 200 520 500]);
   end;
   figure(h1);
   [rx_coords,rx_movement,tx_coords,tx_movement,scatterer_coords,tx_symbol,...
         scatterer_symbol,los_symbol,move_symbol]=getgeometry;
   rx_x=rx_coords(1);
   rx_y=rx_coords(2);
   h2=plot(rx_x,rx_y,'ko');
   set(h2,'LineWidth',2);
   hold on;
   xmov=60*rx_movement(1)*cos(pi*rx_movement(2)/180);   
   ymov=60*rx_movement(1)*sin(pi*rx_movement(2)/180);  
   h3=plot([rx_x,rx_x+xmov],[rx_y,rx_y+ymov],'k-');
      set(h3,'LineWidth',2);
   
   for i=1:size(tx_coords,1)	% for each transmitter
      h4=findobj('Tag',['tx_',num2str(tx_coords(i,1)),'_LOS']);
      v=get(h4,'Value');
      tx_x=tx_coords(i,2);
      tx_y=tx_coords(i,3);
      if v==1	% if LOS
         h5=plot([tx_x,rx_x],[tx_y,rx_y],...
            los_symbol(tx_coords(i,1),:));
         set(h5,'LineWidth',5);
      %else
      %   plot([tx_coords(i,2),rx_coords(1)],[tx_coords(i,3),rx_coords(2)],...
      %      nlos_symbol(tx_coords(i,1),:));
      end; %if v==1      
      xmov=60*tx_movement(i,1)*cos(pi*tx_movement(i,2)/180);   
      ymov=60*tx_movement(i,1)*sin(pi*tx_movement(i,2)/180);  
      h6=plot(tx_x,tx_y,tx_symbol(tx_coords(i,1),:));
      set(h6,'LineWidth',2);
      h7=plot([tx_x,tx_x+xmov],[tx_y,tx_y+ymov],move_symbol(tx_coords(i,1),:));
      set(h7,'LineWidth',2);
      if ~isempty(scatterer_coords{tx_coords(i,1)})
         h8=plot(scatterer_coords{tx_coords(i,1)}(:,1),...
            scatterer_coords{tx_coords(i,1)}(:,2),scatterer_symbol(tx_coords(i,1),:));
         set(h8,'LineWidth',2);
      end; %if ~isempty...
   end; %for i=1...
   hold off;
   a=axis;
   a=[min(a)-100 max(a)+100 min(a)-100 max(a)+100];
   axis(a);
   axis('square');
   grid;
   xlabel('x, meters');
   ylabel('y, meters');
   return;
   
   
   
   function [rx_coords,rx_movement,tx_coords,tx_movement,scatterer_coords,...
         tx_symbol,scatterer_symbol,los_symbol,move_symbol]=getgeometry()
   
   h1=findobj('Tag','rx_x');
   h2=findobj('Tag','rx_y');
   h3=findobj('Tag','rx_vel');
   h4=findobj('Tag','rx_dir');
   rx_coords=[str2num(get(h1,'String')),str2num(get(h2,'String'))];
   rx_movement=[str2num(get(h3,'String')),str2num(get(h4,'String'))];
   tx_coords=[];
   tx_movement=[];
   scatterer_coords=cell(8,1);
   for i=1:8
      h0=findobj('Tag',['tx_',num2str(i),'_button']);
      if get(h0,'Value')
      	h1=findobj('Tag',['tx_',num2str(i),'_x']);
         h2=findobj('Tag',['tx_',num2str(i),'_y']);
         h3=findobj('Tag',['tx_',num2str(i),'_vel']);
         h4=findobj('Tag',['tx_',num2str(i),'_dir']);
         tx_coords=[tx_coords;...
               [i,str2num(get(h1,'String')),str2num(get(h2,'String'))]];
         tx_movement=[tx_movement;...
               [str2num(get(h3,'String')),str2num(get(h4,'String'))]];
         scatterer_coords{i}=getscatterercoords(i);
      end;
   end;
   tx_symbol=['bs';'rs';'ms';'ks';'bd';'rd';'md';'kd'];
   scatterer_symbol=['b+';'r+';'m+';'k+';'bx';'rx';'mx';'kx'];
   move_symbol=['b-';'r-';'m-';'k-';'b-';'r-';'m-';'k-'];
   los_symbol=['b:';'r:';'m:';'k:';'b:';'r:';'m:';'k:'];

   return;
   
   
   
   function scat_coords=getscatterercoords(tx_number)
   
   h1=findobj('Tag','rx_x');
   rx_x=str2num(get(h1,'String'));
   h1=findobj('Tag','rx_y');
   rx_y=str2num(get(h1,'String'));
   h1=findobj('Tag',['tx_',num2str(tx_number),'_x']);
   tx_x=str2num(get(h1,'String'));
   h1=findobj('Tag',['tx_',num2str(tx_number),'_y']);
   tx_y=str2num(get(h1,'String'));
   h1=findobj('Tag',['tx_',num2str(tx_number),'_model']);
   model=get(h1,'Value');
   h1=findobj('Tag',['tx_',num2str(tx_number),'_scat']);
   num_scat=str2num(get(h1,'String'));
   h1=findobj('Tag',['tx_',num2str(tx_number),'_seed']);
   seed=str2num(get(h1,'String'));
   h1=findobj('Tag',['tx_',num2str(tx_number),'_dtau']);
   dtau=str2num(get(h1,'String'));
   R=3e8*dtau*1e-6/2;   
   if num_scat>0
      switch model
      case 1	% no multipath
         ; 
         
      case 2	% Lee's model (ring of scatterers centered on TX) for macrocell
         scat_coords=leescatt([tx_x,tx_y],num_scat,R);
         
      case 3	% Lee's model (ring of scatterers centered on RX) for macrocell
         scat_coords=leescatt([rx_x,rx_y],num_scat,R);
         
		case 4	% Petrus' GBSBM for macrocells, scatterers around TX
         scat_coords=petscat(R,[],[],tx_x,tx_y,num_scat,seed);
         
      case 5	% Petrus' GBSBM for macrocells, scatterers around RX
         scat_coords=petscat(R,[],[],rx_x,rx_y,num_scat,seed);
                  
      case 6	% Liberti's GBSB for microcells
         scat_coords=gbsbscat(dtau*1e-6,...	% convert time to seconds
            rx_x,rx_y,tx_x,tx_y,num_scat,seed);
         
      case 7	% User-specified scatterer locations
         ;
         
      end; %switch model
   else	%if num_scat>0
      scat_coords=[];
   end; 	%if num_scat>0
   return;
   
   
   
   function writeparam()
   [f,p]=uiputfile('*.par','Select Parameter File to Save');
   if f~=0;
      h1=findobj('Tag','param_file');
      set(h1,'String',[p,f]);
      
      % get receiver parameters     
      rxparams={'x';'y';'dir';'vel'};
      rxprop={'String';'String';'String';'String'};
      for i=1:length(rxparams)
         varname=['rx_',rxparams{i,1}];
         eval(['h1=findobj(''Tag'',''',varname,''');']);
         eval([varname,'=get(h1,''',rxprop{i,1},''');']);
      end;
      
      % get element parameters
      elparams={'button';'x';'y';'file'};
      elprop={'Value';'String';'String';'String'};
      for el=1:8
         for i=1:length(elparams)
            varname=['el_',num2str(el),'_',elparams{i,1}];
            eval(['h1=findobj(''Tag'',''',varname,''');']);
            eval([varname,'=get(h1,''',elprop{i,1},''');']);
         end;
      end;
      
      % get transmitter parameters
      txparams={'button';'power';'x';'y';'dir';'vel';'model';...
            'scat';'seed';'dtau';'GammaH';'GammaV';'LOS';'file'};
      txprop={'Value';'String';'String';'String';'String';'String';'Value';...
            'String';'String';'String';'String';'String';'Value';'String'};
      for tx=1:6
         for i=1:length(txparams)
            varname=['tx_',num2str(tx),'_',txparams{i,1}];
            eval(['h1=findobj(''Tag'',''',varname,''');']);
            eval([varname,'=get(h1,''',txprop{i,1},''');']);
         end;
      end;
      
  		eval(['save ',[p,f],' -mat;']);
   end;
   return;
     
     
     
   function readparam()
   [f,p]=uigetfile('*.par','Select Parameter File');
   if f~=0;
      %load parameter file
      eval(['load ',[p,f],' -mat;']);
      
      % set receiver parameters     
      rxparams={'x';'y';'dir';'vel'};
      rxprop={'String';'String';'String';'String'};
      for i=1:length(rxparams)
         varname=['rx_',rxparams{i,1}];
         eval(['h1=findobj(''Tag'',''',varname,''');']);
         eval(['set(h1,''',rxprop{i,1},''',',varname,');'])
      end;
      
      % set element parameters
      elparams={'button';'x';'y';'file'};
      elprop={'Value';'String';'String';'String'};
      for el=1:8
         for i=1:length(elparams)
            varname=['el_',num2str(el),'_',elparams{i,1}];
            eval(['h1=findobj(''Tag'',''',varname,''');']);
            eval(['set(h1,''',elprop{i,1},''',',varname,');']);
            if i==1
               highlightselected(h1);
            end; 
         end;
      end;
      
      % set transmitter parameters
      txparams={'button';'power';'x';'y';'dir';'vel';'model';...
            'scat';'seed';'dtau';'GammaH';'GammaV';'LOS';'file'};
      txprop={'Value';'String';'String';'String';'String';'String';'Value';...
            'String';'String';'String';'String';'String';'Value';'String'};
      for tx=1:6
         for i=1:length(txparams)
            varname=['tx_',num2str(tx),'_',txparams{i,1}];
            eval(['h1=findobj(''Tag'',''',varname,''');']);
            eval(['set(h1,''',txprop{i,1},''',',varname,');']);
            if i==1
               highlightselected(h1)
            end;
         end;
      end;
   end;
   return;
     
   
   
   function highlightselected(h1)
   v=get(h1,'Value');
   u=get(h1,'UserData');
   h2=findobj('UserData',u);
   if v==1
      set(h2,'FontWeight','bold','BackgroundColor',[1 1 1]);
   else
      set(h2,'FontWeight','normal','BackgroundColor',[.752941 .752941 .752941]);
   end;
   return;
   
   
   
   function getpatternfile
   h1=gcbo;
   u=get(h1,'UserData');
   t=get(h1,'Tag')
   t=[t(1:5),'file']
   h2=findobj('UserData',u,'Tag',t)
   [f,p]=uigetfile('*.pat','Select Pattern File')
   if f~=0
      set(h2,'String',[p,f]);
   end;
   thetapat([p,f],90);
   return;
   
   
   
   function selectoutputfile()
   ext={'*.sps';'*.wav';'*.ber'};
   h1=findobj('Tag','run_option');
   opt=get(h1,'Value');
   h2=findobj('Tag','vmps_output_file');
   [f,p]=uiputfile(ext{opt,1},'Specify Output File')
   if f~=0
      set(h2,'String',[p,f]);
   end;
   return;


  