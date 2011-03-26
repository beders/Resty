//
// iWeb - iWebImage.js
// Copyright 2007-2008 Apple Inc.
// All rights reserved.
//

var IWAllImages={};var IWAllImageObjects={};function IWCreateImage(url)
{return IWAllImages[url]||new IWImage(url);}
var IWNamedImages={};function IWImageNamed(name)
{var url=IWNamedImages[name];return url?IWCreateImage(url):null}
function IWRegisterNamedImage(name,url)
{IWNamedImages[name]=url;}
var IWImageEnableUnload=isiPhone;var IWImage=Class.create({initialize:function(url)
{if(IWAllImages.hasOwnProperty(url))
{iWLog("warning -- use IWCreateImage rather than new IWImage and you'll get better performance");}
this.mPreventUnloading=0;this.mLoading=false;this.mLoaded=false;this.mURL=url;this.mCallbacks=[];IWAllImages[url]=this;},sourceURL:function()
{return this.mURL;},loaded:function()
{return this.mLoaded;},load:function(callback,delayCallbackIfLoaded)
{if(this.mLoaded&&(callback!=null))
{delayCallbackIfLoaded?setTimeout(callback,0):callback();}
else
{if(callback!=null)
{this.mCallbacks.push(callback);}
if(this.mLoading==false)
{this.mLoading=true;var img=new Image();IWAllImageObjects[this.sourceURL()]=img;img.onload=this.p_onload.bind(this);img.src=this.mURL;}}},unload:function(evenIfNotEnabled)
{if((evenIfNotEnabled||IWImageEnableUnload)&&this.mLoaded)
{if(this.mPreventUnloading<=0)
{this.mLoaded=false;this.mLoading=false;IWAllImageObjects[this.sourceURL()]=null;}
else
{this.mPreventedUnload=true;}}},preventUnloading:function()
{if(this.mPreventUnloading==0)
{this.mPreventedUnload=false;}
++this.mPreventUnloading;},allowUnloading:function()
{--this.mPreventUnloading;if(this.mPreventUnloading<=0&&this.mPreventedUnload)
{this.unload();}},naturalSize:function()
{(function(){return this.mNaturalSize!==undefined}).bind(this).assert();return this.mNaturalSize;},imgObject:function()
{return IWAllImageObjects[this.sourceURL()];},p_onload:function()
{this.preventUnloading();this.mLoaded=true;if(this.mNaturalSize===undefined)
{var imgObject=this.imgObject();(function(){return imgObject!==undefined}).assert();this.mNaturalSize=new IWSize(imgObject.width,imgObject.height);}
for(var i=0;i<this.mCallbacks.length;++i)
{this.mCallbacks[i]();}
this.mCallbacks=[];this.allowUnloading();},toString:function()
{return"IWImage("+this.mNaturalSize+", "+this.mURL+")";}});function IWCreateLoadingArea()
{if(IWSharedLoadingAreaManager==null)
{IWSharedLoadingAreaManager=new IWLoadingAreaManager();}
return IWSharedLoadingAreaManager.createLoadingArea();}
var IWLoadingAreaManager=Class.create({initialize:function()
{var div=$(document.createElement("div"));div.setStyle({visibility:"hidden",position:"absolute",width:0,height:0,overflow:"hidden"});document.body.appendChild(div);this.mCurrentLoadingArea=div;},createLoadingArea:function()
{var loadingArea=document.createElement('div');this.mCurrentLoadingArea.appendChild(loadingArea);return loadingArea;}});var IWSharedLoadingAreaManager=null;var IWSharedEffectRegistry=null;var allStyleSheetsLoaded=false;var timeStyleSheetsAppearedInDOM=null;function IWCreateEffectRegistry()
{if(IWSharedEffectRegistry==null)
{IWSharedEffectRegistry=new IWEffectRegistry();}
return IWSharedEffectRegistry;}
var IWEffectRegistry=Class.create({initialize:function()
{this.mEffects=null;},registerEffects:function(effects)
{this.mEffects=effects;},applyEffects:function()
{var effectQueue=[];effectQueue=effectQueue.concat(this.p_queueForEffectType("crop"));effectQueue=effectQueue.concat(this.p_queueForEffectType("stroke"));effectQueue=effectQueue.concat(this.p_queueForEffectType("reflection"));effectQueue=effectQueue.concat(this.p_queueForEffectType("shadow"));this.p_applyEffectsFromQueue(effectQueue);},p_queueForEffectType:function(effectType)
{var effectQueue=[];var i=0;var effectClass=effectType+"_"+i++;while(effect=this.mEffects[effectClass])
{effectQueue=effectQueue.concat(this.p_queueForEffectClass(effect,effectClass));effectClass=effectType+"_"+i++;}
return effectQueue;},p_queueForEffectClass:function(effect,effectClass,elementList)
{var effectQueue=[];var elements=elementList||$$("."+effectClass);while(elements&&elements.length>0)
{var element=elements.shift();var children=element.select("."+effectClass);if(children.length>0)
{elements=elements.minusArray(children);effectQueue=effectQueue.concat(this.p_queueForEffectClass(effect,effectClass,children));}
effectQueue.push({element:element,effect:effect});}
return effectQueue;},p_allStyleSheetsLoaded:function()
{if(isCamino||isFirefox)
{if(timeStyleSheetsAppearedInDOM!=null)
{duration=(new Date().getTime())-timeStyleSheetsAppearedInDOM;if(duration>100)
{allStyleSheetsLoaded=true;timeStyleSheetsAppearedInDOM=null;}}
else if(!allStyleSheetsLoaded)
{for(var i=0,sheetCount=document.styleSheets.length;i<sheetCount;i++)
{var styleSheet=document.styleSheets[i];if(styleSheet.href&&styleSheet.href.indexOf("Moz.css")!=-1)
{timeStyleSheetsAppearedInDOM=new Date().getTime();}}}}
else
{allStyleSheetsLoaded=true;}
return allStyleSheetsLoaded;},p_applyEffectsFromQueue:function(queue)
{var startTime=new Date().getTime();var duration=0;var readyToApplyEffects=this.p_allStyleSheetsLoaded();while(queue.length>0&&duration<100&&readyToApplyEffects)
{var queueEntry=queue.shift();if(queueEntry&&queueEntry.effect&&queueEntry.element)
{queueEntry.effect.applyToElement(queueEntry.element);}
duration=(new Date().getTime())-startTime;}
if(queue.length>0)
{setTimeout(this.p_applyEffectsFromQueue.bind(this,queue),0);}
else
{performPostEffectsFixups();}}});function IWChildOffset(child,parent,positionedOnly)
{var l=0;var t=0;if(parent)
{var current=child;while(current&&current!=parent)
{if(!positionedOnly||(current.style.position=="absolute")||(current.style.position=="relative"))
{l+=current.offsetLeft;t+=current.offsetTop;}
current=current.parentNode;}}
return new IWPoint(l,t);}
function IWImageExtents(ancestor,images,left,top,right,bottom)
{var unionedBounds=new IWRect(left,top,right-left,bottom-top);for(var e=0;e<images.length;++e)
{var imageClippedBounds=new IWRect(images[e].offsetLeft,images[e].offsetTop,images[e].offsetWidth,images[e].offsetHeight);if(ancestor)
{var current=images[e].parentNode;while(current&&current!=ancestor)
{if((current.style.position=="absolute")||(current.style.position=="relative"))
{imageClippedBounds.origin.x+=current.offsetLeft||0;imageClippedBounds.origin.y+=current.offsetTop||0;}
var testForHidden=function(str)
{return str=='hidden';};var clipX=[current.style.overflow,current.style.overflowX].any(testForHidden);var clipY=[current.style.overflow,current.style.overflowY].any(testForHidden);if(clipX||clipY)
{var currentRect=new IWRect(clipX?current.offsetLeft:imageClippedBounds.origin.x,clipY?current.offsetTop:imageClippedBounds.origin.y,clipX?current.offsetWidth:imageClippedBounds.size.width,clipY?current.offsetHeight:imageClippedBounds.size.height);imageClippedBounds=imageClippedBounds.intersection(currentRect);}
current=current.parentNode;}}
if((imageClippedBounds.size.width>0)&&(imageClippedBounds.size.height>0))
{if((unionedBounds.size.width>0)&&(unionedBounds.size.height>0))
{unionedBounds=unionedBounds.union(imageClippedBounds);}
else
{unionedBounds=imageClippedBounds.clone();}}}
var extents={left:unionedBounds.origin.x,top:unionedBounds.origin.y,right:unionedBounds.origin.x+unionedBounds.size.width,bottom:unionedBounds.origin.y+unionedBounds.size.height};return extents;}
function IWEffectChildren(element,imagesOnly)
{element=$(element);var inlineBlocks=element.select('.inline-block');return element.descendants().findAll(function(child){if((!imagesOnly&&child.match("div.badge-fill"))||child.match("img"))
{var inline=false;for(var index=0,end=inlineBlocks.length;inline==false&&index<end;++index)
{inline=child.descendantOf(inlineBlocks[index]);}
return inline==false;}
else
{return false;}});}
function IWClippingNode(node)
{if(node)
{if(node.style&&(node.style.overflow||node.style.overflowX||node.style.overflowY))
{if([node.style.overflow,node.style.overflowX,node.style.overflowY].include('hidden'))
return node;}
else
{return IWClippingNode(node.parentNode);}}
return null;}
var IWShadow=Class.create({initialize:function(params)
{this.mBlurRadius=params.blurRadius;this.mOffset=params.offset;this.mColor=params.color;this.mOpacity=params.opacity;},applyToElement:function(shadowed)
{var framePos=new IWPoint(shadowed.offsetLeft,shadowed.offsetTop);var frameSize=new IWSize(shadowed.offsetWidth,shadowed.offsetHeight);var opacity=1.0;if(shadowed!=null)
{shadowed=$(shadowed);opacity=shadowed.getStyle('opacity');if(windowsInternetExplorer)
{var newRoot=$(shadowed.cloneNode(false));shadowed.parentNode.insertBefore(newRoot,shadowed);var shadow=$(document.createElement('DIV'));var shadowContents=shadowed.cloneNodeExcludingIDs(true);shadow.appendChild(shadowContents);shadow.select('map').each(function(mapElement){mapElement.parentNode.removeChild(mapElement);});shadow.select(".IWReflection").invoke("remove");newRoot.appendChild(shadow);newRoot.appendChild(shadowed);shadowed.setStyle({top:0,left:0});var blurRadius=this.mBlurRadius*0.5;var xOffset=this.mOffset.x-(this.mBlurRadius*0.6);var yOffset=this.mOffset.y-(this.mBlurRadius*0.6);shadow.setStyle({position:"absolute",left:px(xOffset-500),top:px(yOffset-500),width:px(frameSize.width+1000),height:px(frameSize.height+1000)});shadowContents.setStyle({position:"absolute",left:px(500),top:px(500),padding:0,margin:0});shadow.style.filter="progid:DXImageTransform.Microsoft.MaskFilter()"+" progid:DXImageTransform.Microsoft.MaskFilter(color="+this.mColor+")"+" progid:DXImageTransform.Microsoft.Alpha(opacity="+this.mOpacity*opacity*100+")"+" progid:DXImageTransform.Microsoft.Blur(pixelradius="+blurRadius+")";if(newRoot.hasClassName("inline-block"))
{var rootTop=newRoot.style.top;var rootMarginTop=newRoot.style.marginTop;if(rootTop&&!rootMarginTop)
{rootTop=(toPixelsAtElement(newRoot,rootTop,true));newRoot.style.marginTop=px(-rootTop);}
else if(!rootTop&&rootMarginTop)
{rootMarginTop=(toPixelsAtElement(newRoot,rootMarginTop,true));newRoot.style.rootTop=px(-rootMarginTop);}
else if(rootTop&&rootMarginTop)
{rootTop=(toPixelsAtElement(newRoot,rootTop,true));rootMarginTop=(toPixelsAtElement(newRoot,rootMarginTop,true));if(rootTop!=rootMarginTop)
{newRoot.style.rootTop=px(-rootMarginTop);}}}
if(shadowed.offsetTop!=0)
{var top=shadowed.style.top;top=top?(toPixelsAtElement(shadowed,top,true)):0;top-=shadowed.offsetTop;shadowed.style.top=px(top);}}
else
{var sourceElements=IWEffectChildren(shadowed,false);var extents=IWImageExtents(shadowed,sourceElements,0,0,frameSize.width,frameSize.height);var canvas=undefined;if(shadowed.sandwich&&shadowed.sandwich.canvas)
{canvas=shadowed.sandwich.canvas;}
extents.left-=Math.max(this.mBlurRadius-this.mOffset.x,0);extents.top-=Math.max(this.mBlurRadius-this.mOffset.y,0);extents.right+=Math.max(this.mBlurRadius+this.mOffset.x,0);extents.bottom+=Math.max(this.mBlurRadius+this.mOffset.y,0);extents.left=Math.floor(extents.left);extents.top=Math.floor(extents.top);extents.right=Math.ceil(extents.right);extents.bottom=Math.ceil(extents.bottom);var leftOffset=extents.left;var topOffset=extents.top;extents.right-=extents.left;extents.bottom-=extents.top;extents.left=0;extents.top=0;var width=extents.right-extents.left;var height=extents.bottom-extents.top;if(canvas===undefined)
{canvas=$(document.createElement("canvas"));}
var context=canvas.getContext?canvas.getContext("2d"):null;var canvasCanDrawShadow=context?context.shadowColor:false;if(canvasCanDrawShadow)
{$(canvas).setAttribute("width",width);$(canvas).setAttribute("height",height);$(canvas).setStyle({position:"absolute",top:px(topOffset),left:px(leftOffset)});var workingCanvas=undefined;if(shadowed.sandwich&&shadowed.sandwich.workingCanvas)
{workingCanvas=shadowed.sandwich.workingCanvas;}
if(workingCanvas===undefined)
{workingCanvas=canvas.cloneNode(false);}
var self=this;var sandwich=shadowed.sandwich||{};sandwich.loadedElements=[];sandwich.elementCount=sourceElements.length;sandwich.loadedElementCount=0;sandwich.canvas=canvas;sandwich.workingCanvas=workingCanvas;shadowed.sandwich=sandwich;sandwich.onImageLoad=function(j,img,image)
{var offset=IWChildOffset(img,shadowed,true);this.loadedElements[j]={imgObject:image.imgObject(),left:offset.x-leftOffset,top:offset.y-topOffset,width:img.offsetWidth,height:img.offsetHeight,render:function(context){context.drawImage(this.imgObject,this.left,this.top,this.width,this.height);}};this.loadedElementCount++;if(this.loadedElementCount==this.elementCount)
{this.renderShadow()}}
sandwich.registerDiv=function(j,div)
{var offset=IWChildOffset(div,shadowed,true);this.loadedElements[j]={divElement:div,left:offset.x-leftOffset,top:offset.y-topOffset,width:div.offsetWidth,height:div.offsetHeight,render:function(context){var div=this.divElement;var color=div.getStyle('background-color');var opacity=parseFloat(div.style.opacity||1);context.save();context.globalAlpha*=opacity;context.fillStyle=color;context.fillRect(this.left,this.top,this.width,this.height);context.restore();}};this.loadedElementCount++;if(this.loadedElementCount==this.elementCount)
{this.renderShadow()}}
sandwich.renderShadow=function()
{if(canvas.parentNode===null)
{shadowed.insertBefore(canvas,shadowed.firstChild);}
canvas.parentNode.insertBefore(workingCanvas,canvas);var context=workingCanvas.getContext("2d");new IWRect(0,0,width,height).clear(context);var bgImage=shadowed.getStyle('background-image');var hasBGImage=bgImage&&bgImage.indexOf('url(')==0;var bgColor=shadowed.getStyle('background-color');var alphaComponent=self.p_alphaComponent(bgColor);IWAssert(function(){return alphaComponent==0||alphaComponent==1},"alpha must be 0 or 1 for background color if shadow is applied");var fillBackground=(hasBGImage||alphaComponent>0);var divBounds=new IWRect(-leftOffset,-topOffset,frameSize.width,frameSize.height).round();if(fillBackground)
{context.fillStyle='rgba(0,0,0,1)';divBounds.fill(context);}
for(var k=0;k<this.loadedElements.length;++k)
{var loaded=this.loadedElements[k];var clipper=$(IWClippingNode(sourceElements[k]));if(clipper&&clipper.descendantOf(shadowed))
{var clipToShadow=IWChildOffset(clipper,shadowed,true);context.save();context.rect(clipToShadow.x-leftOffset,clipToShadow.y-topOffset,clipper.offsetWidth,clipper.offsetHeight);context.clip();loaded.render(context);context.restore();}
else
{loaded.render(context);}}
context=canvas.getContext("2d");new IWRect(0,0,width,height).clear(context);var drawImageUnshadowed=true;context.globalAlpha=opacity;if(context.shadowColor)
{var usingShadowAlpha=true;context.save();usingShadowAlpha=!(isWebKit&&isEarlyWebKitVersion);if(usingShadowAlpha)
{var components=self.mColor.toLowerCase().match(/#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/);if(components&&components.length>=4)
{context.shadowColor="rgba("+parseInt(components[1],16)+", "+parseInt(components[2],16)+", "+parseInt(components[3],16)+", "+self.mOpacity+")";}
else
{components=self.mColor.match(/rgb\(([0-9\.]+),[ ]*([0-9\.]+),[ ]*([0-9\.]+)\)/);if(components&&components.length>=4)
{context.shadowColor="rgba("+components[1]+", "+components[2]+", "+components[3]+", "+self.mOpacity+")";}
else
{iWLog("not using shadow alpha, failed to match "+self.mColor);usingShadowAlpha=false;}}}
if(usingShadowAlpha==false)
{context.globalAlpha*=self.mOpacity;context.shadowColor=self.mColor;}
context.shadowBlur=self.mBlurRadius;context.shadowOffsetX=self.mOffset.x;context.shadowOffsetY=self.mOffset.y;context.drawImage(workingCanvas,0,0);context.restore();if(usingShadowAlpha==false)
{drawImageUnshadowed=self.mOpacity<1.0;}
else
{drawImageUnshadowed=false;}}
if(drawImageUnshadowed)
{context.drawImage(workingCanvas,0,0);}
if(fillBackground)
{divBounds.clear(context);context.save();context.globalAlpha=opacity;context.rect(divBounds.origin.x,divBounds.origin.y,divBounds.size.width,divBounds.size.height);context.clip();for(var k=0;k<this.loadedElements.length;++k)
{this.loadedElements[k].render(context);}
context.restore();}
if(workingCanvas.parentNode)
{workingCanvas.parentNode.removeChild(workingCanvas);delete this.workingCanvas;this.workingCanvas=null;}
for(var j=0;j<sourceElements.length;++j)
{sourceElements[j].style.opacity=0.0;}};if(sourceElements.length>0)
{for(var j=0;j<sourceElements.length;++j)
{var element=$(sourceElements[j]);if(element.match('img'))
{var image=IWCreateImage(element.src);image.load(sandwich.onImageLoad.bind(sandwich,j,element,image));}
else if(element.match('div'))
{sandwich.registerDiv(j,element);}}}
else
{sandwich.renderShadow();}
workingCanvas.style.visibility="hidden";}}}},p_alphaComponent:function(color)
{var alpha=1.0;if(color&&color.indexOf('rgba(')!=-1)
{if(color.match(/rgba\((?:\s*\S+\s*,\s*){3}(\S+)\s*\)/))
{alpha=RegExp.$1;}}
return alpha;}});var IWReflection=Class.create({initialize:function(parameters)
{this.mOpacity=parameters.opacity;this.mOffset=Math.max(parameters.offset,1);this.mFadeSustain=0.4;this.mMaxSustain=120;},applyToElement:function(div)
{var bounds=new IWRect(div.offsetLeft,div.offsetTop,div.offsetWidth,div.offsetHeight);var reflectionHeight=Math.min(div.offsetHeight*this.mFadeSustain,this.mMaxSustain)*0.75;if(div!=null)
{var imgs=IWEffectChildren(div,true);var extents=IWImageExtents(div,imgs,0,0,bounds.size.width,bounds.size.height);var totalWidth=extents.right-extents.left;var totalHeight=extents.bottom-extents.top;var leftOffset=extents.left;var topOffset=extents.top;var bottomOffset=totalHeight-bounds.size.height;if(windowsInternetExplorer)
{var reflection=$(document.createElement("div"));reflection.setStyle({position:"absolute",left:px(extents.left),top:px(bounds.size.height),marginTop:px(this.mOffset),width:px(totalWidth),height:px(reflectionHeight),overflow:"hidden",filter:'progid:DXImageTransform.Microsoft.Alpha(opacity='+(this.mOpacity*100)+', style=1, finishOpacity=0, startx=0, starty=0, finishx=0, finishy=100)'});reflection.addClassName("IWReflection");var flipped=$(document.createElement("div"));flipped.setStyle({position:"relative",width:px(totalWidth),height:px(totalHeight),filter:'flipv'});var cloned=$(div.cloneNode(true));cloned.setStyle({left:px(-extents.left),top:px(-extents.top),position:"absolute"});cloned.className=cloned.className.replace(/(shadow_\d+)/g,'');reflection.appendChild(flipped);flipped.appendChild(cloned);div.insertBefore(reflection,div.firstChild);}
else
{var reflection=$(document.createElement("canvas"));extents.right-=extents.left;extents.bottom-=extents.top;extents.left=0;extents.top=0;reflection.setAttribute("width",extents.right-extents.left);reflection.setAttribute("height",reflectionHeight+this.mOffset/2);reflection.setStyle({position:"absolute",top:px(bounds.size.height),marginTop:px(this.mOffset),left:px(leftOffset)});div.insertBefore(reflection,div.firstChild);var context=reflection.getContext("2d");context.clearRect(0,0,reflection.width,reflection.height);var sandwich={};sandwich.loadedImgs=[];sandwich.imgCount=imgs.length;var self=this;sandwich.onImageLoad=function(j,img,image){var offset=IWChildOffset(img,div,true);this.loadedImgs[j]={imgObject:image.imgObject(),left:offset.x-leftOffset,top:offset.y-topOffset-bottomOffset,width:img.offsetWidth,height:img.offsetHeight};var allImagesLoaded=false;if(this.loadedImgs.length>=this.imgCount)
{allImagesLoaded=true;for(var k=0;allImagesLoaded&&k<this.loadedImgs.length;++k)
{if(this.loadedImgs[k]===undefined)
{allImagesLoaded=false;}}}
if(allImagesLoaded)
{context.save();context.translate(0,bounds.size.height-1);context.scale(1,-1);for(var k=0;k<this.loadedImgs.length;++k)
{var loadedImg=this.loadedImgs[k];var clipper=$(IWClippingNode(imgs[k]));if(clipper&&clipper.descendantOf(div))
{var clipOffset=IWChildOffset(clipper,div,true);context.save();context.rect(clipOffset.x-leftOffset,clipOffset.y-topOffset-bottomOffset,clipper.offsetWidth,clipper.offsetHeight);context.clip();context.drawImage(loadedImg.imgObject,loadedImg.left,loadedImg.top,loadedImg.width,loadedImg.height);context.restore();}
else
{context.drawImage(loadedImg.imgObject,loadedImg.left,loadedImg.top,loadedImg.width,loadedImg.height);}}
context.restore();context.save();context.globalCompositeOperation="destination-out";var gradient=context.createLinearGradient(0,0,0,reflection.height);gradient.addColorStop(1,"rgba(255, 255, 255, 1.0)");gradient.addColorStop(0,"rgba(255, 255, 255, "+(1-self.mOpacity)+")");context.fillStyle=gradient;if(navigator.appVersion.indexOf('WebKit')!=-1)
{context.rect(0,0,reflection.width,reflection.height*2);context.fill();}
else
{context.fillRect(0,0,reflection.width,reflection.height*2);}
context.restore();}};for(var j=0;j<imgs.length;++j)
{var img=imgs[j];var image=IWCreateImage(img.src);image.load(sandwich.onImageLoad.bind(sandwich,j,img,image));}}}}});var kLeft=0,kTopLeft=1,kTop=2,kTopRight=3,kRight=4,kBottomRight=5,kBottom=6,kBottomLeft=7,kPartCount=8;var IWStrokeParts=Class.create({initialize:function(strokeParts,maxImageSize,shouldClip,strokeWidth)
{this.mStrokeParts=strokeParts;this.mMaxImageSize=maxImageSize;this.mShouldClip=shouldClip;if(shouldClip)
{this.mStrokeWidth=strokeWidth;}},p_imageLayout:function(imageSize)
{var strokeParts=this.mStrokeParts;var hDelta=this.mMaxImageSize.width-imageSize.width;var vDelta=this.mMaxImageSize.height-imageSize.height;var topLeft=strokeParts[kTopLeft].rect;var topRight=strokeParts[kTopRight].rect.offset(-hDelta,0);var bottomRight=strokeParts[kBottomRight].rect.offset(-hDelta,-vDelta);var bottomLeft=strokeParts[kBottomLeft].rect.offset(0,-vDelta);var top=strokeParts[kTop].rect;top.size.width=topRight.origin.x-top.origin.x;var right=strokeParts[kRight].rect.offset(-hDelta,0);right.size.height=bottomRight.origin.y-right.origin.y;var bottom=strokeParts[kBottom].rect.offset(0,-vDelta);bottom.size.width=bottomRight.origin.x-bottom.origin.x;var left=strokeParts[kLeft].rect;left.size.height=bottomLeft.origin.y-left.origin.y;return[left,topLeft,top,topRight,right,bottomRight,bottom,bottomLeft];},p_imageMarkup:function(imageSize,zIndex)
{var markup='';var layoutRects=this.p_imageLayout(imageSize);for(var index=kLeft;index<kPartCount;++index)
{var style=layoutRects[index].position();if(zIndex)
{style+='z-index: '+zIndex+';';}
markup+=imgMarkup(this.mStrokeParts[index].url,style);}
return markup;},markupForImageStreamEntry:function(imageStreamEntry,imageSize)
{var rect=new IWRect(0,0,imageSize.width,imageSize.height);var clippingDivPre='';var clippingDivPost='';var thumbRect=rect.clone();if(this.mShouldClip)
{var left=(this.mStrokeWidth/2+1);var top=(this.mStrokeWidth/2+1);var clippingRect=new IWRect(left,top,(imageSize.width-this.mStrokeWidth-2),(imageSize.height-this.mStrokeWidth-2));clippingDivPre='<div style="overflow: hidden; '+clippingRect.position()+'">';clippingDivPost='</div>';thumbRect.origin.x-=left;thumbRect.origin.y-=top;}
var markup='<div class="framedImage" style="'+rect.position()+'">';markup+=clippingDivPre;markup+=imageStreamEntry.thumbnailMarkupForRect(thumbRect);markup+=clippingDivPost;markup+=this.p_imageMarkup(imageSize,2);markup+='</div>';return markup;},applyToElement:function(div)
{div=$(div);if(div!=null)
{if(div.parentNode)
{$(div.parentNode).ensureHasLayoutForIE();}
var size=new IWSize(div.offsetWidth,div.offsetHeight);div.insert(this.p_imageMarkup(size,(div.hasClassName("aboveStrokesAndFrames")?-1:"auto")));if(!div.hasClassName("flowDefining"))
{if(div.style.position!='absolute')
{var divRect=new IWRect(0,0,div.offsetWidth,div.offsetHeight);var unionRect=IWZeroRect();var layoutRects=this.p_imageLayout(size);layoutRects.each(function(r)
{unionRect=unionRect.union(r);});var padding=divRect.paddingToRect(unionRect);var marginLeft=Element.getStyle(div,"marginLeft");marginLeft=marginLeft?(toPixelsAtElement(div,marginLeft,false)):0;var marginTop=Element.getStyle(div,"marginTop");marginTop=marginTop?(toPixelsAtElement(div,marginTop,true)):0;var marginRight=Element.getStyle(div,"marginRight");marginRight=marginRight?(toPixelsAtElement(div,marginRight,false)):0;var marginBottom=Element.getStyle(div,"marginBottom");marginBottom=marginBottom?(toPixelsAtElement(div,marginBottom,true)):0;if(windowsInternetExplorer)
{div.setStyle({marginLeft:px(Math.max(0,padding.left-1)+marginLeft),marginTop:px(Math.max(0,padding.top-1)+marginTop),marginRight:px(Math.max(0,padding.right-1)+marginRight),marginBottom:px(Math.max(0,padding.bottom-1)+marginBottom)});if(effectiveBrowserVersion==7)
{updateListOfIE7FloatsFix(div);}}
else
{div.setStyle({marginLeft:px(padding.left+marginLeft),marginTop:px(padding.top+marginTop),marginRight:px(padding.right+marginRight),marginBottom:px(padding.bottom+marginBottom)});}}}}},strokeExtra:function(imageSize)
{if(!imageSize)
{imageSize=this.mMaxImageSize;}
rect=new IWRect(IWZeroPoint(),imageSize);var layout=this.p_imageLayout(rect.size);var unionRect=IWZeroRect();layout.each(function(r)
{unionRect=unionRect.union(r);});return rect.paddingToRect(unionRect);}});var IWStroke=Class.create({initialize:function(strokeURL,strokeRect,maxImageSize)
{this.mStrokeURL=strokeURL;this.mStrokeRect=strokeRect;this.mMaxImageSize=maxImageSize;},p_strokeRect:function(imageSize)
{var hScale=imageSize.width/this.mMaxImageSize.width;var vScale=imageSize.height/this.mMaxImageSize.height;var strokeRect=this.mStrokeRect.scale(hScale,vScale,true);return strokeRect;},p_imageMarkup:function(imageSize,zIndex)
{var style=this.p_strokeRect(imageSize).position();if(zIndex)
{style+='z-index: '+zIndex+';';}
return imgMarkup(this.mStrokeURL,style);},markupForImageStreamEntry:function(imageStreamEntry,imageSize)
{var rect=new IWRect(0,0,imageSize.width,imageSize.height);var markup='<div class="framedImage" style="'+rect.position()+'">';markup+=imageStreamEntry.thumbnailMarkupForRect(rect);markup+=this.p_imageMarkup(imageSize,2);markup+='</div>';return markup;},applyToElement:function(div)
{div=$(div);if(div!=null)
{if(div.parentNode)
{$(div.parentNode).ensureHasLayoutForIE();}
var size=new IWSize(div.offsetWidth,div.offsetHeight);div.insert(this.p_imageMarkup(size,(div.hasClassName("aboveStrokesAndFrames")?-1:"auto")));if(!div.hasClassName("flowDefining"))
{if(div.style.position!='absolute')
{var divRect=new IWRect(0,0,div.offsetWidth,div.offsetHeight);var padding=divRect.paddingToRect(this.mStrokeRect);var marginLeft=Element.getStyle(div,"marginLeft");marginLeft=marginLeft?(toPixelsAtElement(div,marginLeft,false)):0;var marginTop=Element.getStyle(div,"marginTop");marginTop=marginTop?(toPixelsAtElement(div,marginTop,true)):0;var marginRight=Element.getStyle(div,"marginRight");marginRight=marginRight?(toPixelsAtElement(div,marginRight,false)):0;var marginBottom=Element.getStyle(div,"marginBottom");marginBottom=marginBottom?(toPixelsAtElement(div,marginBottom,true)):0;div.setStyle({marginLeft:px(padding.left+marginLeft),marginTop:px(padding.top+marginTop),marginRight:px(padding.right+marginRight),marginBottom:px(padding.bottom+marginBottom)});if(windowsInternetExplorer&&effectiveBrowserVersion==7)
{updateListOfIE7FloatsFix(div);}}}}},strokeExtra:function(imageSize)
{if(imageSize===undefined)
{imageSize=this.mMaxImageSize;}
var imageRect=new IWRect(IWZeroPoint(),imageSize);return imageRect.paddingToRect(this.p_strokeRect(imageSize));}});var IWEmptyStroke=Class.create({initialize:function()
{},markupForImageStreamEntry:function(imageStreamEntry,imageSize)
{var rect=new IWRect(0,0,imageSize.width,imageSize.height);var markup='<div class="framedImage" style="'+rect.position()+'">';markup+=imageStreamEntry.thumbnailMarkupForRect(rect);markup+='</div>';return markup;},applyToElement:function(div)
{},strokeExtra:function()
{return new IWPadding(0,0,0,0);}});var kSFRFrameTopLeft=0;var kSFRFrameTop=1;var kSFRFrameTopRight=2;var kSFRFrameRight=3;var kSFRFrameBottomRight=4;var kSFRFrameBottom=5;var kSFRFrameBottomLeft=6;var kSFRFrameLeft=7;var kSFRFrameClip=0;var kSFRFrameStretchEvenly=1;var kSFRFrameStretchToFit=2;var IWPhotoFrame=Class.create({initialize:function(images,maskImages,tilingMode,assetScale,leftInset,topInset,rightInset,bottomInset,unscaledLeftWidth,unscaledTopHeight,unscaledRightWidth,unscaledBottomHeight,leftTileHeight,topTileWidth,rightTileHeight,bottomTileWidth,adornmentURL,adornmentPosition,adornmentSize,minimumAssetScale)
{this.mImages=images;this.mMaskImages=maskImages;this.mTilingMode=tilingMode;this.mLeftInset=leftInset;this.mTopInset=topInset;this.mRightInset=rightInset;this.mBottomInset=bottomInset;this.mUnscaledLeftWidth=unscaledLeftWidth;this.mUnscaledTopHeight=unscaledTopHeight;this.mUnscaledRightWidth=unscaledRightWidth;this.mUnscaledBottomHeight=unscaledBottomHeight;this.mLeftTileHeight=leftTileHeight;this.mTopTileWidth=topTileWidth;this.mRightTileHeight=rightTileHeight;this.mBottomTileWidth=bottomTileWidth;this.mAdornmentURL=adornmentURL;this.mAdornmentPosition=adornmentPosition;this.mAdornmentSize=adornmentSize;this.mMinimumAssetScale=minimumAssetScale;this.setAssetScale(assetScale);},setAssetScale:function(assetScale)
{assetScale=Math.min(assetScale,1.0);assetScale=Math.max(this.mMinimumAssetScale,assetScale);this.mAssetScale=assetScale;this.mLeftWidth=this.scaledValue(this.mUnscaledLeftWidth);this.mTopHeight=this.scaledValue(this.mUnscaledTopHeight);this.mRightWidth=this.scaledValue(this.mUnscaledRightWidth);this.mBottomHeight=this.scaledValue(this.mUnscaledBottomHeight);},scaledValue:function(valueToScale)
{return Math.ceil(valueToScale*this.mAssetScale);},markupForImageStreamEntry:function(imageStreamEntry,size)
{var oldAssetScale=this.mAssetScale;var maximumScale=this.maximumAssetScaleForImageSize(size);if((maximumScale<oldAssetScale)&&(maximumScale>=this.mMinimumAssetScale))
{this.setAssetScale(maximumScale);}
var coverageRect=this.coverageRect(new IWRect(0,0,size.width,size.height));var imageRect=new IWRect(-coverageRect.origin.x,-coverageRect.origin.y,size.width,size.height);coverageRect=coverageRect.offsetToOrigin();var markup='<div class="framedImage" style="'+coverageRect.position()+'">';markup+=imageStreamEntry.thumbnailMarkupForRect(imageRect);if(maximumScale>=this.mMinimumAssetScale)
{if(this.mImages!=null)
{markup+=this.p_buildFrame(this.mImages,coverageRect.size,2);}
if(this.mAdornmentURL!=null)
{markup+=this.p_adornmentMarkupForRect(imageRect,2);}
if(this.mMaskImages)
{}}
markup+='</div>';if(oldAssetScale!=this.mAssetScale)this.setAssetScale(oldAssetScale);return markup;},strokeExtra:function()
{var adornmentExtraTopMargin=0;if(this.mAdornmentURL)
{adornmentExtraTopMargin=Math.max(0,(this.scaledValue(this.mAdornmentSize.height)-this.mTopHeight)/2.0-this.mAdornmentPosition.y);}
return new IWPadding(this.mLeftWidth-this.scaledValue(this.mLeftInset),this.mTopHeight-this.scaledValue(this.mTopInset)+adornmentExtraTopMargin,this.mRightWidth-this.scaledValue(this.mRightInset),this.mBottomHeight-this.scaledValue(this.mBottomInset));},applyToElement:function(div)
{div=$(div);if(div!=null)
{if(div.parentNode)
{$(div.parentNode).ensureHasLayoutForIE();}
var markup='';var divRect=new IWRect(0,0,div.offsetWidth,div.offsetHeight);if((divRect.size.width>=(this.scaledValue(this.mLeftInset)+this.scaledValue(this.mRightInset)))&&(divRect.size.height>=(this.scaledValue(this.mTopInset)+this.scaledValue(this.mTopInset))))
{if(this.mImages!=null)
{var coverageRect=this.coverageRect(divRect);var containerRect=new IWRect(coverageRect.origin.x,coverageRect.origin.y,0,0);markup+='<div style="'+containerRect.position()+'">';markup+=this.p_buildFrame(this.mImages,coverageRect.size,(div.hasClassName("aboveStrokesAndFrames")?-1:"auto"));markup+='</div>';}
if(this.mAdornmentURL!=null)
{markup+=this.p_adornmentMarkupForRect(divRect);}}
div.insert(markup);if(!div.hasClassName("flowDefining"))
{if(div.style.position!='absolute')
{var frameExtra=this.strokeExtra();var marginLeft=Element.getStyle(div,"marginLeft");marginLeft=marginLeft?(toPixelsAtElement(div,marginLeft,false)):0;var marginTop=Element.getStyle(div,"marginTop");marginTop=marginTop?(toPixelsAtElement(div,marginTop,true)):0;var marginRight=Element.getStyle(div,"marginRight");marginRight=marginRight?(toPixelsAtElement(div,marginRight,false)):0;var marginBottom=Element.getStyle(div,"marginBottom");marginBottom=marginBottom?(toPixelsAtElement(div,marginBottom,true)):0;div.setStyle({marginLeft:px(frameExtra.left+marginLeft),marginTop:px(frameExtra.top+marginTop),marginRight:px(frameExtra.right+marginRight),marginBottom:px(frameExtra.bottom+marginBottom)});if(windowsInternetExplorer&&effectiveBrowserVersion==7)
{updateListOfIE7FloatsFix(div);}}}}},maximumAssetScaleForImageSize:function(in_imgSize)
{var maxScale=1;if((in_imgSize.width>this.mLeftInset+this.mRightInset)&&(in_imgSize.height>this.mTopInset+this.mBottomInset))
{maxScale=1;}
else if((in_imgSize.width<Math.ceil(this.mLeftInset*this.mMinimumAssetScale)+Math.ceil(this.mRightInset*this.mMinimumAssetScale))||(in_imgSize.height<Math.ceil(this.mTopInset*this.mMinimumAssetScale)+Math.ceil(this.mBottomInset*this.mMinimumAssetScale)))
{maxScale=0;}
else
{var maxWidthScale=1;var floatEpsilon=0.0000001;if(((this.mLeftInset+this.mRightInset)>=in_imgSize.width)&&((this.mLeftInset+this.mRightInset)>0))
{var leftChunkRatio=Math.floor(this.mLeftInset/(this.mLeftInset+this.mRightInset)*in_imgSize.width)/this.mLeftInset;var rightChunkRatio=Math.floor(this.mRightInset/(this.mLeftInset+this.mRightInset)*in_imgSize.width)/this.mRightInset;leftChunkRatio-=floatEpsilon;rightChunkRatio-=floatEpsilon;maxWidthScale=Math.max(leftChunkRatio,rightChunkRatio);if(in_imgSize.width<(Math.ceil(this.mLeftInset*maxWidthScale)+Math.ceil(this.mRightInset*maxWidthScale)))
{maxWidthScale=Math.min(leftChunkRatio,rightChunkRatio);}
if((maxWidthScale<this.mMinimumAssetScale)||in_imgSize.width<(Math.ceil(this.mLeftInset*maxWidthScale)+Math.ceil(this.mRightInset*maxWidthScale)))
{maxWidthScale=this.mMinimumAssetScale;}}
var maxHeightScale=1;if(((this.mTopInset+this.mBottomInset)>=in_imgSize.height)&&((this.mTopInset+this.mBottomInset)>0))
{var topChunkRatio=Math.floor(this.mTopInset/(this.mTopInset+this.mBottomInset)*in_imgSize.height)/this.mTopInset;var bottomChunkRatio=Math.floor(this.mBottomInset/(this.mTopInset+this.mBottomInset)*in_imgSize.height)/this.mBottomInset;topChunkRatio-=floatEpsilon;bottomChunkRatio-=floatEpsilon;maxHeightScale=Math.max(topChunkRatio,bottomChunkRatio);if(in_imgSize.height<(Math.ceil(this.mTopInset*maxHeightScale)+Math.ceil(this.mBottomInset*maxHeightScale)))
{maxHeightScale=Math.min(topChunkRatio,bottomChunkRatio);}
if((maxHeightScale<this.mMinimumAssetScale)||in_imgSize.height<(Math.ceil(this.mTopInset*maxHeightScale)+Math.ceil(this.mBottomInset*maxHeightScale)))
{maxHeightScale=this.mMinimumAssetScale;}}
maxScale=Math.min(maxWidthScale,maxHeightScale);}
return maxScale;},coverageRect:function(rect)
{var left=rect.origin.x+this.scaledValue(this.mLeftInset);var top=rect.origin.y+this.scaledValue(this.mTopInset);var right=rect.maxX()-this.scaledValue(this.mRightInset);var bottom=rect.maxY()-this.scaledValue(this.mBottomInset);left-=this.mLeftWidth;right+=this.mRightWidth;top-=this.mTopHeight;bottom+=this.mBottomHeight;return(new IWRect(left,top,right-left,bottom-top)).round();},p_buildFrame:function(images,size,zIndex)
{var width=size.width;var height=size.height;var startX=this.mLeftWidth;var endX=width-this.mRightWidth;var startY=this.mTopHeight;var endY=height-this.mBottomHeight;var markup="";var zIndexStyle=zIndex?('z-index: '+zIndex+';'):'';if((startX<=endX+1)&&(startY<=endY+1))
{var imageRect=new IWRect(0.0,0.0,this.mLeftWidth,this.mTopHeight);markup=imgMarkup(images[kSFRFrameTopLeft].sourceURL(),imageRect.position()+zIndexStyle);imageRect=new IWRect(0.0,(height-this.mBottomHeight),this.mLeftWidth,this.mBottomHeight);markup+=imgMarkup(images[kSFRFrameBottomLeft].sourceURL(),imageRect.position()+zIndexStyle);imageRect=new IWRect((width-this.mRightWidth),0.0,this.mRightWidth,this.mTopHeight);markup+=imgMarkup(images[kSFRFrameTopRight].sourceURL(),imageRect.position()+zIndexStyle);imageRect=new IWRect((width-this.mRightWidth),(height-this.mBottomHeight),this.mRightWidth,this.mBottomHeight);markup+=imgMarkup(images[kSFRFrameBottomRight].sourceURL(),imageRect.position()+zIndexStyle);var naturalSize=new IWSize(this.mLeftWidth,this.scaledValue(this.mLeftTileHeight));imageRect=new IWRect(0.0,startY,naturalSize.width,naturalSize.height);markup+=this.p_tiles(images[kSFRFrameLeft].sourceURL(),imageRect,startY,endY,true,zIndex);naturalSize=new IWSize(this.mRightWidth,this.scaledValue(this.mRightTileHeight));imageRect=new IWRect(width-this.mRightWidth,startY,naturalSize.width,naturalSize.height);markup+=this.p_tiles(images[kSFRFrameRight].sourceURL(),imageRect,startY,endY,true,zIndex);naturalSize=new IWSize(this.scaledValue(this.mTopTileWidth),this.mTopHeight);imageRect=new IWRect(startX,0.0,naturalSize.width,naturalSize.height);markup+=this.p_tiles(images[kSFRFrameTop].sourceURL(),imageRect,startX,endX,false,zIndex);naturalSize=new IWSize(this.scaledValue(this.mBottomTileWidth),this.mBottomHeight);imageRect=new IWRect(startX,height-this.mBottomHeight,naturalSize.width,naturalSize.height);markup+=this.p_tiles(images[kSFRFrameBottom].sourceURL(),imageRect,startX,endX,false,zIndex);}
return markup;},p_adornmentRectForRect:function(rect)
{var adornmentCenter=new IWPoint();rect=this.coverageRect(rect);adornmentCenter.x=(rect.size.width-(this.mLeftWidth+this.mRightWidth))*this.mAdornmentPosition.x;adornmentCenter.x+=rect.origin.x+this.mLeftWidth;adornmentCenter.y=this.mTopHeight/2.0+(rect.origin.y+this.mAdornmentPosition.y);var scaledAdornmentSize=new IWSize(this.scaledValue(this.mAdornmentSize.width),this.scaledValue(this.mAdornmentSize.height));var adornmentOrigin=new IWPoint(adornmentCenter.x-(scaledAdornmentSize.width/2.0),adornmentCenter.y-(scaledAdornmentSize.height/2.0));var adornmentRect=new IWRect(adornmentOrigin,scaledAdornmentSize);return adornmentRect;},p_adornmentMarkupForRect:function(rect,zIndex)
{var zIndexStyle=zIndex?('z-index: '+zIndex+';'):'';return imgMarkup(this.mAdornmentURL,this.p_adornmentRectForRect(rect).position()+zIndexStyle);},p_tiles:function(imageURL,imageRect,start,end,vertical,zIndex)
{var markup="";if(start<end)
{var zIndexStyle=zIndex?('z-index: '+zIndex+';'):'';var tileRect=imageRect.clone();var tilingMode=this.mTilingMode;if(vertical)
{tileRect.size.height=Math.ceil(end-start);if(imageRect.size.height==1)
{tilingMode=kSFRFrameStretchToFit;}}
else
{tileRect.size.width=Math.ceil(end-start);if(imageRect.size.width==1)
{tilingMode=kSFRFrameStretchToFit;}}
if(tilingMode==kSFRFrameStretchToFit)
{markup+=imgMarkup(imageURL,tileRect.position()+zIndexStyle);}
else
{var naturalSize=imageRect.size;var offset=(vertical?naturalSize.height:naturalSize.width);var maxTiles=Math.ceil((end-start)/offset);if(offset<5||maxTiles>20)
{IWAssert(function(){return true},"Please remove this assert and the surrouding block.");iWLog("Too many frame image tiles are getting generated.  Performance may be affected.");}
if(tilingMode==kSFRFrameStretchEvenly)
{offset=(end-start)/maxTiles;if(vertical)
{imageRect.size.height=offset;}
else
{imageRect.size.width=offset;}}
else if(tilingMode==kSFRFrameClip)
{markup+='<div style="'+tileRect.position()+'overflow: hidden; ">';imageRect.origin.x=0;imageRect.origin.y=0;}
for(var i=0;i<maxTiles;++i)
{var left=Math.round(imageRect.origin.x);var right=Math.round(imageRect.origin.x+imageRect.size.width);var top=Math.round(imageRect.origin.y);var bottom=Math.round(imageRect.origin.y+imageRect.size.height);var roundedRect=new IWRect(left,top,(right-left),(bottom-top));markup+=imgMarkup(imageURL,roundedRect.position()+zIndexStyle);imageRect=vertical?imageRect.offset(0.0,offset):imageRect.offset(offset,0.0);}
if(tilingMode==kSFRFrameClip)
{markup+="</div>";}}}
return markup;}});