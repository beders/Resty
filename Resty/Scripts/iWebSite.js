//
//  iWeb - iWebSite.js
//  Copyright (c) 2007-2008 Apple Inc. All rights reserved.
//
//
//  This file includes a copy of the Prototype JavaScript framework:
//

var Prototype={Version:'1.6.0',Browser:{IE:!!(window.attachEvent&&!window.opera),Opera:!!window.opera,WebKit:navigator.userAgent.indexOf('AppleWebKit/')>-1,Gecko:navigator.userAgent.indexOf('Gecko')>-1&&navigator.userAgent.indexOf('KHTML')==-1,MobileSafari:!!navigator.userAgent.match(/Apple.*Mobile.*Safari/)},BrowserFeatures:{XPath:!!document.evaluate,ElementExtensions:!!window.HTMLElement,SpecificElementExtensions:document.createElement('div').__proto__&&document.createElement('div').__proto__!==document.createElement('form').__proto__},ScriptFragment:'<script[^>]*>([\\S\\s]*?)<\/script>',JSONFilter:/^\/\*-secure-([\s\S]*)\*\/\s*$/,emptyFunction:function(){},K:function(x){return x}};if(Prototype.Browser.MobileSafari)
Prototype.BrowserFeatures.SpecificElementExtensions=false;if(Prototype.Browser.WebKit)
Prototype.BrowserFeatures.XPath=false;var Class={create:function(){var parent=null,properties=$A(arguments);if(Object.isFunction(properties[0]))
parent=properties.shift();function klass(){this.initialize.apply(this,arguments);}
Object.extend(klass,Class.Methods);klass.superclass=parent;klass.subclasses=[];if(parent){var subclass=function(){};subclass.prototype=parent.prototype;klass.prototype=new subclass;parent.subclasses.push(klass);}
for(var i=0;i<properties.length;i++)
klass.addMethods(properties[i]);if(!klass.prototype.initialize)
klass.prototype.initialize=Prototype.emptyFunction;klass.prototype.constructor=klass;return klass;}};Class.Methods={addMethods:function(source){var ancestor=this.superclass&&this.superclass.prototype;var properties=Object.keys(source);if(!Object.keys({toString:true}).length)
properties.push("toString","valueOf");for(var i=0,length=properties.length;i<length;i++){var property=properties[i],value=source[property];if(ancestor&&Object.isFunction(value)&&value.argumentNames().first()=="$super"){var method=value,value=Object.extend((function(m){return function(){return ancestor[m].apply(this,arguments)};})(property).wrap(method),{valueOf:function(){return method},toString:function(){return method.toString()}});}
this.prototype[property]=value;}
return this;}};var Abstract={};Object.extend=function(destination,source){for(var property in source)
destination[property]=source[property];return destination;};Object.extend(Object,{inspect:function(object){try{if(object===undefined)return'undefined';if(object===null)return'null';return object.inspect?object.inspect():object.toString();}catch(e){if(e instanceof RangeError)return'...';throw e;}},toJSON:function(object){var type=typeof object;switch(type){case'undefined':case'function':case'unknown':return;case'boolean':return object.toString();}
if(object===null)return'null';if(object.toJSON)return object.toJSON();if(Object.isElement(object))return;var results=[];for(var property in object){var value=Object.toJSON(object[property]);if(value!==undefined)
results.push(property.toJSON()+': '+value);}
return'{'+results.join(', ')+'}';},toQueryString:function(object){return $H(object).toQueryString();},toHTML:function(object){return object&&object.toHTML?object.toHTML():String.interpret(object);},keys:function(object){var keys=[];for(var property in object)
keys.push(property);return keys;},values:function(object){var values=[];for(var property in object)
values.push(object[property]);return values;},clone:function(object){return Object.extend({},object);},isElement:function(object){return object&&object.nodeType==1;},isArray:function(object){return object&&object.constructor===Array;},isHash:function(object){return object instanceof Hash;},isFunction:function(object){return typeof object=="function";},isString:function(object){return typeof object=="string";},isNumber:function(object){return typeof object=="number";},isUndefined:function(object){return typeof object=="undefined";}});Object.extend(Function.prototype,{argumentNames:function(){var names=this.toString().match(/^[\s\(]*function[^(]*\((.*?)\)/)[1].split(",").invoke("strip");return names.length==1&&!names[0]?[]:names;},bind:function(){if(arguments.length<2&&arguments[0]===undefined)return this;var __method=this,args=$A(arguments),object=args.shift();return function(){return __method.apply(object,args.concat($A(arguments)));}},bindAsEventListener:function(){var __method=this,args=$A(arguments),object=args.shift();return function(event){return __method.apply(object,[event||window.event].concat(args));}},curry:function(){if(!arguments.length)return this;var __method=this,args=$A(arguments);return function(){return __method.apply(this,args.concat($A(arguments)));}},delay:function(){var __method=this,args=$A(arguments),timeout=args.shift()*1000;return window.setTimeout(function(){return __method.apply(__method,args);},timeout);},wrap:function(wrapper){var __method=this;return function(){return wrapper.apply(this,[__method.bind(this)].concat($A(arguments)));}},methodize:function(){if(this._methodized)return this._methodized;var __method=this;return this._methodized=function(){return __method.apply(null,[this].concat($A(arguments)));};}});Function.prototype.defer=Function.prototype.delay.curry(0.01);Date.prototype.toJSON=function(){return'"'+this.getUTCFullYear()+'-'+
(this.getUTCMonth()+1).toPaddedString(2)+'-'+
this.getUTCDate().toPaddedString(2)+'T'+
this.getUTCHours().toPaddedString(2)+':'+
this.getUTCMinutes().toPaddedString(2)+':'+
this.getUTCSeconds().toPaddedString(2)+'Z"';};var Try={these:function(){var returnValue;for(var i=0,length=arguments.length;i<length;i++){var lambda=arguments[i];try{returnValue=lambda();break;}catch(e){}}
return returnValue;}};RegExp.prototype.match=RegExp.prototype.test;RegExp.escape=function(str){return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g,'\\$1');};var PeriodicalExecuter=Class.create({initialize:function(callback,frequency){this.callback=callback;this.frequency=frequency;this.currentlyExecuting=false;this.registerCallback();},registerCallback:function(){this.timer=setInterval(this.onTimerEvent.bind(this),this.frequency*1000);},execute:function(){this.callback(this);},stop:function(){if(!this.timer)return;clearInterval(this.timer);this.timer=null;},onTimerEvent:function(){if(!this.currentlyExecuting){try{this.currentlyExecuting=true;this.execute();}finally{this.currentlyExecuting=false;}}}});Object.extend(String,{interpret:function(value){return value==null?'':String(value);},specialChar:{'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','\\':'\\\\'}});Object.extend(String.prototype,{gsub:function(pattern,replacement){var result='',source=this,match;replacement=arguments.callee.prepareReplacement(replacement);while(source.length>0){if(match=source.match(pattern)){result+=source.slice(0,match.index);result+=String.interpret(replacement(match));source=source.slice(match.index+match[0].length);}else{result+=source,source='';}}
return result;},sub:function(pattern,replacement,count){replacement=this.gsub.prepareReplacement(replacement);count=count===undefined?1:count;return this.gsub(pattern,function(match){if(--count<0)return match[0];return replacement(match);});},scan:function(pattern,iterator){this.gsub(pattern,iterator);return String(this);},truncate:function(length,truncation){length=length||30;truncation=truncation===undefined?'...':truncation;return this.length>length?this.slice(0,length-truncation.length)+truncation:String(this);},strip:function(){return this.replace(/^\s+/,'').replace(/\s+$/,'');},stripTags:function(){return this.replace(/<\/?[^>]+>/gi,'');},stripScripts:function(){return this.replace(new RegExp(Prototype.ScriptFragment,'img'),'');},extractScripts:function(){var matchAll=new RegExp(Prototype.ScriptFragment,'img');var matchOne=new RegExp(Prototype.ScriptFragment,'im');return(this.match(matchAll)||[]).map(function(scriptTag){return(scriptTag.match(matchOne)||['',''])[1];});},evalScripts:function(){return this.extractScripts().map(function(script){return eval(script)});},escapeHTML:function(){var self=arguments.callee;self.text.data=this;return self.div.innerHTML;},unescapeHTML:function(){var div=new Element('div');div.innerHTML=this.stripTags();return div.childNodes[0]?(div.childNodes.length>1?$A(div.childNodes).inject('',function(memo,node){return memo+node.nodeValue}):div.childNodes[0].nodeValue):'';},toQueryParams:function(separator){var match=this.strip().match(/([^?#]*)(#.*)?$/);if(!match)return{};return match[1].split(separator||'&').inject({},function(hash,pair){if((pair=pair.split('='))[0]){var key=decodeURIComponent(pair.shift());var value=pair.length>1?pair.join('='):pair[0];if(value!=undefined)value=decodeURIComponent(value);if(key in hash){if(!Object.isArray(hash[key]))hash[key]=[hash[key]];hash[key].push(value);}
else hash[key]=value;}
return hash;});},toArray:function(){return this.split('');},succ:function(){return this.slice(0,this.length-1)+
String.fromCharCode(this.charCodeAt(this.length-1)+1);},times:function(count){return count<1?'':new Array(count+1).join(this);},camelize:function(){var parts=this.split('-'),len=parts.length;if(len==1)return parts[0];var camelized=this.charAt(0)=='-'?parts[0].charAt(0).toUpperCase()+parts[0].substring(1):parts[0];for(var i=1;i<len;i++)
camelized+=parts[i].charAt(0).toUpperCase()+parts[i].substring(1);return camelized;},capitalize:function(){return this.charAt(0).toUpperCase()+this.substring(1).toLowerCase();},underscore:function(){return this.gsub(/::/,'/').gsub(/([A-Z]+)([A-Z][a-z])/,'#{1}_#{2}').gsub(/([a-z\d])([A-Z])/,'#{1}_#{2}').gsub(/-/,'_').toLowerCase();},dasherize:function(){return this.gsub(/_/,'-');},inspect:function(useDoubleQuotes){var escapedString=this.gsub(/[\x00-\x1f\\]/,function(match){var character=String.specialChar[match[0]];return character?character:'\\u00'+match[0].charCodeAt().toPaddedString(2,16);});if(useDoubleQuotes)return'"'+escapedString.replace(/"/g,'\\"')+'"';return"'"+escapedString.replace(/'/g,'\\\'')+"'";},toJSON:function(){return this.inspect(true);},unfilterJSON:function(filter){return this.sub(filter||Prototype.JSONFilter,'#{1}');},isJSON:function(){var str=this.replace(/\\./g,'@').replace(/"[^"\\\n\r]*"/g,'');return(/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(str);},evalJSON:function(sanitize){var json=this.unfilterJSON();try{if(!sanitize||json.isJSON())return eval('('+json+')');}catch(e){}
throw new SyntaxError('Badly formed JSON string: '+this.inspect());},include:function(pattern){return this.indexOf(pattern)>-1;},startsWith:function(pattern){return this.indexOf(pattern)===0;},endsWith:function(pattern){var d=this.length-pattern.length;return d>=0&&this.lastIndexOf(pattern)===d;},empty:function(){return this=='';},blank:function(){return/^\s*$/.test(this);},interpolate:function(object,pattern){return new Template(this,pattern).evaluate(object);}});if(Prototype.Browser.WebKit||Prototype.Browser.IE)Object.extend(String.prototype,{escapeHTML:function(){return this.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');},unescapeHTML:function(){return this.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');}});String.prototype.gsub.prepareReplacement=function(replacement){if(Object.isFunction(replacement))return replacement;var template=new Template(replacement);return function(match){return template.evaluate(match)};};String.prototype.parseQuery=String.prototype.toQueryParams;Object.extend(String.prototype.escapeHTML,{div:document.createElement('div'),text:document.createTextNode('')});with(String.prototype.escapeHTML)div.appendChild(text);var Template=Class.create({initialize:function(template,pattern){this.template=template.toString();this.pattern=pattern||Template.Pattern;},evaluate:function(object){if(Object.isFunction(object.toTemplateReplacements))
object=object.toTemplateReplacements();return this.template.gsub(this.pattern,function(match){if(object==null)return'';var before=match[1]||'';if(before=='\\')return match[2];var ctx=object,expr=match[3];var pattern=/^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/,match=pattern.exec(expr);if(match==null)return before;while(match!=null){var comp=match[1].startsWith('[')?match[2].gsub('\\\\]',']'):match[1];ctx=ctx[comp];if(null==ctx||''==match[3])break;expr=expr.substring('['==match[3]?match[1].length:match[0].length);match=pattern.exec(expr);}
return before+String.interpret(ctx);}.bind(this));}});Template.Pattern=/(^|.|\r|\n)(#\{(.*?)\})/;var $break={};var Enumerable={each:function(iterator,context){var index=0;iterator=iterator.bind(context);try{this._each(function(value){iterator(value,index++);});}catch(e){if(e!=$break)throw e;}
return this;},eachSlice:function(number,iterator,context){iterator=iterator?iterator.bind(context):Prototype.K;var index=-number,slices=[],array=this.toArray();while((index+=number)<array.length)
slices.push(array.slice(index,index+number));return slices.collect(iterator,context);},all:function(iterator,context){iterator=iterator?iterator.bind(context):Prototype.K;var result=true;this.each(function(value,index){result=result&&!!iterator(value,index);if(!result)throw $break;});return result;},any:function(iterator,context){iterator=iterator?iterator.bind(context):Prototype.K;var result=false;this.each(function(value,index){if(result=!!iterator(value,index))
throw $break;});return result;},collect:function(iterator,context){iterator=iterator?iterator.bind(context):Prototype.K;var results=[];this.each(function(value,index){results.push(iterator(value,index));});return results;},detect:function(iterator,context){iterator=iterator.bind(context);var result;this.each(function(value,index){if(iterator(value,index)){result=value;throw $break;}});return result;},findAll:function(iterator,context){iterator=iterator.bind(context);var results=[];this.each(function(value,index){if(iterator(value,index))
results.push(value);});return results;},grep:function(filter,iterator,context){iterator=iterator?iterator.bind(context):Prototype.K;var results=[];if(Object.isString(filter))
filter=new RegExp(filter);this.each(function(value,index){if(filter.match(value))
results.push(iterator(value,index));});return results;},include:function(object){if(Object.isFunction(this.indexOf))
if(this.indexOf(object)!=-1)return true;var found=false;this.each(function(value){if(value==object){found=true;throw $break;}});return found;},inGroupsOf:function(number,fillWith){fillWith=fillWith===undefined?null:fillWith;return this.eachSlice(number,function(slice){while(slice.length<number)slice.push(fillWith);return slice;});},inject:function(memo,iterator,context){iterator=iterator.bind(context);this.each(function(value,index){memo=iterator(memo,value,index);});return memo;},invoke:function(method){var args=$A(arguments).slice(1);return this.map(function(value){return value[method].apply(value,args);});},max:function(iterator,context){iterator=iterator?iterator.bind(context):Prototype.K;var result;this.each(function(value,index){value=iterator(value,index);if(result==undefined||value>=result)
result=value;});return result;},min:function(iterator,context){iterator=iterator?iterator.bind(context):Prototype.K;var result;this.each(function(value,index){value=iterator(value,index);if(result==undefined||value<result)
result=value;});return result;},partition:function(iterator,context){iterator=iterator?iterator.bind(context):Prototype.K;var trues=[],falses=[];this.each(function(value,index){(iterator(value,index)?trues:falses).push(value);});return[trues,falses];},pluck:function(property){var results=[];this.each(function(value){results.push(value[property]);});return results;},reject:function(iterator,context){iterator=iterator.bind(context);var results=[];this.each(function(value,index){if(!iterator(value,index))
results.push(value);});return results;},sortBy:function(iterator,context){iterator=iterator.bind(context);return this.map(function(value,index){return{value:value,criteria:iterator(value,index)};}).sort(function(left,right){var a=left.criteria,b=right.criteria;return a<b?-1:a>b?1:0;}).pluck('value');},toArray:function(){return this.map();},zip:function(){var iterator=Prototype.K,args=$A(arguments);if(Object.isFunction(args.last()))
iterator=args.pop();var collections=[this].concat(args).map($A);return this.map(function(value,index){return iterator(collections.pluck(index));});},size:function(){return this.toArray().length;},inspect:function(){return'#<Enumerable:'+this.toArray().inspect()+'>';}};Object.extend(Enumerable,{map:Enumerable.collect,find:Enumerable.detect,select:Enumerable.findAll,filter:Enumerable.findAll,member:Enumerable.include,entries:Enumerable.toArray,every:Enumerable.all,some:Enumerable.any});function $A(iterable){if(!iterable)return[];if(iterable.toArray)return iterable.toArray();var length=iterable.length,results=new Array(length);while(length--)results[length]=iterable[length];return results;}
if(Prototype.Browser.WebKit){function $A(iterable){if(!iterable)return[];if(!(Object.isFunction(iterable)&&iterable=='[object NodeList]')&&iterable.toArray)return iterable.toArray();var length=iterable.length,results=new Array(length);while(length--)results[length]=iterable[length];return results;}}
Array.from=$A;Object.extend(Array.prototype,Enumerable);if(!Array.prototype._reverse)Array.prototype._reverse=Array.prototype.reverse;Object.extend(Array.prototype,{_each:function(iterator){for(var i=0,length=this.length;i<length;i++)
iterator(this[i]);},clear:function(){this.length=0;return this;},first:function(){return this[0];},last:function(){return this[this.length-1];},compact:function(){return this.select(function(value){return value!=null;});},flatten:function(){return this.inject([],function(array,value){return array.concat(Object.isArray(value)?value.flatten():[value]);});},without:function(){var values=$A(arguments);return this.select(function(value){return!values.include(value);});},reverse:function(inline){return(inline!==false?this:this.toArray())._reverse();},reduce:function(){return this.length>1?this:this[0];},uniq:function(sorted){return this.inject([],function(array,value,index){if(0==index||(sorted?array.last()!=value:!array.include(value)))
array.push(value);return array;});},intersect:function(array){return this.uniq().findAll(function(item){return array.detect(function(value){return item===value});});},clone:function(){return[].concat(this);},size:function(){return this.length;},inspect:function(){return'['+this.map(Object.inspect).join(', ')+']';},toJSON:function(){var results=[];this.each(function(object){var value=Object.toJSON(object);if(value!==undefined)results.push(value);});return'['+results.join(', ')+']';}});if(Object.isFunction(Array.prototype.forEach))
Array.prototype._each=Array.prototype.forEach;if(!Array.prototype.indexOf)Array.prototype.indexOf=function(item,i){i||(i=0);var length=this.length;if(i<0)i=length+i;for(;i<length;i++)
if(this[i]===item)return i;return-1;};if(!Array.prototype.lastIndexOf)Array.prototype.lastIndexOf=function(item,i){i=isNaN(i)?this.length:(i<0?this.length+i:i)+1;var n=this.slice(0,i).reverse().indexOf(item);return(n<0)?n:i-n-1;};Array.prototype.toArray=Array.prototype.clone;function $w(string){if(!Object.isString(string))return[];string=string.strip();return string?string.split(/\s+/):[];}
if(Prototype.Browser.Opera){Array.prototype.concat=function(){var array=[];for(var i=0,length=this.length;i<length;i++)array.push(this[i]);for(var i=0,length=arguments.length;i<length;i++){if(Object.isArray(arguments[i])){for(var j=0,arrayLength=arguments[i].length;j<arrayLength;j++)
array.push(arguments[i][j]);}else{array.push(arguments[i]);}}
return array;};}
Object.extend(Number.prototype,{toColorPart:function(){return this.toPaddedString(2,16);},succ:function(){return this+1;},times:function(iterator){$R(0,this,true).each(iterator);return this;},toPaddedString:function(length,radix){var string=this.toString(radix||10);return'0'.times(length-string.length)+string;},toJSON:function(){return isFinite(this)?this.toString():'null';}});$w('abs round ceil floor').each(function(method){Number.prototype[method]=Math[method].methodize();});function $H(object){return new Hash(object);};var Hash=Class.create(Enumerable,(function(){if(function(){var i=0,Test=function(value){this.key=value};Test.prototype.key='foo';for(var property in new Test('bar'))i++;return i>1;}()){function each(iterator){var cache=[];for(var key in this._object){var value=this._object[key];if(cache.include(key))continue;cache.push(key);var pair=[key,value];pair.key=key;pair.value=value;iterator(pair);}}}else{function each(iterator){for(var key in this._object){var value=this._object[key],pair=[key,value];pair.key=key;pair.value=value;iterator(pair);}}}
function toQueryPair(key,value){if(Object.isUndefined(value))return key;return key+'='+encodeURIComponent(String.interpret(value));}
return{initialize:function(object){this._object=Object.isHash(object)?object.toObject():Object.clone(object);},_each:each,set:function(key,value){return this._object[key]=value;},get:function(key){return this._object[key];},unset:function(key){var value=this._object[key];delete this._object[key];return value;},toObject:function(){return Object.clone(this._object);},keys:function(){return this.pluck('key');},values:function(){return this.pluck('value');},index:function(value){var match=this.detect(function(pair){return pair.value===value;});return match&&match.key;},merge:function(object){return this.clone().update(object);},update:function(object){return new Hash(object).inject(this,function(result,pair){result.set(pair.key,pair.value);return result;});},toQueryString:function(){return this.map(function(pair){var key=encodeURIComponent(pair.key),values=pair.value;if(values&&typeof values=='object'){if(Object.isArray(values))
return values.map(toQueryPair.curry(key)).join('&');}
return toQueryPair(key,values);}).join('&');},inspect:function(){return'#<Hash:{'+this.map(function(pair){return pair.map(Object.inspect).join(': ');}).join(', ')+'}>';},toJSON:function(){return Object.toJSON(this.toObject());},clone:function(){return new Hash(this);}}})());Hash.prototype.toTemplateReplacements=Hash.prototype.toObject;Hash.from=$H;var ObjectRange=Class.create(Enumerable,{initialize:function(start,end,exclusive){this.start=start;this.end=end;this.exclusive=exclusive;},_each:function(iterator){var value=this.start;while(this.include(value)){iterator(value);value=value.succ();}},include:function(value){if(value<this.start)
return false;if(this.exclusive)
return value<this.end;return value<=this.end;}});var $R=function(start,end,exclusive){return new ObjectRange(start,end,exclusive);};var Ajax={getTransport:function(){return Try.these(function(){return new XMLHttpRequest()},function(){return new ActiveXObject('Msxml2.XMLHTTP')},function(){return new ActiveXObject('Microsoft.XMLHTTP')})||false;},activeRequestCount:0};Ajax.Responders={responders:[],_each:function(iterator){this.responders._each(iterator);},register:function(responder){if(!this.include(responder))
this.responders.push(responder);},unregister:function(responder){this.responders=this.responders.without(responder);},dispatch:function(callback,request,transport,json){this.each(function(responder){if(Object.isFunction(responder[callback])){try{responder[callback].apply(responder,[request,transport,json]);}catch(e){}}});}};Object.extend(Ajax.Responders,Enumerable);Ajax.Responders.register({onCreate:function(){Ajax.activeRequestCount++},onComplete:function(){Ajax.activeRequestCount--}});Ajax.Base=Class.create({initialize:function(options){this.options={method:'post',asynchronous:true,contentType:'application/x-www-form-urlencoded',encoding:'UTF-8',parameters:'',evalJSON:true,evalJS:true};Object.extend(this.options,options||{});this.options.method=this.options.method.toLowerCase();if(Object.isString(this.options.parameters))
this.options.parameters=this.options.parameters.toQueryParams();}});Ajax.Request=Class.create(Ajax.Base,{_complete:false,initialize:function($super,url,options){$super(options);this.transport=Ajax.getTransport();this.request(url);},request:function(url){this.url=url;this.method=this.options.method;var params=Object.clone(this.options.parameters);if(!['get','post'].include(this.method)){params['_method']=this.method;this.method='post';}
this.parameters=params;if(params=Object.toQueryString(params)){if(this.method=='get')
this.url+=(this.url.include('?')?'&':'?')+params;else if(/Konqueror|Safari|KHTML/.test(navigator.userAgent))
params+='&_=';}
try{var response=new Ajax.Response(this);if(this.options.onCreate)this.options.onCreate(response);Ajax.Responders.dispatch('onCreate',this,response);this.transport.open(this.method.toUpperCase(),this.url,this.options.asynchronous);if(this.options.asynchronous)this.respondToReadyState.bind(this).defer(1);this.transport.onreadystatechange=this.onStateChange.bind(this);this.setRequestHeaders();this.body=this.method=='post'?(this.options.postBody||params):null;this.transport.send(this.body);if(!this.options.asynchronous&&this.transport.overrideMimeType)
this.onStateChange();}
catch(e){this.dispatchException(e);}},onStateChange:function(){var readyState=this.transport.readyState;if(readyState>1&&!((readyState==4)&&this._complete))
this.respondToReadyState(this.transport.readyState);},setRequestHeaders:function(){var headers={'X-Requested-With':'XMLHttpRequest','X-Prototype-Version':Prototype.Version,'Accept':'text/javascript, text/html, application/xml, text/xml, */*'};if(this.method=='post'){headers['Content-type']=this.options.contentType+
(this.options.encoding?'; charset='+this.options.encoding:'');if(this.transport.overrideMimeType&&(navigator.userAgent.match(/Gecko\/(\d{4})/)||[0,2005])[1]<2005)
headers['Connection']='close';}
if(typeof this.options.requestHeaders=='object'){var extras=this.options.requestHeaders;if(Object.isFunction(extras.push))
for(var i=0,length=extras.length;i<length;i+=2)
headers[extras[i]]=extras[i+1];else
$H(extras).each(function(pair){headers[pair.key]=pair.value});}
for(var name in headers)
this.transport.setRequestHeader(name,headers[name]);},success:function(){var status=this.getStatus();return!status||(status>=200&&status<300);},getStatus:function(){try{return this.transport.status||0;}catch(e){return 0}},respondToReadyState:function(readyState){var state=Ajax.Request.Events[readyState],response=new Ajax.Response(this);if(state=='Complete'){try{this._complete=true;(this.options['on'+response.status]||this.options['on'+(this.success()?'Success':'Failure')]||Prototype.emptyFunction)(response,response.headerJSON);}catch(e){this.dispatchException(e);}
var contentType=response.getHeader('Content-type');if(this.options.evalJS=='force'||(this.options.evalJS&&contentType&&contentType.match(/^\s*(text|application)\/(x-)?(java|ecma)script(;.*)?\s*$/i)))
this.evalResponse();}
try{(this.options['on'+state]||Prototype.emptyFunction)(response,response.headerJSON);Ajax.Responders.dispatch('on'+state,this,response,response.headerJSON);}catch(e){this.dispatchException(e);}
if(state=='Complete'){this.transport.onreadystatechange=Prototype.emptyFunction;}},getHeader:function(name){try{return this.transport.getResponseHeader(name);}catch(e){return null}},evalResponse:function(){try{return eval((this.transport.responseText||'').unfilterJSON());}catch(e){this.dispatchException(e);}},dispatchException:function(exception){(this.options.onException||Prototype.emptyFunction)(this,exception);Ajax.Responders.dispatch('onException',this,exception);}});Ajax.Request.Events=['Uninitialized','Loading','Loaded','Interactive','Complete'];Ajax.Response=Class.create({initialize:function(request){this.request=request;var transport=this.transport=request.transport,readyState=this.readyState=transport.readyState;if((readyState>2&&!Prototype.Browser.IE)||readyState==4){this.status=this.getStatus();this.statusText=this.getStatusText();this.responseText=String.interpret(transport.responseText);this.headerJSON=this._getHeaderJSON();}
if(readyState==4){var xml=transport.responseXML;this.responseXML=xml===undefined?null:xml;this.responseJSON=this._getResponseJSON();}},status:0,statusText:'',getStatus:Ajax.Request.prototype.getStatus,getStatusText:function(){try{return this.transport.statusText||'';}catch(e){return''}},getHeader:Ajax.Request.prototype.getHeader,getAllHeaders:function(){try{return this.getAllResponseHeaders();}catch(e){return null}},getResponseHeader:function(name){return this.transport.getResponseHeader(name);},getAllResponseHeaders:function(){return this.transport.getAllResponseHeaders();},_getHeaderJSON:function(){var json=this.getHeader('X-JSON');if(!json)return null;json=decodeURIComponent(escape(json));try{return json.evalJSON(this.request.options.sanitizeJSON);}catch(e){this.request.dispatchException(e);}},_getResponseJSON:function(){var options=this.request.options;if(!options.evalJSON||(options.evalJSON!='force'&&!(this.getHeader('Content-type')||'').include('application/json')))
return null;try{return this.transport.responseText.evalJSON(options.sanitizeJSON);}catch(e){this.request.dispatchException(e);}}});Ajax.Updater=Class.create(Ajax.Request,{initialize:function($super,container,url,options){this.container={success:(container.success||container),failure:(container.failure||(container.success?null:container))};options=options||{};var onComplete=options.onComplete;options.onComplete=(function(response,param){this.updateContent(response.responseText);if(Object.isFunction(onComplete))onComplete(response,param);}).bind(this);$super(url,options);},updateContent:function(responseText){var receiver=this.container[this.success()?'success':'failure'],options=this.options;if(!options.evalScripts)responseText=responseText.stripScripts();if(receiver=$(receiver)){if(options.insertion){if(Object.isString(options.insertion)){var insertion={};insertion[options.insertion]=responseText;receiver.insert(insertion);}
else options.insertion(receiver,responseText);}
else receiver.update(responseText);}
if(this.success()){if(this.onComplete)this.onComplete.bind(this).defer();}}});Ajax.PeriodicalUpdater=Class.create(Ajax.Base,{initialize:function($super,container,url,options){$super(options);this.onComplete=this.options.onComplete;this.frequency=(this.options.frequency||2);this.decay=(this.options.decay||1);this.updater={};this.container=container;this.url=url;this.start();},start:function(){this.options.onComplete=this.updateComplete.bind(this);this.onTimerEvent();},stop:function(){this.updater.options.onComplete=undefined;clearTimeout(this.timer);(this.onComplete||Prototype.emptyFunction).apply(this,arguments);},updateComplete:function(response){if(this.options.decay){this.decay=(response.responseText==this.lastText?this.decay*this.options.decay:1);this.lastText=response.responseText;}
this.timer=this.onTimerEvent.bind(this).delay(this.decay*this.frequency);},onTimerEvent:function(){this.updater=new Ajax.Updater(this.container,this.url,this.options);}});function $(element){if(arguments.length>1){for(var i=0,elements=[],length=arguments.length;i<length;i++)
elements.push($(arguments[i]));return elements;}
if(Object.isString(element))
element=document.getElementById(element);return Element.extend(element);}
if(Prototype.BrowserFeatures.XPath){document._getElementsByXPath=function(expression,parentElement){var results=[];var query=document.evaluate(expression,$(parentElement)||document,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);for(var i=0,length=query.snapshotLength;i<length;i++)
results.push(Element.extend(query.snapshotItem(i)));return results;};}
if(!window.Node)var Node={};if(!Node.ELEMENT_NODE){Object.extend(Node,{ELEMENT_NODE:1,ATTRIBUTE_NODE:2,TEXT_NODE:3,CDATA_SECTION_NODE:4,ENTITY_REFERENCE_NODE:5,ENTITY_NODE:6,PROCESSING_INSTRUCTION_NODE:7,COMMENT_NODE:8,DOCUMENT_NODE:9,DOCUMENT_TYPE_NODE:10,DOCUMENT_FRAGMENT_NODE:11,NOTATION_NODE:12});}
(function(){var element=this.Element;this.Element=function(tagName,attributes){attributes=attributes||{};tagName=tagName.toLowerCase();var cache=Element.cache;if(Prototype.Browser.IE&&attributes.name){tagName='<'+tagName+' name="'+attributes.name+'">';delete attributes.name;return Element.writeAttribute(document.createElement(tagName),attributes);}
if(!cache[tagName])cache[tagName]=Element.extend(document.createElement(tagName));return Element.writeAttribute(cache[tagName].cloneNode(false),attributes);};Object.extend(this.Element,element||{});}).call(window);Element.cache={};Element.Methods={visible:function(element){return $(element).style.display!='none';},toggle:function(element){element=$(element);Element[Element.visible(element)?'hide':'show'](element);return element;},hide:function(element){$(element).style.display='none';return element;},show:function(element){$(element).style.display='';return element;},remove:function(element){element=$(element);element.parentNode.removeChild(element);return element;},update:function(element,content){element=$(element);if(content&&content.toElement)content=content.toElement();if(Object.isElement(content))return element.update().insert(content);content=Object.toHTML(content);element.innerHTML=content.stripScripts();content.evalScripts.bind(content).defer();return element;},replace:function(element,content){element=$(element);if(content&&content.toElement)content=content.toElement();else if(!Object.isElement(content)){content=Object.toHTML(content);var range=element.ownerDocument.createRange();range.selectNode(element);content.evalScripts.bind(content).defer();content=range.createContextualFragment(content.stripScripts());}
element.parentNode.replaceChild(content,element);return element;},insert:function(element,insertions){element=$(element);if(Object.isString(insertions)||Object.isNumber(insertions)||Object.isElement(insertions)||(insertions&&(insertions.toElement||insertions.toHTML)))
insertions={bottom:insertions};var content,t,range;for(position in insertions){content=insertions[position];position=position.toLowerCase();t=Element._insertionTranslations[position];if(content&&content.toElement)content=content.toElement();if(Object.isElement(content)){t.insert(element,content);continue;}
content=Object.toHTML(content);range=element.ownerDocument.createRange();t.initializeRange(element,range);t.insert(element,range.createContextualFragment(content.stripScripts()));content.evalScripts.bind(content).defer();}
return element;},wrap:function(element,wrapper,attributes){element=$(element);if(Object.isElement(wrapper))
$(wrapper).writeAttribute(attributes||{});else if(Object.isString(wrapper))wrapper=new Element(wrapper,attributes);else wrapper=new Element('div',wrapper);if(element.parentNode)
element.parentNode.replaceChild(wrapper,element);wrapper.appendChild(element);return wrapper;},inspect:function(element){element=$(element);var result='<'+element.tagName.toLowerCase();$H({'id':'id','className':'class'}).each(function(pair){var property=pair.first(),attribute=pair.last();var value=(element[property]||'').toString();if(value)result+=' '+attribute+'='+value.inspect(true);});return result+'>';},recursivelyCollect:function(element,property){element=$(element);var elements=[];while(element=element[property])
if(element.nodeType==1)
elements.push(Element.extend(element));return elements;},ancestors:function(element){return $(element).recursivelyCollect('parentNode');},descendants:function(element){return $A($(element).getElementsByTagName('*')).each(Element.extend);},firstDescendant:function(element){element=$(element).firstChild;while(element&&element.nodeType!=1)element=element.nextSibling;return $(element);},immediateDescendants:function(element){if(!(element=$(element).firstChild))return[];while(element&&element.nodeType!=1)element=element.nextSibling;if(element)return[element].concat($(element).nextSiblings());return[];},previousSiblings:function(element){return $(element).recursivelyCollect('previousSibling');},nextSiblings:function(element){return $(element).recursivelyCollect('nextSibling');},siblings:function(element){element=$(element);return element.previousSiblings().reverse().concat(element.nextSiblings());},match:function(element,selector){if(Object.isString(selector))
selector=new Selector(selector);return selector.match($(element));},up:function(element,expression,index){element=$(element);if(arguments.length==1)return $(element.parentNode);var ancestors=element.ancestors();return expression?Selector.findElement(ancestors,expression,index):ancestors[index||0];},down:function(element,expression,index){element=$(element);if(arguments.length==1)return element.firstDescendant();var descendants=element.descendants();return expression?Selector.findElement(descendants,expression,index):descendants[index||0];},previous:function(element,expression,index){element=$(element);if(arguments.length==1)return $(Selector.handlers.previousElementSibling(element));var previousSiblings=element.previousSiblings();return expression?Selector.findElement(previousSiblings,expression,index):previousSiblings[index||0];},next:function(element,expression,index){element=$(element);if(arguments.length==1)return $(Selector.handlers.nextElementSibling(element));var nextSiblings=element.nextSiblings();return expression?Selector.findElement(nextSiblings,expression,index):nextSiblings[index||0];},select:function(){var args=$A(arguments),element=$(args.shift());return Selector.findChildElements(element,args);},adjacent:function(){var args=$A(arguments),element=$(args.shift());return Selector.findChildElements(element.parentNode,args).without(element);},identify:function(element){element=$(element);var id=element.readAttribute('id'),self=arguments.callee;if(id)return id;do{id='anonymous_element_'+self.counter++}while($(id));element.writeAttribute('id',id);return id;},readAttribute:function(element,name){element=$(element);if(Prototype.Browser.IE){var t=Element._attributeTranslations.read;if(t.values[name])return t.values[name](element,name);if(t.names[name])name=t.names[name];if(name.include(':')){return(!element.attributes||!element.attributes[name])?null:element.attributes[name].value;}}
return element.getAttribute(name);},writeAttribute:function(element,name,value){element=$(element);var attributes={},t=Element._attributeTranslations.write;if(typeof name=='object')attributes=name;else attributes[name]=value===undefined?true:value;for(var attr in attributes){var name=t.names[attr]||attr,value=attributes[attr];if(t.values[attr])name=t.values[attr](element,value);if(value===false||value===null)
element.removeAttribute(name);else if(value===true)
element.setAttribute(name,name);else element.setAttribute(name,value);}
return element;},getHeight:function(element){return $(element).getDimensions().height;},getWidth:function(element){return $(element).getDimensions().width;},classNames:function(element){return new Element.ClassNames(element);},hasClassName:function(element,className){if(!(element=$(element)))return;var elementClassName=element.className;return(elementClassName.length>0&&(elementClassName==className||new RegExp("(^|\\s)"+className+"(\\s|$)").test(elementClassName)));},addClassName:function(element,className){if(!(element=$(element)))return;if(!element.hasClassName(className))
element.className+=(element.className?' ':'')+className;return element;},removeClassName:function(element,className){if(!(element=$(element)))return;element.className=element.className.replace(new RegExp("(^|\\s+)"+className+"(\\s+|$)"),' ').strip();return element;},toggleClassName:function(element,className){if(!(element=$(element)))return;return element[element.hasClassName(className)?'removeClassName':'addClassName'](className);},cleanWhitespace:function(element){element=$(element);var node=element.firstChild;while(node){var nextNode=node.nextSibling;if(node.nodeType==3&&!/\S/.test(node.nodeValue))
element.removeChild(node);node=nextNode;}
return element;},empty:function(element){return $(element).innerHTML.blank();},descendantOf:function(element,ancestor){element=$(element),ancestor=$(ancestor);if(element.compareDocumentPosition)
return(element.compareDocumentPosition(ancestor)&8)===8;if(element.sourceIndex&&!Prototype.Browser.Opera){var e=element.sourceIndex,a=ancestor.sourceIndex,nextAncestor=ancestor.nextSibling;if(!nextAncestor){do{ancestor=ancestor.parentNode;}
while(!(nextAncestor=ancestor.nextSibling)&&ancestor.parentNode);}
if(nextAncestor)return(e>a&&e<nextAncestor.sourceIndex);}
while(element=element.parentNode)
if(element==ancestor)return true;return false;},scrollTo:function(element){element=$(element);var pos=element.cumulativeOffset();window.scrollTo(pos[0],pos[1]);return element;},getStyle:function(element,style){element=$(element);style=style=='float'?'cssFloat':style.camelize();var value=element.style[style];if(!value){var css=document.defaultView.getComputedStyle(element,null);value=css?css[style]:null;}
if(style=='opacity')return value?parseFloat(value):1.0;return value=='auto'?null:value;},getOpacity:function(element){return $(element).getStyle('opacity');},setStyle:function(element,styles){element=$(element);var elementStyle=element.style,match;if(Object.isString(styles)){element.style.cssText+=';'+styles;return styles.include('opacity')?element.setOpacity(styles.match(/opacity:\s*(\d?\.?\d*)/)[1]):element;}
for(var property in styles)
if(property=='opacity')element.setOpacity(styles[property]);else
elementStyle[(property=='float'||property=='cssFloat')?(elementStyle.styleFloat===undefined?'cssFloat':'styleFloat'):property]=styles[property];return element;},setOpacity:function(element,value){element=$(element);element.style.opacity=(value==1||value==='')?'':(value<0.00001)?0:value;return element;},getDimensions:function(element){element=$(element);var display=$(element).getStyle('display');if(display!='none'&&display!=null)
return{width:element.offsetWidth,height:element.offsetHeight};var els=element.style;var originalVisibility=els.visibility;var originalPosition=els.position;var originalDisplay=els.display;els.visibility='hidden';els.position='absolute';els.display='block';var originalWidth=element.clientWidth;var originalHeight=element.clientHeight;els.display=originalDisplay;els.position=originalPosition;els.visibility=originalVisibility;return{width:originalWidth,height:originalHeight};},makePositioned:function(element){element=$(element);var pos=Element.getStyle(element,'position');if(pos=='static'||!pos){element._madePositioned=true;element.style.position='relative';if(window.opera){element.style.top=0;element.style.left=0;}}
return element;},undoPositioned:function(element){element=$(element);if(element._madePositioned){element._madePositioned=undefined;element.style.position=element.style.top=element.style.left=element.style.bottom=element.style.right='';}
return element;},makeClipping:function(element){element=$(element);if(element._overflow)return element;element._overflow=Element.getStyle(element,'overflow')||'auto';if(element._overflow!=='hidden')
element.style.overflow='hidden';return element;},undoClipping:function(element){element=$(element);if(!element._overflow)return element;element.style.overflow=element._overflow=='auto'?'':element._overflow;element._overflow=null;return element;},cumulativeOffset:function(element){var valueT=0,valueL=0;do{valueT+=element.offsetTop||0;valueL+=element.offsetLeft||0;element=element.offsetParent;}while(element);return Element._returnOffset(valueL,valueT);},positionedOffset:function(element){var valueT=0,valueL=0;do{valueT+=element.offsetTop||0;valueL+=element.offsetLeft||0;element=element.offsetParent;if(element){if(element.tagName=='BODY')break;var p=Element.getStyle(element,'position');if(p=='relative'||p=='absolute')break;}}while(element);return Element._returnOffset(valueL,valueT);},absolutize:function(element){element=$(element);if(element.getStyle('position')=='absolute')return;var offsets=element.positionedOffset();var top=offsets[1];var left=offsets[0];var width=element.clientWidth;var height=element.clientHeight;element._originalLeft=left-parseFloat(element.style.left||0);element._originalTop=top-parseFloat(element.style.top||0);element._originalWidth=element.style.width;element._originalHeight=element.style.height;element.style.position='absolute';element.style.top=top+'px';element.style.left=left+'px';element.style.width=width+'px';element.style.height=height+'px';return element;},relativize:function(element){element=$(element);if(element.getStyle('position')=='relative')return;element.style.position='relative';var top=parseFloat(element.style.top||0)-(element._originalTop||0);var left=parseFloat(element.style.left||0)-(element._originalLeft||0);element.style.top=top+'px';element.style.left=left+'px';element.style.height=element._originalHeight;element.style.width=element._originalWidth;return element;},cumulativeScrollOffset:function(element){var valueT=0,valueL=0;do{valueT+=element.scrollTop||0;valueL+=element.scrollLeft||0;element=element.parentNode;}while(element);return Element._returnOffset(valueL,valueT);},getOffsetParent:function(element){if(element.offsetParent)return $(element.offsetParent);if(element==document.body)return $(element);while((element=element.parentNode)&&element!=document.body)
if(Element.getStyle(element,'position')!='static')
return $(element);return $(document.body);},viewportOffset:function(forElement){var valueT=0,valueL=0;var element=forElement;do{valueT+=element.offsetTop||0;valueL+=element.offsetLeft||0;if(element.offsetParent==document.body&&Element.getStyle(element,'position')=='absolute')break;}while(element=element.offsetParent);element=forElement;do{if(!Prototype.Browser.Opera||element.tagName=='BODY'){valueT-=element.scrollTop||0;valueL-=element.scrollLeft||0;}}while(element=element.parentNode);return Element._returnOffset(valueL,valueT);},clonePosition:function(element,source){var options=Object.extend({setLeft:true,setTop:true,setWidth:true,setHeight:true,offsetTop:0,offsetLeft:0},arguments[2]||{});source=$(source);var p=source.viewportOffset();element=$(element);var delta=[0,0];var parent=null;if(Element.getStyle(element,'position')=='absolute'){parent=element.getOffsetParent();delta=parent.viewportOffset();}
if(parent==document.body){delta[0]-=document.body.offsetLeft;delta[1]-=document.body.offsetTop;}
if(options.setLeft)element.style.left=(p[0]-delta[0]+options.offsetLeft)+'px';if(options.setTop)element.style.top=(p[1]-delta[1]+options.offsetTop)+'px';if(options.setWidth)element.style.width=source.offsetWidth+'px';if(options.setHeight)element.style.height=source.offsetHeight+'px';return element;}};Element.Methods.identify.counter=1;Object.extend(Element.Methods,{getElementsBySelector:Element.Methods.select,childElements:Element.Methods.immediateDescendants});Element._attributeTranslations={write:{names:{className:'class',htmlFor:'for'},values:{}}};if(!document.createRange||Prototype.Browser.Opera){Element.Methods.insert=function(element,insertions){element=$(element);if(Object.isString(insertions)||Object.isNumber(insertions)||Object.isElement(insertions)||(insertions&&(insertions.toElement||insertions.toHTML)))
insertions={bottom:insertions};var t=Element._insertionTranslations,content,position,pos,tagName;for(position in insertions){content=insertions[position];position=position.toLowerCase();pos=t[position];if(content&&content.toElement)content=content.toElement();if(Object.isElement(content)){pos.insert(element,content);continue;}
content=Object.toHTML(content);tagName=((position=='before'||position=='after')?element.parentNode:element).tagName.toUpperCase();if(t.tags[tagName]){var fragments=Element._getContentFromAnonymousElement(tagName,content.stripScripts());if(position=='top'||position=='after')fragments.reverse();fragments.each(pos.insert.curry(element));}
else element.insertAdjacentHTML(pos.adjacency,content.stripScripts());content.evalScripts.bind(content).defer();}
return element;};}
if(Prototype.Browser.Opera){Element.Methods._getStyle=Element.Methods.getStyle;Element.Methods.getStyle=function(element,style){switch(style){case'left':case'top':case'right':case'bottom':if(Element._getStyle(element,'position')=='static')return null;default:return Element._getStyle(element,style);}};Element.Methods._readAttribute=Element.Methods.readAttribute;Element.Methods.readAttribute=function(element,attribute){if(attribute=='title')return element.title;return Element._readAttribute(element,attribute);};}
else if(Prototype.Browser.IE){$w('positionedOffset getOffsetParent viewportOffset').each(function(method){Element.Methods[method]=Element.Methods[method].wrap(function(proceed,element){element=$(element);var position=element.getStyle('position');if(position!='static')return proceed(element);element.setStyle({position:'relative'});var value=proceed(element);element.setStyle({position:position});return value;});});Element.Methods.getStyle=function(element,style){element=$(element);style=(style=='float'||style=='cssFloat')?'styleFloat':style.camelize();var value=element.style[style];if(!value&&element.currentStyle)value=element.currentStyle[style];if(style=='opacity'){if(value=(element.getStyle('filter')||'').match(/alpha\(opacity=(.*)\)/))
if(value[1])return parseFloat(value[1])/100;return 1.0;}
if(value=='auto'){if((style=='width'||style=='height')&&(element.getStyle('display')!='none'))
return element['offset'+style.capitalize()]+'px';return null;}
return value;};Element.Methods.setOpacity=function(element,value){function stripAlpha(filter){return filter.replace(/alpha\([^\)]*\)/gi,'');}
element=$(element);var currentStyle=element.currentStyle;if((currentStyle&&!currentStyle.hasLayout)||(!currentStyle&&element.style.zoom=='normal'))
element.style.zoom=1;var filter=element.getStyle('filter'),style=element.style;if(value==1||value===''){(filter=stripAlpha(filter))?style.filter=filter:style.removeAttribute('filter');return element;}else if(value<0.00001)value=0;style.filter=stripAlpha(filter)+'alpha(opacity='+(value*100)+')';return element;};Element._attributeTranslations={read:{names:{'class':'className','for':'htmlFor'},values:{_getAttr:function(element,attribute){return element.getAttribute(attribute,2);},_getAttrNode:function(element,attribute){var node=element.getAttributeNode(attribute);return node?node.value:"";},_getEv:function(element,attribute){var attribute=element.getAttribute(attribute);return attribute?attribute.toString().slice(23,-2):null;},_flag:function(element,attribute){return $(element).hasAttribute(attribute)?attribute:null;},style:function(element){return element.style.cssText.toLowerCase();},title:function(element){return element.title;}}}};Element._attributeTranslations.write={names:Object.clone(Element._attributeTranslations.read.names),values:{checked:function(element,value){element.checked=!!value;},style:function(element,value){element.style.cssText=value?value:'';}}};Element._attributeTranslations.has={};$w('colSpan rowSpan vAlign dateTime accessKey tabIndex '+'encType maxLength readOnly longDesc').each(function(attr){Element._attributeTranslations.write.names[attr.toLowerCase()]=attr;Element._attributeTranslations.has[attr.toLowerCase()]=attr;});(function(v){Object.extend(v,{href:v._getAttr,src:v._getAttr,type:v._getAttr,action:v._getAttrNode,disabled:v._flag,checked:v._flag,readonly:v._flag,multiple:v._flag,onload:v._getEv,onunload:v._getEv,onclick:v._getEv,ondblclick:v._getEv,onmousedown:v._getEv,onmouseup:v._getEv,onmouseover:v._getEv,onmousemove:v._getEv,onmouseout:v._getEv,onfocus:v._getEv,onblur:v._getEv,onkeypress:v._getEv,onkeydown:v._getEv,onkeyup:v._getEv,onsubmit:v._getEv,onreset:v._getEv,onselect:v._getEv,onchange:v._getEv});})(Element._attributeTranslations.read.values);}
else if(Prototype.Browser.Gecko&&/rv:1\.8\.0/.test(navigator.userAgent)){Element.Methods.setOpacity=function(element,value){element=$(element);element.style.opacity=(value==1)?0.999999:(value==='')?'':(value<0.00001)?0:value;return element;};}
else if(Prototype.Browser.WebKit){Element.Methods.setOpacity=function(element,value){element=$(element);element.style.opacity=(value==1||value==='')?'':(value<0.00001)?0:value;if(value==1)
if(element.tagName=='IMG'&&element.width){element.width++;element.width--;}else try{var n=document.createTextNode(' ');element.appendChild(n);element.removeChild(n);}catch(e){}
return element;};Element.Methods.cumulativeOffset=function(element){var valueT=0,valueL=0;do{valueT+=element.offsetTop||0;valueL+=element.offsetLeft||0;if(element.offsetParent==document.body)
if(Element.getStyle(element,'position')=='absolute')break;element=element.offsetParent;}while(element);return Element._returnOffset(valueL,valueT);};}
if(Prototype.Browser.IE||Prototype.Browser.Opera){Element.Methods.update=function(element,content){element=$(element);if(content&&content.toElement)content=content.toElement();if(Object.isElement(content))return element.update().insert(content);content=Object.toHTML(content);var tagName=element.tagName.toUpperCase();if(tagName in Element._insertionTranslations.tags){$A(element.childNodes).each(function(node){element.removeChild(node)});Element._getContentFromAnonymousElement(tagName,content.stripScripts()).each(function(node){element.appendChild(node)});}
else element.innerHTML=content.stripScripts();content.evalScripts.bind(content).defer();return element;};}
if(document.createElement('div').outerHTML){Element.Methods.replace=function(element,content){element=$(element);if(content&&content.toElement)content=content.toElement();if(Object.isElement(content)){element.parentNode.replaceChild(content,element);return element;}
content=Object.toHTML(content);var parent=element.parentNode,tagName=parent.tagName.toUpperCase();if(Element._insertionTranslations.tags[tagName]){var nextSibling=element.next();var fragments=Element._getContentFromAnonymousElement(tagName,content.stripScripts());parent.removeChild(element);if(nextSibling)
fragments.each(function(node){parent.insertBefore(node,nextSibling)});else
fragments.each(function(node){parent.appendChild(node)});}
else element.outerHTML=content.stripScripts();content.evalScripts.bind(content).defer();return element;};}
Element._returnOffset=function(l,t){var result=[l,t];result.left=l;result.top=t;return result;};Element._getContentFromAnonymousElement=function(tagName,html){var div=new Element('div'),t=Element._insertionTranslations.tags[tagName];div.innerHTML=t[0]+html+t[1];t[2].times(function(){div=div.firstChild});return $A(div.childNodes);};Element._insertionTranslations={before:{adjacency:'beforeBegin',insert:function(element,node){element.parentNode.insertBefore(node,element);},initializeRange:function(element,range){range.setStartBefore(element);}},top:{adjacency:'afterBegin',insert:function(element,node){element.insertBefore(node,element.firstChild);},initializeRange:function(element,range){range.selectNodeContents(element);range.collapse(true);}},bottom:{adjacency:'beforeEnd',insert:function(element,node){element.appendChild(node);}},after:{adjacency:'afterEnd',insert:function(element,node){element.parentNode.insertBefore(node,element.nextSibling);},initializeRange:function(element,range){range.setStartAfter(element);}},tags:{TABLE:['<table>','</table>',1],TBODY:['<table><tbody>','</tbody></table>',2],TR:['<table><tbody><tr>','</tr></tbody></table>',3],TD:['<table><tbody><tr><td>','</td></tr></tbody></table>',4],SELECT:['<select>','</select>',1]}};(function(){this.bottom.initializeRange=this.top.initializeRange;Object.extend(this.tags,{THEAD:this.tags.TBODY,TFOOT:this.tags.TBODY,TH:this.tags.TD});}).call(Element._insertionTranslations);Element.Methods.Simulated={hasAttribute:function(element,attribute){attribute=Element._attributeTranslations.has[attribute]||attribute;var node=$(element).getAttributeNode(attribute);return node&&node.specified;}};Element.Methods.ByTag={};Object.extend(Element,Element.Methods);if(!Prototype.BrowserFeatures.ElementExtensions&&document.createElement('div').__proto__){window.HTMLElement={};window.HTMLElement.prototype=document.createElement('div').__proto__;Prototype.BrowserFeatures.ElementExtensions=true;}
Element.extend=(function(){if(Prototype.BrowserFeatures.SpecificElementExtensions)
return Prototype.K;var Methods={},ByTag=Element.Methods.ByTag;var extend=Object.extend(function(element){if(!element||element._extendedByPrototype||element.nodeType!=1||element==window)return element;var methods=Object.clone(Methods),tagName=element.tagName,property,value;if(ByTag[tagName])Object.extend(methods,ByTag[tagName]);for(property in methods){value=methods[property];if(Object.isFunction(value)&&!(property in element))
element[property]=value.methodize();}
element._extendedByPrototype=Prototype.emptyFunction;return element;},{refresh:function(){if(!Prototype.BrowserFeatures.ElementExtensions){Object.extend(Methods,Element.Methods);Object.extend(Methods,Element.Methods.Simulated);}}});extend.refresh();return extend;})();Element.hasAttribute=function(element,attribute){if(element.hasAttribute)return element.hasAttribute(attribute);return Element.Methods.Simulated.hasAttribute(element,attribute);};Element.addMethods=function(methods){var F=Prototype.BrowserFeatures,T=Element.Methods.ByTag;if(!methods){Object.extend(Form,Form.Methods);Object.extend(Form.Element,Form.Element.Methods);Object.extend(Element.Methods.ByTag,{"FORM":Object.clone(Form.Methods),"INPUT":Object.clone(Form.Element.Methods),"SELECT":Object.clone(Form.Element.Methods),"TEXTAREA":Object.clone(Form.Element.Methods)});}
if(arguments.length==2){var tagName=methods;methods=arguments[1];}
if(!tagName)Object.extend(Element.Methods,methods||{});else{if(Object.isArray(tagName))tagName.each(extend);else extend(tagName);}
function extend(tagName){tagName=tagName.toUpperCase();if(!Element.Methods.ByTag[tagName])
Element.Methods.ByTag[tagName]={};Object.extend(Element.Methods.ByTag[tagName],methods);}
function copy(methods,destination,onlyIfAbsent){onlyIfAbsent=onlyIfAbsent||false;for(var property in methods){var value=methods[property];if(!Object.isFunction(value))continue;if(!onlyIfAbsent||!(property in destination))
destination[property]=value.methodize();}}
function findDOMClass(tagName){var klass;var trans={"OPTGROUP":"OptGroup","TEXTAREA":"TextArea","P":"Paragraph","FIELDSET":"FieldSet","UL":"UList","OL":"OList","DL":"DList","DIR":"Directory","H1":"Heading","H2":"Heading","H3":"Heading","H4":"Heading","H5":"Heading","H6":"Heading","Q":"Quote","INS":"Mod","DEL":"Mod","A":"Anchor","IMG":"Image","CAPTION":"TableCaption","COL":"TableCol","COLGROUP":"TableCol","THEAD":"TableSection","TFOOT":"TableSection","TBODY":"TableSection","TR":"TableRow","TH":"TableCell","TD":"TableCell","FRAMESET":"FrameSet","IFRAME":"IFrame"};if(trans[tagName])klass='HTML'+trans[tagName]+'Element';if(window[klass])return window[klass];klass='HTML'+tagName+'Element';if(window[klass])return window[klass];klass='HTML'+tagName.capitalize()+'Element';if(window[klass])return window[klass];window[klass]={};window[klass].prototype=document.createElement(tagName).__proto__;return window[klass];}
if(F.ElementExtensions){copy(Element.Methods,HTMLElement.prototype);copy(Element.Methods.Simulated,HTMLElement.prototype,true);}
if(F.SpecificElementExtensions){for(var tag in Element.Methods.ByTag){var klass=findDOMClass(tag);if(Object.isUndefined(klass))continue;copy(T[tag],klass.prototype);}}
Object.extend(Element,Element.Methods);delete Element.ByTag;if(Element.extend.refresh)Element.extend.refresh();Element.cache={};};document.viewport={getDimensions:function(){var dimensions={};$w('width height').each(function(d){var D=d.capitalize();dimensions[d]=self['inner'+D]||(document.documentElement['client'+D]||document.body['client'+D]);});return dimensions;},getWidth:function(){return this.getDimensions().width;},getHeight:function(){return this.getDimensions().height;},getScrollOffsets:function(){return Element._returnOffset(window.pageXOffset||document.documentElement.scrollLeft||document.body.scrollLeft,window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop);}};var Selector=Class.create({initialize:function(expression){this.expression=expression.strip();this.compileMatcher();},compileMatcher:function(){if(Prototype.BrowserFeatures.XPath&&!(/(\[[\w-]*?:|:checked)/).test(this.expression))
return this.compileXPathMatcher();var e=this.expression,ps=Selector.patterns,h=Selector.handlers,c=Selector.criteria,le,p,m;if(Selector._cache[e]){this.matcher=Selector._cache[e];return;}
this.matcher=["this.matcher = function(root) {","var r = root, h = Selector.handlers, c = false, n;"];while(e&&le!=e&&(/\S/).test(e)){le=e;for(var i in ps){p=ps[i];if(m=e.match(p)){this.matcher.push(Object.isFunction(c[i])?c[i](m):new Template(c[i]).evaluate(m));e=e.replace(m[0],'');break;}}}
this.matcher.push("return h.unique(n);\n}");eval(this.matcher.join('\n'));Selector._cache[this.expression]=this.matcher;},compileXPathMatcher:function(){var e=this.expression,ps=Selector.patterns,x=Selector.xpath,le,m;if(Selector._cache[e]){this.xpath=Selector._cache[e];return;}
this.matcher=['.//*'];while(e&&le!=e&&(/\S/).test(e)){le=e;for(var i in ps){if(m=e.match(ps[i])){this.matcher.push(Object.isFunction(x[i])?x[i](m):new Template(x[i]).evaluate(m));e=e.replace(m[0],'');break;}}}
this.xpath=this.matcher.join('');Selector._cache[this.expression]=this.xpath;},findElements:function(root){root=root||document;if(this.xpath)return document._getElementsByXPath(this.xpath,root);return this.matcher(root);},match:function(element){this.tokens=[];var e=this.expression,ps=Selector.patterns,as=Selector.assertions;var le,p,m;while(e&&le!==e&&(/\S/).test(e)){le=e;for(var i in ps){p=ps[i];if(m=e.match(p)){if(as[i]){this.tokens.push([i,Object.clone(m)]);e=e.replace(m[0],'');}else{return this.findElements(document).include(element);}}}}
var match=true,name,matches;for(var i=0,token;token=this.tokens[i];i++){name=token[0],matches=token[1];if(!Selector.assertions[name](element,matches)){match=false;break;}}
return match;},toString:function(){return this.expression;},inspect:function(){return"#<Selector:"+this.expression.inspect()+">";}});Object.extend(Selector,{_cache:{},xpath:{descendant:"//*",child:"/*",adjacent:"/following-sibling::*[1]",laterSibling:'/following-sibling::*',tagName:function(m){if(m[1]=='*')return'';return"[local-name()='"+m[1].toLowerCase()+"' or local-name()='"+m[1].toUpperCase()+"']";},className:"[contains(concat(' ', @class, ' '), ' #{1} ')]",id:"[@id='#{1}']",attrPresence:"[@#{1}]",attr:function(m){m[3]=m[5]||m[6];return new Template(Selector.xpath.operators[m[2]]).evaluate(m);},pseudo:function(m){var h=Selector.xpath.pseudos[m[1]];if(!h)return'';if(Object.isFunction(h))return h(m);return new Template(Selector.xpath.pseudos[m[1]]).evaluate(m);},operators:{'=':"[@#{1}='#{3}']",'!=':"[@#{1}!='#{3}']",'^=':"[starts-with(@#{1}, '#{3}')]",'$=':"[substring(@#{1}, (string-length(@#{1}) - string-length('#{3}') + 1))='#{3}']",'*=':"[contains(@#{1}, '#{3}')]",'~=':"[contains(concat(' ', @#{1}, ' '), ' #{3} ')]",'|=':"[contains(concat('-', @#{1}, '-'), '-#{3}-')]"},pseudos:{'first-child':'[not(preceding-sibling::*)]','last-child':'[not(following-sibling::*)]','only-child':'[not(preceding-sibling::* or following-sibling::*)]','empty':"[count(*) = 0 and (count(text()) = 0 or translate(text(), ' \t\r\n', '') = '')]",'checked':"[@checked]",'disabled':"[@disabled]",'enabled':"[not(@disabled)]",'not':function(m){var e=m[6],p=Selector.patterns,x=Selector.xpath,le,m,v;var exclusion=[];while(e&&le!=e&&(/\S/).test(e)){le=e;for(var i in p){if(m=e.match(p[i])){v=Object.isFunction(x[i])?x[i](m):new Template(x[i]).evaluate(m);exclusion.push("("+v.substring(1,v.length-1)+")");e=e.replace(m[0],'');break;}}}
return"[not("+exclusion.join(" and ")+")]";},'nth-child':function(m){return Selector.xpath.pseudos.nth("(count(./preceding-sibling::*) + 1) ",m);},'nth-last-child':function(m){return Selector.xpath.pseudos.nth("(count(./following-sibling::*) + 1) ",m);},'nth-of-type':function(m){return Selector.xpath.pseudos.nth("position() ",m);},'nth-last-of-type':function(m){return Selector.xpath.pseudos.nth("(last() + 1 - position()) ",m);},'first-of-type':function(m){m[6]="1";return Selector.xpath.pseudos['nth-of-type'](m);},'last-of-type':function(m){m[6]="1";return Selector.xpath.pseudos['nth-last-of-type'](m);},'only-of-type':function(m){var p=Selector.xpath.pseudos;return p['first-of-type'](m)+p['last-of-type'](m);},nth:function(fragment,m){var mm,formula=m[6],predicate;if(formula=='even')formula='2n+0';if(formula=='odd')formula='2n+1';if(mm=formula.match(/^(\d+)$/))
return'['+fragment+"= "+mm[1]+']';if(mm=formula.match(/^(-?\d*)?n(([+-])(\d+))?/)){if(mm[1]=="-")mm[1]=-1;var a=mm[1]?Number(mm[1]):1;var b=mm[2]?Number(mm[2]):0;predicate="[((#{fragment} - #{b}) mod #{a} = 0) and "+"((#{fragment} - #{b}) div #{a} >= 0)]";return new Template(predicate).evaluate({fragment:fragment,a:a,b:b});}}}},criteria:{tagName:'n = h.tagName(n, r, "#{1}", c);   c = false;',className:'n = h.className(n, r, "#{1}", c); c = false;',id:'n = h.id(n, r, "#{1}", c);        c = false;',attrPresence:'n = h.attrPresence(n, r, "#{1}"); c = false;',attr:function(m){m[3]=(m[5]||m[6]);return new Template('n = h.attr(n, r, "#{1}", "#{3}", "#{2}"); c = false;').evaluate(m);},pseudo:function(m){if(m[6])m[6]=m[6].replace(/"/g,'\\"');return new Template('n = h.pseudo(n, "#{1}", "#{6}", r, c); c = false;').evaluate(m);},descendant:'c = "descendant";',child:'c = "child";',adjacent:'c = "adjacent";',laterSibling:'c = "laterSibling";'},patterns:{laterSibling:/^\s*~\s*/,child:/^\s*>\s*/,adjacent:/^\s*\+\s*/,descendant:/^\s/,tagName:/^\s*(\*|[\w\-]+)(\b|$)?/,id:/^#([\w\-\*]+)(\b|$)/,className:/^\.([\w\-\*]+)(\b|$)/,pseudo:/^:((first|last|nth|nth-last|only)(-child|-of-type)|empty|checked|(en|dis)abled|not)(\((.*?)\))?(\b|$|(?=\s)|(?=:))/,attrPresence:/^\[([\w]+)\]/,attr:/\[((?:[\w-]*:)?[\w-]+)\s*(?:([!^$*~|]?=)\s*((['"])([^\4]*?)\4|([^'"][^\]]*?)))?\]/},assertions:{tagName:function(element,matches){return matches[1].toUpperCase()==element.tagName.toUpperCase();},className:function(element,matches){return Element.hasClassName(element,matches[1]);},id:function(element,matches){return element.id===matches[1];},attrPresence:function(element,matches){return Element.hasAttribute(element,matches[1]);},attr:function(element,matches){var nodeValue=Element.readAttribute(element,matches[1]);return Selector.operators[matches[2]](nodeValue,matches[3]);}},handlers:{concat:function(a,b){for(var i=0,node;node=b[i];i++)
a.push(node);return a;},mark:function(nodes){for(var i=0,node;node=nodes[i];i++)
node._counted=true;return nodes;},unmark:function(nodes){for(var i=0,node;node=nodes[i];i++)
node._counted=undefined;return nodes;},index:function(parentNode,reverse,ofType){parentNode._counted=true;if(reverse){for(var nodes=parentNode.childNodes,i=nodes.length-1,j=1;i>=0;i--){var node=nodes[i];if(node.nodeType==1&&(!ofType||node._counted))node.nodeIndex=j++;}}else{for(var i=0,j=1,nodes=parentNode.childNodes;node=nodes[i];i++)
if(node.nodeType==1&&(!ofType||node._counted))node.nodeIndex=j++;}},unique:function(nodes){if(nodes.length==0)return nodes;var results=[],n;for(var i=0,l=nodes.length;i<l;i++)
if(!(n=nodes[i])._counted){n._counted=true;results.push(Element.extend(n));}
return Selector.handlers.unmark(results);},descendant:function(nodes){var h=Selector.handlers;for(var i=0,results=[],node;node=nodes[i];i++)
h.concat(results,node.getElementsByTagName('*'));return results;},child:function(nodes){var h=Selector.handlers;for(var i=0,results=[],node;node=nodes[i];i++){for(var j=0,children=[],child;child=node.childNodes[j];j++)
if(child.nodeType==1&&child.tagName!='!')results.push(child);}
return results;},adjacent:function(nodes){for(var i=0,results=[],node;node=nodes[i];i++){var next=this.nextElementSibling(node);if(next)results.push(next);}
return results;},laterSibling:function(nodes){var h=Selector.handlers;for(var i=0,results=[],node;node=nodes[i];i++)
h.concat(results,Element.nextSiblings(node));return results;},nextElementSibling:function(node){while(node=node.nextSibling)
if(node.nodeType==1)return node;return null;},previousElementSibling:function(node){while(node=node.previousSibling)
if(node.nodeType==1)return node;return null;},tagName:function(nodes,root,tagName,combinator){tagName=tagName.toUpperCase();var results=[],h=Selector.handlers;if(nodes){if(combinator){if(combinator=="descendant"){for(var i=0,node;node=nodes[i];i++)
h.concat(results,node.getElementsByTagName(tagName));return results;}else nodes=this[combinator](nodes);if(tagName=="*")return nodes;}
for(var i=0,node;node=nodes[i];i++)
if(node.tagName.toUpperCase()==tagName)results.push(node);return results;}else return root.getElementsByTagName(tagName);},id:function(nodes,root,id,combinator){var targetNode=$(id),h=Selector.handlers;if(!targetNode)return[];if(!nodes&&root==document)return[targetNode];if(nodes){if(combinator){if(combinator=='child'){for(var i=0,node;node=nodes[i];i++)
if(targetNode.parentNode==node)return[targetNode];}else if(combinator=='descendant'){for(var i=0,node;node=nodes[i];i++)
if(Element.descendantOf(targetNode,node))return[targetNode];}else if(combinator=='adjacent'){for(var i=0,node;node=nodes[i];i++)
if(Selector.handlers.previousElementSibling(targetNode)==node)
return[targetNode];}else nodes=h[combinator](nodes);}
for(var i=0,node;node=nodes[i];i++)
if(node==targetNode)return[targetNode];return[];}
return(targetNode&&Element.descendantOf(targetNode,root))?[targetNode]:[];},className:function(nodes,root,className,combinator){if(nodes&&combinator)nodes=this[combinator](nodes);return Selector.handlers.byClassName(nodes,root,className);},byClassName:function(nodes,root,className){if(!nodes)nodes=Selector.handlers.descendant([root]);var needle=' '+className+' ';for(var i=0,results=[],node,nodeClassName;node=nodes[i];i++){nodeClassName=node.className;if(nodeClassName.length==0)continue;if(nodeClassName==className||(' '+nodeClassName+' ').include(needle))
results.push(node);}
return results;},attrPresence:function(nodes,root,attr){if(!nodes)nodes=root.getElementsByTagName("*");var results=[];for(var i=0,node;node=nodes[i];i++)
if(Element.hasAttribute(node,attr))results.push(node);return results;},attr:function(nodes,root,attr,value,operator){if(!nodes)nodes=root.getElementsByTagName("*");var handler=Selector.operators[operator],results=[];for(var i=0,node;node=nodes[i];i++){var nodeValue=Element.readAttribute(node,attr);if(nodeValue===null)continue;if(handler(nodeValue,value))results.push(node);}
return results;},pseudo:function(nodes,name,value,root,combinator){if(nodes&&combinator)nodes=this[combinator](nodes);if(!nodes)nodes=root.getElementsByTagName("*");return Selector.pseudos[name](nodes,value,root);}},pseudos:{'first-child':function(nodes,value,root){for(var i=0,results=[],node;node=nodes[i];i++){if(Selector.handlers.previousElementSibling(node))continue;results.push(node);}
return results;},'last-child':function(nodes,value,root){for(var i=0,results=[],node;node=nodes[i];i++){if(Selector.handlers.nextElementSibling(node))continue;results.push(node);}
return results;},'only-child':function(nodes,value,root){var h=Selector.handlers;for(var i=0,results=[],node;node=nodes[i];i++)
if(!h.previousElementSibling(node)&&!h.nextElementSibling(node))
results.push(node);return results;},'nth-child':function(nodes,formula,root){return Selector.pseudos.nth(nodes,formula,root);},'nth-last-child':function(nodes,formula,root){return Selector.pseudos.nth(nodes,formula,root,true);},'nth-of-type':function(nodes,formula,root){return Selector.pseudos.nth(nodes,formula,root,false,true);},'nth-last-of-type':function(nodes,formula,root){return Selector.pseudos.nth(nodes,formula,root,true,true);},'first-of-type':function(nodes,formula,root){return Selector.pseudos.nth(nodes,"1",root,false,true);},'last-of-type':function(nodes,formula,root){return Selector.pseudos.nth(nodes,"1",root,true,true);},'only-of-type':function(nodes,formula,root){var p=Selector.pseudos;return p['last-of-type'](p['first-of-type'](nodes,formula,root),formula,root);},getIndices:function(a,b,total){if(a==0)return b>0?[b]:[];return $R(1,total).inject([],function(memo,i){if(0==(i-b)%a&&(i-b)/a>=0)memo.push(i);return memo;});},nth:function(nodes,formula,root,reverse,ofType){if(nodes.length==0)return[];if(formula=='even')formula='2n+0';if(formula=='odd')formula='2n+1';var h=Selector.handlers,results=[],indexed=[],m;h.mark(nodes);for(var i=0,node;node=nodes[i];i++){if(!node.parentNode._counted){h.index(node.parentNode,reverse,ofType);indexed.push(node.parentNode);}}
if(formula.match(/^\d+$/)){formula=Number(formula);for(var i=0,node;node=nodes[i];i++)
if(node.nodeIndex==formula)results.push(node);}else if(m=formula.match(/^(-?\d*)?n(([+-])(\d+))?/)){if(m[1]=="-")m[1]=-1;var a=m[1]?Number(m[1]):1;var b=m[2]?Number(m[2]):0;var indices=Selector.pseudos.getIndices(a,b,nodes.length);for(var i=0,node,l=indices.length;node=nodes[i];i++){for(var j=0;j<l;j++)
if(node.nodeIndex==indices[j])results.push(node);}}
h.unmark(nodes);h.unmark(indexed);return results;},'empty':function(nodes,value,root){for(var i=0,results=[],node;node=nodes[i];i++){if(node.tagName=='!'||(node.firstChild&&!node.innerHTML.match(/^\s*$/)))continue;results.push(node);}
return results;},'not':function(nodes,selector,root){var h=Selector.handlers,selectorType,m;var exclusions=new Selector(selector).findElements(root);h.mark(exclusions);for(var i=0,results=[],node;node=nodes[i];i++)
if(!node._counted)results.push(node);h.unmark(exclusions);return results;},'enabled':function(nodes,value,root){for(var i=0,results=[],node;node=nodes[i];i++)
if(!node.disabled)results.push(node);return results;},'disabled':function(nodes,value,root){for(var i=0,results=[],node;node=nodes[i];i++)
if(node.disabled)results.push(node);return results;},'checked':function(nodes,value,root){for(var i=0,results=[],node;node=nodes[i];i++)
if(node.checked)results.push(node);return results;}},operators:{'=':function(nv,v){return nv==v;},'!=':function(nv,v){return nv!=v;},'^=':function(nv,v){return nv.startsWith(v);},'$=':function(nv,v){return nv.endsWith(v);},'*=':function(nv,v){return nv.include(v);},'~=':function(nv,v){return(' '+nv+' ').include(' '+v+' ');},'|=':function(nv,v){return('-'+nv.toUpperCase()+'-').include('-'+v.toUpperCase()+'-');}},matchElements:function(elements,expression){var matches=new Selector(expression).findElements(),h=Selector.handlers;h.mark(matches);for(var i=0,results=[],element;element=elements[i];i++)
if(element._counted)results.push(element);h.unmark(matches);return results;},findElement:function(elements,expression,index){if(Object.isNumber(expression)){index=expression;expression=false;}
return Selector.matchElements(elements,expression||'*')[index||0];},findChildElements:function(element,expressions){var exprs=expressions.join(','),expressions=[];exprs.scan(/(([\w#:.~>+()\s-]+|\*|\[.*?\])+)\s*(,|$)/,function(m){expressions.push(m[1].strip());});var results=[],h=Selector.handlers;for(var i=0,l=expressions.length,selector;i<l;i++){selector=new Selector(expressions[i].strip());h.concat(results,selector.findElements(element));}
return(l>1)?h.unique(results):results;}});function $$(){return Selector.findChildElements(document,$A(arguments));}
var Form={reset:function(form){$(form).reset();return form;},serializeElements:function(elements,options){if(typeof options!='object')options={hash:!!options};else if(options.hash===undefined)options.hash=true;var key,value,submitted=false,submit=options.submit;var data=elements.inject({},function(result,element){if(!element.disabled&&element.name){key=element.name;value=$(element).getValue();if(value!=null&&(element.type!='submit'||(!submitted&&submit!==false&&(!submit||key==submit)&&(submitted=true)))){if(key in result){if(!Object.isArray(result[key]))result[key]=[result[key]];result[key].push(value);}
else result[key]=value;}}
return result;});return options.hash?data:Object.toQueryString(data);}};Form.Methods={serialize:function(form,options){return Form.serializeElements(Form.getElements(form),options);},getElements:function(form){return $A($(form).getElementsByTagName('*')).inject([],function(elements,child){if(Form.Element.Serializers[child.tagName.toLowerCase()])
elements.push(Element.extend(child));return elements;});},getInputs:function(form,typeName,name){form=$(form);var inputs=form.getElementsByTagName('input');if(!typeName&&!name)return $A(inputs).map(Element.extend);for(var i=0,matchingInputs=[],length=inputs.length;i<length;i++){var input=inputs[i];if((typeName&&input.type!=typeName)||(name&&input.name!=name))
continue;matchingInputs.push(Element.extend(input));}
return matchingInputs;},disable:function(form){form=$(form);Form.getElements(form).invoke('disable');return form;},enable:function(form){form=$(form);Form.getElements(form).invoke('enable');return form;},findFirstElement:function(form){var elements=$(form).getElements().findAll(function(element){return'hidden'!=element.type&&!element.disabled;});var firstByIndex=elements.findAll(function(element){return element.hasAttribute('tabIndex')&&element.tabIndex>=0;}).sortBy(function(element){return element.tabIndex}).first();return firstByIndex?firstByIndex:elements.find(function(element){return['input','select','textarea'].include(element.tagName.toLowerCase());});},focusFirstElement:function(form){form=$(form);form.findFirstElement().activate();return form;},request:function(form,options){form=$(form),options=Object.clone(options||{});var params=options.parameters,action=form.readAttribute('action')||'';if(action.blank())action=window.location.href;options.parameters=form.serialize(true);if(params){if(Object.isString(params))params=params.toQueryParams();Object.extend(options.parameters,params);}
if(form.hasAttribute('method')&&!options.method)
options.method=form.method;return new Ajax.Request(action,options);}};Form.Element={focus:function(element){$(element).focus();return element;},select:function(element){$(element).select();return element;}};Form.Element.Methods={serialize:function(element){element=$(element);if(!element.disabled&&element.name){var value=element.getValue();if(value!=undefined){var pair={};pair[element.name]=value;return Object.toQueryString(pair);}}
return'';},getValue:function(element){element=$(element);var method=element.tagName.toLowerCase();return Form.Element.Serializers[method](element);},setValue:function(element,value){element=$(element);var method=element.tagName.toLowerCase();Form.Element.Serializers[method](element,value);return element;},clear:function(element){$(element).value='';return element;},present:function(element){return $(element).value!='';},activate:function(element){element=$(element);try{element.focus();if(element.select&&(element.tagName.toLowerCase()!='input'||!['button','reset','submit'].include(element.type)))
element.select();}catch(e){}
return element;},disable:function(element){element=$(element);element.blur();element.disabled=true;return element;},enable:function(element){element=$(element);element.disabled=false;return element;}};var Field=Form.Element;var $F=Form.Element.Methods.getValue;Form.Element.Serializers={input:function(element,value){switch(element.type.toLowerCase()){case'checkbox':case'radio':return Form.Element.Serializers.inputSelector(element,value);default:return Form.Element.Serializers.textarea(element,value);}},inputSelector:function(element,value){if(value===undefined)return element.checked?element.value:null;else element.checked=!!value;},textarea:function(element,value){if(value===undefined)return element.value;else element.value=value;},select:function(element,index){if(index===undefined)
return this[element.type=='select-one'?'selectOne':'selectMany'](element);else{var opt,value,single=!Object.isArray(index);for(var i=0,length=element.length;i<length;i++){opt=element.options[i];value=this.optionValue(opt);if(single){if(value==index){opt.selected=true;return;}}
else opt.selected=index.include(value);}}},selectOne:function(element){var index=element.selectedIndex;return index>=0?this.optionValue(element.options[index]):null;},selectMany:function(element){var values,length=element.length;if(!length)return null;for(var i=0,values=[];i<length;i++){var opt=element.options[i];if(opt.selected)values.push(this.optionValue(opt));}
return values;},optionValue:function(opt){return Element.extend(opt).hasAttribute('value')?opt.value:opt.text;}};Abstract.TimedObserver=Class.create(PeriodicalExecuter,{initialize:function($super,element,frequency,callback){$super(callback,frequency);this.element=$(element);this.lastValue=this.getValue();},execute:function(){var value=this.getValue();if(Object.isString(this.lastValue)&&Object.isString(value)?this.lastValue!=value:String(this.lastValue)!=String(value)){this.callback(this.element,value);this.lastValue=value;}}});Form.Element.Observer=Class.create(Abstract.TimedObserver,{getValue:function(){return Form.Element.getValue(this.element);}});Form.Observer=Class.create(Abstract.TimedObserver,{getValue:function(){return Form.serialize(this.element);}});Abstract.EventObserver=Class.create({initialize:function(element,callback){this.element=$(element);this.callback=callback;this.lastValue=this.getValue();if(this.element.tagName.toLowerCase()=='form')
this.registerFormCallbacks();else
this.registerCallback(this.element);},onElementEvent:function(){var value=this.getValue();if(this.lastValue!=value){this.callback(this.element,value);this.lastValue=value;}},registerFormCallbacks:function(){Form.getElements(this.element).each(this.registerCallback,this);},registerCallback:function(element){if(element.type){switch(element.type.toLowerCase()){case'checkbox':case'radio':Event.observe(element,'click',this.onElementEvent.bind(this));break;default:Event.observe(element,'change',this.onElementEvent.bind(this));break;}}}});Form.Element.EventObserver=Class.create(Abstract.EventObserver,{getValue:function(){return Form.Element.getValue(this.element);}});Form.EventObserver=Class.create(Abstract.EventObserver,{getValue:function(){return Form.serialize(this.element);}});if(!window.Event)var Event={};Object.extend(Event,{KEY_BACKSPACE:8,KEY_TAB:9,KEY_RETURN:13,KEY_ESC:27,KEY_LEFT:37,KEY_UP:38,KEY_RIGHT:39,KEY_DOWN:40,KEY_DELETE:46,KEY_HOME:36,KEY_END:35,KEY_PAGEUP:33,KEY_PAGEDOWN:34,KEY_INSERT:45,cache:{},relatedTarget:function(event){var element;switch(event.type){case'mouseover':element=event.fromElement;break;case'mouseout':element=event.toElement;break;default:return null;}
return Element.extend(element);}});Event.Methods=(function(){var isButton;if(Prototype.Browser.IE){var buttonMap={0:1,1:4,2:2};isButton=function(event,code){return event.button==buttonMap[code];};}else if(Prototype.Browser.WebKit){isButton=function(event,code){switch(code){case 0:return event.which==1&&!event.metaKey;case 1:return event.which==1&&event.metaKey;default:return false;}};}else{isButton=function(event,code){return event.which?(event.which===code+1):(event.button===code);};}
return{isLeftClick:function(event){return isButton(event,0)},isMiddleClick:function(event){return isButton(event,1)},isRightClick:function(event){return isButton(event,2)},element:function(event){var node=Event.extend(event).target;return Element.extend(node.nodeType==Node.TEXT_NODE?node.parentNode:node);},findElement:function(event,expression){var element=Event.element(event);return element.match(expression)?element:element.up(expression);},pointer:function(event){return{x:event.pageX||(event.clientX+
(document.documentElement.scrollLeft||document.body.scrollLeft)),y:event.pageY||(event.clientY+
(document.documentElement.scrollTop||document.body.scrollTop))};},pointerX:function(event){return Event.pointer(event).x},pointerY:function(event){return Event.pointer(event).y},stop:function(event){Event.extend(event);event.preventDefault();event.stopPropagation();event.stopped=true;}};})();Event.extend=(function(){var methods=Object.keys(Event.Methods).inject({},function(m,name){m[name]=Event.Methods[name].methodize();return m;});if(Prototype.Browser.IE){Object.extend(methods,{stopPropagation:function(){this.cancelBubble=true},preventDefault:function(){this.returnValue=false},inspect:function(){return"[object Event]"}});return function(event){if(!event)return false;if(event._extendedByPrototype)return event;event._extendedByPrototype=Prototype.emptyFunction;var pointer=Event.pointer(event);Object.extend(event,{target:event.srcElement,relatedTarget:Event.relatedTarget(event),pageX:pointer.x,pageY:pointer.y});return Object.extend(event,methods);};}else{Event.prototype=Event.prototype||document.createEvent("HTMLEvents").__proto__;Object.extend(Event.prototype,methods);return Prototype.K;}})();Object.extend(Event,(function(){var cache=Event.cache;function getEventID(element){if(element._eventID)return element._eventID;arguments.callee.id=arguments.callee.id||1;return element._eventID=++arguments.callee.id;}
function getDOMEventName(eventName){if(eventName&&eventName.include(':'))return"dataavailable";return eventName;}
function getCacheForID(id){return cache[id]=cache[id]||{};}
function getWrappersForEventName(id,eventName){var c=getCacheForID(id);return c[eventName]=c[eventName]||[];}
function createWrapper(element,eventName,handler){var id=getEventID(element);var c=getWrappersForEventName(id,eventName);if(c.pluck("handler").include(handler))return false;var wrapper=function(event){if(!Event||!Event.extend||(event.eventName&&event.eventName!=eventName))
return false;Event.extend(event);handler.call(element,event)};wrapper.handler=handler;c.push(wrapper);return wrapper;}
function findWrapper(id,eventName,handler){var c=getWrappersForEventName(id,eventName);return c.find(function(wrapper){return wrapper.handler==handler});}
function destroyWrapper(id,eventName,handler){var c=getCacheForID(id);if(!c[eventName])return false;c[eventName]=c[eventName].without(findWrapper(id,eventName,handler));}
function destroyCache(){for(var id in cache)
for(var eventName in cache[id])
cache[id][eventName]=null;}
if(window.attachEvent){window.attachEvent("onunload",destroyCache);}
return{observe:function(element,eventName,handler){element=$(element);var name=getDOMEventName(eventName);var wrapper=createWrapper(element,eventName,handler);if(!wrapper)return element;if(element.addEventListener){element.addEventListener(name,wrapper,false);}else{element.attachEvent("on"+name,wrapper);}
return element;},stopObserving:function(element,eventName,handler){element=$(element);var id=getEventID(element),name=getDOMEventName(eventName);if(!handler&&eventName){getWrappersForEventName(id,eventName).each(function(wrapper){element.stopObserving(eventName,wrapper.handler);});return element;}else if(!eventName){Object.keys(getCacheForID(id)).each(function(eventName){element.stopObserving(eventName);});return element;}
var wrapper=findWrapper(id,eventName,handler);if(!wrapper)return element;if(element.removeEventListener){element.removeEventListener(name,wrapper,false);}else{element.detachEvent("on"+name,wrapper);}
destroyWrapper(id,eventName,handler);return element;},fire:function(element,eventName,memo){element=$(element);if(element==document&&document.createEvent&&!element.dispatchEvent)
element=document.documentElement;if(document.createEvent){var event=document.createEvent("HTMLEvents");event.initEvent("dataavailable",true,true);}else{var event=document.createEventObject();event.eventType="ondataavailable";}
event.eventName=eventName;event.memo=memo||{};if(document.createEvent){element.dispatchEvent(event);}else{element.fireEvent(event.eventType,event);}
return event;}};})());Object.extend(Event,Event.Methods);Element.addMethods({fire:Event.fire,observe:Event.observe,stopObserving:Event.stopObserving});Object.extend(document,{fire:Element.Methods.fire.methodize(),observe:Element.Methods.observe.methodize(),stopObserving:Element.Methods.stopObserving.methodize()});(function(){var timer,fired=false;function fireContentLoadedEvent(){if(fired)return;if(timer)window.clearInterval(timer);document.fire("dom:loaded");fired=true;}
if(document.addEventListener){if(Prototype.Browser.WebKit){timer=window.setInterval(function(){if(/loaded|complete/.test(document.readyState))
fireContentLoadedEvent();},0);Event.observe(window,"load",fireContentLoadedEvent);}else{document.addEventListener("DOMContentLoaded",fireContentLoadedEvent,false);}}else{document.write("<script id=__onDOMContentLoaded defer src=//:><\/script>");$("__onDOMContentLoaded").onreadystatechange=function(){if(this.readyState=="complete"){this.onreadystatechange=null;fireContentLoadedEvent();}};}})();Hash.toQueryString=Object.toQueryString;var Toggle={display:Element.toggle};Element.Methods.childOf=Element.Methods.descendantOf;var Insertion={Before:function(element,content){return Element.insert(element,{before:content});},Top:function(element,content){return Element.insert(element,{top:content});},Bottom:function(element,content){return Element.insert(element,{bottom:content});},After:function(element,content){return Element.insert(element,{after:content});}};var $continue=new Error('"throw $continue" is deprecated, use "return" instead');var Position={includeScrollOffsets:false,prepare:function(){this.deltaX=window.pageXOffset||document.documentElement.scrollLeft||document.body.scrollLeft||0;this.deltaY=window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0;},within:function(element,x,y){if(this.includeScrollOffsets)
return this.withinIncludingScrolloffsets(element,x,y);this.xcomp=x;this.ycomp=y;this.offset=Element.cumulativeOffset(element);return(y>=this.offset[1]&&y<this.offset[1]+element.offsetHeight&&x>=this.offset[0]&&x<this.offset[0]+element.offsetWidth);},withinIncludingScrolloffsets:function(element,x,y){var offsetcache=Element.cumulativeScrollOffset(element);this.xcomp=x+offsetcache[0]-this.deltaX;this.ycomp=y+offsetcache[1]-this.deltaY;this.offset=Element.cumulativeOffset(element);return(this.ycomp>=this.offset[1]&&this.ycomp<this.offset[1]+element.offsetHeight&&this.xcomp>=this.offset[0]&&this.xcomp<this.offset[0]+element.offsetWidth);},overlap:function(mode,element){if(!mode)return 0;if(mode=='vertical')
return((this.offset[1]+element.offsetHeight)-this.ycomp)/element.offsetHeight;if(mode=='horizontal')
return((this.offset[0]+element.offsetWidth)-this.xcomp)/element.offsetWidth;},cumulativeOffset:Element.Methods.cumulativeOffset,positionedOffset:Element.Methods.positionedOffset,absolutize:function(element){Position.prepare();return Element.absolutize(element);},relativize:function(element){Position.prepare();return Element.relativize(element);},realOffset:Element.Methods.cumulativeScrollOffset,offsetParent:Element.Methods.getOffsetParent,page:Element.Methods.viewportOffset,clone:function(source,target,options){options=options||{};return Element.clonePosition(target,source,options);}};if(!document.getElementsByClassName)document.getElementsByClassName=function(instanceMethods){function iter(name){return name.blank()?null:"[contains(concat(' ', @class, ' '), ' "+name+" ')]";}
instanceMethods.getElementsByClassName=Prototype.BrowserFeatures.XPath?function(element,className){className=className.toString().strip();var cond=/\s/.test(className)?$w(className).map(iter).join(''):iter(className);return cond?document._getElementsByXPath('.//*'+cond,element):[];}:function(element,className){className=className.toString().strip();var elements=[],classNames=(/\s/.test(className)?$w(className):null);if(!classNames&&!className)return elements;var nodes=$(element).getElementsByTagName('*');className=' '+className+' ';for(var i=0,child,cn;child=nodes[i];i++){if(child.className&&(cn=' '+child.className+' ')&&(cn.include(className)||(classNames&&classNames.all(function(name){return!name.toString().blank()&&cn.include(' '+name+' ');}))))
elements.push(Element.extend(child));}
return elements;};return function(className,parentElement){return $(parentElement||document.body).getElementsByClassName(className);};}(Element.Methods);Element.ClassNames=Class.create();Element.ClassNames.prototype={initialize:function(element){this.element=$(element);},_each:function(iterator){this.element.className.split(/\s+/).select(function(name){return name.length>0;})._each(iterator);},set:function(className){this.element.className=className;},add:function(classNameToAdd){if(this.include(classNameToAdd))return;this.set($A(this).concat(classNameToAdd).join(' '));},remove:function(classNameToRemove){if(!this.include(classNameToRemove))return;this.set($A(this).without(classNameToRemove).join(' '));},toString:function(){return $A(this).join(' ');}};Object.extend(Element.ClassNames.prototype,Enumerable);Element.addMethods();try
{if(NodeList&&NodeList.prototype&&!NodeList.prototype._each)
{Object.extend(NodeList.prototype,{_each:function(iterator){for(var i=0,length=this.length;i<length;++i)
iterator(this[i]);}});Object.extend(NodeList.prototype,Enumerable);}}
catch(exception)
{}
var windowsInternetExplorer=false;var isGecko=false;var isMozilla=false;var isFirefox=false;var isCamino=false;var isSafari=false;var isNS=false;var isWebKit=false;var isOpera=false;var isiPhone=false;var isEarlyWebKitVersion=false;var browserDetected=false;var listOfIE7FloatsFix=[];function detectBrowser()
{if(browserDetected===false)
{windowsInternetExplorer=false;var appVersion=navigator.appVersion;if((appVersion.indexOf("MSIE")!=-1)&&(appVersion.indexOf("Macintosh")==-1))
{var temp=appVersion.split("MSIE");actualBrowserVersion=(document.documentMode?8:parseFloat(temp[1]));effectiveBrowserVersion=document.documentMode?document.documentMode:parseFloat(temp[1]);windowsInternetExplorer=true;}
else
{var ua=navigator.userAgent.toLowerCase();isGecko=(ua.indexOf('gecko')!=-1);isMozilla=(this.isGecko&&ua.indexOf("gecko/")+14==ua.length);isFirefox=(this.isGecko&&ua.indexOf("firefox")!=-1);isCamino=(this.isGecko&&ua.indexOf("camino")!=-1);isSafari=(this.isGecko&&ua.indexOf("safari")!=-1);isNS=((this.isGecko)?(ua.indexOf('netscape')!=-1):((ua.indexOf('mozilla')!=-1)&&(ua.indexOf('spoofer')==-1)&&(ua.indexOf('compatible')==-1)&&(ua.indexOf('opera')==-1)&&(ua.indexOf('webtv')==-1)&&(ua.indexOf('hotjava')==-1)));isOpera=!!window.opera;var matchResult=ua.match(/applewebkit\/(\d+)/);if(matchResult)
{isiPhone=(ua.indexOf("mobile/")!=-1);isWebKit=true;webKitVersion=parseInt(matchResult[1]);isEarlyWebKitVersion=(webKitVersion<522);}}
browserDetected=true;}}
detectBrowser();function shouldApplyCSSBackgroundPNGFix()
{return(windowsInternetExplorer&&(effectiveBrowserVersion<7));}
function photocastHelper(url)
{var feed=new IWURL(url);var iPhotoVersionMin=600;var iPhotoMimeTypePlugin="application/photo";if(navigator.mimeTypes&&navigator.mimeTypes.length>0)
{var iPhoto=navigator.mimeTypes[iPhotoMimeTypePlugin];if(iPhoto)
{var description=iPhoto.description;try
{var components=description.split(" ");if(components&&components.length>1)
{var pluginVersion=components[1];if(pluginVersion>=iPhotoVersionMin)
{feed.mProtocol="photo";}}}
catch(exception)
{}}}
window.location=feed.toURLString();}
function loadCSS(file)
{var cssNode=document.createElement('link');cssNode.setAttribute('rel','stylesheet');cssNode.setAttribute('type','text/css');cssNode.setAttribute('href',file);document.getElementsByTagName('head')[0].appendChild(cssNode);}
function loadMozillaCSS(file)
{if(isMozilla||isFirefox||isCamino)
{loadCSS(file);}}
function utf8sequence(c)
{if(c<=0x0000007f)return[c];if(c<=0x000007ff)return[(0xc0|(c>>>6)),(0x80|(c&0x3f))];if(c<=0x0000ffff)return[(0xe0|(c>>>12)),(0x80|((c>>>6)&0x3f)),(0x80|(c&0x3f))];if(c<=0x001fffff)return[(0xf0|(c>>>18)),(0x80|((c>>>12)&0x3f)),(0x80|((c>>>6)&0x3f)),(0x80|(c&0x3f))];if(c<=0x03ffffff)return[(0xf8|(c>>>24)),(0x80|((c>>>18)&0x3f)),(0x80|((c>>>12)&0x3f)),(0x80|((c>>>6)&0x3f)),(0x80|(c&0x3f))];if(c<=0x7fffffff)return[(0xfc|(c>>>30)),(0x80|((c>>>24)&0x3f)),(0x80|((c>>>18)&0x3f)),(0x80|((c>>>12)&0x3f)),(0x80|((c>>>6)&0x3f)),(0x80|(c&0x3f))];return[];}
function utf8encode(s)
{var result=[];var firstSurrogate=0;for(var i=0;i<s.length;++i)
{var code=s.charCodeAt(i);if(firstSurrogate!=0)
{if((code>=0xDC00)&&(code<=0xDFFF))
{code=(firstSurrogate-0xD800)*0x400+(code-0xDC00)+0x10000;firstSurrogate=0;}}
else
{if((code<0xD800)||(code>0xDFFF))
{}
else if((code>=0xD800)&&(code<0xDC00))
{firstSurrogate=code;continue;}
else
{continue;}}
result=result.concat(utf8sequence(code));}
var resultString="";for(i=0;i<result.length;++i)
{resultString+=String.fromCharCode(result[i]);}
return resultString;}
function IELatin1Munge(UTF8String)
{var munged="";for(var i=0;i<UTF8String.length;i++)
{var c=UTF8String.charCodeAt(i);switch(c){case 0x0080:c=0x20AC;break;case 0x0081:break;case 0x0082:c=0x201A;break;case 0x0083:c=0x0192;break;case 0x0084:c=0x201E;break;case 0x0085:c=0x2026;break;case 0x0086:c=0x2020;break;case 0x0087:c=0x2021;break;case 0x0088:c=0x02C6;break;case 0x0089:c=0x2030;break;case 0x008A:c=0x0160;break;case 0x008B:c=0x2039;break;case 0x008C:c=0x0152;break;case 0x008D:break;case 0x008E:c=0x017D;break;case 0x008F:break;case 0x0090:break;case 0x0091:c=0x2018;break;case 0x0092:c=0x2019;break;case 0x0093:c=0x201C;break;case 0x0094:c=0x201D;break;case 0x0095:c=0x2022;break;case 0x0096:c=0x2013;break;case 0x0097:c=0x2014;break;case 0x0098:c=0x02DC;break;case 0x0099:c=0x2122;break;case 0x009A:c=0x0161;break;case 0x009B:c=0x203A;break;case 0x009C:c=0x0153;break;case 0x009D:break;case 0x009E:c=0x017E;break;case 0x009F:c=0x0178;break;}
munged+=String.fromCharCode(c);}
return munged;}
function IEConvertURLForPNGFix(urlString)
{var result=urlString;if(windowsInternetExplorer)
{var decoded=decodeURI(urlString);if(decoded.match(/[^\x00-\x7f]/))
{result=IELatin1Munge(utf8encode(decodeURI(urlString)));}}
return result;}
function fixAllIEPNGs(transparentGif)
{if(windowsInternetExplorer&&effectiveBrowserVersion<8)
{for(var i=0;i<document.images.length;++i)
{if(document.images[i].src.slice(-4).toLowerCase()==".png")
{var img=$(document.images[i]);var fixPng=function(img)
{if(!img.originalSrc&&!img.hasClassName("noAutoPNGFix")&&!img.hasClassName("noAutoPNGFixInTree")&&img.up(".noAutoPNGFixInTree")==undefined)
{if((img.style.width=="")&&(img.style.height==""))
{var width=img.width;var height=img.height;img.style.width=px(width);img.style.height=px(height);}
var filterName='progid:DXImageTransform.Microsoft.AlphaImageLoader';var filterParams='src="'+IEConvertURLForPNGFix(img.src)+'", sizingMethod="scale"';img.setFilter(filterName,filterParams);img.originalSrc=img.src;img.src=transparentGif;}};img.complete?fixPng(img):img.onload=fixPng.bind(null,img);}}}}
function toPixels(value)
{var converted=0;var px_per_pt=window.screen.logicalXDPI?(window.screen.logicalXDPI/72.0):1.3333;if(value.indexOf("px")>0)
{converted=parseFloat(value);}
else if(value.indexOf("pt")>0)
{converted=px_per_pt*parseFloat(value);}
else if(value.indexOf("in")>0)
{converted=72*px_per_pt*parseFloat(value);}
else if(value.indexOf("pc")>0)
{converted=12*px_per_pt*parseFloat(value);}
else if(value.indexOf("mm")>0)
{converted=2.83465*px_per_pt*parseFloat(value);}
else if(value.indexOf("cm")>0)
{converted=28.3465*px_per_pt*parseFloat(value);}
return converted;}
function toPixelsAtElement(element,value,vertical)
{var converted=0;if(value.indexOf("%")>0)
{var containerSize=0;if(vertical)
{containerSize=$(element.parentNode).getHeight();}
else
{containerSize=$(element.parentNode).getWidth();}
converted=containerSize*parseFloat(value)/100.0;}
else if(value.indexOf("em")>0)
{converted=parseFloat(value)*toPixels(Element.getStyle(element,'fontSize'));}
else
{converted=toPixels(value);}
return converted;}
function backgroundPositionDimension(oBlock,currentBGPosition,blockDimension,imageDimension)
{var position=0;if(currentBGPosition==='center')
{position=(blockDimension/2)-(imageDimension/2);}
else if((currentBGPosition==='right')||(currentBGPosition==='bottom'))
{position=blockDimension-imageDimension;}
else if((currentBGPosition==='left')||(currentBGPosition==='top'))
{position=0;}
else if(currentBGPosition.indexOf("px")>0)
{position=parseFloat(currentBGPosition);}
else if(currentBGPosition.indexOf("em")>0)
{position=parseFloat(currentBGPosition)*toPixels(oBlock.currentStyle.fontSize);}
else if(currentBGPosition.indexOf("%")>0)
{position=parseFloat(currentBGPosition)*blockDimension/100.0;}
else if((currentBGPosition.indexOf("pt")>0)||(currentBGPosition.indexOf("in")>0)||(currentBGPosition.indexOf("pc")>0)||(currentBGPosition.indexOf("cm")>0)||(currentBGPosition.indexOf("mm")>0))
{position=toPixels(currentBGPosition);}
return position;}
function elementHasCSSBGPNG(element)
{return(element.currentStyle&&element.currentStyle.backgroundImage&&(element.currentStyle.backgroundImage.indexOf('url(')!=-1)&&(element.currentStyle.backgroundImage.indexOf('.png")')!=-1));}
function fixupIEPNGBG(oBlock)
{if(oBlock)
{if(elementHasCSSBGPNG(oBlock))
{var currentBGImage=oBlock.currentStyle.backgroundImage;var currentBGRepeat=oBlock.currentStyle.backgroundRepeat;var currentBGPositionX=oBlock.currentStyle.backgroundPositionX;var currentBGPositionY=oBlock.currentStyle.backgroundPositionY;var urlStart=currentBGImage.indexOf('url(');var urlEnd=currentBGImage.indexOf(')',urlStart);var imageURL=currentBGImage.substring(urlStart+4,urlEnd);if(imageURL.charAt(0)=='"')
{imageURL=imageURL.substring(1);}
if(imageURL.charAt(imageURL.length-1)=='"')
{imageURL=imageURL.substring(0,imageURL.length-1);}
imageURL=IEConvertURLForPNGFix(imageURL);var overrideRepeat=false;var filterStyle="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+
imageURL+"', sizingMethod='crop');";var fixupIEPNGBG_helper=function(img)
{var tileWidth=img.width;var tileHeight=img.height;var blockWidth=0;var blockHeight=0;if(oBlock.style.width)
{blockWidth=parseInt(oBlock.style.width,10);}
else
{blockWidth=oBlock.offsetWidth;}
if(oBlock.style.height)
{blockHeight=parseInt(oBlock.style.height,10);}
else
{blockHeight=oBlock.offsetHeight;}
var blockPaddingLeft=parseInt(oBlock.style.paddingLeft||0,10);if((blockWidth===0)||(blockHeight===0))
{return;}
var wholeRows=1;var wholeCols=1;var extraHeight=0;var extraWidth=0;if(((currentBGRepeat.indexOf("repeat-x")!=-1)&&(tileWidth==1)&&(tileHeight==blockHeight))||((currentBGRepeat.indexOf("repeat-y")!=-1)&&(tileWidth==blockWidth)&&(tileHeight==1))||((currentBGRepeat=="repeat")&&(tileWidth==1)&&(tileHeight==1)))
{tileWidth=blockWidth;tileHeight=blockHeight;filterStyle="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+
imageURL+"', sizingMethod='scale');";}
else if((currentBGRepeat.indexOf("no-repeat")!=-1)||((tileWidth===0)&&(tileHeight===0)))
{tileWidth=blockWidth;tileHeight=blockHeight;}
else if((currentBGRepeat.indexOf("repeat-x")!=-1)||(tileHeight===0))
{wholeCols=Math.floor(blockWidth/tileWidth);extraWidth=blockWidth-(tileWidth*wholeCols);tileHeight=blockHeight;}
else if(currentBGRepeat.indexOf("repeat-y")!=-1)
{wholeRows=Math.floor(blockHeight/tileHeight);extraHeight=blockHeight-(tileHeight*wholeRows);tileWidth=blockWidth;}
else
{wholeCols=Math.floor(blockWidth/tileWidth);wholeRows=Math.floor(blockHeight/tileHeight);extraWidth=blockWidth-(tileWidth*wholeCols);extraHeight=blockHeight-(tileHeight*wholeRows);}
var wrappedContent=$(document.createElement("div"));var pngBGFixIsWrappedContentEmpty=true;wrappedContent.setStyle({position:"relative",zIndex:"1",left:0,top:0,background:"transparent"});if(!isNaN(parseInt(oBlock.style.width,10)))
{wrappedContent.style.width=px(blockWidth);}
if(!isNaN(parseInt(oBlock.style.height,10)))
{wrappedContent.style.height=px(blockHeight);}
while(oBlock.hasChildNodes())
{if(oBlock.firstChild.nodeType==3)
{if(RegExp("^ *$").exec(oBlock.firstChild.data)===null)
{pngBGFixIsWrappedContentEmpty=false;}}
else
{pngBGFixIsWrappedContentEmpty=false;}
wrappedContent.appendChild(oBlock.firstChild);}
if(pngBGFixIsWrappedContentEmpty)
{wrappedContent.style.lineHeight=0;}
var bgPositionX=backgroundPositionDimension(oBlock,currentBGPositionX,blockWidth,img.width);var bgPositionY=backgroundPositionDimension(oBlock,currentBGPositionY,blockHeight,img.height);bgPositionX-=blockPaddingLeft;var newMarkup="";for(var currentRow=0;currentRow<wholeRows;currentRow++)
{for(currentCol=0;currentCol<wholeCols;currentCol++)
{newMarkup+="<div class='pngtile' style="+"\"position: absolute; line-height: 0px; "+"width: "+((tileWidth==blockWidth)?"100%":px(tileWidth))+"; "+"height: "+((tileHeight==blockHeight)?"100%":px(tileHeight))+"; "+"left:"+(bgPositionX+(currentCol*tileWidth))+"px; "+"top:"+(bgPositionY+(currentRow*tileHeight))+"px; "+"filter:"+filterStyle+"\" > </div>";}
if(extraWidth!==0)
{newMarkup+="<div class='pngtile' style="+"\"position: absolute; line-height: 0px; "+"width: "+extraWidth+"px; "+"height: "+tileHeight+"px; "+"left:"+(bgPositionX+(currentCol*tileWidth))+"px; "+"top:"+(bgPositionY+(currentRow*tileHeight))+"px; "+"filter:"+filterStyle+"\" > </div>";}}
if(extraHeight!==0)
{for(currentCol=0;currentCol<wholeCols;currentCol++)
{newMarkup+="<div class='pngtile' style="+"\"position: absolute; line-height: 0px; "+"width: "+tileWidth+"px; "+"height: "+extraHeight+"px; "+"left:"+(bgPositionX+(currentCol*tileWidth))+"px; "+"top:"+(bgPositionY+(currentRow*tileHeight))+"px; "+"filter:"+filterStyle+"\" > </div>";}
if(extraWidth!==0)
{newMarkup+="<div class='pngtile' style="+"\"position: absolute; line-height: 0px; "+"width: "+extraWidth+"px; "+"height: "+extraHeight+"px; "+"left:"+(bgPositionX+(currentCol*tileWidth))+"px; "+"top:"+(bgPositionY+(currentRow*tileHeight))+"px; "+"filter:"+filterStyle+"\" > </div>";}}
oBlock.innerHTML=newMarkup;if(!pngBGFixIsWrappedContentEmpty)
{oBlock.appendChild(wrappedContent);}
oBlock.style.background="";}
var backgroundImage=new Image();backgroundImage.src=imageURL;if(backgroundImage.complete)
{fixupIEPNGBG_helper(backgroundImage);}
else
{backgroundImage.onload=fixupIEPNGBG_helper.bind(null,backgroundImage);}}}}
function fixupIEPNGBGsInTree(oAncestor,forceAutoFixup)
{if(shouldApplyCSSBackgroundPNGFix())
{try
{var allDivs=$(oAncestor).select('div');if(isDiv(oAncestor))
{allDivs.push(oAncestor);}
allDivs.each(function(oNode)
{if((!($(oNode).hasClassName("noAutoPNGFix"))&&!($(oNode).hasClassName("noAutoPNGFixInTree"))&&($(oNode.up(".noAutoPNGFixInTree")==undefined)))||forceAutoFixup)
{fixupIEPNGBG(oNode);}});}
catch(e)
{}}}
function fixupAllIEPNGBGs()
{setTimeout(fixupIEPNGBGsInTree.bind(null,document),1);}
function optOutOfCSSBackgroundPNGFix(element)
{if(shouldApplyCSSBackgroundPNGFix())
{$(element).select('div').each(function(div)
{if(elementHasCSSBGPNG(div))
{$(div).addClassName("noAutoPNGFix");}});}}
function fixupIECSS3Opacity(strElementID)
{if(windowsInternetExplorer)
{var oNode=$(strElementID);if(oNode&&(parseFloat(oNode.currentStyle.getAttribute('opacity'))<1))
{var opacity=parseFloat(oNode.currentStyle.getAttribute('opacity'));oNode.style.height=px(oNode.offsetHeight);var targetNode=oNode;if(oNode.tagName.toLowerCase()=='img')
{targetNode=$(document.createElement('div'));targetNode.setStyle({position:oNode.style.position,top:oNode.style.top,left:oNode.style.left,width:oNode.style.width,height:oNode.style.height,opacity:oNode.style.opacity,zIndex:oNode.style.zIndex});oNode.setStyle({left:0,top:0,opacity:''});if(oNode.parentNode.tagName.toLowerCase()=='a')
{var anchor=oNode.parentNode;anchor.parentNode.insertBefore(targetNode,anchor);targetNode.appendChild(anchor);}
else
{oNode.parentNode.insertBefore(targetNode,oNode);targetNode.appendChild(oNode);}}
else if(oNode.tagName.toLowerCase()=='div')
{var bufferWidth=100;var oNodeWidth=oNode.offsetWidth;var oNodeHeight=oNode.offsetHeight;extents=new IWExtents(-bufferWidth,-bufferWidth,oNodeWidth+bufferWidth,oNodeHeight*2+bufferWidth);var positionStyleVal=oNode.getStyle("position");var floatStyleVal=oNode.getStyle("float");var positioned=((positionStyleVal=="relative")||(positionStyleVal=="absolute"));var absolutelyPositioned=(positionStyleVal=="absolute"&&(floatStyleVal=="none"));targetNode=$(document.createElement('div'));var classString=oNode.className;classString=classString.replace(/(shadow_\d+)/g,'');classString=classString.replace(/(stroke_\d+)/g,'');classString=classString.replace(/(reflection_\d+)/g,'');targetNode.className=classString;targetNode.setStyle({position:positioned?positionStyleVal:"relative",styleFloat:floatStyleVal,clear:oNode.getStyle("clear"),width:px(extents.right-extents.left),height:px(extents.bottom-extents.top),opacity:oNode.style.opacity,zIndex:oNode.style.zIndex});if(absolutelyPositioned)
{targetNode.setStyle({top:px((parseFloat(oNode.getStyle("top"))||0)+extents.top),left:px((parseFloat(oNode.getStyle("left"))||0)+extents.left)});}
else
{targetNode.setStyle({marginTop:px((parseFloat(oNode.getStyle("marginTop"))||0)+extents.top),marginLeft:px((parseFloat(oNode.getStyle("marginLeft"))||0)+extents.left),marginBottom:px((parseFloat(oNode.getStyle("marginBottom"))||0)-
(extents.bottom-oNodeHeight)),marginRight:px((parseFloat(oNode.getStyle("marginRight"))||0)-
(extents.right-oNodeWidth))});}
oNode.setStyle({position:"absolute",styleFloat:"none",clear:"none",left:px(-extents.left),top:px(-extents.top),margin:0,verticalAlign:'baseline',display:'block',opacity:''});if(effectiveBrowserVersion<7||actualBrowserVersion>=8)
{oNode.className=oNode.className.replace(/(shadow_\d+)/g,'');}
oNode.parentNode.insertBefore(targetNode,oNode);targetNode.appendChild(oNode);}
$(targetNode).setFilter('progid:DXImageTransform.Microsoft.BasicImage','opacity='+opacity);}}}
function IWSetDivOpacity(div,fraction,suppressFilterRemoval)
{if(windowsInternetExplorer)
{if(fraction<.99||(suppressFilterRemoval==true))
{$(div).setFilter('alpha','opacity='+fraction*100);}
else
{$(div).killFilter('alpha');}}
else
{$(div).setOpacity(fraction);}}
function IMpreload(path,name,areaIndex)
{var rolloverName=name+'_rollover_'+areaIndex;var rolloverPath=path+'/'+rolloverName+'.png';self[rolloverName]=new Image();self[rolloverName].src=rolloverPath;var linkName=name+'_link_'+areaIndex;var linkPath=path+'/'+linkName+'.png';self[linkName]=new Image();self[linkName].src=linkPath;return true;}
function swapAlphaImageLoaderFilterSrc(img,src)
{var filterName='progid:DXImageTransform.Microsoft.AlphaImageLoader';var filterParams='src="'+IEConvertURLForPNGFix(src)+'", sizingMethod="scale"';img.setFilter(filterName,filterParams);img.originalSrc=img.src;}
function IMmouseover(name,areaIndex)
{var rolloverName=name+'_rollover_'+areaIndex;var linkName=name+'_link_'+areaIndex;var img=$(linkName);if(img)
{if(windowsInternetExplorer&&img.originalSrc)
{swapAlphaImageLoaderFilterSrc(img,self[rolloverName].src);}
else
{img.src=self[rolloverName].src;}}
return true;}
function IMmouseout(name,areaIndex)
{var linkName=name+'_link_'+areaIndex;var img=$(linkName);if(img)
{if(windowsInternetExplorer&&img.originalSrc)
{swapAlphaImageLoaderFilterSrc(img,self[linkName].src);}
else
{img.src=self[linkName].src;}}
return true;}
var quicktimeAvailable=false;var quicktimeVersion702=false;var isQuicktimeDetectionInitialized=false;var minVersionNum=0x7028000;var minVersionArray=['7','0','2'];function initializeQuicktimeDetection()
{if((navigator.plugins!==null)&&(navigator.plugins.length>0))
{for(i=0;i<navigator.plugins.length;i++)
{var plugin=navigator.plugins[i];if(plugin.name.toLowerCase().indexOf('quicktime plug-in ')!=-1)
{quicktimeAvailable=true;quicktimeVersionString=plugin.name.substring(18);var qtVersionArray=quicktimeVersionString.split('.');for(j=0;j<minVersionArray.length&&j<qtVersionArray.length;j++)
{var qtVersionComponent=qtVersionArray[j];var minVersionComponent=minVersionArray[j];if((qtVersionComponent>minVersionComponent)||((qtVersionComponent==minVersionComponent)&&(j==minVersionArray.length-1)))
{quicktimeVersion702=true;break;}
else if(qtVersionComponent<minVersionComponent)
{break;}}
break;}}}
else if(window.ActiveXObject)
{try
{quicktimeObj=new ActiveXObject('QuickTimeCheckObject.QuickTimeCheck.1');if(quicktimeObj!==null)
{quicktimeAvailable=true;quicktimeVersionNum=quicktimeObj.QuickTimeVersion;if(quicktimeVersionNum>=minVersionNum)
{quicktimeVersion702=true;}}}
catch(e)
{}}
isQuicktimeDetectionInitialized=true;}
function fixupPodcast(mediaId,anchorId)
{if(!isQuicktimeDetectionInitialized)
{initializeQuicktimeDetection();}
if(!quicktimeVersion702)
{var oMediaElem=$(mediaId);var oAnchorElem=$(anchorId);if(oMediaElem&&oAnchorElem)
{oAnchorElem.style.display='inline';oMediaElem.parentNode.removeChild(oMediaElem);}}}
function allListBulletImagesContainedBy(node)
{var result=[];for(var i=0;i<node.childNodes.length;++i)
{var child=node.childNodes[i];if((child.nodeName=="IMG")&&((node.nodeName=="SPAN")||(node.nodeName=="A"))&&(node.parentNode!=null)&&(node.parentNode.nodeName=="P")&&(node.parentNode.parentNode!=null)&&(node.parentNode.parentNode.nodeName=="LI"))
{result=result.concat([child]);}
result=result.concat(allListBulletImagesContainedBy(child));}
return result;}
function hideAllListBulletImagesContainedBy(node)
{$A(allListBulletImagesContainedBy(node)).invoke('hide');}
function showAllListBulletImagesContainedBy(node)
{$A(allListBulletImagesContainedBy(node)).invoke('show');}
function getChildOfType(oParent,sNodeName,requestedIndex)
{var childrenOfType=$(oParent).select(sNodeName);return(requestedIndex<childrenOfType.length)?childrenOfType.item(requestedIndex):null;}
function containsFixedHeightIntermediate(oDescendant,oAncestor)
{if(oDescendant===oAncestor||oDescendant==null)
{return false;}
else if(parseFloat(oDescendant.style.height)>0)
{return true;}
else
{return containsFixedHeightIntermediate(oDescendant.parentNode,oAncestor);}}
function getShrinkableParaDescendants(oAncestor)
{return $(oAncestor).select('div.paragraph, p').findAll(function(paragraph){return!containsFixedHeightIntermediate(paragraph,oAncestor);});}
var MINIMUM_FONT="10";var UNITS="";function elementFontSize(element)
{var fontSize=MINIMUM_FONT;if(document.defaultView)
{var computedStyle=document.defaultView.getComputedStyle(element,null);if(computedStyle)
{fontSize=computedStyle.getPropertyValue("font-size");}}
else if(element.currentStyle)
{fontSize=element.currentStyle.fontSize;}
if((UNITS.length===0)&&(fontSize!=MINIMUM_FONT))
{UNITS=fontSize.substring(fontSize.length-2,fontSize.length);}
return parseFloat(fontSize);}
function isExceptionToOneLineRule(element)
{return $(element).hasClassName("Header");}
var HEIGHT_ERROR_MARGIN=2;function adjustFontSizeIfTooBig(idOfElement)
{var oParagraphDiv;var oSpan;var oTextBoxInnerDiv;var oTextBoxOuterDiv=$(idOfElement);if(oTextBoxOuterDiv)
{oTextBoxInnerDiv=oTextBoxOuterDiv.selectFirst("div.text-content");if(oTextBoxInnerDiv)
{hideAllListBulletImagesContainedBy(oTextBoxInnerDiv);var offsetHeight=oTextBoxInnerDiv.offsetHeight;var specifiedHeight=offsetHeight;if(oTextBoxOuterDiv.style.height!=="")
{specifiedHeight=parseFloat(oTextBoxOuterDiv.style.height);}
if(offsetHeight>(specifiedHeight+HEIGHT_ERROR_MARGIN))
{var smallestFontSize=200;var aParaChildren=getShrinkableParaDescendants(oTextBoxInnerDiv);var oneLine=false;var exceptionToOneLineRule=false;for(i=0;i<aParaChildren.length;i++)
{oParagraphDiv=aParaChildren[i];var lineHeight=elementLineHeight(oParagraphDiv);if(!isNaN(lineHeight))
{oneLine=oneLine||(lineHeight*1.5>=specifiedHeight);exceptionToOneLineRule=oneLine&&isExceptionToOneLineRule(oParagraphDiv);}
var fontSize=elementFontSize(oParagraphDiv);if(!isNaN(fontSize))
{smallestFontSize=Math.min(smallestFontSize,fontSize);}
for(j=0;j<oParagraphDiv.childNodes.length;j++)
{oSpan=oParagraphDiv.childNodes[j];if((oSpan.nodeName=="SPAN")||(oSpan.nodeName=="A"))
{fontSize=elementFontSize(oSpan);if(!isNaN(fontSize))
{smallestFontSize=Math.min(smallestFontSize,fontSize);}}}}
var minimum=parseFloat(MINIMUM_FONT);var count=0;while((smallestFontSize>minimum)&&(offsetHeight>(specifiedHeight+HEIGHT_ERROR_MARGIN))&&(count<10))
{++count;if(oneLine&&!exceptionToOneLineRule)
{var oldWidth=parseInt(oTextBoxOuterDiv.style.width,10);oTextBoxInnerDiv.style.width=px(oldWidth*Math.pow(1.05,count));}
else
{var scale=Math.max(0.95,minimum/smallestFontSize);for(i=0;i<aParaChildren.length;i++)
{oParagraphDiv=aParaChildren[i];var paraFontSize=elementFontSize(oParagraphDiv)*scale;var paraLineHeight=elementLineHeight(oParagraphDiv)*scale;for(j=0;j<oParagraphDiv.childNodes.length;j++)
{oSpan=oParagraphDiv.childNodes[j];if((oSpan.nodeName=="SPAN")||(oSpan.nodeName=="A"))
{var spanLineHeight=elementLineHeight(oSpan)*scale;if(!isNaN(spanLineHeight))
{oSpan.style.lineHeight=spanLineHeight+UNITS;}
var spanFontSize=elementFontSize(oSpan)*scale;if(!isNaN(spanFontSize))
{oSpan.style.fontSize=spanFontSize+UNITS;smallestFontSize=Math.min(smallestFontSize,spanFontSize);}}}
if(!isNaN(paraLineHeight))
{oParagraphDiv.style.lineHeight=paraLineHeight+UNITS;}
if(!isNaN(paraFontSize))
{oParagraphDiv.style.fontSize=paraFontSize+UNITS;smallestFontSize=Math.min(smallestFontSize,paraFontSize);}}}
offsetHeight=oTextBoxInnerDiv.offsetHeight;}}
showAllListBulletImagesContainedBy(oTextBoxInnerDiv);}}}
function elementLineHeight(element)
{var lineHeight=MINIMUM_FONT;if(document.defaultView)
{var computedStyle=document.defaultView.getComputedStyle(element,null);if(computedStyle)
{lineHeight=computedStyle.getPropertyValue("line-height");}}
else if(element.currentStyle)
{lineHeight=element.currentStyle.lineHeight;}
if((UNITS.length===0)&&(lineHeight!=MINIMUM_FONT))
{UNITS=lineHeight.substring(lineHeight.length-2,lineHeight.length);}
return parseFloat(lineHeight);}
function adjustLineHeightIfTooBig(idOfElement)
{var oTextBoxInnerDiv;var oTextBoxOuterDiv=$(idOfElement);if(oTextBoxOuterDiv)
{oTextBoxInnerDiv=oTextBoxOuterDiv.selectFirst("div.text-content");if(oTextBoxInnerDiv)
{hideAllListBulletImagesContainedBy(oTextBoxInnerDiv);var offsetHeight=oTextBoxInnerDiv.offsetHeight;var specifiedHeight=offsetHeight;if(oTextBoxOuterDiv.style.height!=="")
{specifiedHeight=parseFloat(oTextBoxOuterDiv.style.height);}
if(offsetHeight>(specifiedHeight+HEIGHT_ERROR_MARGIN))
{var adjusted=true;var count=0;while((adjusted)&&(offsetHeight>(specifiedHeight+HEIGHT_ERROR_MARGIN))&&(count<10))
{adjusted=false;++count;var aParaChildren=getShrinkableParaDescendants(oTextBoxInnerDiv);for(i=0;i<aParaChildren.length;i++)
{var fontSize;var lineHeight;var oParagraphDiv=aParaChildren[i];fontSize=elementFontSize(oParagraphDiv);lineHeight=elementLineHeight(oParagraphDiv)*0.95;if(!isNaN(lineHeight)&&lineHeight>=(fontSize*1.1))
{oParagraphDiv.style.lineHeight=lineHeight+UNITS;adjusted=true;}
for(j=0;j<oParagraphDiv.childNodes.length;j++)
{var oSpan=oParagraphDiv.childNodes[j];if((oSpan.nodeName=="SPAN")||(oSpan.nodeName=="A"))
{fontSize=elementFontSize(oSpan);lineHeight=elementLineHeight(oSpan)*0.95;if(!isNaN(lineHeight)&&lineHeight>=(fontSize*1.1))
{oSpan.style.lineHeight=lineHeight+UNITS;adjusted=true;}}}}
offsetHeight=oTextBoxInnerDiv.offsetHeight;}}
showAllListBulletImagesContainedBy(oTextBoxInnerDiv);}}}
function isDiv(node)
{return(node.nodeType==Node.ELEMENT_NODE)&&(node.tagName=="DIV");}
function fixupAllMozInlineBlocks()
{if(isFirefox||isCamino)
{var oInlineBlocks=$$("div.inline-block");for(var i=0,inlineBlocksLength=oInlineBlocks.length;i<inlineBlocksLength;++i)
{var oInlineBlock=oInlineBlocks[i];var oInterposingDiv=document.createElement("div");oInterposingDiv.style.position="relative";oInterposingDiv.style.overflow="visible";for(var j=0,childNodesLength=oInlineBlock.childNodes.length;j<childNodesLength;++j)
{var oChildNode=oInlineBlock.childNodes[0];oInlineBlock.removeChild(oChildNode);oInterposingDiv.appendChild(oChildNode);}
oInlineBlock.appendChild(oInterposingDiv);}}}
function getWidthDefiningAncestor(elem)
{return elem.up('[style~="width:"]')||document.body;}
function updateListOfIE7FloatsFix(div)
{var div=$(div);var floatValue=div.getStyle("float");if(floatValue=="left"||floatValue=="right")
{var commonAncestor=getWidthDefiningAncestor(div);var floatDescendants=commonAncestor.select('[style~="float:"]');while(floatDescendants.length>0)
{var floatElem=floatDescendants.shift();floatValue=floatElem.getStyle("float");if(floatValue=="left"||floatValue=="right")
{var floatAncestor=getWidthDefiningAncestor(floatElem);if(floatAncestor===commonAncestor)
{if(!listOfIE7FloatsFix.include(floatElem))
{listOfIE7FloatsFix.push(floatElem);}}}}}}
function fixupFloatsIfIE7()
{if(windowsInternetExplorer&&effectiveBrowserVersion==7)
{if(listOfIE7FloatsFix.length>0)
{var floatsToRestore=[];var floatElem;var displayStyle;while(listOfIE7FloatsFix.length>0)
{floatElem=listOfIE7FloatsFix.shift();displayStyle=floatElem.getStyle("display");$(floatElem).hide();floatsToRestore.push({element:floatElem,displayStyle:displayStyle});}
while(floatsToRestore.length>0)
{var queueEntry=floatsToRestore.shift();floatElem=queueEntry.element;displayStyle=queueEntry.displayStyle;$(floatElem).setStyle({"display":displayStyle});}}}}
function joltLater(element)
{setTimeout(function(element){$(element).hide();}.bind(null,element),100);setTimeout(function(element){$(element).show();}.bind(null,element),200);}
function performPostEffectsFixups()
{fixupAllMozInlineBlocks();fixupFloatsIfIE7();}
function reduceLeftMarginIfIE6(element)
{if(windowsInternetExplorer&&effectiveBrowserVersion<7)
{$(element).style.marginLeft=px(parseFloat($(element).style.marginLeft||0)-1);}}
function reduceRightMarginIfIE6(element)
{if(windowsInternetExplorer&&effectiveBrowserVersion<7)
{$(element).style.marginRight=px(parseFloat($(element).style.marginRight||0)-1);}}
Object.objectType=function(obj)
{var result=typeof obj;if(result=="object")
{if(obj.constructor==Array)
result="Array";}
return result;}
var trace=function(){};function ajaxGetDocumentElement(req)
{var dom=null;if(req)
{if(req.responseXML&&req.responseXML.documentElement)
{dom=req.responseXML;}
else if(req.responseText)
{if(window.DOMParser)
{dom=(new DOMParser()).parseFromString(req.responseText,"text/xml");}
else if(window.ActiveXObject)
{dom=new ActiveXObject("MSXML.DOMDocument");if(dom)
{dom.async=false;dom.loadXML(req.responseText);}}}}
return dom?dom.documentElement:null;}
function iWLog(str)
{if(window.console)
{window.console.log(str);}
else if(window.dump)
{window.dump(str+"\n");}}
function iWPosition(abs,left,top,width,height)
{var pos="";if(abs)
pos="position: absolute; ";var size="";if(width&&height)
size=' width: '+width+'px; height: '+height+'px;';return pos+'left: '+left+'px; top: '+top+'px;'+size;}
var gIWUtilsTransparentGifURL="";function setTransparentGifURL(url)
{if(gIWUtilsTransparentGifURL=="")
{gIWUtilsTransparentGifURL=url;}}
function transparentGifURL()
{(function(){return gIWUtilsTransparentGifURL!=""}).assert("Transparent image URL not set");return gIWUtilsTransparentGifURL;}
function imgMarkup(src,style,attributes,alt,forceFixupIE7)
{var markup="";if(src)
{style=style||"";attributes=attributes||"";alt=alt||"";if(windowsInternetExplorer&&((effectiveBrowserVersion<7)||(effectiveBrowserVersion<8&&forceFixupIE7!==false)))
{style+=" filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+IEConvertURLForPNGFix(src)+"', sizingMethod='scale');";src=gIWUtilsTransparentGifURL;}
if(style.length>0)
{style=' style="'+style+'"';}
if(attributes.length>0)
{attributes=' '+attributes;}
if(alt.length>0)
{alt=' alt="'+alt.stringByEscapingXML(true)+'"';}
markup='<img src="'+src+'"'+style+attributes+alt+' />';}
return markup;}
function setImgSrc(imgElement,src,forceFixupIE7)
{if(windowsInternetExplorer&&((effectiveBrowserVersion<7)||(effectiveBrowserVersion<8&&forceFixupIE7!==false))&&src.slice(-4).toLowerCase()==".png")
{$(imgElement).setFilter('progid:DXImageTransform.Microsoft.AlphaImageLoader','src="'+IEConvertURLForPNGFix(src)+'", sizingMethod="scale"');imgElement.src=gIWUtilsTransparentGifURL;}
else
{imgElement.src=src;}}
function iWOpacity(opacity)
{var style="";if(windowsInternetExplorer)
{style=" progid:DXImageTransform.Microsoft.Alpha(opacity="+opacity*100+"); ";}
else
{style=" opacity: "+opacity+"; ";}
return style;}
var IWRange=Class.create({initialize:function(location,length)
{this.setLocation(location);this.setLength(length);},length:function()
{return this.p_length;},setLength:function(length)
{this.p_length=parseFloat(length);},location:function()
{return this.p_location;},setLocation:function(location)
{this.p_location=parseFloat(location);},max:function()
{return this.location()+this.length();},min:function()
{return this.location();},shift:function(amount)
{this.setLocation(this.location()+amount);},containsLocation:function(location)
{return((location>=this.min())&&(location<this.max()));}});var IWPageRange=Class.create(IWRange,{initialize:function($super,location,length)
{$super(location,length);},setMax:function(newMax)
{var maxLength=this.p_lengthForMax(newMax);this.setLocation(Math.max(newMax-maxLength,0))
this.setLength(newMax-this.location());},shift:function($super,amount)
{$super(amount);this.setMax(this.max());},p_lengthForMax:function(max)
{return(max<=9)?5:3;}});function px(s)
{return s.toString()+"px";}
function depx(s)
{return parseInt(s||0);}
function locationHRef()
{var result=window.location.href;if(result.match(/file:\/[^\/]/))
{result="file://"+result.substr(5);}
return result;}
function IWZeroSize()
{return new IWSize(0,0);}
var IWSize=Class.create({initialize:function(width,height)
{this.width=width;this.height=height;},scale:function(hscale,vscale,round)
{if(round===undefined)round=false;if(vscale===undefined)vscale=hscale;var scaled=new IWSize(this.width*hscale,this.height*vscale);if(round)
{scaled.width=Math.round(scaled.width);scaled.height=Math.round(scaled.height);}
return scaled;},scaleToTargetSize:function(targetSize,fitTarget)
{var scaledSize=new IWSize(this.width,this.height);if(scaledSize.width>0&&scaledSize.height>0)
{var wScale=targetSize.width/scaledSize.width;var hScale=targetSize.height/scaledSize.height;var scale=fitTarget?Math.min(wScale,hScale):Math.max(wScale,hScale);scaledSize.width*=scale;scaledSize.height*=scale;}
return scaledSize;},scaleToFit:function(sizeToFit)
{return this.scaleToTargetSize(sizeToFit,true);},round:function()
{return this.scale(1,1,true);},toString:function()
{return"Size("+this.width+", "+this.height+")";},aspectRatio:function()
{return this.width/this.height;},subtractSize:function(s)
{return new IWSize(this.width-s.width,this.height-s.height);}});function IWZeroPoint()
{return new IWPoint(0,0);}
var IWPoint=Class.create({initialize:function(x,y)
{this.x=x;this.y=y;},scale:function(hscale,vscale,round)
{if(round===undefined)round=false;if(vscale===undefined)vscale=hscale;var scaled=new IWPoint(this.x*hscale,this.y*vscale);if(round)
{scaled.x=Math.round(scaled.x);scaled.y=Math.round(scaled.y);}
return scaled;},round:function()
{return this.scale(1,1,true);},offset:function(deltaX,deltaY)
{return new IWPoint(this.x+deltaX,this.y+deltaY);},toString:function()
{return"Point("+this.x+", "+this.y+")";}});function IWZeroRect()
{return new IWRect(0,0,0,0);}
var IWRect=Class.create({initialize:function()
{if(arguments.length==1)
{this.origin=arguments[0].origin;this.size=arguments[0].size;}
else if(arguments.length==2)
{this.origin=arguments[0];this.size=arguments[1];}
else if(arguments.length==4)
{this.origin=new IWPoint(arguments[0],arguments[1]);this.size=new IWSize(arguments[2],arguments[3]);}},clone:function()
{return new IWRect(this.origin.x,this.origin.y,this.size.width,this.size.height);},toString:function()
{return"Rect("+this.origin.toString()+", "+this.size.toString()+")";},maxX:function()
{return this.origin.x+this.size.width;},maxY:function()
{return this.origin.y+this.size.height;},union:function(that)
{var minX=Math.min(this.origin.x,that.origin.x);var minY=Math.min(this.origin.y,that.origin.y);var maxX=Math.max(this.maxX(),that.maxX());var maxY=Math.max(this.maxY(),that.maxY());return new IWRect(minX,minY,maxX-minX,maxY-minY);},intersection:function(that)
{var intersectionRect;var minX=Math.max(this.origin.x,that.origin.x);var minY=Math.max(this.origin.y,that.origin.y);var maxX=Math.min(this.maxX(),that.maxX());var maxY=Math.min(this.maxY(),that.maxY());if((minX<maxX)&&(minY<maxY))
{intersectionRect=new IWRect(minX,minY,maxX-minX,maxY-minY);}
else
{intersectionRect=new IWRect(0,0,0,0);}
return intersectionRect;},scale:function(hscale,vscale,round)
{if(round===undefined)round=false;if(vscale===undefined)vscale=hscale;var scaledOrigin=this.origin.scale(hscale,vscale,round);var scaledSize=this.size.scale(hscale,vscale,round);return new IWRect(scaledOrigin.x,scaledOrigin.y,scaledSize.width,scaledSize.height);},scaleSize:function(hscale,vscale,round)
{var scaledSize=this.size.scale(hscale,vscale,round);return new IWRect(this.origin.x,this.origin.y,scaledSize.width,scaledSize.height);},round:function()
{return this.scale(1,1,true);},offset:function(deltaX,deltaY)
{var offsetOrigin=this.origin.offset(deltaX,deltaY);return new IWRect(offsetOrigin.x,offsetOrigin.y,this.size.width,this.size.height);},offsetToOrigin:function()
{return this.offset(-this.origin.x,-this.origin.y)},centerPoint:function()
{return this.offset(this.size.width/2,this.size.height/2);},position:function()
{return iWPosition(true,this.origin.x,this.origin.y,this.size.width,this.size.height);},clip:function()
{return"clip: rect("+this.origin.y+"px, "+this.maxX()+"px, "+this.maxY()+"px, "+this.origin.x+"px);";},toExtents:function()
{return new IWExtents(this.origin.x,this.origin.y,this.origin.x+this.size.width,this.origin.y+this.size.height);},paddingToRect:function(padded)
{return new IWPadding(this.origin.x-padded.origin.x,this.origin.y-padded.origin.y,padded.maxX()-this.maxX(),padded.maxY()-this.maxY());},fill:function(context)
{context.fillRect(this.origin.x,this.origin.y,this.size.width,this.size.height);},clear:function(context)
{context.clearRect(this.origin.x,this.origin.y,this.size.width,this.size.height);}});var IWExtents=Class.create({initialize:function(left,top,right,bottom)
{this.left=left;this.top=top;this.right=right;this.bottom=bottom;},clone:function()
{return new IWExtents(this.left,this.top,this.right,this.bottom);},toRect:function()
{return new IWRect(this.left,this.top,this.right-this.left,this.bottom-this.top);}});var IWPadding=Class.create({initialize:function(left,top,right,bottom)
{this.left=left;this.top=top;this.right=right;this.bottom=bottom;}});var IWNotificationCenter=Class.create({initialize:function()
{this.mDispatchTable=new Array();},addObserver:function(observer,method,name,object)
{this.p_observersForName(name).push(new Array(observer,method,object));},removeObserver:function(observer)
{},postNotification:function(notification)
{if(notification.name()!=null)
{var observersForName=this.mDispatchTable[notification.name()];this.p_postNotificationToObservers(notification,observersForName);}
var observersForNullName=this.mDispatchTable[null];this.p_postNotificationToObservers(notification,observersForNullName);},postNotificationWithInfo:function(name,object,userInfo)
{this.postNotification(new IWNotification(name,object,userInfo));},p_postNotificationToObservers:function(notification,observers)
{if(notification!=null&&observers!=null)
{for(var i=0;i<observers.length;i++)
{var observer=observers[i][0];var method=observers[i][1];var obj=observers[i][2];if(obj==null||obj===notification.object())
{method.call(observer,notification);}}}},p_observersForName:function(name)
{if(this.mDispatchTable[name]===undefined)
{this.mDispatchTable[name]=new Array();}
return this.mDispatchTable[name];}});var NotificationCenter=new IWNotificationCenter();var IWNotification=Class.create({initialize:function(name,object,userInfo)
{this.mName=name;this.mObject=object;this.mUserInfo=userInfo;},name:function()
{return this.mName;},object:function()
{return this.mObject;},userInfo:function()
{return this.mUserInfo;}});var IWAssertionsEnabled=true;function IWAssert(func,description)
{if(IWAssertionsEnabled)
{function IWAssertionFailed(func,description)
{var formatter=new RegExp("return[\t\r ]*([^};\r]*)");var assertionText=func.toString().match(formatter)[1];var message='Assertion failed: "'+assertionText+'"';if(description!=null)
message+='.  '+description;iWLog(message);}
function IWCoreAssert(func,description)
{if(func()==false)
{IWAssertionFailed(func,description);}}
IWCoreAssert(function(){return typeof(func)=='function'},"IWAssert requires its first argument to be a function.  "+"Try wrapping your assertion in function(){return ... }");var result=func();IWCoreAssert(function(){return result!=null},"The result of your assertion function is null; "+"did you remember your return statement?");IWCoreAssert(function(){return result==true||result==false},"The result of your assertion function is neither true nor false");if(result==false)
{IWAssertionFailed(func,description);}}}
Function.prototype.assert=function(description)
{IWAssert(this,description);}
function getTextFromNode(node)
{if(node.textContent)
return node.textContent;if(node.innerText)
return node.innerText;var result="";if(node.nodeType==Node.ELEMENT_NODE)
{var children=node.childNodes;for(var i=0;i<children.length;++i)
{result=result+getTextFromNode(children[i]);}}
else if(node.nodeType==Node.TEXT_NODE)
{return node.nodeValue;}
return result;}
function getChildElementsByTagNameNS(node,ns,nsPrefix,localName)
{var result=[];for(var i=0;i<node.childNodes.length;++i)
{var childNode=node.childNodes[i];if(childNode.namespaceURI)
{if(childNode.namespaceURI==ns)
{if(childNode.localName&&(childNode.localName==localName))
{result.push(childNode);}
else if(childNode.tagName==(nsPrefix+":"+localName))
{result.push(childNode);}}}
else
{if((ns=="")&&(childNode.tagName==localName))
{result.push(childNode);}}}
return result;}
function getFirstChildElementByTagNameNS(node,ns,nsPrefix,localName)
{var children=getChildElementsByTagNameNS(node,ns,nsPrefix,localName);return(children.length>0)?children[0]:null;}
function getChildElementTextByTagName(node,tagName)
{var result="";if(node!==null)
{var children=node.getElementsByTagName(tagName);if(children.length>1)
{throw"MultipleResults";}
if(children.length==1)
{result=getTextFromNode(children[0]);}}
return result;}
function getChildElementTextByTagNameNS(node,ns,nsPrefix,localName)
{var result="";if(node)
{var children=getChildElementsByTagNameNS(node,ns,nsPrefix,localName);if(children.length>1)
throw"MultipleResults";if(children.length==1)
{result=getTextFromNode(children[0]);}}
return result;}
function adjustNodeIds(node,suffix)
{var undefined;if(node.id!="")
{node.id+=("$"+suffix);}
$(node).childElements().each(function(e){adjustNodeIds(e,suffix);});}
function substituteSpans(parentNode,replacements)
{$H(replacements).each(function(pair)
{var selector="span."+pair.key;$(parentNode).select(selector).each(function(node)
{var contentType=pair.value[0];var newContent=pair.value[1];if(contentType=="text")
{node.update(newContent);}
else if(contentType=="html")
{node.innerHTML=newContent;}});});}
Element.addMethods({selectFirst:function(element,tag_name){var elements=$(element).select(tag_name);return(elements.length>0)?$(elements[0]):null;},setVisibility:function(element,visible){element=$(element);if(visible)
{element.style.display='inline';}
else
{element.style.display='none';}
return element;},ensureHasLayoutForIE:function(element)
{element=$(element);if(windowsInternetExplorer&&effectiveBrowserVersion<8)
{if(!element.currentStyle.hasLayout)
{element.style.zoom=1;}}},setFilter:function(element,filterName,filterParams)
{element=$(element);var regex=new RegExp(filterName+'\\([^\\)]*\\);','gi');element.style.filter=element.style.filter.replace(regex,'')+
filterName+'('+filterParams+'); ';return element;},killFilter:function(element,filterName)
{element=$(element);var regex=new RegExp(filterName+'\\([^\\)]*\\);','gi');element.style.filter=element.style.filter.replace(regex,'');return element;},cloneNodeExcludingIDs:function(element,deep)
{var clone=element.cloneNode(deep);if(deep)
{var descendantsWithID=clone.select("[id]");for(var i=0,length=descendantsWithID.length;i<length;++i){descendantsWithID[i].id="";}}
clone.id="";return clone;}});Object.extend(Array.prototype,{contains:function(value)
{return $A(this).indexOf(value)!=-1;},isEqual:function(that)
{if(this.length==that.length)
{for(var i=0;i<this.length;++i)
{if(this[i]!=that[i])
return false;}
return true;}
return false;},minusArray:function(that)
{var result=$A(this);$A(that).each(function(e){result=result.without(e);});return result;}});String.stringWithFormat=function(format)
{var formatted="";var nextArgument=1;var formatPattern=/%((\d+)\$)?([%s])?/;while(true)
{foundIndex=format.search(formatPattern);if(foundIndex==-1)
{formatted+=format;break;}
if(foundIndex>0)
{formatted+=format.substring(0,foundIndex)}
var matchInfo=format.match(formatPattern);var formatCharacter=matchInfo[3];if(formatCharacter=="%")
{formatted+="%";}
else
{if(matchInfo[2])
{argumentNumber=parseInt(matchInfo[2]);}
else
{argumentNumber=nextArgument++;}
argument=(argumentNumber<arguments.length)?arguments[argumentNumber]:"";if(formatCharacter=="s")
{formatted+=argument;}}
format=format.substring(foundIndex+matchInfo[0].length);}
return formatted;}
Object.extend(String.prototype,{lastPathComponent:function()
{return this.substr(this.lastIndexOf("/")+1);},pathExtension:function()
{var lastSeparatorIndex=this.lastIndexOf("/");var lastDotIndex=this.lastIndexOf(".");return((lastDotIndex>lastSeparatorIndex+1)&&lastDotIndex>0)?this.slice(lastDotIndex+1):this;},stringByDeletingLastPathComponent:function()
{return this.substr(0,this.lastIndexOf("/"));},stringByDeletingPathExtension:function()
{var lastSeparatorIndex=this.lastIndexOf("/");var lastDotIndex=this.lastIndexOf(".");if((lastDotIndex>lastSeparatorIndex+1)&&lastDotIndex>0)
return this.slice(0,lastDotIndex);return this;},stringByAppendingPathComponent:function(component)
{return this.endsWith("/")?(this+component):(this+"/"+component);},stringByAppendingAsQueryString:function(parameters)
{return this+'?'+$H(parameters).toQueryString();},stringByUnescapingXML:function()
{var str=this.replace(/&lt;/g,'<');str=str.replace(/&gt;/g,'>');str=str.replace(/&quot;/g,'"');str=str.replace(/&apos;/g,"'");str=str.replace(/&amp;/g,'&');return str;},stringByEscapingXML:function(escapeAdditionalCharacters)
{var str=this.replace(/&/g,'&amp;');str=str.replace(/</g,'&lt;');if(escapeAdditionalCharacters)
{str=str.replace(/>/g,'&gt;');str=str.replace(/"/g,'&quot;');str=str.replace(/'/g,'&apos;');}
return str;},stringByConvertingNewlinesToBreakTags:function()
{return this.replace(/\n\r|\n|\r/g,'<br />');},urlStringByDeletingQueryAndFragment:function()
{var result=this;var lastIndex=result.lastIndexOf("?");if(lastIndex>0)
return result.substr(0,lastIndex);lastIndex=result.lastIndexOf("#");if(lastIndex>0)
result=result.substr(0,lastIndex);return result;},toRelativeURL:function(baseURL)
{var result=this;if(baseURL&&this.indexOf(baseURL)==0)
{var chop=baseURL.length;if(this.charAt(chop)=='/')
++chop;result=this.substring(chop);}
return result;},toAbsoluteURL:function()
{var result=this;if(this.indexOf(":/")==-1)
{var pageURL=document.URL.urlStringByDeletingQueryAndFragment();var pathURL=pageURL.stringByDeletingLastPathComponent();result=pathURL.stringByAppendingPathComponent(this);}
return result;},toRebasedURL:function(baseURL)
{return this.toRelativeURL(baseURL).toAbsoluteURL();},httpURLRegExp:function()
{if(String.m_httpurlRegExp==undefined)
{var alpha="[A-Za-z]";var digit="[0-9]";var safe="[$_.+-]";var extra="[!*'(),]";var unreserved="("+alpha+"|"+digit+"|"+safe+"|"+extra+")";var hex="("+digit+"|"+"[A-Fa-f])";var escapeSeq="(%"+hex+hex+")";var uchar="("+unreserved+"|"+escapeSeq+")";var alphadigit="("+alpha+"|"+digit+")";var digits=digit+"+";var hostnumber="("+digits+"\\."+digits+"\\."+digits+"\\."+digits+")";var toplabel="(("+alpha+"("+alpha+"|"+"-)*"+alphadigit+")|"+alpha+")";var domainlabel="(("+alphadigit+"("+alphadigit+"|"+"-)*"+alphadigit+")|"+alphadigit+")";var hostname="(("+domainlabel+"\\.)*"+toplabel+")";var host="("+hostname+"|"+hostnumber+")";var port=digits;var hostport="(("+host+")(:"+port+")?)";var hsegment="((("+uchar+")|[;:@&=])*)";var search="((("+uchar+")|[;:@&=])*)";var hpath="("+hsegment+"(/"+hsegment+")*)";var httpurl="((http)|(feed)|(https))://"+hostport+"(/"+hpath+"(\\?"+search+")?)?"
String.m_httpurlRegExp=new RegExp(httpurl);}
return String.m_httpurlRegExp;},isHTTPURL:function()
{var matchResult=this.match(this.httpURLRegExp());return matchResult?(matchResult[0]==this):false;},firstHTTPURL:function()
{var matchResult=this.match(this.httpURLRegExp());return matchResult?matchResult[0]:undefined;},httpURLQueryString:function()
{var charIndex=this.indexOf("?");charIndex=((charIndex==-1)?this.indexOf("&"):charIndex);return(charIndex==-1)?"":this.slice(charIndex+1);},plaintextgsub:function(pattern,replacement)
{var value=this;while(true)
{var index=value.indexOf(pattern);if(index==-1)
break;value=value.substr(0,index)+replacement+value.substr(index+pattern.length);}
return value;}});function IWURL(urlString)
{try
{if((arguments.length==0)||(arguments.length==1&&(urlString==""||urlString==null)))
{this.p_initWithParts(null,null,null,null,null);}
else if(arguments.length==1)
{urlString.replace("file://localhost/","file:///");var urlParts=urlString.match(/^([A-Z]+):\/\/([^/]*)((\/[^?#]*)(\?([^#]*))?(#(.*))?)?/i);if(urlParts)
{this.p_initWithParts(urlParts[1],urlParts[2],urlParts[4]||"/",urlParts[6]||null,urlParts[8]||null);}
else
{urlParts=urlString.match(/^([^?#]*)(\?([^#]*))?(#(.*))?/);if(urlParts)
{this.p_initWithParts(null,null,urlParts[1],urlParts[3]||null,urlParts[5]||null);}
else
{}}}}
catch(e)
{print("Exception Parsing URL:"+e);}}
Object.extend(IWURL,{p_normalizePathComponents:function(components)
{var index=0;while(index<components.length)
{var component=components[index];if(component==""||component==".")
{components.splice(index,1);}
else if(component=="..")
{if(index>0)
{var previousComponent=components[index-1];if(previousComponent=="/")
{components.splice(index,1);}
else if(previousComponent!="..")
{components.splice(index-1,2);index-=1;}
else
{index+=1;}}
else
{index+=1;}}
else
{index+=1;}}
return components;}});Object.extend(IWURL.prototype,{p_initWithParts:function(inProtocol,inAuthority,inPath,inQuery,inFragment)
{this.mProtocol=inProtocol;this.mAuthority=inAuthority;this.mQuery=inQuery;this.mFragment=inFragment;this.mPathComponents=null;if(inPath)
{this.mPathComponents=inPath.split('/');if(this.mPathComponents[0]=="")
this.mPathComponents[0]='/';for(var i=0;i<this.mPathComponents.length;++i)
{this.mPathComponents[i]=decodeURIComponent(this.mPathComponents[i]);}
this.mPathComponents=IWURL.p_normalizePathComponents(this.mPathComponents);}},copy:function()
{var copy=new IWURL();copy.mProtocol=this.mProtocol;copy.mAuthority=this.mAuthority;copy.mQuery=this.mQuery;copy.mFragment=this.mFragment;copy.mPathComponents=null;if(this.mPathComponents)
{copy.mPathComponents=[];for(var i=0;i<this.mPathComponents.length;++i)
{copy.mPathComponents[i]=String(this.mPathComponents[i]);}}
return copy;},toString:function()
{var path="null";if(this.mPathComponents)
{path="";this.mPathComponents.each(function(component)
{if(path=="")
path="[ "+component;else
path+=", "+component;});if(path=="")
path="[]";else
path+=" ]";}
var result="{"+this.mProtocol+", "+this.mAuthority+", "+path+", "+this.mQuery+", "+this.mFragment+"}";return result;},isAbsolute:function()
{return(this.mPathComponents&&this.mPathComponents.length&&this.mPathComponents[0]=="/");},isRelative:function()
{return(this.mProtocol==null);},encodedPathComponents:function()
{var result=[];var index=0;while(index<this.mPathComponents.length)
{if((index==0)&&(this.mPathComponents[0]=="/"))
{result.push("/");}
else
{result.push(encodeURIComponent(this.mPathComponents[index]));}
index+=1;}
return result;},encodedPath:function()
{if(this.isAbsolute())
{return"/"+this.encodedPathComponents().slice(1).join("/");}
else
{return this.encodedPathComponents().join("/");}},toURLString:function()
{if(this.isRelative())
{return this.encodedPath()+
(this.mQuery?"?"+this.mQuery:"")+
(this.mFragment?"#"+this.mFragment:"");}
else
{return this.mProtocol+":"+"//"+this.mAuthority+this.encodedPath()+
(this.mQuery?"?"+this.mQuery:"")+
(this.mFragment?"#"+this.mFragment:"");}},isEqual:function(that)
{var pathMatches=true;if((this.mPathComponents)&&(that.mPathComponents)&&(this.mPathComponents.length==that.mPathComponents.length))
{for(var index=0;index<this.mPathComponents.length;++index)
{if(this.mPathComponents[index]!=that.mPathComponents[index])
{pathMatches=false;break;}}}
else
{pathMatches=false;}
return(this.mProtocol==that.mProtocol)&&(this.mAuthority==that.mAuthority)&&pathMatches&&(this.mQuery==that.mQuery)&&(this.mFragment==that.mFragment);},resolve:function(base)
{if(!this.isRelative())
return new IWURL(this.toURLString());var resolved=base.copy();resolved.mQuery=null;resolved.mFragment=null;if(resolved.mPathComponents==null)
{resolved.mPathComponents=[];}
this.mPathComponents.each(function(component)
{resolved.mPathComponents.push(component);});resolved.mPathComponents=IWURL.p_normalizePathComponents(resolved.mPathComponents);return resolved;},relativize:function(base)
{if(base&&(base.mPathComponents&&base.mPathComponents.length>0)&&(this.mProtocol==base.mProtocol)&&(this.mAuthority==base.mAuthority))
{var commonAncestorIndex=0;for(var index=0;index<Math.min(this.mPathComponents.length,base.mPathComponents.length);++index)
{if(this.mPathComponents[index]==base.mPathComponents[index])
commonAncestorIndex=index;else
break;}
var relativePath=[];for(var up=base.mPathComponents.length-1;up>commonAncestorIndex;--up)
{relativePath.push("..");}
for(var down=commonAncestorIndex+1;down<this.mPathComponents.length;++down)
{relativePath.push(this.mPathComponents[down]);}
var relativized=new IWURL();relativized.mPathComponents=IWURL.p_normalizePathComponents(relativePath);relativized.mQuery=this.mQuery;relativized.mFragment=this.mFragment;return relativized;}
else
{return this.copy();}}});