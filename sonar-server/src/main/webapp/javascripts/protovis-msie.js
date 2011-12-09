/*!
 * Protovis MSIE/VML addon
 * Copyright (C) 2011 by DataMarket <http://datamarket.com>
 * Dual licensed under the terms of the MIT or GPL Version 2 software licenses.
 * 
 * This software includes code from jQuery, http://jquery.com/
 * jQuery is licensed under the MIT or GPL Version 2 license.
 * 
 * This software includes code from the Protovis, http://mbostock.github.com/protovis/
 * Protovis is licensed under the BSD license.
 *
 * https://github.com/DataMarket/protovis-msie
 * Commit 46167da505a53d0930b007da00d0759c69b1ed99
 * 
 */
pv.have_SVG=!!document.createElementNS&&!!document.createElementNS("http://www.w3.org/2000/svg","svg").createSVGRect,pv.have_VML=function(a,b,c){return b=a.createElement("div"),b.innerHTML='<v:shape adj="1" />',c=b.firstChild,c.style.behavior="url(#default#VML)",c?typeof c.adj=="object":!0}(document),Array.prototype.indexOf||(Array.prototype.indexOf=function(a,b){var c=this.length>>>0,d=!isFinite(b)||b<0?0:b>this.length?this.length:b;for(;d<c;d++)if(this[d]===a)return d;return-1}),!pv.have_SVG&&pv.have_VML&&function(){typeof Date.now!="function"&&(Date.now=function(){return new Date*1});var a={round:function(a){return Math.round(a*21.6)},styles:null,pre:"<v:",post:' class="msvml">',block:{group:1,shape:1,shapetype:1,line:1,polyline:1,curve:1,rect:1,roundrect:1,oval:1,arc:1,image:1},ends:{butt:"flat",round:"round",square:"square",flat:"flat"},joins:{bevel:"bevel",round:"round",miter:"miter"},cursorstyles:{hand:"pointer",crosshair:1,pointer:1,move:1,text:1,wait:1,help:1,progress:1,"n-resize":1,"ne-resize":1,"nw-resize":1,"s-resize":1,"se-resize":1,"sw-resize":1,"e-resize":1,"w-resize":1},text_shim:null,_textcache:{},text_dims:function(b,c){c in a._textcache||(a._textcache[c]={});if(b in a._textcache[c])return a._textcache[c][b];var d=a.text_shim;return d.style.font=c,d.innerText=b,a._textcache[c][b]={fontsize:parseInt(d.style.fontSize,10),height:d.offsetHeight,width:d.offsetWidth}},d2r:Math.PI*2/360,get_dim:function(a,b){var c=b||{};c.translate_x=0,c.translate_y=0;if(a.transform){var d=/translate\((\d+(?:\.\d+)?)(?:,(\d+(?:\.\d+)?))?\)/.exec(a.transform);d&&d[1]&&(c.translate_x=parseFloat(d[1])),d&&d[2]&&(c.translate_y=parseFloat(d[2]));var e=/rotate\((\d+\.\d+|\d+)\)/.exec(a.transform);e&&(c.rotation=parseFloat(e[1])%360)}return c.x=parseFloat(a.x||0),c.y=parseFloat(a.y||0),"width"in a&&(c.width=parseInt(a.width,10)),"height"in a&&(c.height=parseInt(a.height,10)),c},elm_defaults:{g:{rewrite:"span",attr:function(b,c,d){var e=a.get_dim(b);d.style.cssText="position:absolute;zoom:1;left:"+(e.translate_x+e.x)+"px;top:"+(e.translate_y+e.y)+"px;"}},line:{rewrite:"shape",attr:function(b,c,d){var e=parseFloat(b.x1||0),f=parseFloat(b.y1||0),g=parseFloat(b.x2||0),h=parseFloat(b.y2||0),i=a.round;d.coordorigin="0,0",d.coordsize="21600,21600",a.path(d).v="M "+i(e)+" "+i(f)+" L "+i(g)+" "+i(h)+" E",a.stroke(d,b)},css:"top:0px;left:0px;width:1000px;height:1000px"},rect:{rewrite:"shape",attr:function(b,c,d){var e=a.get_dim(b),f=a.path(d),g=a.round;d.coordorigin="0,0",d.coordsize="21600,21600";var h=g(e.translate_x+e.x),i=g(e.translate_y+e.y),j=g(e.width),k=g(e.height);f.v="M "+h+" "+i+" L "+(h+j)+" "+i+" L "+(h+j)+" "+(i+k)+" L "+h+" "+(i+k)+" x",a.stroke(d,b),a.fill(d,b)},css:"top:0px;left:0px;width:1000px;height:1000px"},path:{rewrite:"shape",attr:function(b,c,d){var e=a.get_dim(b),f=d.style;f.left=e.translate_x+e.x+"px",f.top=e.translate_y+e.y+"px",d.coordorigin="0,0",d.coordsize="21600,21600",a.path(d,b.d),a.fill(d,b),a.stroke(d,b)},css:"top:0px;left:0px;width:1000px;height:1000px"},circle:{rewrite:"oval",attr:function(b,c,d){var e=a.get_dim(b),f=d.style,g=parseFloat(b.cx||0)+.7,h=parseFloat(b.cy||0)+.7,i=parseFloat(b.r||0)+.5;f.top=e.translate_y+h-i+"px",f.left=e.translate_x+g-i+"px",f.width=i*2+"px",f.height=i*2+"px",a.fill(d,b),a.stroke(d,b)}},text:{rewrite:"span"},svg:{rewrite:"span",css:"position:relative;overflow:hidden;display:inline-block;~display:block;"},"vml:path":{rewrite:"path"},"vml:stroke":{rewrite:"stroke"},"vml:fill":{rewrite:"fill"}},_elmcache:{span:document.createElement("span"),div:document.createElement("div")},createElement:function(b,c){var d,e=a._elmcache,f=a.elm_defaults[b]||{},g=f.rewrite||b;return g in e?d=e[g].cloneNode(!1):(e[g]=document.createElement(a.pre+g+a.post),g in a.block&&(e[g].className+=" msvml_block"),d=e[g].cloneNode(!1)),f.css&&(d.style.cssText=f.css),d},_hex:pv.range(0,256).map(function(a){return pv.Format.pad("0",2,a.toString(16))}),_colorcache:{},color:function(b,c){return!(b in a._colorcache)&&(c=/^rgb\((\d+),(\d+),(\d+)\)$/i.exec(b))&&(a._colorcache[b]="#"+a._hex[c[1]]+a._hex[c[2]]+a._hex[c[3]]),a._colorcache[b]||b},fill:function(b,c){var d=b.getElementsByTagName("fill")[0];d||(d=b.appendChild(a.createElement("vml:fill"))),!c.fill||c.fill==="none"?d.on=!1:(d.on="true",d.color=a.color(c.fill),d.opacity=parseFloat(c["fill-opacity"]||"1")||"1")},stroke:function(b,c){var d=b.getElementsByTagName("stroke")[0];d||(d=b.appendChild(a.createElement("vml:stroke"))),!c.stroke||c.stroke==="none"?(d.on="false",d.weight="0"):(d.on="true",d.weight=parseFloat(c["stroke-width"]||"1")/1.25,d.color=a.color(c.stroke)||"black",d.opacity=parseFloat(c["stroke-opacity"]||"1")||"1",d.joinstyle=a.joins[c["stroke-linejoin"]]||"miter")},path:function(b,c){var d=b.getElementsByTagName("path")[0];return d||(d=b.appendChild(a.createElement("vml:path"))),arguments.length>1&&(d.v=a.rewritePath(c)),d},init:function(){a.text_shim||(a.text_shim=document.getElementById("pv_vml_text_shim")||document.createElement("span"),a.text_shim.id="protovisvml_text_shim",a.text_shim.style.cssText="position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline-block;white-space:nowrap;",document.body.appendChild(a.text_shim));if(!a.styles){a.styles=document.getElementById("protovisvml_styles")||document.createElement("style"),a.styles.id!=="protovisvml_styles"&&(a.styles.id="protovisvml_styles",document.documentElement.firstChild.appendChild(a.styles),a.styles.styleSheet.addRule(".msvml","behavior:url(#default#VML);"),a.styles.styleSheet.addRule(".msvml_block","position:absolute;top:0;left:0;"));try{document.namespaces.v||document.namespaces.add("v","urn:schemas-microsoft-com:vml")}catch(b){a.pre="<",a.post=' class="msvml" xmlns="urn:schemas-microsoft.com:vml">'}}},_pathcache:{},rewritePath:function(b,c){var d=0,e=0,f=a.round;if(!b)return b;if(b in a._pathcache)return a._pathcache[b];b=b.replace(/(\d*)((\.*\d*)(e ?-?\d*))/g,"$1");var g=b.match(/([MLHVCSQTAZ][^MLHVCSQTAZ]*)/gi),h=[],i=[];for(var j=0,k=g.length;j<k;j++){var l=g[j],m=l.charAt(0),n=l.substring(1).split(/[, ]/);switch(m){case"M":m="m",d=f(n[0]),e=f(n[1]),n=[d,e];break;case"m":m="m",d+=f(n[0]),e+=f(n[1]),n=[d,e];break;case"A":m="l",n=[d=f(n[5]),e=f(n[6])];break;case"L":m="l",n=[d=f(n[0]),e=f(n[1])];break;case"l":m="l",n=[d=d+f(n[0]),e=e+f(n[1])];break;case"H":m="l",n=[d=f(n[0]),e];break;case"h":m="l",n=[d=d+f(n[0]),e];break;case"V":m="l",n=[d,e=f(n[0])];break;case"v":m="l",n=[d,e=e+f(n[0])];break;case"C":m="c",i=n=[f(n[0]),f(n[1]),f(n[2]),f(n[3]),d=f(n[4]),e=f(n[5])];break;case"c":m="c",i=n=[d+f(n[0]),e+f(n[1]),d+f(n[2]),e+f(n[3]),d=d+f(n[4]),e=e+f(n[5])];break;case"S":m="c",i=n=[i[4]+(i[4]-i[2]),i[5]+(i[5]-i[3]),f(n[0]),f(n[1]),d=f(n[2]),e=f(n[3])];break;case"s":m="c",i=n=[i[4]+(i[4]-i[2]),i[5]+(i[5]-i[3]),d+f(n[0]),e+f(n[1]),d=d+f(n[2]),e=e+f(n[3])];break;case"Q":m="c";var o=f(n[0]),p=f(n[1]),q=f(n[2]),r=f(n[3]);n=[~~(d+(o-d)*2/3),~~(e+(p-e)*2/3),~~(o+(q-o)/3),~~(p+(r-p)/3),d=q,e=r];break;case"q":m="l",d+=f(n[2]),e+=f(n[3]),n=[d,e];break;case"Z":case"z":m="xe",n=[];break;default:m="",n=[]}h.push(m,n.join(","))}return a._pathcache[b]=h.join("")+"e"}};pv.VmlScene={scale:1,events:["mousewheel","mousedown","mouseup","mouseover","mouseout","mousemove","click","dblclick"],implicit:{css:{}},copy_functions:function(a){for(var b in a)typeof a[b]=="function"&&!(b in pv.VmlScene)&&(pv.VmlScene[b]=a[b])}},pv.VmlScene.copy_functions(pv.SvgScene),pv.Scene=pv.VmlScene,pv.VmlScene.expect=function(b,c,d,e){e=e||{};var f=a.elm_defaults[c]||{},g=f.rewrite||c;if(b){if(b.tagName.toUpperCase()!==g.toUpperCase()){var h=a.createElement(c);b.parentNode.replaceChild(h,b),b=h}}else b=a.createElement(c);"attr"in f&&f.attr(d,e,b);if(d.cursor in a.cursorstyles){var i=a.cursorstyles[d.cursor];e.cursor=i===1?d.cursor:i}for(var j in e){var k=e[j];k==null?b.style.removeAttribute(j):b.style[j]=k}return b},pv.VmlScene.append=function(a,b,c){return a.$scene={scenes:b,index:c},a=this.title(a,b[c]),(!a.parentNode||a.parentNode.nodeType===11)&&b.$g.appendChild(a),a.nextSibling},pv.VmlScene.title=function(a,b){return a.title=b.title||"",a},pv.VmlScene.panel=function(b){var c=b.$g,d=c&&c.firstChild;for(var e=0;e<b.length;e++){var f=b[e];if(!f.visible)continue;if(!b.parent){f.canvas.style.display="inline-block",f.canvas.style.zoom=1,c&&c.parentNode!=f.canvas&&(c=f.canvas.firstChild,d=c&&c.firstChild);if(!c){a.init(),c=f.canvas.appendChild(a.createElement("svg"));for(var g=0;g<this.events.length;g++)c.addEventListener?c.addEventListener(this.events[g],this.dispatch,!1):c.attachEvent("on"+this.events[g],this.dispatch);d=c.firstChild}b.$g=c;var h=f.width+f.left+f.right,i=f.height+f.top+f.bottom;c.style.width=h+"px",c.style.height=i+"px",c.style.clip="rect(0px "+h+"px "+i+"px 0px)"}d=this.fill(d,b,e);var j=this.scale,k=f.transform,l=f.left+k.x,m=f.top+k.y;this.scale*=k.k;for(var g=0;g<f.children.length;g++){f.children[g].$g=d=this.expect(d,"g",{transform:"translate("+l+","+m+")"+(k.k!=1?" scale("+k.k+")":"")}),this.updateAll(f.children[g]);if(!d.parentNode||d.parentNode.nodeType===11){c.appendChild(d);var n=a.elm_defaults[d.svgtype];n&&typeof n.onappend=="function"&&n.onappend(d,b[e])}d=d.nextSibling}this.scale=j,d=this.stroke(d,b,e)}return d},pv.VmlScene.fill=function(b,c,d){var e=c[d],f=e.fillStyle;if(f.opacity||e.events=="all")b=this.expect(b,"div",{},{cursor:e.cursor,left:e.left,top:e.top,width:e.width,height:e.height,border:"none",background:a.color(f.color),position:"absolute"}),b=this.append(b,c,d);return b},pv.VmlScene.stroke=function(b,c,d){var e=c[d],f=e.strokeStyle;if(f.opacity||e.events=="all"){var g=Math.round(e.lineWidth/this.scale);b=this.expect(b,"div",{},{cursor:e.cursor,left:e.left-g/2,top:e.top-g/2,width:Math.max(1e-10,e.width)-g,height:Math.max(1e-10,e.height)-g,border:g+"px solid "+a.color(f.color),"z-index":1e3,position:"absolute"}),b=this.append(b,c,d)}return b},function(){function e(a){if(a&&a.type){this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=c;if(a.defaultPrevented||a.returnValue===!1||a.getPreventDefault&&a.getPreventDefault())this.isDefaultPrevented=b}else this.type=a;this.timeStamp=Date.now()}var b=function(){return!0},c=function(){return!1},d=["altKey","attrChange","attrName","bubbles","button","cancelable","charCode","clientX","clientY","ctrlKey","currentTarget","data","detail","eventPhase","fromElement","handler","keyCode","layerX","layerY","metaKey","newValue","offsetX","offsetY","pageX","pageY","prevValue","relatedNode","relatedTarget","screenX","screenY","shiftKey","srcElement","target","toElement","view","wheelDelta","which"];e.prototype={preventDefault:function(){this.isDefaultPrevented=b;var a=this.originalEvent;if(!a)return;a.preventDefault?a.preventDefault():a.returnValue=!1},stopPropagation:function(){this.isPropagationStopped=b;var a=this.originalEvent;if(!a)return;a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=b,this.stopPropagation()},isDefaultPrevented:c,isPropagationStopped:c,isImmediatePropagationStopped:c},a.fixEvent=function(a){var b=a;a=new e(b);for(var c=0,f=d.length;c<f;c++){var g=d[c];a[g]=b[g]}a.target||(a.target=a.srcElement||document),!a.relatedTarget&&a.fromElement&&(a.relatedTarget=a.fromElement===a.target?a.toElement:a.fromElement);if(a.pageX==null&&a.clientX!=null){var h=document.documentElement,i=document.body;a.pageX=a.clientX+(h&&h.scrollLeft||i&&i.scrollLeft||0)-(h&&h.clientLeft||i&&i.clientLeft||0),a.pageY=a.clientY+(h&&h.scrollTop||i&&i.scrollTop||0)-(h&&h.clientTop||i&&i.clientTop||0)}return a.which==null&&(a.charCode!=null||a.keyCode!=null)&&(a.which=a.charCode!=null?a.charCode:a.keyCode),!a.metaKey&&a.ctrlKey&&(a.metaKey=a.ctrlKey),!a.which&&a.button!==undefined&&(a.which=a.button&1?1:a.button&2?3:a.button&4?2:0),a.type==="mousewheel"&&(a.wheel=a.wheelDelta),a}}(),pv.listener=function(b,c){return b.$listener||(b.$listener=function(c){try{return pv.event=a.fixEvent(c||window.event),b.call(this,pv.event)}catch(c){pv.error(c)}finally{delete pv.event}})},pv.listen=function(a,b,c){return c=pv.listener(c,a),a===window&&(a=document.documentElement),a.addEventListener?a.addEventListener(b,c,!1):a.attachEvent("on"+b,c)},pv.VmlScene.dispatch=pv.listener(function(a){var b=a.target.$scene;b&&pv.Mark.dispatch(a.type,b.scenes,b.index)&&a.preventDefault()}),pv.VmlScene.image=function(a){var b=a.$g.firstChild;for(var c=0;c<a.length;c++){var d=a[c];if(!d.visible)continue;b=this.fill(b,a,c);if(!d.image){b=new Image,b.src=d.url;var e=b.style;e.position="absolute",e.top=d.top,e.left=d.left,e.width=d.width,e.height=d.height,e.cursor=d.cursor,e.msInterpolationMode="bicubic"}b=this.append(b,a,c),b=this.stroke(b,a,c)}return b},pv.VmlScene.label=function(b){var c=b.$g.firstChild,d=Math.round;for(var e=0;e<b.length;e++){var f=b[e];if(!f.visible)continue;var g=f.textStyle;if(!g.opacity||!f.text)continue;var h={};f.cursor&&(h.cursor=f.cursor);var i=f.text.replace(/\s+/g," "),j=a.text_dims(i,f.font),k=0,l=0;f.textBaseline==="middle"?l-=j.fontsize/2:f.textBaseline==="top"?l+=f.textMargin:f.textBaseline==="bottom"&&(l-=f.textMargin+j.fontsize),f.textAlign==="center"?k-=j.width/2:f.textAlign==="right"?k-=j.width+f.textMargin:f.textAlign==="left"&&(k+=f.textMargin),c=this.expect(c,"text",h,{font:f.font,textDecoration:f.textDecoration,top:Math.round(f.top+l)+"px",left:Math.round(f.left+k)+"px",position:"absolute",display:"block",lineHeight:1,whiteSpace:"nowrap",zoom:1,cursor:"default",color:a.color(g.color)||"black"}),c.innerText=i;var m=180*f.textAngle/Math.PI;if(m){var n=~~m%360*a.d2r,o=Math.cos(n),p=Math.sin(n);c.style.filter=["progid:DXImageTransform.Microsoft.Matrix(","M11=",o.toFixed(8),",","M12=",-p.toFixed(8),",","M21=",p.toFixed(8),",","M22=",o.toFixed(8),",sizingMethod='auto expand')\";"].join("")}else c.style.filter="";c=this.append(c,b,e)}return c},pv.VmlScene.wedge=function(b){var c=b.$g.firstChild,d=a.round;for(var e=0;e<b.length;e++){var f=b[e];if(!f.visible)continue;var g=f.fillStyle,h=f.strokeStyle;if(!g.opacity&&!h.opacity)continue;c=this.expect(c,"path",{"pointer-events":f.events,cursor:f.cursor,transform:"translate("+f.left+","+f.top+")",d:"",fill:g.color,"fill-rule":"evenodd","fill-opacity":g.opacity||null,stroke:h.color,"stroke-opacity":h.opacity||null,"stroke-width":h.opacity?f.lineWidth/this.scale:null});var i=c.getElementsByTagName("path")[0];i||(i=a.make("path"),c.appendChild(i));var j=d(f.innerRadius),k=d(f.outerRadius),l;if(f.angle>=2*Math.PI)j?l="AE0,0 "+k+","+k+" 0 23592960"+"AL0,0 "+j+","+j+" 0 23592960":l="AE0,0 "+k+","+k+" 0 23592960";else{var m=Math.round(f.startAngle/Math.PI*11796480),n=Math.round(f.angle/Math.PI*11796480);j?l="AE 0,0 "+k+","+k+" "+ -m+" "+ -n+" 0,0 "+j+","+j+" "+ -(m+n)+" "+n+"X":l="M0,0AE0,0 "+k+","+k+" "+ -m+" "+ -n+"X"}i.v=l,c=this.append(c,b,e)}return c}}()