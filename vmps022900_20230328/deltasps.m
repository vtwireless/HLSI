% dsps=deltasps(sp_sig)
% Returns percent change between successive samples of 
% spatial-polarization signature
% Output:  dsps:  percent change in sps (1x(length-1))
% Input:   sp_sig:  spatial-polarization signature (Mxlength)

function dsps=deltasps(sp_sig)

M=size(sp_sig,1);
length=size(sp_sig,2);
dsps=zeros(1,length-1);

for i=1:(length-1);
   vi=sp_sig(:,i);
   vip1=sp_sig(:,i+1);
   deltavi=vip1-((vi'*vip1)/(vi'*vi))*vi;
   dsps(i)=100*norm(deltavi)/norm(vi);
end;