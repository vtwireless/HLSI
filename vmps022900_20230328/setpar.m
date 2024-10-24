% setpar
 
set(h5,'String',num2str(receiver_x0));
set(h7,'String',num2str(receiver_y0));
set(h10,'String',num2str(receiver_dir));
set(h12,'String',num2str(receiver_vel));
set(h15,'Value',rx_el_on(1));
set(h16,'Value',rx_el_on(2));
set(h17,'Value',rx_el_on(3));
set(h18,'Value',rx_el_on(4));
set(h20,'String',num2str(rx_el_x(1)));
set(h25,'String',num2str(rx_el_y(1)));
set(h21,'String',num2str(rx_el_x(2)));
set(h26,'String',num2str(rx_el_y(2)));
set(h22,'String',num2str(rx_el_x(3)));
set(h27,'String',num2str(rx_el_y(3)));
set(h23,'String',num2str(rx_el_x(4)));
set(h28,'String',num2str(rx_el_y(4)));
set(h30,'String',rx_el1_file);
set(h31,'String',rx_el2_file);
set(h32,'String',rx_el3_file);
set(h33,'String',rx_el4_file);

set(h42,'Value',tx_on(1));
set(h43,'Value',tx_on(2));
set(h44,'Value',tx_on(3));
set(h45,'Value',tx_on(4));
set(h47,'String',num2str(tx_x0(1)));
set(h52,'String',num2str(tx_y0(1)));
set(h48,'String',num2str(tx_x0(2)));
set(h53,'String',num2str(tx_y0(2)));
set(h49,'String',num2str(tx_x0(3)));
set(h54,'String',num2str(tx_y0(3)));
set(h50,'String',num2str(tx_x0(4)));
set(h55,'String',num2str(tx_y0(4)));
set(h57,'String',num2str(tx_dir(1)));
set(h58,'String',num2str(tx_dir(2)));
set(h59,'String',num2str(tx_dir(3)));
set(h60,'String',num2str(tx_dir(4)));
set(h62,'String',num2str(tx_vel(1)));
set(h63,'String',num2str(tx_vel(2)));
set(h64,'String',num2str(tx_vel(3)));
set(h65,'String',num2str(tx_vel(4)));
set(h67,'Value',tx_mpmodel(1));
set(h68,'Value',tx_mpmodel(2));
set(h69,'Value',tx_mpmodel(3));
set(h70,'Value',tx_mpmodel(4));
set(h72,'String',num2str(tx_scatterers(1)));
set(h73,'String',num2str(tx_scatterers(2)));
set(h74,'String',num2str(tx_scatterers(3)));
set(h75,'String',num2str(tx_scatterers(4)));
set(h92,'String',num2str(tx_tmax(1)));
set(h93,'String',num2str(tx_tmax(2)));
set(h94,'String',num2str(tx_tmax(3)));
set(h95,'String',num2str(tx_tmax(4)));
set(h97,'String',num2str(tx_Gamma_H(1)));
set(h98,'String',num2str(tx_Gamma_H(2)));
set(h99,'String',num2str(tx_Gamma_H(3)));
set(h100,'String',num2str(tx_Gamma_H(4)));
set(h141,'String',num2str(tx_Gamma_V(1)));
set(h142,'String',num2str(tx_Gamma_V(2)));
set(h143,'String',num2str(tx_Gamma_V(3)));
set(h144,'String',num2str(tx_Gamma_V(4)));
set(h77,'Value',tx_los(1));
set(h78,'Value',tx_los(2));
set(h79,'Value',tx_los(3));
set(h80,'Value',tx_los(4));
set(h130,'String',tx_pat1);
set(h131,'String',tx_pat2);
set(h132,'String',tx_pat3);
set(h133,'String',tx_pat4);

textbold(h15,h15,h20,h25,h30,h34)
textbold(h16,h16,h21,h26,h31,h35)
textbold(h17,h17,h22,h27,h32,h36)
textbold(h18,h18,h23,h28,h33,h37)
textbold(h42,h42,h47,h52,h57,h62,h67,h72,h92,h97,h141,h77,h130,h134)
textbold(h43,h43,h48,h53,h58,h63,h68,h73,h93,h98,h142,h78,h131,h135)
textbold(h44,h44,h49,h54,h59,h64,h69,h74,h94,h99,h143,h79,h132,h136)
textbold(h45,h45,h50,h55,h60,h65,h70,h75,h95,h100,h144,h80,h133,h137)