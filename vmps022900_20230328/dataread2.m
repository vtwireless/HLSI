active=[1 2];
tic
load data
clear Ebrec
samp=10
usu=[3000 2];
consamp=1000;
ii=size(timefilt);
transient=ceil((ii(2))/samp)+1;
bits=ceil(consamp/samp)+transient;

grnd=rand(1,length(active));
grnd(find(grnd>0.5))=1;
grnd(find(grnd<=0.5))=-1;
grndl=grnd';
for pp=1:(samp-1),
  grndl=[grndl grnd'];
end
xx=grndl;
for ii=1:(bits),
   grnd=rand(1,length(active));
   grnd(find(grnd>0.5))=1;
   grnd(find(grnd<=0.5))=-1;
   grndl=grnd';
   for pp=1:(samp-1),
     grndl=[grndl grnd'];
   end
   xx=[xx grndl];
end
size(xx)
toc
tic
for hh=1:3,
   [Ebrec(hh,:)]=filter(timefilt(hh,:),[1],xx(1,:));
end
save datadata4  Ebrec
size(Ebrec)

clear Ebrec
toc
for uuu=1:3,
    [Ebrec1(uuu,:)]=filter(timefilt((usu(1)+uuu),:),[1],xx(2,:));
    if uuu==1000*floor(uuu/1000)
       '1000'
       toc
       tic
    end
end
save datadata5 Ebrec1
size(Ebrec1)

toc
%save data2 Ebrec timefilt

%pp=size(Ebrec)
%toc
%%%%%%%%%
return
%%%%%%%%%
  
Ebmain=Ebrec(:,201:pp(2));
qq=size(Ebmain)
Eb=Ebmain(1:qq(1)/2,:)+Ebmain((qq(1)/2+1):qq(1),:);
tt=size(Eb)
return
for uu=1:tt(1),
  for gg=1:tt(2)
%     Ebfinal(
  end
end
%%%%%%%%%%%
return
%%%%%%%%%%%%
block=20;
wn=[0; 0; 1]
w=wn;
for h=1:floor(qq(2)/block);
  yn=conj(wn.')*Ebmain(:,(h-1)*block+1:h*block);
  delta=yn./abs(yn);
  for g=1:min(size(x)),
     for gi=1:min(size(x)),
       phi(g,gi)=sum(x(g,(h-1)*block+1:h*block).*conj(x(gi,(h-1)*block+1:h*block)));
     end
  end
  S=x(:,(h-1)*block+1:h*block)*conj(delta.');
  wn=inv(phi)*S;
%  using qr decomp to approximate solution(see help qr):
%  R=qr(phi);
%  wn = R\(R'\(phi'*S));
%  r = S - phi*wn;
%  e = R\(R'\(phi'*r));
%  wn=wn+e;
%  [q,r]=qr(phi);
%  wn=inv(r)*q'*S;
%  h
  y=[y yn];
  w=[w wn];
end;
