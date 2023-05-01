fid=fopen('comput.jpg','r');
F = fread(fid);
bits=dec2bin(F,8);
seq=bits(1,:);
oo=size(bits);
for uu=2:oo(1),
  seq=[seq bits(uu,:)];
end

%%%%%%%%%%%%%%%%%%%%%%%%%%

hbits=seq(1:8);
for uu=2:oo(1),
  hbits(uu,:)=seq((uu-1)*8+1:uu*8);
end
ff=bin2dec(hbits);
s=char(ff');

fid1=fopen('comput1.jpg','w');
fwrite(fid1,s)

