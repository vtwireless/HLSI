%vmpsmain.m 
function vmpsmain(option,tmax,outputfile);

disp('running vmpsmain')
outputfile
tic

MAX_EL=8;						% maximum number of array elements
MAX_TX=6;						% maximum number of transmitters

epsilon_r=NaN;					% relative permittivity of reflectors
freq=2.05e9;					% RF frequency
receiver=1;						% Terminal that is receiver
fs=32000;						% baseband sampling rate, samples per second
%tmax=2;							% duration of simulated data, in seconds
simtime=0:0.001:tmax;		% time vector for spatial-polarization signature 
									% simulation, in seconds
Samples=size(simtime,2); 	% number of samples of spatial-pol. signature
rx_x_t=zeros(1,Samples);	% receiver x(t)
rx_y_t=zeros(1,Samples);	% receiver y(t)
sp_sigs=[];						% spatial-polarization signatures
s=[];								% cw signals
sigsamples=fs*tmax+1;	  	% number of samples of CW signals
t=0:(1/fs):tmax;				% time for CW signals
randn('seed',0);				% seed for random number generator (for noise)



% get receiver parameters     
rxparams={'x';'y';'dir';'vel'};
rxprop={'String';'String';'String';'String'};
for i=1:length(rxparams)
   varname=['rx_',rxparams{i,1}];
   eval(['h1=findobj(''Tag'',''',varname,''');']);
   eval([varname,'=get(h1,''',rxprop{i,1},''');']);
end;
    
% process receiver parameters
rx_x_t=str2num(rx_x)*ones(1,Samples)+...
   simtime*str2num(rx_vel)*cos(pi*str2num(rx_dir)/180);
rx_y_t=str2num(rx_y)*ones(1,Samples)+...
   simtime*str2num(rx_vel)*sin(pi*str2num(rx_dir)/180);

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

% process element parameters
rx_el=[];			% indices of active elements
rx_azpatterns=[];	% azimuth patterns of elements
array_geometry=[];
for i=1:MAX_EL
   eval(['h1=findobj(''Tag'',''el_',num2str(i),'_button'');']);
  if get(h1,'Value')==1	% if element is active
    rx_el=[rx_el,i];
    eval(['[rx_azpattern',num2str(i),'h,rx_azpattern',num2str(i),...
          'v]=getazpat(el_',num2str(i),'_file);']);
    eval(['rx_azpatterns=[rx_azpatterns;rx_azpattern',num2str(i),'h];']);
    eval(['rx_azpatterns=[rx_azpatterns;rx_azpattern',num2str(i),'v];']);
    eval(['array_geometry=[array_geometry;',...
       '[str2num(el_',num2str(i),'_x),str2num(el_',num2str(i),'_y)]];']);
  end;
end;
M=length(rx_el); % number of elements  

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

% process transmitter parameters
tx=[];	% numbers of transmitters that are on
tx_on=[];
for i=1:MAX_TX
   eval(['tx_on=tx_',num2str(i),'_button;']);
  if tx_on
    tx=[tx,i];	% row vector of transmitter ID numbers
  end;
end;
Ntx=size(tx,2);	% Total number of transmitters

% get spatial-polarization signatures, generate CW signals
for txcount=1:Ntx
   i=tx(txcount);
   for k=1:length(txparams)
      if strcmp(txprop{k,1},'Value') | strcmp(txparams{k,1},'file')
         eval(['tx_',txparams{k,1},'=tx_',num2str(i),'_',txparams{k,1},';']);
      elseif strcmp(txprop{k,1},'String') 
         eval(['tx_',txparams{k,1},'=str2num(tx_',num2str(i),'_',txparams{k,1},');']);
      end;
   end;
   % spatial-polarization signature, M rows x Samples columns for each element
   sp_sigs=[sp_sigs;sqrt(2*tx_power)*spscalc(rx_x_t,rx_y_t,array_geometry,rx_azpatterns,...
         tx_x,tx_y,tx_vel,tx_dir,tx_file,tx_dtau,tx_model,...
         tx_scat,tx_GammaH,tx_GammaV,epsilon_r,...
         tx_LOS,simtime,freq,tx_seed)];
   % cw signals, M x Samples for each element
   if option==2
      s=[s;cwsignal2(sp_sigs((M*(txcount-1)+1):(M*txcount),:),1000*tx(txcount),fs,tmax)];  
   end;
end;


if option==1 	% write spatial signatures
   eval(['save ',outputfile,' sp_sigs -mat;']);
elseif option==2	% generate and write signals
   n=1/sqrt(2)*randn(M,sigsamples)...	% noise
      +j/sqrt(2)*randn(M,sigsamples); 
   x=sqrt(1e-13)*n;
   for i=1:size(tx,2)
      x=x+s((M*(i-1)+1):(M*i),:);
   end;

   figure
   plot(t(1:100),real(x(1,1:100)))
   xlabel('time in seconds')
   ylabel('x(t)')
   
outputfile=outputfile(1:(length(outputfile)-4))
m=3*max(max(abs(real(x))));
%wavwr(real(x),fs,16,2,outputfile)
if size(x,1)<=2
   ofile=[outputfile,'.wav'];
   wavwrite(real(x(1:2,:).')/m,fs,16,outputfile)
end
if size(x,1)>2
   ofile=[outputfile,'a.wav'];
   wavwrite(real(x(1:2,:).')/m,fs,16,ofile)
   ofile=[outputfile,'b.wav'];
   wavwrite(real(x(3:4,:).')/m,fs,16,ofile)
end
if size(x,1)>4
   ofile=[outputfile,'c.wav'];   
   wavwrite(real(x(5:6,:).')/m,fs,16,ofile)
end
if size(x,1)>6
   ofile=[outputfile,'d.wav'];   
   wavwrite(real(x(7:8,:).')/m,fs,16,ofile)
end

   figure
   psd(x(1,:),fs,fs,fs)
end;

toc