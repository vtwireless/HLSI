% wcpat('filename',vpattern,hpattern)
% writes a complex antenna pattern

% Carl Dietrich (carld@birch.ee.vt.edu)
% Antenna Group
% Center for Wireless Telecommunications
% Virginia Tech
% 5-28-96
% 9-4-96 modified for MS-DOS
% 8-17-98 modified to use one pattern file

function wcpat(filename,vpattern,hpattern)

eval(['save -mat4-binary ',filename,' vpattern hpattern']);

return;
