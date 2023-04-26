function sp_sig=spscalc(rx_x,rx_y,array_geometry,rx_azpatterns,...
                        tx_x0,tx_y0,tx_vel,tx_dir,tx_patternfile,...
                        tx_tmax,tx_mpmodel,tx_scatterers,tx_gamma_H,...
                        tx_gamma_V,epsilon_r, tx_los,simtime,freq,seed)

%function sp_sig=spscalc(rx_x,rx_y,array_geometry,rx_azpatterns,...
%                        tx_x0,tx_y0,tx_vel,tx_dir,tx_patternfile,...
%                        tx_tmax,tx_mpmodel,tx_scatterers,tx_gamma_H,...
%                        tx_gamma_V,epsilon_r, tx_los,simtime,freq,seed)

% tx_patternfile:  path and filename of antenna pattern file

Samples=size(simtime,2);	% number of samples of spatial-pol. signature
receiver=1;

% transmitter parameters

[tx_azpatternh,tx_azpatternv]=getazpat(tx_patternfile);
tx_azpattern=[tx_azpatternh;tx_azpatternv];
tx_x=tx_x0*ones(1,Samples)+simtime*tx_vel*cos(pi*tx_dir/180);
tx_y=tx_y0*ones(1,Samples)+simtime*tx_vel*sin(pi*tx_dir/180);
R=tx_tmax*1e-6*3e8;

if tx_scatterers>0
   switch tx_mpmodel
      
   case 1 	% no multipath
      ;
      
   case 2	% Lee's model (ring of scatterers centered on TX) for macrocell
      scatterer_loc=leescatt([tx_x(1),tx_y(1)],tx_scatterers,R);
      
   case 3	% Lee's model (ring of scatterers centered on RX) for macrocell
		scatterer_loc=leescatt([rx_x(1),rx_y(1)],tx_scatterers,R);
      
   case 4	% Petrus' GBSBM for macrocells, scatterers around TX
      scatterer_loc=petscat(R,[],[],tx_x(1),tx_y(1),tx_scatterers,seed);
      
   case 5	% Petrus' GBSBM for macrocells, scatterers around RX
	   scatterer_loc=petscat(R,[],[],rx_x(1),rx_y(1),tx_scatterers,seed);
      
   case 6	% Liberti's GBSB for microcells
     scatterer_loc=gbsbscat(tx_tmax*1e-6,...	% convert time to seconds
        rx_x(1),rx_y(1),tx_x(1),tx_x(2),tx_scatterers,seed);
     
   case 7	% User-specified scatterer positions
      ;
      
   end;
end;

sp_sig=zeros(size(array_geometry,1),size(tx_x,2));

for i=1:Samples
   term1_loc=[rx_x(i),rx_y(i)];
   term2_loc=[tx_x(i),tx_y(i)];
   pb=[];
   pm=[];
   propagation=[];

   if tx_scatterers>0 & tx_mpmodel~=1 	% if multipath
%     rand('seed',seed);								% initialize random number generator (uniform dist.) 4/30/99
%     scat_phases=2*pi*rand(1,tx_scatterers);	% random scatterer phases 4/30/99
     [pb,pm,pr,bsd,msd]=aoadist(term1_loc,term2_loc,scatterer_loc);
%     propagation=reflect(bsd,msd,pr,freq,[tx_gamma_H tx_gamma_V],epsilon_r,scat_phases);	% scat_phases 4/30/99
     propagation=reflect(bsd,msd,pr,freq,[tx_gamma_H tx_gamma_V],epsilon_r);
   end;

   if tx_los==1
     [lospropagation,losphi1,losphi2]=los(term1_loc,term2_loc,freq);
     propagation=[propagation;lospropagation];
     pb=[pb;losphi1];
     pm=[pm;losphi2];
   end;
   sp_sig(:,i)=spsig(pb,pm,propagation,receiver,tx_azpattern,...
                      array_geometry,rx_azpatterns);
end;

return;

