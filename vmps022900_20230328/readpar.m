% readpar

receiver_x0=str2num(get(h5,'String'));
receiver_y0=str2num(get(h7,'String'));
receiver_dir=str2num(get(h10,'String'));
receiver_vel=str2num(get(h12,'String'));
rx_el_on=[get(h15,'Value');get(h16,'Value');get(h17,'Value');get(h18,'Value')];
rx_el_x=[str2num(get(h20,'String'));str2num(get(h21,'String'));...
str2num(get(h22,'String'));str2num(get(h23,'String'))];
rx_el_y=[str2num(get(h25,'String'));str2num(get(h26,'String'));...
str2num(get(h27,'String'));str2num(get(h28,'String'))];
rx_el1_file=get(h30,'String');
rx_el2_file=get(h31,'String');
rx_el3_file=get(h32,'String');
rx_el4_file=get(h33,'String');

tx_on=[get(h42,'Value');get(h43,'Value');get(h44,'Value');get(h45,'Value')];
tx_x0=[str2num(get(h47,'String'));str2num(get(h48,'String'));...
str2num(get(h49,'String'));str2num(get(h50,'String'))];
tx_y0=[str2num(get(h52,'String'));str2num(get(h53,'String'));...
str2num(get(h54,'String'));str2num(get(h55,'String'))];
tx_dir=[str2num(get(h57,'String'));str2num(get(h58,'String'));...
str2num(get(h59,'String'));str2num(get(h60,'String'))];
tx_vel=[str2num(get(h62,'String'));str2num(get(h63,'String'));...
str2num(get(h64,'String'));str2num(get(h65,'String'))];
tx_mpmodel=[get(h67,'Value');get(h68,'Value');get(h69,'Value');get(h70,'Value')];
tx_scatterers=[str2num(get(h72,'String'));str2num(get(h73,'String'));...
str2num(get(h74,'String'));str2num(get(h75,'String'))];
tx_tmax=[str2num(get(h92,'String'));str2num(get(h93,'String'));...
str2num(get(h94,'String'));str2num(get(h95,'String'))];
tx_Gamma_H=[str2num(get(h97,'String'));str2num(get(h98,'String'));...
      str2num(get(h99,'String'));str2num(get(h100,'String'))];
tx_Gamma_V=[str2num(get(h141,'String'));str2num(get(h142,'String'));...
str2num(get(h143,'String'));str2num(get(h144,'String'))];

tx_los=[get(h77,'Value');get(h78,'Value');get(h79,'Value');get(h80,'Value')];
tx_pat1=get(h130,'String');
tx_pat2=get(h131,'String');
tx_pat3=get(h132,'String');
tx_pat4=get(h133,'String');


