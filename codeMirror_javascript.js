(function(a){if(typeof exports=="object"&&typeof module=="object"){a(require("../../lib/codemirror"))
}else{if(typeof define=="function"&&define.amd){define(["../../lib/codemirror"],a)
}else{a(CodeMirror)}}})(function(a){a.defineMode("javascript",function(ap,aC){var p=ap.indentUnit;
var H=aC.statementIndent;var aW=aC.jsonld;var E=aC.json||aW;var aO=aC.trackScope!==false;
var h=aC.typescript;var aN=aC.wordCharacters||/[\w$\xa1-\uffff]/;var aL=function(){function bb(bf){return{type:bf,style:"keyword"}
}var a8=bb("keyword a"),be=bb("keyword b"),bd=bb("keyword c"),bc=bb("keyword d");
var a9=bb("operator"),ba={type:"atom",style:"atom"};return{"if":bb("if"),"while":a8,"with":a8,"else":be,"do":be,"try":be,"finally":be,"return":bc,"break":bc,"continue":bc,"new":bb("new"),"delete":bd,"void":bd,"throw":bd,"debugger":bb("debugger"),"var":bb("var"),"const":bb("var"),let:bb("var"),"function":bb("function"),"catch":bb("catch"),"for":bb("for"),"switch":bb("switch"),"case":bb("case"),"default":bb("default"),"in":a9,"typeof":a9,"instanceof":a9,"true":ba,"false":ba,"null":ba,"undefined":ba,"NaN":ba,"Infinity":ba,"this":bb("this"),"class":bb("class"),"super":bb("atom"),yield:bd,"export":bb("export"),"import":bb("import"),"extends":bd,await:bd}
}();var aa=/[+\-*&%=<>!?|~^@]/;var aK=/^@(context|id|value|language|type|container|list|set|reverse|index|base|vocab|graph)"/;
function L(bb){var a9=false,a8,ba=false;while((a8=bb.next())!=null){if(!a9){if(a8=="/"&&!ba){return
}if(a8=="["){ba=true}else{if(ba&&a8=="]"){ba=false}}}a9=!a9&&a8=="\\"}}var af,M;function U(ba,a9,a8){af=ba;
M=a8;return a9}function ah(bc,ba){var a8=bc.next();if(a8=='"'||a8=="'"){ba.tokenize=ae(a8);
return ba.tokenize(bc,ba)}else{if(a8=="."&&bc.match(/^\d[\d_]*(?:[eE][+\-]?[\d_]+)?/)){return U("number","number")
}else{if(a8=="."&&bc.match("..")){return U("spread","meta")}else{if(/[\[\]{}\(\),;\:\.]/.test(a8)){return U(a8)
}else{if(a8=="="&&bc.eat(">")){return U("=>","operator")}else{if(a8=="0"&&bc.match(/^(?:x[\dA-Fa-f_]+|o[0-7_]+|b[01_]+)n?/)){return U("number","number")
}else{if(/\d/.test(a8)){bc.match(/^[\d_]*(?:n|(?:\.[\d_]*)?(?:[eE][+\-]?[\d_]+)?)?/);
return U("number","number")}else{if(a8=="/"){if(bc.eat("*")){ba.tokenize=aV;return aV(bc,ba)
}else{if(bc.eat("/")){bc.skipToEnd();return U("comment","comment")}else{if(a4(bc,ba,1)){L(bc);
bc.match(/^\b(([gimyus])(?![gimyus]*\2))+\b/);return U("regexp","string-2")}else{bc.eat("=");
return U("operator","operator",bc.current())}}}}else{if(a8=="`"){ba.tokenize=aY;return aY(bc,ba)
}else{if(a8=="#"&&bc.peek()=="!"){bc.skipToEnd();return U("meta","meta")}else{if(a8=="#"&&bc.eatWhile(aN)){return U("variable","property")
}else{if(a8=="<"&&bc.match("!--")||(a8=="-"&&bc.match("->")&&!/\S/.test(bc.string.slice(0,bc.start)))){bc.skipToEnd();
return U("comment","comment")}else{if(aa.test(a8)){if(a8!=">"||!ba.lexical||ba.lexical.type!=">"){if(bc.eat("=")){if(a8=="!"||a8=="="){bc.eat("=")
}}else{if(/[<>*+\-|&?]/.test(a8)){bc.eat(a8);if(a8==">"){bc.eat(a8)}}}}if(a8=="?"&&bc.eat(".")){return U(".")
}return U("operator","operator",bc.current())}else{if(aN.test(a8)){bc.eatWhile(aN);
var bb=bc.current();if(ba.lastType!="."){if(aL.propertyIsEnumerable(bb)){var a9=aL[bb];
return U(a9.type,a9.style,bb)}if(bb=="async"&&bc.match(/^(\s|\/\*([^*]|\*(?!\/))*?\*\/)*[\[\(\w]/,false)){return U("async","keyword",bb)
}}return U("variable","variable",bb)}}}}}}}}}}}}}}}function ae(a8){return function(bc,ba){var bb=false,a9;
if(aW&&bc.peek()=="@"&&bc.match(aK)){ba.tokenize=ah;return U("jsonld-keyword","meta")
}while((a9=bc.next())!=null){if(a9==a8&&!bb){break}bb=!bb&&a9=="\\"}if(!bb){ba.tokenize=ah
}return U("string","string")}}function aV(bb,ba){var a8=false,a9;while(a9=bb.next()){if(a9=="/"&&a8){ba.tokenize=ah;
break}a8=(a9=="*")}return U("comment","comment")}function aY(bb,a9){var ba=false,a8;
while((a8=bb.next())!=null){if(!ba&&(a8=="`"||a8=="$"&&bb.eat("{"))){a9.tokenize=ah;
break}ba=!ba&&a8=="\\"}return U("quasi","string-2",bb.current())}var q="([{}])";function aS(bh,ba){if(ba.fatArrowAt){ba.fatArrowAt=null
}var bg=bh.string.indexOf("=>",bh.start);if(bg<0){return}if(h){var bc=/:\s*(?:\w+(?:<[^>]*>|\[\])?|\{[^}]*\})\s*$/.exec(bh.string.slice(bh.start,bg));
if(bc){bg=bc.index}}var bd=0,bb=false;for(var bf=bg-1;bf>=0;--bf){var a8=bh.string.charAt(bf);
var a9=q.indexOf(a8);if(a9>=0&&a9<3){if(!bd){++bf;break}if(--bd==0){if(a8=="("){bb=true
}break}}else{if(a9>=3&&a9<6){++bd}else{if(aN.test(a8)){bb=true}else{if(/["'\/`]/.test(a8)){for(;
;--bf){if(bf==0){return}var be=bh.string.charAt(bf-1);if(be==a8&&bh.string.charAt(bf-2)!="\\"){bf--;
break}}}else{if(bb&&!bd){++bf;break}}}}}}if(bb&&!bd){ba.fatArrowAt=bf}}var b={atom:true,number:true,variable:true,string:true,regexp:true,"this":true,"import":true,"jsonld-keyword":true};
function S(bd,a9,a8,bc,ba,bb){this.indented=bd;this.column=a9;this.type=a8;this.prev=ba;
this.info=bb;if(bc!=null){this.align=bc}}function y(bb,ba){if(!aO){return false}for(var a9=bb.localVars;
a9;a9=a9.next){if(a9.name==ba){return true}}for(var a8=bb.context;a8;a8=a8.prev){for(var a9=a8.vars;
a9;a9=a9.next){if(a9.name==ba){return true}}}}function g(bc,a9,a8,bb,bd){var be=bc.cc;
K.state=bc;K.stream=bd;K.marked=null,K.cc=be;K.style=a9;if(!bc.lexical.hasOwnProperty("align")){bc.lexical.align=true
}while(true){var ba=be.length?be.pop():E?aG:a2;if(ba(a8,bb)){while(be.length&&be[be.length-1].lex){be.pop()()
}if(K.marked){return K.marked}if(a8=="variable"&&y(bc,bb)){return"variable-2"}return a9
}}}var K={state:null,column:null,marked:null,cc:null};function ar(){for(var a8=arguments.length-1;
a8>=0;a8--){K.cc.push(arguments[a8])}}function ax(){ar.apply(null,arguments);return true
}function f(a9,ba){for(var a8=ba;a8;a8=a8.next){if(a8.name==a9){return true}}return false
}function aR(a8){var a9=K.state;K.marked="def";if(!aO){return}if(a9.context){if(a9.lexical.info=="var"&&a9.context&&a9.context.block){var ba=aQ(a8,a9.context);
if(ba!=null){a9.context=ba;return}}else{if(!f(a8,a9.localVars)){a9.localVars=new a3(a8,a9.localVars);
return}}}if(aC.globalVars&&!f(a8,a9.globalVars)){a9.globalVars=new a3(a8,a9.globalVars)
}}function aQ(a9,ba){if(!ba){return null}else{if(ba.block){var a8=aQ(a9,ba.prev);
if(!a8){return null}if(a8==ba.prev){return ba}return new R(a8,ba.vars,true)}else{if(f(a9,ba.vars)){return ba
}else{return new R(ba.prev,new a3(a9,ba.vars),false)}}}}function aD(a8){return a8=="public"||a8=="private"||a8=="protected"||a8=="abstract"||a8=="readonly"
}function R(a8,a9,ba){this.prev=a8;this.vars=a9;this.block=ba}function a3(a8,a9){this.name=a8;
this.next=a9}var w=new a3("this",new a3("arguments",null));function B(){K.state.context=new R(K.state.context,K.state.localVars,false);
K.state.localVars=w}function an(){K.state.context=new R(K.state.context,K.state.localVars,true);
K.state.localVars=null}function C(){K.state.localVars=K.state.context.vars;K.state.context=K.state.context.prev
}C.lex=true;function a0(a9,ba){var a8=function(){var bd=K.state,bb=bd.indented;if(bd.lexical.type=="stat"){bb=bd.lexical.indented
}else{for(var bc=bd.lexical;bc&&bc.type==")"&&bc.align;bc=bc.prev){bb=bc.indented
}}bd.lexical=new S(bb,K.stream.column(),a9,null,bd.lexical,ba)};a8.lex=true;return a8
}function i(){var a8=K.state;if(a8.lexical.prev){if(a8.lexical.type==")"){a8.indented=a8.lexical.indented
}a8.lexical=a8.lexical.prev}}i.lex=true;function x(a8){function a9(ba){if(ba==a8){return ax()
}else{if(a8==";"||ba=="}"||ba==")"||ba=="]"){return ar()}else{return ax(a9)}}}return a9
}function a2(a8,a9){if(a8=="var"){return ax(a0("vardef",a9),c,x(";"),i)}if(a8=="keyword a"){return ax(a0("form"),aH,a2,i)
}if(a8=="keyword b"){return ax(a0("form"),a2,i)}if(a8=="keyword d"){return K.stream.match(/^\s*$/,false)?ax():ax(a0("stat"),aB,x(";"),i)
}if(a8=="debugger"){return ax(x(";"))}if(a8=="{"){return ax(a0("}"),an,D,i,C)}if(a8==";"){return ax()
}if(a8=="if"){if(K.state.lexical.info=="else"&&K.state.cc[K.state.cc.length-1]==i){K.state.cc.pop()()
}return ax(a0("form"),aH,a2,i,d)}if(a8=="function"){return ax(V)}if(a8=="for"){return ax(a0("form"),an,A,a2,C,i)
}if(a8=="class"||(h&&a9=="interface")){K.marked="keyword";return ax(a0("form",a8=="class"?a8:a9),ak,i)
}if(a8=="variable"){if(h&&a9=="declare"){K.marked="keyword";return ax(a2)}else{if(h&&(a9=="module"||a9=="enum"||a9=="type")&&K.stream.match(/^\s*\w/,false)){K.marked="keyword";
if(a9=="enum"){return ax(aP)}else{if(a9=="type"){return ax(aq,x("operator"),k,x(";"))
}else{return ax(a0("form"),j,x("{"),a0("}"),D,i,i)}}}else{if(h&&a9=="namespace"){K.marked="keyword";
return ax(a0("form"),aG,a2,i)}else{if(h&&a9=="abstract"){K.marked="keyword";return ax(a2)
}else{return ax(a0("stat"),a5)}}}}}if(a8=="switch"){return ax(a0("form"),aH,x("{"),a0("}","switch"),an,D,i,i,C)
}if(a8=="case"){return ax(aG,x(":"))}if(a8=="default"){return ax(x(":"))}if(a8=="catch"){return ax(a0("form"),B,Y,a2,i,C)
}if(a8=="export"){return ax(a0("stat"),a1,i)}if(a8=="import"){return ax(a0("stat"),ay,i)
}if(a8=="async"){return ax(a2)}if(a9=="@"){return ax(aG,a2)}return ar(a0("stat"),aG,x(";"),i)
}function Y(a8){if(a8=="("){return ax(aw,x(")"))}}function aG(a8,a9){return ao(a8,a9,false)
}function aZ(a8,a9){return ao(a8,a9,true)}function aH(a8){if(a8!="("){return ar()
}return ax(a0(")"),aB,x(")"),i)}function ao(a9,ba,bc){if(K.state.fatArrowAt==K.stream.start){var a8=bc?W:al;
if(a9=="("){return ax(B,a0(")"),aM(aw,")"),i,x("=>"),a8,C)}else{if(a9=="variable"){return ar(B,j,x("=>"),a8,C)
}}}var bb=bc?l:au;if(b.hasOwnProperty(a9)){return ax(bb)}if(a9=="function"){return ax(V,bb)
}if(a9=="class"||(h&&ba=="interface")){K.marked="keyword";return ax(a0("form"),P,i)
}if(a9=="keyword c"||a9=="async"){return ax(bc?aZ:aG)}if(a9=="("){return ax(a0(")"),aB,x(")"),i,bb)
}if(a9=="operator"||a9=="spread"){return ax(bc?aZ:aG)}if(a9=="["){return ax(a0("]"),r,i,bb)
}if(a9=="{"){return aT(z,"}",null,bb)}if(a9=="quasi"){return ar(ab,bb)}if(a9=="new"){return ax(O(bc))
}return ax()}function aB(a8){if(a8.match(/[;\}\)\],]/)){return ar()}return ar(aG)
}function au(a8,a9){if(a8==","){return ax(aB)}return l(a8,a9,false)}function l(a8,ba,bc){var a9=bc==false?au:l;
var bb=bc==false?aG:aZ;if(a8=="=>"){return ax(B,bc?W:al,C)}if(a8=="operator"){if(/\+\+|--/.test(ba)||h&&ba=="!"){return ax(a9)
}if(h&&ba=="<"&&K.stream.match(/^([^<>]|<[^<>]*>)*>\s*\(/,false)){return ax(a0(">"),aM(k,">"),i,a9)
}if(ba=="?"){return ax(aG,x(":"),bb)}return ax(bb)}if(a8=="quasi"){return ar(ab,a9)
}if(a8==";"){return}if(a8=="("){return aT(aZ,")","call",a9)}if(a8=="."){return ax(aE,a9)
}if(a8=="["){return ax(a0("]"),aB,x("]"),i,a9)}if(h&&ba=="as"){K.marked="keyword";
return ax(k,a9)}if(a8=="regexp"){K.state.lastType=K.marked="operator";K.stream.backUp(K.stream.pos-K.stream.start-1);
return ax(bb)}}function ab(a8,a9){if(a8!="quasi"){return ar()}if(a9.slice(a9.length-2)!="${"){return ax(ab)
}return ax(aG,v)}function v(a8){if(a8=="}"){K.marked="string-2";K.state.tokenize=aY;
return ax(ab)}}function al(a8){aS(K.stream,K.state);return ar(a8=="{"?a2:aG)}function W(a8){aS(K.stream,K.state);
return ar(a8=="{"?a2:aZ)}function O(a8){return function(a9){if(a9=="."){return ax(a8?s:aj)
}else{if(a9=="variable"&&h){return ax(e,a8?l:au)}else{return ar(a8?aZ:aG)}}}}function aj(a8,a9){if(a9=="target"){K.marked="keyword";
return ax(au)}}function s(a8,a9){if(a9=="target"){K.marked="keyword";return ax(l)
}}function a5(a8){if(a8==":"){return ax(i,a2)}return ar(au,x(";"),i)}function aE(a8){if(a8=="variable"){K.marked="property";
return ax()}}function z(a9,ba){if(a9=="async"){K.marked="property";return ax(z)}else{if(a9=="variable"||K.style=="keyword"){K.marked="property";
if(ba=="get"||ba=="set"){return ax(Q)}var a8;if(h&&K.state.fatArrowAt==K.stream.start&&(a8=K.stream.match(/^\s*:\s*/,false))){K.state.fatArrowAt=K.stream.pos+a8[0].length
}return ax(T)}else{if(a9=="number"||a9=="string"){K.marked=aW?"property":(K.style+" property");
return ax(T)}else{if(a9=="jsonld-keyword"){return ax(T)}else{if(h&&aD(ba)){K.marked="keyword";
return ax(z)}else{if(a9=="["){return ax(aG,ag,x("]"),T)}else{if(a9=="spread"){return ax(aZ,T)
}else{if(ba=="*"){K.marked="keyword";return ax(z)}else{if(a9==":"){return ar(T)}}}}}}}}}}function Q(a8){if(a8!="variable"){return ar(T)
}K.marked="property";return ax(V)}function T(a8){if(a8==":"){return ax(aZ)}if(a8=="("){return ar(V)
}}function aM(bb,a8,a9){function ba(bd,be){if(a9?a9.indexOf(bd)>-1:bd==","){var bc=K.state.lexical;
if(bc.info=="call"){bc.pos=(bc.pos||0)+1}return ax(function(bf,bg){if(bf==a8||bg==a8){return ar()
}return ar(bb)},ba)}if(bd==a8||be==a8){return ax()}if(a9&&a9.indexOf(";")>-1){return ar(bb)
}return ax(x(a8))}return function(bc,bd){if(bc==a8||bd==a8){return ax()}return ar(bb,ba)
}}function aT(bb,a8,ba){for(var a9=3;a9<arguments.length;a9++){K.cc.push(arguments[a9])
}return ax(a0(a8,ba),aM(bb,a8),i)}function D(a8){if(a8=="}"){return ax()}return ar(a2,D)
}function ag(a8,a9){if(h){if(a8==":"){return ax(k)}if(a9=="?"){return ax(ag)}}}function F(a8,a9){if(h&&(a8==":"||a9=="in")){return ax(k)
}}function X(a8){if(h&&a8==":"){if(K.stream.match(/^\s*\w+\s+is\b/,false)){return ax(aG,ac,k)
}else{return ax(k)}}}function ac(a8,a9){if(a9=="is"){K.marked="keyword";return ax()
}}function k(a8,a9){if(a9=="keyof"||a9=="typeof"||a9=="infer"||a9=="readonly"){K.marked="keyword";
return ax(a9=="typeof"?aZ:k)}if(a8=="variable"||a9=="void"){K.marked="type";return ax(N)
}if(a9=="|"||a9=="&"){return ax(k)}if(a8=="string"||a8=="number"||a8=="atom"){return ax(N)
}if(a8=="["){return ax(a0("]"),aM(k,"]",","),i,N)}if(a8=="{"){return ax(a0("}"),u,i,N)
}if(a8=="("){return ax(aM(at,")"),ad,N)}if(a8=="<"){return ax(aM(k,">"),k)}}function ad(a8){if(a8=="=>"){return ax(k)
}}function u(a8){if(a8.match(/[\}\)\]]/)){return ax()}if(a8==","||a8==";"){return ax(u)
}return ar(aF,u)}function aF(a8,a9){if(a8=="variable"||K.style=="keyword"){K.marked="property";
return ax(aF)}else{if(a9=="?"||a8=="number"||a8=="string"){return ax(aF)}else{if(a8==":"){return ax(k)
}else{if(a8=="["){return ax(x("variable"),F,x("]"),aF)}else{if(a8=="("){return ar(a7,aF)
}else{if(!a8.match(/[;\}\)\],]/)){return ax()}}}}}}}function at(a8,a9){if(a8=="variable"&&K.stream.match(/^\s*[?:]/,false)||a9=="?"){return ax(at)
}if(a8==":"){return ax(k)}if(a8=="spread"){return ax(at)}return ar(k)}function N(a8,a9){if(a9=="<"){return ax(a0(">"),aM(k,">"),i,N)
}if(a9=="|"||a8=="."||a9=="&"){return ax(k)}if(a8=="["){return ax(k,x("]"),N)}if(a9=="extends"||a9=="implements"){K.marked="keyword";
return ax(k)}if(a9=="?"){return ax(k,x(":"),k)}}function e(a8,a9){if(a9=="<"){return ax(a0(">"),aM(k,">"),i,N)
}}function o(){return ar(k,ai)}function ai(a8,a9){if(a9=="="){return ax(k)}}function c(a8,a9){if(a9=="enum"){K.marked="keyword";
return ax(aP)}return ar(j,ag,av,am)}function j(a8,a9){if(h&&aD(a9)){K.marked="keyword";
return ax(j)}if(a8=="variable"){aR(a9);return ax()}if(a8=="spread"){return ax(j)}if(a8=="["){return aT(G,"]")
}if(a8=="{"){return aT(aX,"}")}}function aX(a8,a9){if(a8=="variable"&&!K.stream.match(/^\s*:/,false)){aR(a9);
return ax(av)}if(a8=="variable"){K.marked="property"}if(a8=="spread"){return ax(j)
}if(a8=="}"){return ar()}if(a8=="["){return ax(aG,x("]"),x(":"),aX)}return ax(x(":"),j,av)
}function G(){return ar(j,av)}function av(a8,a9){if(a9=="="){return ax(aZ)}}function am(a8){if(a8==","){return ax(c)
}}function d(a8,a9){if(a8=="keyword b"&&a9=="else"){return ax(a0("form","else"),a2,i)
}}function A(a8,a9){if(a9=="await"){return ax(A)}if(a8=="("){return ax(a0(")"),J,i)
}}function J(a8){if(a8=="var"){return ax(c,I)}if(a8=="variable"){return ax(I)}return ar(I)
}function I(a8,a9){if(a8==")"){return ax()}if(a8==";"){return ax(I)}if(a9=="in"||a9=="of"){K.marked="keyword";
return ax(aG,I)}return ar(aG,I)}function V(a8,a9){if(a9=="*"){K.marked="keyword";
return ax(V)}if(a8=="variable"){aR(a9);return ax(V)}if(a8=="("){return ax(B,a0(")"),aM(aw,")"),i,X,a2,C)
}if(h&&a9=="<"){return ax(a0(">"),aM(o,">"),i,V)}}function a7(a8,a9){if(a9=="*"){K.marked="keyword";
return ax(a7)}if(a8=="variable"){aR(a9);return ax(a7)}if(a8=="("){return ax(B,a0(")"),aM(aw,")"),i,X,C)
}if(h&&a9=="<"){return ax(a0(">"),aM(o,">"),i,a7)}}function aq(a8,a9){if(a8=="keyword"||a8=="variable"){K.marked="type";
return ax(aq)}else{if(a9=="<"){return ax(a0(">"),aM(o,">"),i)}}}function aw(a8,a9){if(a9=="@"){ax(aG,aw)
}if(a8=="spread"){return ax(aw)}if(h&&aD(a9)){K.marked="keyword";return ax(aw)}if(h&&a8=="this"){return ax(ag,av)
}return ar(j,ag,av)}function P(a8,a9){if(a8=="variable"){return ak(a8,a9)}return Z(a8,a9)
}function ak(a8,a9){if(a8=="variable"){aR(a9);return ax(Z)}}function Z(a8,a9){if(a9=="<"){return ax(a0(">"),aM(o,">"),i,Z)
}if(a9=="extends"||a9=="implements"||(h&&a8==",")){if(a9=="implements"){K.marked="keyword"
}return ax(h?k:aG,Z)}if(a8=="{"){return ax(a0("}"),t,i)}}function t(a8,a9){if(a8=="async"||(a8=="variable"&&(a9=="static"||a9=="get"||a9=="set"||(h&&aD(a9)))&&K.stream.match(/^\s+[\w$\xa1-\uffff]/,false))){K.marked="keyword";
return ax(t)}if(a8=="variable"||K.style=="keyword"){K.marked="property";return ax(a6,t)
}if(a8=="number"||a8=="string"){return ax(a6,t)}if(a8=="["){return ax(aG,ag,x("]"),a6,t)
}if(a9=="*"){K.marked="keyword";return ax(t)}if(h&&a8=="("){return ar(a7,t)}if(a8==";"||a8==","){return ax(t)
}if(a8=="}"){return ax()}if(a9=="@"){return ax(aG,t)}}function a6(a9,bb){if(bb=="?"){return ax(a6)
}if(a9==":"){return ax(k,av)}if(bb=="="){return ax(aZ)}var a8=K.state.lexical.prev,ba=a8&&a8.info=="interface";
return ar(ba?a7:V)}function a1(a8,a9){if(a9=="*"){K.marked="keyword";return ax(aA,x(";"))
}if(a9=="default"){K.marked="keyword";return ax(aG,x(";"))}if(a8=="{"){return ax(aM(az,"}"),aA,x(";"))
}return ar(a2)}function az(a8,a9){if(a9=="as"){K.marked="keyword";return ax(x("variable"))
}if(a8=="variable"){return ar(aZ,az)}}function ay(a8){if(a8=="string"){return ax()
}if(a8=="("){return ar(aG)}if(a8=="."){return ar(au)}return ar(aJ,n,aA)}function aJ(a8,a9){if(a8=="{"){return aT(aJ,"}")
}if(a8=="variable"){aR(a9)}if(a9=="*"){K.marked="keyword"}return ax(m)}function n(a8){if(a8==","){return ax(aJ,n)
}}function m(a8,a9){if(a9=="as"){K.marked="keyword";return ax(aJ)}}function aA(a8,a9){if(a9=="from"){K.marked="keyword";
return ax(aG)}}function r(a8){if(a8=="]"){return ax()}return ar(aM(aZ,"]"))}function aP(){return ar(a0("form"),j,x("{"),a0("}"),aM(aU,"}"),i,i)
}function aU(){return ar(j,av)}function aI(a9,a8){return a9.lastType=="operator"||a9.lastType==","||aa.test(a8.charAt(0))||/[,.]/.test(a8.charAt(0))
}function a4(ba,a9,a8){return a9.tokenize==ah&&/^(?:operator|sof|keyword [bcd]|case|new|export|default|spread|[\[{}\(,;:]|=>)$/.test(a9.lastType)||(a9.lastType=="quasi"&&/\{\s*$/.test(ba.string.slice(0,ba.pos-(a8||0))))
}return{startState:function(a9){var a8={tokenize:ah,lastType:"sof",cc:[],lexical:new S((a9||0)-p,0,"block",false),localVars:aC.localVars,context:aC.localVars&&new R(null,null,false),indented:a9||0};
if(aC.globalVars&&typeof aC.globalVars=="object"){a8.globalVars=aC.globalVars}return a8
},token:function(ba,a9){if(ba.sol()){if(!a9.lexical.hasOwnProperty("align")){a9.lexical.align=false
}a9.indented=ba.indentation();aS(ba,a9)}if(a9.tokenize!=aV&&ba.eatSpace()){return null
}var a8=a9.tokenize(ba,a9);if(af=="comment"){return a8}a9.lastType=af=="operator"&&(M=="++"||M=="--")?"incdec":af;
return g(a9,a8,af,M,ba)},indent:function(a8,bb){if(a8.tokenize==aV||a8.tokenize==aY){return a.Pass
}if(a8.tokenize!=ah){return 0}var bf=bb&&bb.charAt(0),bg=a8.lexical,be;if(!/^\s*else\b/.test(bb)){for(var ba=a8.cc.length-1;
ba>=0;--ba){var bc=a8.cc[ba];if(bc==i){bg=bg.prev}else{if(bc!=d&&bc!=C){break}}}}while((bg.type=="stat"||bg.type=="form")&&(bf=="}"||((be=a8.cc[a8.cc.length-1])&&(be==au||be==l)&&!/^[,\.=+\-*:?[\(]/.test(bb)))){bg=bg.prev
}if(H&&bg.type==")"&&bg.prev.type=="stat"){bg=bg.prev}var bd=bg.type,a9=bf==bd;if(bd=="vardef"){return bg.indented+(a8.lastType=="operator"||a8.lastType==","?bg.info.length+1:0)
}else{if(bd=="form"&&bf=="{"){return bg.indented}else{if(bd=="form"){return bg.indented+p
}else{if(bd=="stat"){return bg.indented+(aI(a8,bb)?H||p:0)}else{if(bg.info=="switch"&&!a9&&aC.doubleIndentSwitch!=false){return bg.indented+(/^(?:case|default)\b/.test(bb)?p:2*p)
}else{if(bg.align){return bg.column+(a9?0:1)}else{return bg.indented+(a9?0:p)}}}}}}},electricInput:/^\s*(?:case .*?:|default:|\{|\})$/,blockCommentStart:E?null:"/*",blockCommentEnd:E?null:"*/",blockCommentContinue:E?null:" * ",lineComment:E?null:"//",fold:"brace",closeBrackets:"()[]{}''\"\"``",helperType:E?"json":"javascript",jsonldMode:aW,jsonMode:E,expressionAllowed:a4,skipExpression:function(a8){var a9=a8.cc[a8.cc.length-1];
if(a9==aG||a9==aZ){a8.cc.pop()}}}});a.registerHelper("wordChars","javascript",/[\w$]/);
a.defineMIME("text/javascript","javascript");a.defineMIME("text/ecmascript","javascript");
a.defineMIME("application/javascript","javascript");a.defineMIME("application/x-javascript","javascript");
a.defineMIME("application/ecmascript","javascript");a.defineMIME("application/json",{name:"javascript",json:true});
a.defineMIME("application/x-json",{name:"javascript",json:true});a.defineMIME("application/manifest+json",{name:"javascript",json:true});
a.defineMIME("application/ld+json",{name:"javascript",jsonld:true});a.defineMIME("text/typescript",{name:"javascript",typescript:true});
a.defineMIME("application/typescript",{name:"javascript",typescript:true})});