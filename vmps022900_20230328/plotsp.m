% 3 element spatial array
ERR1=[21319 14378 8565 4601 2095 810 238 59 8];
BER1=ERR1/500000;
% 3 element spatial temporal 10 taps delay 5 2 GHz 10 samp/symbol
ERR2=[15539 9861  5733 3054 1316 469 143 26 3];
BER2=ERR2/500000;
% 2 element spatial temporal array
%ERR3=[32928 24548 17985 12070 7653 4415 2155 1007 340];
% 2 element spatial array
%ERR4=[27278 19026 12521 7724 4584 2435 1086 461 171]
Eb=0:8;
semilogy(Eb,BER1,'r--')
Eblin=10.^(Eb/10)
per=1/2*erfc(sqrt(Eblin));
hold on
semilogy(Eb,BER2,'g')
semilogy(Eb,per,'b')
grid
legend('Three Element Array','Three Element S-T Array','BPSK in AWGN',3)
title('Bit Error Rate for a Three Antenna Element Receiver')
xlabel('Eb/No')
ylabel('Bit Error Rate (BER)')