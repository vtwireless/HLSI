function jpgwriter(filename,seq)

%accepts a sequence of bits in a single row as a string and transforms them
%back into a jpeg image.  saves the result into filename as a jpeg format
%Nov 7,1998-Kai Dietze
oo=length(seq)/8;

hbits=(reshape(seq,8,oo)).';
ff=bin2dec(hbits);
s=char(ff')

fid1=fopen(filename,'a');
fwrite(fid1,s);
fclose(fid1)
return
