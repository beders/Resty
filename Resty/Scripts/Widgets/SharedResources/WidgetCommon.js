//
//  iWeb - WidgetCommon.js
//  Copyright (c) 2007-2008 Apple Inc. All rights reserved.
//

var widgets=[];var identifiersToStringLocalizations=[];var Widget=Class.create({initialize:function(instanceID,widgetPath,sharedPath,sitePath,preferences,runningInApp)
{if(instanceID)
{this.instanceID=instanceID;this.widgetPath=widgetPath;this.sharedPath=sharedPath;this.sitePath=sitePath;this.preferences=preferences;this.runningInApp=(runningInApp===undefined)?false:runningInApp;this.onloadReceived=false;if(this.preferences&&this.runningInApp==true)
{this.preferences.widget=this;setTransparentGifURL(this.sharedPath.stringByAppendingPathComponent("None.gif"));}
this.div().widget=this;window[instanceID]=this;widgets.push(this);widgets[instanceID]=this;if(!this.constructor.instances)
{this.constructor.instances=new Array();}
this.constructor.instances.push(this);}},div:function()
{var divID=this.instanceID;if(arguments.length==1)
{divID=this.instanceID+"-"+arguments[0];}
return $(divID);},onload:function()
{this.onloadReceived=true;},onunload:function()
{},didBecomeSelected:function()
{},didBecomeDeselected:function()
{},didBeginEditing:function()
{},didEndEditing:function()
{},setNeedsDisplay:function()
{},preferenceForKey:function(key)
{var value;if(this.preferences)
value=this.preferences[key];return value;},initializeDefaultPreferences:function(prefs)
{var self=this;$H(prefs).each(function(pair)
{if(self.preferenceForKey(pair.key)===undefined)
{self.setPreferenceForKey(pair.value,pair.key,false);}});},setPreferenceForKey:function(preference,key,registerUndo)
{if(this.runningInApp)
{if(registerUndo===undefined)
registerUndo=true;if((registerUndo==false)&&this.preferences.disableUndoRegistration)
this.preferences.disableUndoRegistration();this.preferences[key]=preference;if((registerUndo==false)&&this.preferences.enableUndoRegistration)
this.preferences.enableUndoRegistration();}
else
{this.preferences[key]=preference;this.changedPreferenceForKey(key);}},changedPreferenceForKey:function(key)
{},postNotificationWithNameAndUserInfo:function(name,userInfo)
{if(window.NotificationCenter!==undefined)
{NotificationCenter.postNotification(new IWNotification(name,null,userInfo));}},sizeWillChange:function()
{},sizeDidChange:function()
{},widgetWidth:function()
{var enclosingDiv=this.div();if(enclosingDiv)
return enclosingDiv.offsetWidth;else
return null;},widgetHeight:function()
{var enclosingDiv=this.div();if(enclosingDiv)
return enclosingDiv.offsetHeight;else
return null;},getInstanceId:function(id)
{var fullId=this.instanceID+"-"+id;if(arguments.length==2)
{fullId+=("$"+arguments[1]);}
return fullId;},getElementById:function(id)
{var fullId=this.getInstanceId.apply(this,arguments);return $(fullId);},localizedString:function(string)
{return LocalizedString(this.widgetIdentifier,string);},showView:function(viewName)
{var futureView=this.m_views[viewName];if((futureView!=this.m_currentView)&&(futureView!=this.m_futureView))
{this.m_futureView=futureView;if(this.m_fadeAnimation)
{this.m_fadeAnimation.stop();}
var previousView=this.m_currentView;this.m_currentView=futureView;var currentView=this.m_currentView;this.m_futureView=null;this.m_fadeAnimation=new SimpleAnimation(function(){delete this.m_fadeAnimation;}.bind(this));this.m_fadeAnimation.pre=function()
{if(previousView)
{previousView.ensureDiv().setStyle({zIndex:0,opacity:1});}
if(currentView)
{currentView.ensureDiv().setStyle({zIndex:1,opacity:0});currentView.show();currentView.render();}}
this.m_fadeAnimation.post=function()
{!previousView||previousView.hide();!currentView||currentView.ensureDiv().setStyle({zIndex:'',opacity:1});!currentView||!currentView.doneFadingIn||currentView.doneFadingIn();}
this.m_fadeAnimation.update=function(now)
{!currentView||currentView.ensureDiv().setOpacity(now);!previousView||previousView.ensureDiv().setOpacity(1-now);}.bind(this);this.m_fadeAnimation.start();}}});Widget.onload=function()
{for(var i=0;i<widgets.length;i++)
{widgets[i].onload();}}
Widget.onunload=function()
{for(var i=0;i<widgets.length;i++)
{widgets[i].onunload();}}
function RegisterWidgetStrings(identifier,strings)
{identifiersToStringLocalizations[identifier]=strings;}
function LocalizedString(identifier,string)
{var localized=undefined;var localizations=identifiersToStringLocalizations[identifier];if(localizations===undefined)
{iWLog("warning: no localizations for widget "+identifier+", (key:"+string+")");}
else
{localized=localizations[string];}
if(localized===undefined)
{iWLog("warning: couldn't find a localization for '"+string+"' for widget "+identifier);localized=string;}
return localized;}
function WriteLocalizedString(identifier,string)
{document.write(LocalizedString(identifier,string));}
var JSONFeedRendererWidget=Class.create(Widget,{initialize:function($super,instanceID,widgetPath,sharedPath,sitePath,preferences,runningInApp)
{if(instanceID)
{$super(instanceID,widgetPath,sharedPath,sitePath,preferences,runningInApp);}},changedPreferenceForKey:function(key)
{try
{var value=this.preferenceForKey(key);if(key=="sfr-shadow")
{if(value!=null)
{this.sfrShadow=eval(value);}
else
{this.sfrShadow=null;}
this.renderFeedItems("sfr-shadow");}
if(key=="sfr-stroke")
{if(value!==null)
this.sfrStroke=eval(value);else
this.sfrStroke=null;this.invalidateFeedItems("sfr-stroke");}
if(key=="sfr-reflection")
{if(value!==null)
{this.sfrReflection=eval(value);}
else
{this.sfrReflection=null;}
this.invalidateFeedItems("sfr-reflection");}}
catch(e)
{iWLog("JSONFeedRendererWidget: exception");debugPrintException(e);}},invalidateFeedItems:function(reason)
{trace('invalidateFeedItems(%s)',reason);if(this.pendingRender!==null)
{clearTimeout(this.pendingRender);}
this.pendingRender=setTimeout(function()
{this.pendingRender=null;this.renderFeedItems(reason);}.bind(this),50);},rerenderImage:function(imgGroupDiv,imgDiv,imageUrlString,entryHasImage,photoProportions,imageWidth,positioningHandler,onloadHandler)
{imgGroupDiv.update();if(entryHasImage)
{imgGroupDiv.strokeApplied=false;imgGroupDiv.reflectionApplied=false;imgGroupDiv.shadowApplied=false;imgGroupDiv.setStyle({marginLeft:0,marginTop:0,marginRight:0,marginBottom:0});imgGroupDiv.style.position='relative';imgDiv.style.position='relative';var imageUrl=imageUrlString||transparentGifURL();var image=IWCreateImage(imageUrl);image.load(function(image,imgDiv,imgGroupDiv,positioningHandler,onloadHandler)
{var cropDiv=this.croppingDivForImage(image,photoProportions,imageWidth);imgGroupDiv.appendChild(cropDiv);if(positioningHandler)
{positioningHandler();}
if(image.sourceURL()!==transparentGifURL())
{this.applyEffects(imgGroupDiv);}
if(onloadHandler)
{onloadHandler();}}.bind(this,image,imgDiv,imgGroupDiv,positioningHandler,onloadHandler));}},croppingDivForImage:function(image,kind,width)
{var croppedSize=function(originalSize,cropKind,width)
{if(cropKind=="Square")
{return new IWSize(width,width);}
else if(cropKind=="Landscape")
{return new IWSize(width,width*(3/4));}
else if(cropKind=="Portrait")
{return new IWSize(width,width*(4/3));}
else
{var scaleFactor=width/originalSize.width;return originalSize.scale(scaleFactor,scaleFactor,true);}};var cropDiv=null;if(image.loaded())
{var img=$(document.createElement('img'));img.src=image.sourceURL();var natural=image.naturalSize();cropDiv=$(document.createElement("div"));cropDiv.appendChild(img);var croppingDivForImage_helper=function(loadedImage)
{if(loadedImage)
{natural=new IWSize(loadedImage.width,loadedImage.height);}
var cropped=croppedSize(natural,kind,width);var scaleFactor=cropped.width/natural.width;if(natural.aspectRatio()>cropped.aspectRatio())
{scaleFactor=cropped.height/natural.height;}
var scaled=natural.scale(scaleFactor);var offset=new IWPoint(Math.abs(scaled.width-cropped.width)/2,Math.abs(scaled.height-cropped.height)/2);img.setStyle({width:px(scaled.width),height:px(scaled.height),marginLeft:px(-offset.x),marginTop:px(-offset.y),position:'relative'});cropDiv.setStyle({width:px(cropped.width),height:px(cropped.height),overflow:"hidden",position:'relative'});cropDiv.className="crop";}
if(windowsInternetExplorer&&effectiveBrowserVersion<7&&img.src.indexOf(transparentGifURL())!=-1)
{var originalImage=new Image();originalImage.src=img.originalSrc;if(originalImage.complete)
{croppingDivForImage_helper(originalImage);}
else
{originalImage.onload=croppingDivForImage_helper.bind(null,originalImage);}}
else
{croppingDivForImage_helper(null);}}
return cropDiv;},applyEffects:function(div)
{if(this.sfrShadow||this.sfrReflection||this.sfrStroke)
{if((div.offsetWidth===undefined)||(div.offsetHeight===undefined)||(div.offsetWidth===0)||(div.offsetHeight===0))
{setTimeout(JSONFeedRendererWidget.prototype.applyEffects.bind(this,div),0)
return;}
if(this.sfrStroke&&(div.strokeApplied==false))
{this.sfrStroke.applyToElement(div);div.strokeApplied=true;}
if(this.sfrReflection&&(div.reflectionApplied==false))
{this.sfrReflection.applyToElement(div);div.reflectionApplied=true;}
if(this.sfrShadow&&(!this.disableShadows)&&(div.shadowApplied==false))
{this.sfrShadow.applyToElement(div);div.shadowApplied=true;}
if(this.runningInApp&&(window.webKitVersion<=419)&&this.preferences.setNeedsDisplay)
{this.preferences.setNeedsDisplay();}}
if(windowsInternetExplorer)
{var cropDivs=div.select(".crop");var cropDiv=cropDivs[cropDivs.length-1];if(cropDiv)
{cropDiv.onclick=function()
{var anchorNode=div.parentNode;var targetHref=locationHRef();while(anchorNode&&(anchorNode.tagName!="A"))
{anchorNode=anchorNode.parentNode}
if(anchorNode)
{targetHref=anchorNode.href;}
window.location=targetHref;};cropDiv.onmouseover=function()
{this.style.cursor='pointer';}}}},summaryExcerpt:function(descriptionHTML,maxSummaryLength)
{var div=document.createElement("div");div.innerHTML=descriptionHTML;if(maxSummaryLength>0)
{var model=new HTMLTextModel(div);model.truncateAroundPosition(maxSummaryLength,"...");}
else if(maxSummaryLength===0)
{div.innerHTML="";}
return div.innerHTML;}});var PrefMarkupWidget=Class.create(Widget,{initialize:function($super,instanceID,widgetPath,sharedPath,sitePath,preferences,runningInApp)
{if(instanceID)
{$super(instanceID,widgetPath,sharedPath,sitePath,preferences,runningInApp);}},onload:function()
{if(!this.runningInApp)
{this.setUpSubDocumentOnLoad();}},setUpSubDocumentOnLoad:function()
{var self=this;var oIFrame=this.getElementById("frame");if(oIFrame)
{setTimeout(function(){self.loadedSubDocument()},250);}},loadedSubDocument:function()
{var oIFrame=this.getElementById("frame");var oSubDocument=oIFrame.contentWindow||oIFrame.contentDocument;if(oSubDocument.document)
{oSubDocument=oSubDocument.document;}
if(oSubDocument.body)
{this.fixTargetOnElements(oSubDocument,"a");this.fixTargetOnElements(oSubDocument,"form");}
else
{var self=this;setTimeout(function(){self.loadedSubDocument()},250);}},fixTargetOnElements:function(doc,tagName)
{var elements=doc.getElementsByTagName(tagName);for(var i=0;i<elements.length;i++)
{var target=elements[i].target;if(target===undefined||target=="")
elements[i].target="_top";}}});function IWScrollbar(scrollbar)
{}
IWScrollbar.prototype._init=function()
{var style=null;var element=null;this._track=$(document.createElement("div"));style=this._track.style;style.height="100%";style.width="100%";this.scrollbar.appendChild(this._track);element=$(document.createElement("div"));element.style.position="absolute";this._setObjectStart(element,0);this._track.appendChild(element);element=$(document.createElement("div"));element.style.position="absolute";this._track.appendChild(element);element=$(document.createElement("div"));element.style.position="absolute";windowsInternetExplorer||this._setObjectEnd(element,0);this._track.appendChild(element);this._thumb=$(document.createElement("div"));style=this._thumb.style;style.position="absolute";this._setObjectSize(this._thumb,this.minThumbSize);this._track.appendChild(this._thumb);element=$(document.createElement("div"));element.style.position="absolute";this._setObjectStart(element,0);this._thumb.appendChild(element);element=$(document.createElement("div"));element.style.position="absolute";this._thumb.appendChild(element);element=$(document.createElement("div"));element.style.position="absolute";windowsInternetExplorer||this._setObjectEnd(element,0);this._thumb.appendChild(element);this.setSize(this.size);this.setTrackStart(this.trackStartPath,this.trackStartLength);this.setTrackMiddle(this.trackMiddlePath);this.setTrackEnd(this.trackEndPath,this.trackEndLength);this.setThumbStart(this.thumbStartPath,this.thumbStartLength);this.setThumbMiddle(this.thumbMiddlePath);this.setThumbEnd(this.thumbEndPath,this.thumbEndLength);this._thumb.style.display="none";Event.observe(this._track,"mousedown",this._mousedownTrackHandler,false);Event.observe(this._thumb,"mousedown",this._mousedownThumbHandler,false);}
IWScrollbar.prototype.remove=function()
{this.scrollbar.removeChild(this._track);}
IWScrollbar.prototype._captureEvent=function(event)
{event.stopPropagation();event.preventDefault();}
IWScrollbar.prototype._mousedownThumb=function(event)
{Event.observe(document,"mousemove",this._mousemoveThumbHandler,true);Event.observe(document,"mouseup",this._mouseupThumbHandler,true);Event.observe(document,"mouseover",this._captureEventHandler,true);Event.observe(document,"mouseout",this._captureEventHandler,true);this._thumbStart_temp=this._getMousePosition(event);this._scroll_thumbStartPos=this._getThumbStartPos();event.stopPropagation();event.preventDefault();}
IWScrollbar.prototype._mousemoveThumb=function(event)
{var delta=this._getMousePosition(event)-this._thumbStart_temp;var new_pos=this._scroll_thumbStartPos+delta;this.scrollTo(this._contentPositionForThumbPosition(new_pos));event.stopPropagation();event.preventDefault();}
IWScrollbar.prototype._mouseupThumb=function(event)
{Event.stopObserving(document,"mousemove",this._mousemoveThumbHandler,true);Event.stopObserving(document,"mouseup",this._mouseupThumbHandler,true);Event.stopObserving(document,"mouseover",this._captureEventHandler,true);Event.stopObserving(document,"mouseout",this._captureEventHandler,true);delete this._thumbStart_temp;delete this._scroll_thumbStartPos;event.stopPropagation();event.preventDefault();}
IWScrollbar.prototype._mousedownTrack=function(event)
{this._track_mouse_temp=this._getMousePosition(event)-this._trackOffset;if(event.altKey)
{this.scrollTo(this._contentPositionForThumbPosition(this._track_mouse_temp-(this._thumbLength/2)));delete this._track_mouse_temp;}
else
{this._track_scrolling=true;Event.observe(this._track,"mousemove",this._mousemoveTrackHandler,true);Event.observe(this._track,"mouseover",this._mouseoverTrackHandler,true);Event.observe(this._track,"mouseout",this._mouseoutTrackHandler,true);Event.observe(document,"mouseup",this._mouseupTrackHandler,true);this._trackScrollOnePage(this);this._track_timer=setInterval(this._trackScrollDelay,500,this);}
event.stopPropagation();event.preventDefault();}
IWScrollbar.prototype._trackScrollDelay=function(self)
{if(!self._track_scrolling)return;clearInterval(self._track_timer);self._trackScrollOnePage(self);self._track_timer=setInterval(self._trackScrollOnePage,150,self);}
IWScrollbar.prototype._mousemoveTrack=function(event)
{this._track_mouse_temp=this._getMousePosition(event)-this._trackOffset;event.stopPropagation();event.preventDefault();}
IWScrollbar.prototype._mouseoverTrack=function(event)
{this._track_mouse_temp=this._getMousePosition(event)-this._trackOffset;this._track_scrolling=true;event.stopPropagation();event.preventDefault();}
IWScrollbar.prototype._mouseoutTrack=function(event)
{this._track_scrolling=false;event.stopPropagation();event.preventDefault();}
IWScrollbar.prototype._mouseupTrack=function(event)
{clearInterval(this._track_timer);Event.stopObserving(this._track,"mousemove",this._mousemoveTrackHandler,true);Event.stopObserving(this._track,"mouseover",this._mouseoverTrackHandler,true);Event.stopObserving(this._track,"mouseout",this._mouseoutTrackHandler,true);Event.stopObserving(document,"mouseup",this._mouseupTrackHandler,true);delete this._track_mouse_temp;delete this._track_scrolling;delete this._track_timer;event.stopPropagation();event.preventDefault();}
IWScrollbar.prototype._trackScrollOnePage=function(self)
{if(!self._track_scrolling)return;var deltaScroll=Math.round(self._trackLength*self._getViewToContentRatio());if(self._track_mouse_temp<self._thumbStart)
self.scrollByThumbDelta(-deltaScroll);else if(self._track_mouse_temp>(self._thumbStart+self._thumbLength))
self.scrollByThumbDelta(deltaScroll);}
IWScrollbar.prototype.setScrollArea=function(scrollarea)
{if(this.scrollarea)
{Event.stopObserving(this.scrollbar,"mousewheel",this.scrollarea._mousewheelScrollHandler,true);Event.stopObserving(this.scrollbar,"DOMMouseScroll",this.scrollarea._mousewheelScrollHandler,true);}
this.scrollarea=scrollarea;Event.observe(this.scrollbar,"mousewheel",this.scrollarea._mousewheelScrollHandler,true);Event.observe(this.scrollbar,"DOMMouseScroll",this.scrollarea._mousewheelScrollHandler,true);}
IWScrollbar.prototype.refresh=function()
{this._trackOffset=this._computeTrackOffset();this._trackLength=this._computeTrackLength();var ratio=this._getViewToContentRatio();if(ratio>=1.0||!this._canScroll())
{if(this.autohide)
{this.hide();}
this._thumb.style.display="none";this.scrollbar.style.appleDashboardRegion="none";}
else
{this._thumbLength=Math.max(Math.round(this._trackLength*ratio),this.minThumbSize);this._numScrollablePixels=this._trackLength-this._thumbLength-(2*this.padding);this._setObjectLength(this._thumb,this._thumbLength);if(windowsInternetExplorer)
{this._setObjectStart(this._thumb.down().next(),this.thumbStartLength);this._setObjectLength(this._thumb.down().next(),this._thumbLength
-this.thumbStartLength-this.thumbEndLength);this._setObjectStart(this._thumb.down().next(1),this._thumbLength-this.thumbEndLength);this._setObjectLength(this._thumb.down().next(1),this.thumbEndLength);if(!this.fixedUpIEPNGBGs)
{fixupIEPNGBGsInTree(this._track);Event.stopObserving(this._track,"mousedown",this._mousedownTrackHandler);Event.stopObserving(this._thumb,"mousedown",this._mousedownThumbHandler);Event.observe(this._track,"mousedown",this._mousedownTrackHandler);Event.observe(this._thumb,"mousedown",this._mousedownThumbHandler);this.fixedUpIEPNGBGs=true;}}
this._thumb.style.display="block";this.scrollbar.style.appleDashboardRegion="dashboard-region(control rectangle)";this.show();}
this.verticalHasScrolled();this.horizontalHasScrolled();}
IWScrollbar.prototype.setAutohide=function(autohide)
{this.autohide=autohide;if(this._getViewToContentRatio()>=1.0&&autohide)
{this.hide();}
else
{this.show();}}
IWScrollbar.prototype.hide=function()
{this._track.style.display="none";this.hidden=true;}
IWScrollbar.prototype.show=function()
{this._track.style.display="block";this.hidden=false;}
IWScrollbar.prototype.setSize=function(size)
{this.size=size;this._setObjectSize(this.scrollbar,size);this._setObjectSize(this._track.down().next(),size);this._setObjectSize(this._thumb.down().next(),size);}
IWScrollbar.prototype.setTrackStart=function(imgpath,length)
{this.trackStartPath=imgpath;this.trackStartLength=length;var element=this._track.down();element.style.background="url("+imgpath+") no-repeat top left";this._setObjectLength(element,length);this._setObjectSize(element,this.size);this._setObjectStart(this._track.down().next(),length);}
IWScrollbar.prototype.setTrackMiddle=function(imgpath)
{this.trackMiddlePath=imgpath;this._track.down().next().style.background="url("+imgpath+") "+this._repeatType+" top left";}
IWScrollbar.prototype.setTrackEnd=function(imgpath,length)
{this.trackEndPath=imgpath;this.trackEndLength=length;var element=this._track.down().next(1);element.style.background="url("+imgpath+") no-repeat top left";this._setObjectLength(element,length);this._setObjectSize(element,this.size);windowsInternetExplorer||this._setObjectEnd(this._track.down().next(),length);}
IWScrollbar.prototype.setThumbStart=function(imgpath,length)
{this.thumbStartPath=imgpath;this.thumbStartLength=length;var element=this._thumb.down();element.style.background="url("+imgpath+") no-repeat top left";this._setObjectLength(element,length);this._setObjectSize(element,this.size);this._setObjectStart(this._thumb.down().next(),length);}
IWScrollbar.prototype.setThumbMiddle=function(imgpath)
{this.thumbMiddlePath=imgpath;this._thumb.down().next().style.background="url("+imgpath+") "+this._repeatType+" top left";}
IWScrollbar.prototype.setThumbEnd=function(imgpath,length)
{this.thumbEndPath=imgpath;this.thumbEndLength=length;var element=this._thumb.down().next(1);element.style.background="url("+imgpath+") no-repeat top left";this._setObjectLength(element,length);this._setObjectSize(element,this.size);windowsInternetExplorer||this._setObjectEnd(this._thumb.down().next(),length);}
IWScrollbar.prototype._contentPositionForThumbPosition=function(thumb_pos)
{if(this._getViewToContentRatio()>=1.0)
{return 0;}
else
{return(thumb_pos-this.padding)*((this._getContentLength()-this._getViewLength())/this._numScrollablePixels);}}
IWScrollbar.prototype._thumbPositionForContentPosition=function(page_pos)
{if(this._getViewToContentRatio()>=1.0)
{return this.padding;}
else
{var result=this.padding+(page_pos/((this._getContentLength()-this._getViewLength())/this._numScrollablePixels));if(isNaN(result))
result=0;return result;}}
IWScrollbar.prototype.scrollByThumbDelta=function(deltaScroll)
{if(deltaScroll==0)
return;this.scrollTo(this._contentPositionForThumbPosition(this._thumbStart+deltaScroll));}
function IWVerticalScrollbar(scrollbar)
{this.scrollarea=null;this.scrollbar=$(scrollbar);this.minThumbSize=28;this.padding=-1;this.autohide=true;this.hidden=true;this.size=19;this.trackStartPath=transparentGifURL();this.trackStartLength=18;this.trackMiddlePath=transparentGifURL();this.trackEndPath=transparentGifURL();this.trackEndLength=18;this.thumbStartPath=transparentGifURL();this.thumbStartLength=9;this.thumbMiddlePath=transparentGifURL();this.thumbEndPath=transparentGifURL();this.thumbEndLength=9;this._track=null;this._thumb=null;this._trackOffset=0;this._trackLength=0;this._numScrollablePixels=0;this._thumbLength=0;this._repeatType="repeat-y";this._thumbStart=this.padding;var _self=this;this._captureEventHandler=function(event){_self._captureEvent(event);};this._mousedownThumbHandler=function(event){_self._mousedownThumb(event);};this._mousemoveThumbHandler=function(event){_self._mousemoveThumb(event);};this._mouseupThumbHandler=function(event){_self._mouseupThumb(event);};this._mousedownTrackHandler=function(event){_self._mousedownTrack(event);};this._mousemoveTrackHandler=function(event){_self._mousemoveTrack(event);};this._mouseoverTrackHandler=function(event){_self._mouseoverTrack(event);};this._mouseoutTrackHandler=function(event){_self._mouseoutTrack(event);};this._mouseupTrackHandler=function(event){_self._mouseupTrack(event);};this._init();}
IWVerticalScrollbar.prototype=new IWScrollbar(null);IWVerticalScrollbar.prototype.scrollTo=function(pos)
{this.scrollarea.verticalScrollTo(pos);}
IWVerticalScrollbar.prototype._setObjectSize=function(object,size)
{object.style.width=size+"px";}
IWVerticalScrollbar.prototype._setObjectLength=function(object,length)
{object.style.height=length+"px";}
IWVerticalScrollbar.prototype._setObjectStart=function(object,start)
{object.style.top=start+"px";}
IWVerticalScrollbar.prototype._setObjectEnd=function(object,end)
{object.style.bottom=end+"px";}
IWVerticalScrollbar.prototype._getMousePosition=function(event)
{if(event!=undefined)
return Event.pointerY(event);else
return 0;}
IWVerticalScrollbar.prototype._getThumbStartPos=function()
{return this._thumb.offsetTop;}
IWVerticalScrollbar.prototype._computeTrackOffset=function()
{var obj=this.scrollbar;var curtop=0;while(obj.offsetParent)
{curtop+=obj.offsetTop;obj=obj.offsetParent;}
return curtop;}
IWVerticalScrollbar.prototype._computeTrackLength=function()
{return this.scrollbar.offsetHeight;}
IWVerticalScrollbar.prototype._getViewToContentRatio=function()
{return this.scrollarea.viewToContentHeightRatio;}
IWVerticalScrollbar.prototype._getContentLength=function()
{return this.scrollarea.content.scrollHeight;}
IWVerticalScrollbar.prototype._getViewLength=function()
{return this.scrollarea.viewHeight;}
IWVerticalScrollbar.prototype._canScroll=function()
{return this.scrollarea.scrollsVertically;}
IWVerticalScrollbar.prototype.verticalHasScrolled=function()
{var new_thumb_pos=this._thumbPositionForContentPosition(this.scrollarea.content.scrollTop);this._thumbStart=new_thumb_pos;this._thumb.style.top=new_thumb_pos+"px";}
IWVerticalScrollbar.prototype.horizontalHasScrolled=function()
{}
function IWHorizontalScrollbar(scrollbar)
{this.scrollarea=null;this.scrollbar=$(scrollbar);this.minThumbSize=28;this.padding=-1;this.autohide=true;this.hidden=true;this.size=19;this.trackStartPath=transparentGifURL();this.trackStartLength=18;this.trackMiddlePath=transparentGifURL();this.trackEndPath=transparentGifURL();this.trackEndLength=18;this.thumbStartPath=transparentGifURL();this.thumbStartLength=9;this.thumbMiddlePath=transparentGifURL();this.thumbEndPath=transparentGifURL();this.thumbEndLength=9;this._track=null;this._thumb=null;this._trackOffset=0;this._trackLength=0;this._numScrollablePixels=0;this._thumbLength=0;this._repeatType="repeat-x";this._thumbStart=this.padding;var _self=this;this._captureEventHandler=function(event){_self._captureEvent(event);};this._mousedownThumbHandler=function(event){_self._mousedownThumb(event);};this._mousemoveThumbHandler=function(event){_self._mousemoveThumb(event);};this._mouseupThumbHandler=function(event){_self._mouseupThumb(event);};this._mousedownTrackHandler=function(event){_self._mousedownTrack(event);};this._mousemoveTrackHandler=function(event){_self._mousemoveTrack(event);};this._mouseoverTrackHandler=function(event){_self._mouseoverTrack(event);};this._mouseoutTrackHandler=function(event){_self._mouseoutTrack(event);};this._mouseupTrackHandler=function(event){_self._mouseupTrack(event);};this._init();}
IWHorizontalScrollbar.prototype=new IWScrollbar(null);IWHorizontalScrollbar.prototype.scrollTo=function(pos)
{this.scrollarea.horizontalScrollTo(pos);}
IWHorizontalScrollbar.prototype._setObjectSize=function(object,size)
{object.style.height=size+"px";}
IWHorizontalScrollbar.prototype._setObjectLength=function(object,length)
{object.style.width=length+"px";}
IWHorizontalScrollbar.prototype._setObjectStart=function(object,start)
{object.style.left=start+"px";}
IWHorizontalScrollbar.prototype._setObjectEnd=function(object,end)
{object.style.right=end+"px";}
IWHorizontalScrollbar.prototype._getMousePosition=function(event)
{if(event!=undefined)
return Event.pointerX(event);else
return 0;}
IWHorizontalScrollbar.prototype._getThumbStartPos=function()
{return this._thumb.offsetLeft;}
IWHorizontalScrollbar.prototype._computeTrackOffset=function()
{var obj=this.scrollbar;var curtop=0;while(obj.offsetParent)
{curtop+=obj.offsetLeft;obj=obj.offsetParent;}
return curtop;}
IWHorizontalScrollbar.prototype._computeTrackLength=function()
{return this.scrollbar.offsetWidth;}
IWHorizontalScrollbar.prototype._getViewToContentRatio=function()
{return this.scrollarea.viewToContentWidthRatio;}
IWHorizontalScrollbar.prototype._getContentLength=function()
{return this.scrollarea.content.scrollWidth;}
IWHorizontalScrollbar.prototype._getViewLength=function()
{return this.scrollarea.viewWidth;}
IWHorizontalScrollbar.prototype._canScroll=function()
{return this.scrollarea.scrollsHorizontally;}
IWHorizontalScrollbar.prototype.verticalHasScrolled=function()
{}
IWHorizontalScrollbar.prototype.horizontalHasScrolled=function()
{var new_thumb_pos=this._thumbPositionForContentPosition(this.scrollarea.content.scrollLeft);this._thumbStart=new_thumb_pos;this._thumb.style.left=new_thumb_pos+"px";}
function IWScrollArea(content)
{this.content=$(content);this.scrollsVertically=true;this.scrollsHorizontally=true;this.singlepressScrollPixels=10;this.viewHeight=0;this.viewToContentHeightRatio=1.0;this.viewWidth=0;this.viewToContentWidthRatio=1.0;this._scrollbars=new Array();var _self=this;this._refreshHandler=function(){_self.refresh();};this._keyPressedHandler=function(){_self.keyPressed(event);};this._mousewheelScrollHandler=function(event){_self.mousewheelScroll(event);};this.content.style.overflow="hidden";this.content.scrollTop=0;this.content.scrollLeft=0;Event.observe(this.content,"mousewheel",this._mousewheelScrollHandler,true);Event.observe(this.content,"DOMMouseScroll",this._mousewheelScrollHandler,true);this.refresh();var c=arguments.length;for(var i=1;i<c;++i)
{this.addScrollbar(arguments[i]);}}
IWScrollArea.prototype.addScrollbar=function(scrollbar)
{scrollbar.setScrollArea(this);this._scrollbars.push(scrollbar);scrollbar.refresh();}
IWScrollArea.prototype.removeScrollbar=function(scrollbar)
{var scrollbars=this._scrollbars;var c=scrollbars.length;for(var i=0;i<c;++i)
{if(scrollbars[i]==scrollbar)
{scrollbars.splice(i,1);break;}}}
IWScrollArea.prototype.remove=function()
{Event.stopObserving(this.content,"mousewheel",this._mousewheelScrollHandler,true);Event.stopObserving(this.content,"DOMMouseScroll",this._mousewheelScrollHandler,true);var scrollbars=this._scrollbars;var c=scrollbars.length;for(var i=0;i<c;++i)
{scrollbars[i].setScrollArea(null);}}
IWScrollArea.prototype.refresh=function()
{this.viewHeight=this.content.offsetHeight;this.viewWidth=this.content.offsetWidth;if(this.content.scrollHeight>this.viewHeight)
{this.viewToContentHeightRatio=this.viewHeight/this.content.scrollHeight;this.verticalScrollTo(this.content.scrollTop);}
else
{this.viewToContentHeightRatio=1.0;this.verticalScrollTo(0);}
if(this.content.scrollWidth>this.viewWidth)
{this.viewToContentWidthRatio=this.viewWidth/this.content.scrollWidth;this.horizontalScrollTo(this.content.scrollLeft);}
else
{this.viewToContentWidthRatio=1.0;this.horizontalScrollTo(0);}
var scrollbars=this._scrollbars;var c=scrollbars.length;for(var i=0;i<c;++i)
{scrollbars[i].refresh();}}
IWScrollArea.prototype.focus=function()
{Event.observe(document,"keypress",this._keyPressedHandler,true);}
IWScrollArea.prototype.blur=function()
{Event.stopObserving(document,"keypress",this._keyPressedHandler,true);}
IWScrollArea.prototype.reveal=function(element)
{var offsetY=0;var obj=element;do
{offsetY+=obj.offsetTop;obj=obj.offsetParent;}while(obj&&obj!=this.content);var offsetX=0;obj=element;do
{offsetX+=obj.offsetLeft;obj=obj.offsetParent;}while(obj&&obj!=this.content);this.verticalScrollTo(offsetY);this.horizontalScrollTo(offsetX);}
IWScrollArea.prototype.verticalScrollTo=function(new_content_top)
{if(!this.scrollsVertically)
return;var bottom=this.content.scrollHeight-this.viewHeight;if(new_content_top<0)
{new_content_top=0;}
else if(new_content_top>bottom)
{new_content_top=bottom;}
this.content.scrollTop=new_content_top;var scrollbars=this._scrollbars;var c=scrollbars.length;for(var i=0;i<c;++i)
{scrollbars[i].verticalHasScrolled();}}
IWScrollArea.prototype.horizontalScrollTo=function(new_content_left)
{if(!this.scrollsHorizontally)
return;var right=this.content_width-this.viewWidth;if(new_content_left<0)
{new_content_left=0;}
else if(new_content_left>right)
{new_content_left=right;}
this.content.scrollLeft=new_content_left;var scrollbars=this._scrollbars;var c=scrollbars.length;for(var i=0;i<c;++i)
{scrollbars[i].horizontalHasScrolled();}}
IWScrollArea.prototype.keyPressed=function(event)
{var handled=true;if(event.altKey)
return;if(event.shiftKey)
return;switch(event.keyIdentifier)
{case"Home":this.verticalScrollTo(0);break;case"End":this.verticalScrollTo(this.content.scrollHeight-this.viewHeight);break;case"Up":this.verticalScrollTo(this.content.scrollTop-this.singlepressScrollPixels);break;case"Down":this.verticalScrollTo(this.content.scrollTop+this.singlepressScrollPixels);break;case"PageUp":this.verticalScrollTo(this.content.scrollTop-this.viewHeight);break;case"PageDown":this.verticalScrollTo(this.content.scrollTop+this.viewHeight);break;case"Left":this.horizontalScrollTo(this.content.scrollLeft-this.singlepressScrollPixels);break;case"Right":this.horizontalScrollTo(this.content.scrollLeft+this.singlepressScrollPixels);break;default:handled=false;}
if(handled)
{event.stopPropagation();event.preventDefault();}}
IWScrollArea.prototype.mousewheelScroll=function(event)
{var deltaScroll=event.wheelDelta?(event.wheelDelta/120*this.singlepressScrollPixels):(event.detail/-2*this.singlepressScrollPixels);this.verticalScrollTo(this.content.scrollTop-deltaScroll);event.stopPropagation();event.preventDefault();}
var View=Class.create({initialize:function(widget,parentDiv)
{this.m_widget=widget;this.m_parentDiv=parentDiv;this.m_divInstanceId=this.m_divId;this.hide();},ensureDiv:function()
{var div=this.m_widget.div(this.m_divInstanceId);if(!div)
{div=new Element('div',{'id':this.m_widget.getInstanceId(this.m_divInstanceId)});div.addClassName(this.m_divClass);this.m_parentDiv.appendChild(div);}
return $(div);},hide:function()
{this.ensureDiv().hide();},show:function()
{this.ensureDiv().show();},render:function()
{},resize:function()
{}});var StatusView=Class.create(View,{initialize:function($super,widget,parentDiv)
{$super(widget,parentDiv);this.render();this.hide();},render:function()
{var markup="<table class='StatusMessageTable'><tr><td>";if(this.badgeImage)
{markup+=imgMarkup(this.m_widget.widgetPath+"/"+this.badgeImage,"","id='"+this.p_badgeImgId()+"'","");}
markup+="</td></tr></table>";if(this.upperRightBadgeWidth&&this.upperRightBadgeHeight)
{var badgeURL=(this.upperRightBadge)?(this.m_widget.widgetPath+"/"+this.upperRightBadge):transparentGifURL();markup+=imgMarkup(badgeURL,"","class='StatusUpperRightBadge' width='"+this.upperRightBadgeWidth+"' height='"+this.upperRightBadgeHeight+"' ","");}
var overlayPath=this.m_widget.sharedPath.stringByAppendingPathComponent("Translucent-Overlay.png");markup+=imgMarkup(overlayPath,"position: absolute; top: 0; left: 0;","id='"+this.p_overlayImgId()+"' width='700' height='286' ","");if(this.statusMessageKey)
{markup+="<div id='"+this.p_statusMessageBlockId()+"' class='StatusMessageBlock' ><span>"+
this.m_widget.localizedString(this.statusMessageKey)+"</span></div>";}
this.ensureDiv().update(markup);this.resize();},resize:function()
{var widgetWidth=(this.runningInApp)?window.innerWidth:this.m_widget.div().offsetWidth;var widgetHeight=(this.runningInApp)?window.innerHeight:this.m_widget.div().offsetHeight;if(this.badgeImage)
{var badgeImageEl=$(this.p_badgeImgId());var badgeSize=new IWSize(this.badgeImageWidth,this.badgeImageHeight);if((badgeSize.width>widgetWidth)||(badgeSize.height>widgetHeight))
{var widgetSize=new IWSize(widgetWidth,widgetHeight);badgeSize=badgeSize.scaleToFit(widgetSize);}
badgeImageEl.width=badgeSize.width;badgeImageEl.height=badgeSize.height;}
var overlayNativeWidth=700;var overlayNativeHeight=286;var overlayWidth=Math.max(widgetWidth,overlayNativeWidth);var overlayHeight=overlayNativeHeight;var overlayTop=Math.min(((widgetHeight/2)-overlayNativeHeight),0);var overlayLeft=Math.min(((widgetWidth/2)-(overlayNativeWidth/2)),0);var overlayImage=$(this.p_overlayImgId());overlayImage.width=overlayWidth;overlayImage.height=overlayHeight;overlayImage.setStyle({left:px(overlayLeft),top:px(overlayTop)});var statusMessageBlock=$(this.p_statusMessageBlockId());if(statusMessageBlock)
{var leftValue=px(Math.max(((widgetWidth-statusMessageBlock.offsetWidth)/2),0));var positionStyles={left:leftValue};if(this.statusMessageVerticallyCentered)
{var topValue=px(Math.max(((widgetHeight-statusMessageBlock.offsetHeight)/2),0));positionStyles.top=topValue;}
statusMessageBlock.setStyle(positionStyles);}
if(this.footerView)
{this.footerView.resize();}},doneFadingIn:function()
{this.m_widget.setPreferenceForKey(true,"x-viewDoneFadingIn",false);},p_badgeImgId:function()
{return this.m_widget.getInstanceId(this.m_divId+"-badge");},p_overlayImgId:function()
{return this.m_widget.getInstanceId(this.m_divId+"-overlay");},p_statusMessageBlockId:function()
{return this.m_widget.getInstanceId(this.m_divId+"-messageBlock");}});