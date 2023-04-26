% [vpattern,hpattern]=rcpat('filename')
% reads a complex antenna pattern

% Carl Dietrich (carld@birch.ee.vt.edu)
% Antenna Group
% Center for Wireless Telecommunications
% Virginia Tech
% 5-28-96
% 9-4-96 modified for MS-DOS
% 8-17-98 modified to use one pattern file

function [vpattern,hpattern]=rcpat(filename)

cmd=['load ',filename,' -mat;'];
eval(cmd);

return;
 
