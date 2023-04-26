%spatial_sig=spsig(phi_term1,phi_term2,propagation,rx_terminal,...
%                  tx_pattern,rx_geometry,rx_patterns)
%Determines spatial or spatial-polarization signature at receiver in multipath channel 
%   Outputs:
%     spatial_sig:  A vector containing the complex envelope at each array element
%   Inputs:
%     phi_term1:    Angles in radians to each scatterer (ccw from x-axis)
%                   at terminal 1
%     phi_term2:    Angles in radians to each scatterer (ccw from x-axis)
%                   at terminal 2
%     propagation:  Each row contains the horizontally and vertically
%                   polarized components of one complex multipath component 
%     rx_terminal:  The receiving terminal at which spatial signature is to be 
%                   calculated, either 1 or 2
%     tx_pattern:   a matrix in which the first row contains the horizontally
%                   polarized azimuth pattern and the second row contains the 
%                   vertically polarized azimuth pattern of the transmitting 
%                   antenna, sampled at equal increments from 0 to 2*pi 
%     rx_geometry:  A matrix in which each row contains the (x,y) coordinates
%                   in wavelengths of one element of the receiving array
%     rx_patterns:  a matrix in which the odd rows contain the horizontally
%                   polarized azimuth patterns and the even rows contain the 
%                   vertically polarized azimuth patterns of the receiving
%                   antennas, sampled at equal increments from 0 to 2*pi 

% Carl Dietrich, 5-27-98

function spatial_sig=spsig(phi_term1,phi_term2,propagation,...
                     rx_terminal,tx_pattern,rx_geometry,rx_patterns)

paths=max(size(propagation));
elements=size(rx_geometry,1);
spatial_sig=zeros(elements,1);

if rx_terminal==1
  phi_TX=phi_term2;
  phi_RX=phi_term1;
elseif rx_terminal==2
  phi_TX=phi_term1;
  phi_RX=phi_term2;
else
  error('rx_terminal must be 1 or 2')
end; % if rx_terminal...

tx_phidim=size(tx_pattern,2);
tx_phi_index=1+round((tx_phidim-1)*phi_TX/(2*pi));
propagation(:,1)=tx_pattern(1,tx_phi_index).'.*propagation(:,1);
propagation(:,2)=tx_pattern(2,tx_phi_index).'.*propagation(:,2);

rx_phidim=size(rx_patterns,2);
rx_phi_index=1+round((rx_phidim-1)*phi_RX/(2*pi));
for i=1:elements
   x=rx_geometry(i,1);	% element coordinates in wavelengths
   y=rx_geometry(i,2);
   elhpattern=rx_patterns(2*i-1,:);
   elvpattern=rx_patterns(2*i,:);
   signal=propagation(:,1).*elhpattern(rx_phi_index).'...
          .*exp(j*2*pi*(x*cos(phi_RX)+y*sin(phi_RX)))...
          +propagation(:,2).*elvpattern(rx_phi_index).'...
          .*exp(j*2*pi*(x*cos(phi_RX)+y*sin(phi_RX)));
   spatial_sig(i)=sum(signal);
end;
return;       
            
