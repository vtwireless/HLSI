function seq=jpgreader(filename)

%Reads jpgimages and transforms them into strings of bits
%Nov 7 1998-Kai Dietze

fid=fopen(filename,'r');
F = fread(fid);
bits=dec2bin(F,8);
bits=bits';
oo=size(bits);
pp=1:oo(1)*oo(2);
seq=bits(pp);
fclose(fid)
return
