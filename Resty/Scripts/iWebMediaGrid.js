//
// iWeb - iWebMediaGrid.js
// Copyright 2007-2008 Apple Inc.
// All rights reserved.
//

var IWAllFeeds={};function IWCreateFeed(url)
{var feed=IWAllFeeds[url];if(feed==null)
{feed=new IWFeed(url);}
return feed;}
var IWFeed=Class.create({initialize:function(url)
{if(url)
{if(IWAllFeeds.hasOwnProperty(url))
{iWLog("warning -- use IWCreateFeed rather than new IWFeed and you'll get better performance");}
this.mURL=url;this.mLoading=false;this.mLoaded=false;this.mCallbacks=[];this.mImageStream=null;IWAllFeeds[url]=this;}},sourceURL:function()
{return this.mURL;},load:function(baseURL,callback)
{if(this.mLoaded&&(callback!=null))
{callback(this.mImageStream);}
else
{if(callback!=null)
{this.mCallbacks.push(callback);}
if(this.mLoading==false)
{this.mLoading=true;this.p_sendRequest(baseURL);}}},p_sendRequest:function(baseURL)
{var url=this.mURL.toRelativeURL(baseURL);new Ajax.Request(url,{method:'get',onSuccess:this.p_onload.bind(this,baseURL),onFailure:this.p_requestFailed.bind(this,baseURL)});},p_requestFailed:function(baseURL,req)
{iWLog("There was a problem ("+req.status+") retrieving the feed:\n\r"+req.statusText);if(req.status==500)
{iWLog("working around status 500 by trying again...");window.setTimeout(this.p_sendRequest.bind(this,baseURL),100);}},p_onload:function(baseURL,req)
{var collectionItem;var doc=ajaxGetDocumentElement(req);var items=$A(doc.getElementsByTagName('item'));this.mImageStream=this.p_interpretItems(baseURL,items);this.p_postLoadCallbacks(this.mImageStream);},p_postLoadCallbacks:function(imageStream)
{for(var i=0;i<this.mCallbacks.length;++i)
{this.mCallbacks[i](imageStream);}
this.mLoaded=true;},p_applyEntryOrder:function(imageStream,entryGUIDs)
{var orderedStream=[];var guidToIndex=[];for(var i=0;i<imageStream.length;i++)
{var streamEntryGUID=imageStream[i].guid();if(streamEntryGUID)
{guidToIndex[streamEntryGUID]=i;}}
for(var i=0;i<entryGUIDs.length;i++)
{var index=guidToIndex[entryGUIDs[i]];if(index!==undefined)
{orderedStream.push(imageStream[index]);}}
(function(){return orderedStream.length==entryGUIDs.length}).assert();return orderedStream;},p_firstElementByTagNameNS:function(element,ns,tag)
{var child=null;for(child=element.firstChild;child!=null;child=child.nextSibling)
{if(child.baseName==tag||child.localName==tag)
{if(ns==null||ns==""||child.namespaceURI==ns)
{break;}}}
return child;}});var IWStreamEntry=Class.create({initialize:function(thumbnailURL,title,richTitle,guid)
{if(arguments.length>0)
{if(thumbnailURL)
{this.mThumbnail=IWCreateImage(thumbnailURL);}
if(title)
{this.mTitle=title.stringByEscapingXML().stringByConvertingNewlinesToBreakTags();}
if(richTitle)
{this.mRichTitle=richTitle;}
if(guid)
{this.mGUID=guid;}}},setThumbnailURL:function(thumbnailURL)
{this.mThumbnail=IWCreateImage(thumbnailURL);},loadThumbnail:function(callback)
{this.thumbnail().load(callback);},unloadThumbnail:function()
{this.thumbnail().unload();},thumbnailNaturalSize:function()
{return this.thumbnail().naturalSize();},thumbnail:function()
{return this.mThumbnail;},micro:function()
{return this.thumbnail();},mipThumbnail:function()
{return this.thumbnail();},title:function()
{return this.mTitle;},richTitle:function()
{return this.mRichTitle?this.mRichTitle:this.mTitle;},metric:function()
{return null;},guid:function()
{return this.mGUID;},isMovie:function()
{return false;},commentGUID:function()
{return null;},showCommentIndicator:function()
{return true;},badgeMarkupForRect:function(rect)
{return IWStreamEntryBadgeMarkup(rect,this.isMovie(),this.showCommentIndicator()?this.commentGUID():null);},thumbnailMarkupForRect:function(rect)
{return imgMarkup(this.thumbnail().sourceURL(),rect.position(),"",this.mTitle)+
this.badgeMarkupForRect(rect);},didInsertThumbnailMarkupIntoDocument:function()
{}});function IWStreamEntryBadgeMarkup(rect,isMovie,commentGUID)
{var kBadgeWidth=16.0;var kBadgeHeight=16.0;var badgeRect=new IWRect(rect.origin.x,rect.maxY()-kBadgeHeight,rect.size.width,kBadgeHeight);var markup="";if(isMovie)
{markup+='<div style="background-color: black; '+badgeRect.position()+iWOpacity(0.75)+'"></div>';}
var badgeSize=new IWSize(kBadgeWidth,kBadgeHeight);if(isMovie)
{var movieImage=IWImageNamed("movie overlay");var movieRect=new IWRect(badgeRect.origin,badgeSize);markup+=imgMarkup(movieImage.sourceURL(),movieRect.position(),'class="badge-overlay"');}
var commentLocation=new IWPoint(badgeRect.maxX()-kBadgeWidth,badgeRect.origin.y);if(commentGUID)
{var commentImage=IWImageNamed("comment overlay");var commentRect=new IWRect(commentLocation,badgeSize);markup+=imgMarkup(commentImage.sourceURL(),commentRect.position()+"display: none; ",'class="badge-overlay" id="comment-badge-'+commentGUID+'"');}
return markup;}
var IWCommentableStreamEntry=Class.create(IWStreamEntry,{initialize:function($super,assetURL,showCommentIndicator,thumbnailURL,title,richTitle,guid)
{$super(thumbnailURL,title,richTitle,guid);this.mAssetURL=assetURL;this.mShowCommentIndicator=showCommentIndicator;},commentGUID:function()
{return this.guid();},showCommentIndicator:function()
{return this.mShowCommentIndicator;},didInsertThumbnailMarkupIntoDocument:function()
{if(this.mAssetURL&&hostedOnDM())
{IWCommentCountForURL(this.mAssetURL,this.p_commentCountCallback.bind(this));}
else
{this.p_commentCountCallback(0);}},commentAssetURL:function()
{return this.mAssetURL;},p_commentCountCallback:function(commentCount)
{this.mCommentCount=commentCount;if(this.mCommentCount>0)
{$('comment-badge-'+this.commentGUID()).show();}}});var IWImageStreamEntry=Class.create(IWCommentableStreamEntry,{initialize:function($super,assetURL,showCommentIndicator,imageURL,thumbnailURL,microURL,mipThumbnailURL,title,richTitle,guid)
{$super(assetURL,showCommentIndicator,thumbnailURL,title,richTitle,guid);this.mImage=IWCreateImage(imageURL);if(microURL)
{this.mMicro=IWCreateImage(microURL);}
if(mipThumbnailURL)
{this.mMIPThumbnail=IWCreateImage(mipThumbnailURL);}},setImageURL:function(imageURL)
{this.mImage=IWCreateImage(imageURL);},image:function()
{return this.mImage;},micro:function()
{return this.mMicro?this.mMicro:this.thumbnail();},mipThumbnail:function()
{return this.mMIPThumbnail?this.mMIPThumbnail:this.thumbnail();},targetURL:function()
{return this.mImage.sourceURL();},slideshowValue:function(imageType)
{var image=this[imageType]();return{image:image,caption:this.title()};}});var IWMovieStreamEntry=Class.create(IWCommentableStreamEntry,{initialize:function($super,assetURL,showCommentIndicator,movieURL,thumbnailURL,title,richTitle,movieParams,guid)
{$super(assetURL,showCommentIndicator,thumbnailURL,title,richTitle,guid);this.mMovieURL=movieURL;this.mMovieParams=movieParams;},movieURL:function()
{return this.mMovieURL;},targetURL:function()
{return this.movieURL();},isMovie:function()
{return true;},setMovieParams:function(params)
{this.mMovieParams=params;},slideshowValue:function(imageType)
{return{image:this.thumbnail(),movieURL:this.movieURL(),caption:this.title(),params:this.mMovieParams};}});var IWMediaStreamPageEntry=Class.create(IWStreamEntry,{initialize:function($super,targetPageURL,thumbnailURL,title,richTitle,guid)
{if(arguments.length>0)
{$super(thumbnailURL,title,richTitle,guid);this.mTargetPageURL=targetPageURL;}},thumbnailNaturalSize:function()
{return new IWSize(4000,3000);},targetURL:function()
{return this.mTargetPageURL;},positionedThumbnailMarkupForRect:function(rect)
{return IWMediaStreamPageEntryPositionedThumbnailMarkupForRect(this.mThumbnail,rect);}});function IWMediaStreamPageEntryPositionedThumbnailMarkupForRect(thumbnail,rect)
{var thumbnailSize=thumbnail.naturalSize();var scale=Math.max(rect.size.width/thumbnailSize.width,rect.size.height/thumbnailSize.height);var imageSize=thumbnailSize.scale(scale,scale,true);var imagePosition=new IWPoint((rect.size.width-imageSize.width)/2,(rect.size.height-imageSize.height)/2);imagePosition=imagePosition.scale(1,1,true);var imageRect=new IWRect(imagePosition,imageSize);return imgMarkup(thumbnail.sourceURL(),imageRect.position());}
var IWMediaStreamPhotoPageEntryPrefs={};var IWMediaStreamPhotoPageEntries={};function IWMediaStreamPhotoPageSetPrefs(slideshowPrefs)
{IWMediaStreamPhotoPageEntryPrefs=slideshowPrefs;}
var IWMediaStreamPhotoPageEntryUniqueId=0;var IWMediaStreamPhotoPageEntry=Class.create(IWMediaStreamPageEntry,{initialize:function($super,streamScriptURL,targetPageURL,title,contentsFunction,guid)
{$super(targetPageURL,null,title,null,guid);this.mStreamScriptURL=streamScriptURL;this.mContentsFunction=contentsFunction;},loadThumbnail:function(callback)
{this.mThumbnailCallback=callback;this.mSlideshowId='gridEntry'+IWMediaStreamPhotoPageEntryUniqueId++;IWMediaStreamPhotoPageEntries[this.mSlideshowId]=this;var loadingArea=IWCreateLoadingArea();var uniqueId='iFrame_'+new Date().getTime()+IWMediaStreamPhotoPageEntryUniqueId;loadingArea.innerHTML='<iframe id='+uniqueId+' src="streamloader.html?scriptURL='+this.mStreamScriptURL+'&id='+this.mSlideshowId+'" style="position: absolute; visibility: hidden; ">'+'</iframe>';},streamDidLoad:function(media)
{this.mMedia=media;if(this.mMedia&&this.mMedia.length>0)
{this.mThumbnail=this.mMedia[0].mipThumbnail();this.mThumbnail.load(this.mThumbnailCallback);}
else
{this.mThumbnailCallback();}},metric:function()
{var photoCount=0;var clipCount=0;if(this.mMedia)
{for(var index=0;index<this.mMedia.length;++index)
{if(this.mMedia[index].isMovie())
++clipCount;else
++photoCount;}}
return this.mContentsFunction(photoCount,clipCount);},thumbnailMarkupForRect:function(rect)
{var markup="";if(this.mThumbnail)
{markup='<div id="'+this.mSlideshowId+'" style="overflow: hidden; '+rect.position()+'" onclick="window.location.href = \''+this.targetURL()+'\'">'+
this.positionedThumbnailMarkupForRect(rect)+'<div id="'+this.mSlideshowId+'-slideshow_placeholder" style="position: absolute; left: 0px; top: 0px; height: 100%; width: 100%; overflow: hidden; ">'+'</div>'+'</div>';}
return markup;},didInsertThumbnailMarkupIntoDocument:function()
{if(this.mThumbnail)
{if(isiPhone==false)
{var prefs=IWMediaStreamPhotoPageEntryPrefs;prefs["mediaStreamObject"]={load:function(media,baseURL,callback){callback(media);}.bind(null,this.mMedia)};new SlideshowGlue(this.mSlideshowId,'../Scripts/Widgets/Slideshow','../Scripts/Widgets/SharedResources','..',prefs);}}}});function IWMediaStreamPhotoPageSetMediaStream(mediaStream,slideshowId)
{mediaStream.load(IWMediaStreamPhotoPageEntryPrefs.baseURL,function(slideshowId,media)
{IWMediaStreamPhotoPageEntries[slideshowId].streamDidLoad(media);}.bind(null,slideshowId));}
var IWMediaStreamMediaPageEntryUniqueId=0;var IWMediaStreamMediaPageEntry=Class.create(IWMediaStreamPageEntry,{initialize:function($super,targetPageURL,thumbnailURL,title,contents,isMovie,guid)
{$super(targetPageURL,thumbnailURL,title,null,guid);this.mContents=contents;this.mIsMovie=isMovie;},isMovie:function()
{return this.mIsMovie;},metric:function()
{return this.mContents;},thumbnailMarkupForRect:function(rect)
{var badgeRect=new IWRect(new IWPoint(0,0),rect.size);var thumbnailMarkup=this.positionedThumbnailMarkupForRect(rect)+this.badgeMarkupForRect(badgeRect);var idAttribute="";var playButtonMarkup="";if(this.isMovie())
{this.mPlayButtonId='movieEntry'+IWMediaStreamMediaPageEntryUniqueId++;idAttribute='id="'+this.mPlayButtonId+'"';playButtonMarkup='<div id="'+this.mPlayButtonId+'-play_button" class="play_button">'+'<div>'+'</div>'+'</div>';}
var markup='<div '+idAttribute+' style="overflow: hidden; '+rect.position()+'" onclick="window.location.href = \''+this.targetURL()+'\'">'+
thumbnailMarkup+
playButtonMarkup+'</div>';return markup;},didInsertThumbnailMarkupIntoDocument:function()
{if(this.isMovie())
{if(isiPhone==false)
{new PlayButton(this.mPlayButtonId,'../Scripts/Widgets/PlayButton','../Scripts/Widgets/SharedResources','..',{});}}}});var gPhotoFormats=[];var gClipFormats=[];function IWCreateMediaCollection(url,slideshowEnabled,transitionIndex,photoFormats,clipFormats)
{var feed=IWAllFeeds[url];if(feed==null)
{if(gPhotoFormats.length==0)
{gPhotoFormats=photoFormats;}
if(gClipFormats.length==0)
{gClipFormats=clipFormats;}
feed=new IWMediaCollection(url,slideshowEnabled,transitionIndex);}
return feed;}
var IWMediaCollection=Class.create(IWFeed,{initialize:function($super,url,slideshowEnabled,transitionIndex)
{$super(url);this.mSlideshowEnabled=slideshowEnabled;this.mTransitionIndex=transitionIndex;},p_interpretItems:function(baseURL,items)
{var iWebNamespace='http://www.apple.com/iweb';var thumbnailNamespace='urn:iphoto:property';var truthFeed=this.mURL.indexOf('?webdav-method=truthget')!=-1;if(truthFeed)
{iWebNamespace=thumbnailNamespace="urn:iweb:";}
if(IWMediaStreamPhotoPageSetPrefs)
{IWMediaStreamPhotoPageSetPrefs({slideshowEnabled:this.mSlideshowEnabled,fadeIn:true,showOnMouseOver:true,photoDuration:2,startIndex:1,scaleMode:"fill",transitionIndex:this.mTransitionIndex,imageType:"mipThumbnail",movieMode:kPosterFrameOnly,baseURL:baseURL});}
var mediaStream=[];for(var i=0;i<items.length;++i)
{var item=items[i];var link=null;if(truthFeed)
{link=this.p_firstElementByTagNameNS(item,iWebNamespace,'link');}
if(link==null)
{link=item.getElementsByTagName('link')[0];}
if(link!=null)
{var titleText='';var title=item.getElementsByTagName('title')[0];if(title!=null)
{titleText=title.firstChild.nodeValue;}
var skip=false;if(truthFeed)
{title=this.p_firstElementByTagNameNS(item,iWebNamespace,'title');if(title!=null)
{titleText=title.firstChild.nodeValue;}
else
{skip=true;}}
if(skip==false)
{var pageURL=link.firstChild.nodeValue.toRelativeURL(baseURL);var entry=null;var guidNode=item.getElementsByTagName('useritemguid')[0];var guid=null;if(guidNode!=null)
{guid=guidNode.firstChild.nodeValue;}
var thumbnail=this.p_firstElementByTagNameNS(item,thumbnailNamespace,'thumbnail')||item.getElementsByTagName('thumbnail')[0];if(thumbnail)
{var thumbnailURL=transparentGifURL();if(thumbnail.firstChild&&thumbnail.firstChild.nodeValue)
{thumbnailURL=thumbnail.firstChild.nodeValue.toRelativeURL(baseURL);}
var contentsText=null;var contents=this.p_firstElementByTagNameNS(item,iWebNamespace,'contents');if(contents)
{contentsText=contents.firstChild.nodeValue;}
var isMovie=false;var isMovieValue=this.p_firstElementByTagNameNS(item,iWebNamespace,'is-movie');if(isMovieValue&&isMovieValue.firstChild&&isMovieValue.firstChild.nodeValue)
{isMovie=(isMovieValue.firstChild.nodeValue=='true');}
entry=new IWMediaStreamMediaPageEntry(pageURL,thumbnailURL,titleText,contentsText,isMovie,guid);}
else
{var pageName=pageURL.lastPathComponent().stringByDeletingPathExtension();var pageScriptURL=pageURL.stringByDeletingLastPathComponent().stringByAppendingPathComponent(pageName+"_files").stringByAppendingPathComponent(pageName+".js");entry=new IWMediaStreamPhotoPageEntry(pageScriptURL,pageURL,titleText,albumContentsFunction,guid);}
mediaStream.push(entry);}}}
return mediaStream;}});function albumContentsFunction(photoCount,clipCount)
{var contents="";photoFormat=gPhotoFormats[Math.min(photoCount,2)];clipFormat=gClipFormats[Math.min(clipCount,2)];photoFormat=photoFormat.replace(/%d/,photoCount);clipFormat=clipFormat.replace(/%d/,clipCount);if(clipFormat&&clipFormat.length>0&&photoCount==0)
{contents=clipFormat;}
else
{contents=photoFormat;if(clipFormat&&clipFormat.length>0)
{contents+=", "+clipFormat;}}
return contents;}
function IWCreatePhotocast(url,showCommentIndicator)
{var feed=IWAllFeeds[url];if(feed==null)
{feed=new IWPhotocast(url,showCommentIndicator);}
return feed;}
var IWPhotocast=Class.create(IWFeed,{initialize:function($super,url,showCommentIndicator)
{$super(url);this.mShowCommentIndicator=showCommentIndicator;},p_interpretItems:function(baseURL,items)
{var imageStream=[];for(var i=0;i<items.length;++i)
{var item=items[i];enclosure=item.getElementsByTagName('enclosure')[0];if(enclosure!=null)
{var titleText='';var title=item.getElementsByTagName('title')[0];if(title&&title.firstChild&&title.firstChild.nodeValue)
{titleText=title.firstChild.nodeValue;}
var iWebNamespace='http://www.apple.com/iweb';var thumbnailNamespace='urn:iphoto:property';var richTitleHTML;var richTitle=this.p_firstElementByTagNameNS(item,iWebNamespace,'richTitle');if(richTitle&&richTitle.firstChild&&richTitle.firstChild.nodeValue)
{richTitleHTML=richTitle.firstChild.nodeValue.stringByUnescapingXML();}
var guidNode=item.getElementsByTagName('guid')[0];var guid=null;if(guidNode!=null)
{guid=guidNode.firstChild.nodeValue;}
var thumbnail=this.p_firstElementByTagNameNS(item,thumbnailNamespace,'thumbnail')||item.getElementsByTagName('thumbnail')[0];IWAssert(function(){return thumbnail!=null},"Could not get thumbnail from feed.  Server configuration may have changed.");if(thumbnail)
{var entry=null;var type=enclosure.getAttribute("type").split("/");var thumbnailURL=thumbnail.firstChild.nodeValue.toRebasedURL(baseURL);if(type[0]=="video")
{var movieURL=enclosure.getAttribute('url').toRebasedURL(baseURL);var movieParams=null;var movieParamsElement=this.p_firstElementByTagNameNS(item,iWebNamespace,'movieParams');if(movieParamsElement&&movieParamsElement.firstChild&&movieParamsElement.firstChild.nodeValue)
{var movieParamsJSON=movieParamsElement.firstChild.nodeValue.stringByUnescapingXML();movieParams=eval('('+movieParamsJSON+')');}
var assetURL=movieURL.stringByDeletingLastPathComponent();IWAssert(function(){return assetURL!=null},"could not determine asset URL for movie: "+movieURL);entry=new IWMovieStreamEntry(assetURL,this.mShowCommentIndicator,movieURL,thumbnailURL,titleText,richTitleHTML,movieParams,guid);}
else
{var imageURL=enclosure.getAttribute('url').toRebasedURL(baseURL);var assetURL=imageURL.urlStringByDeletingQueryAndFragment().stringByDeletingPathExtension();var microURL=null;var micro=this.p_firstElementByTagNameNS(item,iWebNamespace,'micro');if(micro&&micro.firstChild&&micro.firstChild.nodeValue)
{microURL=micro.firstChild.nodeValue.toRebasedURL(baseURL);}
if(!microURL)
{microURL=(imageURL.urlStringByDeletingQueryAndFragment()+"?derivative=micro").toRebasedURL(baseURL);}
var mipThumbnailURL=null;var mipThumbnail=this.p_firstElementByTagNameNS(item,iWebNamespace,'mip-thumbnail');if(mipThumbnail&&mipThumbnail.firstChild&&mipThumbnail.firstChild.nodeValue)
{mipThumbnailURL=mipThumbnail.firstChild.nodeValue.toRebasedURL(baseURL);}
if(!mipThumbnailURL)
{mipThumbnailURL=(imageURL.urlStringByDeletingQueryAndFragment()+"?derivative=mip&alternate=thumb").toRebasedURL(baseURL);}
IWAssert(function(){return assetURL!=null},"could not determine asset URL for image: "+imageURL);entry=new IWImageStreamEntry(assetURL,this.mShowCommentIndicator,imageURL,thumbnailURL,microURL,mipThumbnailURL,titleText,richTitleHTML,guid);}
imageStream.push(entry);}}}
return imageStream;}});var kPhotoViewMovieControllerHeight=16;var kShowMovie=0;var kAutoplayMovie=1;var kPosterFrameOnly=2;function setFrameOptionallyMovingContents(element,frame,moveContents)
{var oldOrigin=new IWPoint(element.offsetLeft,element.offsetTop);$(element).setStyle({left:px(frame.origin.x),top:px(frame.origin.y),width:px(frame.size.width),height:px(frame.size.height)});var offset=new IWPoint(oldOrigin.x-frame.origin.x,oldOrigin.y-frame.origin.y);if(moveContents)
{offsetChildren(element,offset,false);}
return offset;}
function offsetChildren(element,offset,reverse)
{for(var node=element.firstChild;node;node=node.nextSibling)
{var left=parseFloat(node.style.left||0);var top=parseFloat(node.style.top||0);$(node).setStyle({left:px(reverse?left-offset.x:left+offset.x),top:px(reverse?top-offset.y:top+offset.y)});}}
var PhotoViewWaitingForDonePlaying=[];function PhotoViewDonePlaying(index)
{PhotoViewWaitingForDonePlaying[index]();return false;}
var PhotoView=Class.create({initialize:function(container,scaleMode,reflectionHeight,reflectionOffset,backgroundColor,movieMode,captionHeight)
{this.scaleMode="fit";this.reflectionHeight=0;this.reflectionOffset=0;this.backgroundColor="black";this.movieMode=kShowMovie;this.captionHeight=0;if(scaleMode)
{this.scaleMode=scaleMode;}
if(reflectionHeight)
{this.reflectionHeight=reflectionHeight;if(reflectionOffset)
{this.reflectionOffset=reflectionOffset;}
if(windowsInternetExplorer)
{this.reflection=document.createElement("img");}
else
{this.reflection=document.createElement("canvas");}}
if(captionHeight)
{this.captionHeight=captionHeight;this.caption=document.createElement("div");}
if(backgroundColor)
{this.backgroundColor=backgroundColor;}
if(movieMode!==undefined)
{this.movieMode=movieMode;}
var div=document.createElement("div");var canvas=document.createElement("canvas");if(canvas.getContext&&!isOpera)
{div.appendChild(canvas);this.canvas=canvas;}
else
{var img=document.createElement("img");img.src=transparentGifURL();div.appendChild(img);this.img=img;}
if(this.reflection)
{div.appendChild(this.reflection);}
if(this.caption)
{div.appendChild(this.caption);}
container.appendChild(div);this.box=container;this.div=div;this.initStyle();},boxSize:function()
{return{width:this.box.offsetWidth,height:this.box.offsetHeight};},initStyle:function()
{var box_size=this.boxSize();$(this.div).setStyle({position:"absolute",width:px(box_size.width),height:px(box_size.height),backgroundColor:this.backgroundColor});if(this.canvas)
{$(this.canvas).setStyle({position:"absolute",left:0,top:0});$(this.canvas).setAttribute("width",box_size.width);$(this.canvas).setAttribute("height",box_size.height-Math.max(this.reflectionHeight+this.reflectionOffset,this.captionHeight));if(!windowsInternetExplorer)
{this.canvas.style.zIndex="inherit";}}
else if(this.img)
{this.img.style.position="absolute";}
if(this.reflection)
{this.reflection.style.position="absolute";if(!windowsInternetExplorer)
{this.reflection.setAttribute("width",box_size.width);this.reflection.setAttribute("height",this.reflectionHeight);}}
if(this.caption)
{$(this.caption).setStyle({position:"absolute",top:px(box_size.height-this.captionHeight*0.6),left:0,width:px(box_size.width)});this.caption.className="caption";}
this.resetSizeAndPosition();},setImage:function(photo)
{if(this.photo!==photo)
{if(this.photo)
{this.photo.image.allowUnloading();this.photo.image.unload();}
if(photo)
{photo.image.preventUnloading();}}
this.photo=photo;this.image=photo.image;this.movieURL=null;if(this.movieMode!=kPosterFrameOnly&&photo.movieURL)
{this.movieURL=photo.movieURL;}
if(this.caption)
{this.caption.innerHTML=photo.caption||'';}
var box_size=this.boxSize();box_size.height-=Math.max(this.reflectionHeight+this.reflectionOffset,this.captionHeight);if(this.movieURL&&box_size.height>kPhotoViewMovieControllerHeight)
{box_size.height-=kPhotoViewMovieControllerHeight;}
var box_aspect=box_size.height/box_size.width;var img_size=this.image.naturalSize();var img_aspect=img_size.height/img_size.width;var w=box_size.width;var h=box_size.height;if((img_aspect>box_aspect&&this.scaleMode=="fit")||(img_aspect<box_aspect&&this.scaleMode=="fill"))
{var ratio=box_size.height/img_size.height;if(this.scaleMode=="fit")
ratio=Math.min(ratio,1.0);w=Math.round(img_size.width*ratio);h=Math.round(img_size.height*ratio);}
else if((img_aspect<box_aspect&&this.scaleMode=="fit")||(img_aspect>box_aspect&&this.scaleMode=="fill"))
{var ratio=box_size.width/img_size.width;if(this.scaleMode=="fit")
ratio=Math.min(ratio,1.0);w=Math.round(img_size.width*ratio);h=Math.round(img_size.height*ratio);}
var x=Math.floor((box_size.width-w)/2);var y=Math.floor((box_size.height-h)/2);if(this.canvas)
{if(this.scaleMode=="fit")
{if(this.canvas.width!=w||this.canvas.height!=h)
{if(true)
{var newCanvas=this.canvas.cloneNode(false);newCanvas.setAttribute("width",w);newCanvas.setAttribute("height",h);this.canvas.parentNode.replaceChild(newCanvas,this.canvas);this.canvas=newCanvas;}
else
{this.canvas.setAttribute("width",w);this.canvas.setAttribute("height",h);}
$(this.canvas).setStyle({top:px(y),left:px(x)});}
if(w>0&&h>0)
{var context=this.canvas.getContext("2d");context.clearRect(0,0,w,h);context.drawImage(this.image.imgObject(),0,0,w,h);}}
else
{if(w>0&&h>0)
{var context=this.canvas.getContext("2d");context.clearRect(0,0,this.canvas.width,this.canvas.height);context.drawImage(this.image.imgObject(),x,y,w,h);}}}
else if(this.img)
{$(this.img).src=this.image.sourceURL();$(this.img).setStyle({width:px(w),height:px(h),top:px(y),left:px(x)});}
this.updateReflection(x,y,w,h);if(windowsInternetExplorer)
{setTimeout(this.updateReflection.bind(this,x,y,w,h),0);}
if(this.movieURL)
{this.movieRect=new IWRect(x,y,w,h);this.p_updateMovieRect();}},willAnimate:function()
{if(this.caption&&this.caption.parentNode==this.div)
{this.div.removeChild(this.caption);}},didAnimate:function()
{if(this.caption&&this.caption.parentNode!=this.div)
{this.div.appendChild(this.caption);}},transitionComplete:function()
{if(this.movieURL&&this.movieMode!=kPosterFrameOnly)
{this.p_showMovie();}},updateReflection:function(x,y,w,h)
{if(this.reflection)
{var opacity=0.5;this.reflection.style.top=px(y+h+this.reflectionOffset);if(windowsInternetExplorer)
{this.reflection.src=this.image.sourceURL();$(this.reflection).setStyle({left:px(x),width:px(w),height:px(h)});this.reflection.style.filter='flipv'+' progid:DXImageTransform.Microsoft.Alpha(opacity='+opacity*100+', style=1, finishOpacity=0, startx=0, starty=0, finishx=0, finishy='+this.reflectionHeight/h*100+')';}
else if(this.reflection.getContext)
{if(true)
{var newReflection=this.reflection.cloneNode(false);newReflection.setAttribute("width",w);this.reflection.parentNode.replaceChild(newReflection,this.reflection);this.reflection=newReflection;}
else
{this.reflection.setAttribute("width",w);}
this.reflection.style.left=px(x);if(w>0&&this.reflection.height>0)
{var context=this.reflection.getContext("2d");context.clearRect(0,0,w,this.reflection.height);context.save();context.translate(0,h-1);context.scale(1,-1);context.drawImage(this.image.imgObject(),0,0,w,h);context.restore();context.save();var gradient=context.createLinearGradient(0,0,0,this.reflectionHeight);gradient.addColorStop(1,this.backgroundColor);var partiallyOpaque="rgba(0,0,0,"+opacity+")";var components=this.backgroundColor.toLowerCase().match(/#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/);if(components&&components.length>=4)
{partiallyOpaque="rgba("+parseInt(components[1],16)+", "+parseInt(components[2],16)+", "+parseInt(components[3],16)+", "+opacity+")";}
gradient.addColorStop(0,partiallyOpaque);context.fillStyle=gradient;if(navigator.appVersion.indexOf('WebKit')!=-1)
{context.rect(0,0,w,this.reflectionHeight*2);context.fill();}
else
{context.fillRect(0,0,w,this.reflectionHeight*2);}
context.restore();}}}},updateSize:function()
{this.initStyle();if(this.photo)
{this.photo.image.load(this.setImage.bind(this,this.photo));}},setZIndex:function(zIndex)
{this.div.style.zIndex=zIndex;},upper:function()
{this.setZIndex(1);},lower:function()
{this.setZIndex(0);},show:function()
{this.div.style.visibility="visible";},hide:function()
{this.p_destroyMovie();this.div.style.visibility="hidden";},upperShown:function()
{this.upper();this.show();},upperHidden:function()
{this.hide();this.upper();},lowerShown:function()
{this.lower();this.show();},lowerHidden:function()
{this.hide();this.lower();},setClipPx:function(top,width,height,left)
{this.div.style.clip="rect("+top+"px "+width+"px "+height+"px "+left+"px)";},setLeftPx:function(left)
{this.div.style.left=px(left);},setTopPx:function(top)
{this.div.style.top=px(top);},setClipToMax:function()
{var size=this.boxSize();this.div.style.clip="rect(0px "+size.width+"px "+size.height+"px 0px)";},resetSizeAndPosition:function()
{$(this.div).setStyle({left:0,top:0});this.setClipToMax();},setOpacity:function(opacity)
{IWSetDivOpacity(this.div,opacity)},p_appendParamToObject:function(name,value)
{var param=document.createElement("param");param.name=name;param.value=value;this.object.appendChild(param);},p_stopMovie:function()
{var movie=this.movieID?document[this.movieID]:null;if(movie)
{var status=null;try
{status=movie.GetPluginStatus();}
catch(e)
{status=null;}
if(status==null||status.startsWith("Error:")||status=="Waiting"||status=="Loading")
{}
else
{if(status=="Playable"||status=="Complete")
{if(movie.GetRate()>0)
{movie.Stop();}}}}},p_destroyMovie:function()
{if(this.movieID)
{this.p_stopMovie();var movie=document[this.movieID];if(movie)
{movie.style.display="none";}
this.div.removeChild(this.object);delete this.object;delete this.movieIndex;delete this.movieID;}},p_movieDidFinish:function()
{NotificationCenter.postNotification(new IWNotification("PhotoViewMovieDidEnd",this,{}));},p_timeString:function(time)
{var seconds=Math.floor(time);var frames=(time-seconds)*30;var minutes=Math.floor(seconds/60);var hours=Math.floor(minutes/60);seconds-=minutes*60;minutes-=hours*60;if(minutes<10)
{minutes="0"+minutes;}
if(seconds<10)
{seconds="0"+seconds;}
frames=Math.round(frames*10)/10;if(frames<10)
{frames="0"+frames;}
var timeString=hours+":"+minutes+":"+seconds+":"+frames;return timeString;},p_movieHeight:function()
{var movieHeight=this.movieRect.size.height;if(this.photo.params.movieShowController)
{movieHeight+=kPhotoViewMovieControllerHeight;}
return movieHeight;},p_updateMovieRect:function()
{if(this.object)
{this.object.setAttribute("width",this.movieRect.size.width);this.object.setAttribute("height",this.p_movieHeight());$(this.object).setStyle({position:"absolute",left:px(this.movieRect.origin.x),top:px(this.movieRect.origin.y)});}},p_showMovie:function()
{this.object=document.createElement("object");if(this.object)
{this.movieIndex=PhotoViewWaitingForDonePlaying.length;this.movieID="photoViewMovie"+this.movieIndex;this.object.id=this.movieID;if(!windowsInternetExplorer)
{this.object.type="video/quicktime";this.object.setAttribute("data",this.movieURL);this.object.style.zIndex="inherit";}
this.p_updateMovieRect();var shouldAutoplay=this.movieMode==kAutoplayMovie||this.photo.params.movieAutoPlay;this.p_appendParamToObject("controller",this.photo.params.movieShowController?"true":"false");this.p_appendParamToObject("autoplay",shouldAutoplay?"true":"false");this.p_appendParamToObject("scale","tofit");this.p_appendParamToObject("volume","12800");this.p_appendParamToObject("loop",this.photo.params.movieLoop!="SFDMovieNoLoop"?"true":"false");this.p_appendParamToObject("starttime",this.p_timeString(this.photo.params.movieStartTime*this.photo.params.movieDuration));this.p_appendParamToObject("endtime",this.p_timeString(this.photo.params.movieEndTime*this.photo.params.movieDuration));this.p_appendParamToObject("src",this.movieURL);PhotoViewWaitingForDonePlaying[this.movieIndex]=this.p_movieDidFinish.bind(this);this.p_appendParamToObject("qtnext1","<javascript:PhotoViewDonePlaying("+this.movieIndex+");>");this.div.appendChild(this.object);if(windowsInternetExplorer)
{this.object.classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B";this.object.codebase="http://www.apple.com/qtactivex/qtplugin.cab";}}},setMovieTime:function(time)
{if(this.object)
{var movie=document[this.movieID];movie.Stop();movie.SetTime(time*movie.GetDuration());}},p_updateMovieParams:function()
{if(this.object)
{var movie=document[this.movieID];if(movie)
{var params=$H(this.photo.params);var self=this;params.each(function(pair)
{if(pair.key=="movieShowController")
{if(movie.GetControllerVisible()!=pair.value)
{movie.SetControllerVisible(pair.value);self.object.setAttribute("height",self.p_movieHeight());}}
else if(pair.key=="movieLoop")
{movie.SetIsLooping(pair.value!="SFDMovieNoLoop");}
else if(pair.key=="movieAutoPlay")
{movie.SetAutoPlay(pair.value||this.movieMode==kAutoplayMovie);}
else if(pair.key=="movieStartTime")
{movie.SetStartTime(pair.value*movie.GetDuration());}
else if(pair.key=="movieEndTime")
{movie.SetEndTime(pair.value*movie.GetDuration());}});}}},setMovieParams:function(params)
{var photo=this.photo;$H(params).each(function(pair)
{photo.params[pair.key]=pair.value;});this.p_updateMovieParams();}});var SimpleAnimation=Class.create({initialize:function(oncomplete)
{this.duration=500;this.from=0.0;this.to=1.0;if(oncomplete!=null){this.oncomplete=oncomplete;}},animationComplete:function()
{delete this.animation;delete this.animator;this.post();if(this.oncomplete!=null){this.oncomplete();}},stop:function()
{if(this.animation!=null){this.animator.stop();this.post();delete this.animation;delete this.animator;}},start:function()
{this.stop();this.pre();var self=this;var animator=new AppleAnimator(this.duration,13);animator.oncomplete=function(){self.animationComplete();};this.animator=animator;this.framecount=0;var update=function(animation,now,first,done){self.update(now);++self.framecount;}
this.animation=new AppleAnimation(this.from,this.to,update);animator.addAnimation(this.animation);animator.start();},pre:function()
{},post:function()
{},update:function(now)
{}});var TransitionEffect=Class.create({initialize:function(current,next,oncomplete,shouldTighten)
{this.current=current;this.next=next;this.oncomplete=oncomplete;this.shouldTighten=shouldTighten;this.effects=[{name:"Random",method:"random"},{name:"Jump",method:"jump"},{name:"Fade",method:"fade"},{name:"Wipe",directions:[{name:"Right",method:"wipeRight"},{name:"Left",method:"wipeLeft"},{name:"Down",method:"wipeDown"},{name:"Up",method:"wipeUp"},{name:"In",method:"wipeIn"},{name:"Out",method:"wipeOut"}]},{name:"Close",directions:[{name:"Horizontal",method:"wipeCloseHoriz"},{name:"Vertical",method:"wipeCloseVert"}]},{name:"Open",directions:[{name:"Horizontal",method:"wipeOpenHoriz"},{name:"Vertical",method:"wipeOpenVert"}]},{name:"Reveal",directions:[{name:"Right",method:"slideOffRight"},{name:"Left",method:"slideOffLeft"},{name:"Down",method:"slideOffDown"},{name:"Up",method:"slideOffUp"}]},{name:"Slide On",directions:[{name:"Right",method:"slideOnRight"},{name:"Left",method:"slideOnLeft"},{name:"Down",method:"slideOnDown"},{name:"Up",method:"slideOnUp"}]},{name:"Push",directions:[{name:"Right",method:"pushRight"},{name:"Left",method:"pushLeft"},{name:"Down",method:"pushDown"},{name:"Up",method:"pushUp"}]},{name:"Fade Through Black",method:"fadeThroughBlack"}];},doEffect:function(effect)
{this[effect]();},random:function()
{var supportedEffects=[2,6,8,9];var idx=Math.floor(Math.random()*supportedEffects.length);var num=supportedEffects[idx];var effect=this.effects[num];var method=effect.directions?effect.directions[0].method:effect.method;this.doEffect(method);},animationComplete:function()
{delete this.animation;if(this.oncomplete!=null){this.oncomplete();}},jump:function()
{this.stop();this.next.upperShown();this.current.lowerHidden();this.animationComplete();},tighten:function(horiz,vert)
{if(this.shouldTighten&&(vert||horiz))
{var top=99999;var left=99999;var right=0;var bottom=0;function expand(div)
{for(var node=div.firstChild;node;node=node.nextSibling)
{var t=node.offsetTop;var l=node.offsetLeft;left=Math.min(left,l);top=Math.min(top,t);right=Math.max(right,l+node.offsetWidth);bottom=Math.max(bottom,t+node.offsetHeight);}}
expand(this.current.div);expand(this.next.div);if(vert==false||horiz==false)
{var boxSize=this.current.boxSize();if(vert==false)
{top=0;bottom=boxSize.height;}
if(horiz==false)
{left=0;right=boxSize.width;}}
var frame=new IWRect(left,top,right-left,bottom-top);this.current.originalFrame=new IWRect(this.current.div.offsetLeft,this.current.div.offsetTop,this.current.div.offsetWidth,this.current.div.offsetHeight);this.next.originalFrame=new IWRect(this.next.div.offsetLeft,this.next.div.offsetTop,this.next.div.offsetWidth,this.next.div.offsetHeight);this.current.offset=setFrameOptionallyMovingContents(this.current.div,frame,true);this.next.offset=setFrameOptionallyMovingContents(this.next.div,frame,true);}},loosen:function(loosenHoriz,loosenVert)
{if(this.shouldTighten&&(loosenHoriz||loosenVert))
{setFrameOptionallyMovingContents(this.current.div,this.current.originalFrame,false);setFrameOptionallyMovingContents(this.next.div,this.next.originalFrame,false);offsetChildren(this.current.div,this.current.offset,true);offsetChildren(this.next.div,this.next.offset,true);}},fade:function()
{this.stop();var self=this;this.animation=new SimpleAnimation(function(){self.animationComplete();});this.animation.pre=function()
{self.tighten(true,true);self.current.upperShown();self.next.lowerShown();self.current.setOpacity(1.0);self.next.setOpacity(1.0);}
this.animation.post=function()
{self.loosen(true,true);self.next.upperShown();self.next.setOpacity(1.0);self.current.lowerHidden();self.current.setOpacity(1.0);}
this.animation.update=function(now)
{self.current.setOpacity(1.0-now);}
this.animation.start();},fadeThroughBlack:function()
{this.stop();var self=this;this.animation=new SimpleAnimation(function(){self.animationComplete();});this.animation.pre=function()
{self.tighten(true,true);self.current.upperShown();self.next.lowerShown();self.current.setOpacity(1.0);self.next.setOpacity(0.0);}
this.animation.post=function()
{self.loosen(true,true);self.next.upperShown();self.next.setOpacity(1.0);self.current.lowerHidden();self.current.setOpacity(1.0);}
this.animation.update=function(now)
{if(now<0.5)
{self.current.setOpacity((0.5-now)*2);}
else
{self.current.lowerHidden();self.next.setOpacity((now-0.5)*2);}}
this.animation.start();},doWipe:function(wiper,inFlag,tightenHoriz,tightenVert)
{this.stop();var self=this;this.animation=new SimpleAnimation(function(){self.animationComplete();});this.animation.pre=function()
{self.current.resetSizeAndPosition();self.width=parseInt(self.current.div.style.width);self.height=parseInt(self.current.div.style.height);self.tighten(tightenHoriz,tightenVert);if(inFlag){wiper.call(self,self.animation.from);self.next.upperShown();self.current.lowerShown();}
else{self.current.upperShown();self.next.lowerShown();}}
this.animation.post=function()
{self.loosen(tightenHoriz,tightenVert);self.next.upperShown();self.next.resetSizeAndPosition();self.current.lowerHidden();self.current.resetSizeAndPosition();}
this.animation.update=function(now)
{wiper.call(self,now);}
this.animation.start();},wipeRight:function()
{this.doWipe(function(now)
{this.current.setClipPx(0,this.width,this.height,now*this.width);});},wipeLeft:function()
{this.doWipe(function(now)
{this.current.setClipPx(0,this.width-now*this.width,this.height,0);});},wipeDown:function()
{this.doWipe(function(now)
{this.current.setClipPx(now*this.height,this.width,this.height,0);});},wipeUp:function()
{this.doWipe(function(now)
{this.current.setClipPx(0,this.width,this.height-now*this.height,0);});},wipeIn:function()
{this.doWipe(function(now)
{var x=this.width*(1-now)/2;var y=this.height*(1-now)/2;this.next.setClipPx(y,this.width-x,this.height-y,x);},true);},wipeOut:function()
{this.doWipe(function(now)
{var x=this.width*now/2;var y=this.height*now/2;this.current.setClipPx(y,this.width-x,this.height-y,x);});},wipeCloseHoriz:function()
{this.doWipe(function(now)
{var x=this.width*now/2;this.current.setClipPx(0,this.width-x,this.height,x);});},wipeCloseVert:function()
{this.doWipe(function(now)
{var y=this.height*now/2;this.current.setClipPx(y,this.width,this.height-y,0);});},wipeOpenHoriz:function()
{this.doWipe(function(now)
{var x=this.width*(1-now)/2;this.next.setClipPx(0,this.width-x,this.height,x);},true);},wipeOpenVert:function()
{this.doWipe(function(now)
{var y=this.height*(1-now)/2;this.next.setClipPx(y,this.width,this.height-y,0);},true);},slideOffRight:function()
{this.doWipe(function(now)
{var x=now*this.width;this.current.setLeftPx(x+(this.width-parseInt(this.current.div.style.width))/2);},false,true,true);},slideOffLeft:function()
{this.doWipe(function(now)
{var x=now*this.width;this.current.setClipPx(0,this.width,this.height,x);this.current.setLeftPx(-x);});},slideOffDown:function()
{this.doWipe(function(now)
{var y=now*this.height;this.current.setClipPx(0,this.width,this.height-y,0);this.current.setTopPx(y);});},slideOffUp:function()
{this.doWipe(function(now)
{var y=now*this.width;this.current.setClipPx(y,this.width,this.height,0);this.current.setTopPx(-y);});},slideOnRight:function()
{this.doWipe(function(now)
{var x=(1-now)*this.width;this.next.setClipPx(0,this.width,this.height,x);this.next.setLeftPx(-x);},true);},slideOnLeft:function()
{this.doWipe(function(now)
{var x=now*this.width;this.next.setClipPx(0,x,this.height,0);this.next.setLeftPx(this.width-x);},true);},slideOnDown:function()
{this.doWipe(function(now)
{var y=(1-now)*this.height;this.next.setClipPx(y,this.width,this.height,0);this.next.setTopPx(-y);},true);},slideOnUp:function()
{this.doWipe(function(now)
{var y=now*this.height;this.next.setClipPx(0,this.width,y,0);this.next.setTopPx(this.height-y);},true);},pushRight:function()
{this.doWipe(function(now)
{var x=now*this.width;this.current.setLeftPx(x+(this.width-parseInt(this.current.div.style.width))/2);this.next.setLeftPx(x-this.width+(this.width-parseInt(this.current.div.style.width))/2);},false,true,true);},pushLeft:function()
{this.doWipe(function(now)
{var x=now*this.width;this.current.setClipPx(0,this.width,this.height,x);this.current.setLeftPx(-x);this.next.setClipPx(0,x,this.height,0);this.next.setLeftPx(this.width-x);});},pushDown:function()
{this.doWipe(function(now)
{var y=now*this.height;this.current.setClipPx(0,this.width,this.height-y,0);this.current.setTopPx(y);this.next.setClipPx(this.height-y,this.width,this.height,0);this.next.setTopPx(y-this.height);});},pushUp:function()
{this.doWipe(function(now)
{var y=now*this.height;this.current.setClipPx(y,this.width,this.height,0);this.current.setTopPx(-y);this.next.setClipPx(0,this.width,y,0);this.next.setTopPx(this.height-y);});},stop:function()
{if(this.animation!=null){this.animation.stop();delete this.animation;}}});var Slideshow=Class.create({initialize:function(container,photos,onchange,options)
{this.reflectionHeight=0;this.reflectionOffset=0;this.backgroundColor='black';this.scaleMode="fit";this.movieMode=kShowMovie;this.advanceAnchor=null;this.captionHeight=0;this.shouldTighten=true;if(options)
{if(options.reflectionHeight)
{this.reflectionHeight=parseFloat(options.reflectionHeight);}
if(options.reflectionOffset)
{this.reflectionOffset=parseFloat(options.reflectionOffset);}
if(options.backgroundColor)
{this.backgroundColor=options.backgroundColor;}
if(options.scaleMode)
{this.scaleMode=options.scaleMode;}
if(options.movieMode!==undefined)
{this.movieMode=options.movieMode;}
if(options.advanceAnchor!==undefined)
{this.advanceAnchor=options.advanceAnchor;}
if(options.captionHeight!==undefined)
{this.captionHeight=options.captionHeight;}
if(options.shouldTighten!==undefined)
{this.shouldTighten=options.shouldTighten;}}
this.background=new PhotoView(container,this.scaleMode,0,0,this.backgroundColor,false,false,0);this.current={view:new PhotoView(container,this.scaleMode,this.reflectionHeight,this.reflectionOffset,this.backgroundColor,this.movieMode,this.captionHeight)};this.prev={view:new PhotoView(container,this.scaleMode,this.reflectionHeight,this.reflectionOffset,this.backgroundColor,this.movieMode,this.captionHeight)};this.next={view:new PhotoView(container,this.scaleMode,this.reflectionHeight,this.reflectionOffset,this.backgroundColor,this.movieMode,this.captionHeight)};this.current.view.upperShown();this.prev.view.lowerHidden();this.next.view.lowerHidden();this.photos=photos;this.onchange=onchange;this.paused=true;this.photoDuration=5000;this.currentPhotoNumber=0;this.selectedTransition="random";this.lastPhotoChange=new Date();},updateSize:function()
{this.background.updateSize();this.current.view.updateSize();this.prev.view.updateSize();this.next.view.updateSize();this.p_updateAnchorSize();},transitionComplete:function(number)
{this.transition.current.didAnimate();this.transition.next.didAnimate();this.transition.next.transitionComplete();delete this.transition;if(this.onchange!=null){this.onchange(number);}},showPhotoNumber:function(number,skipTransition)
{this.p_showPhotoNumber(number,skipTransition,true);},p_updateAnchorSize:function()
{if(this.advanceAnchor)
{var box_size=this.current.view.boxSize();$(this.advanceAnchor).setStyle({position:"absolute",width:px(box_size.width),height:px(box_size.height)});if(windowsInternetExplorer)
{var img=this.advanceAnchor.firstChild;if(!img)
{img=document.createElement('img');this.advanceAnchor.appendChild(img);}
img.src=transparentGifURL();img.style.width=this.advanceAnchor.style.width;img.style.height=this.advanceAnchor.style.height;}}},p_setAdvanceAnchorHandler:function()
{if(this.advanceAnchor)
{if(this.current.photo&&this.current.photo.movieURL)
{this.advanceAnchor.style.display='none';this.advanceAnchor.href='';this.advanceAnchor.onclick=function(){return false;};}
else
{this.advanceAnchor.style.display='';this.advanceAnchor.href='#'+this.nextPhotoNumber();this.advanceAnchor.onclick=function(i){setTimeout(this.showPhotoNumber.bind(this,i,true),0);}.bind(this,this.nextPhotoNumber());}}},p_showPhotoNumber:function(number,skipTransition,override)
{this.cancelNextPhotoTimer();if(this.transition!=null)
{this.transition.stop();delete this.transition;}
var transitionTime=500;var current=this.current;var prev=this.prev;var next=this.next;if(next.photo==undefined||next.photo!==this.photos[number])
{if(prev.photo!=undefined&&prev.photo===this.photos[number])
{next=prev;}
else if(override)
{next.photo=this.photos[number];}
else
{return;}}
if(next.photo.image.loaded()==false)
{next.photo.image.load(arguments.callee.bind(this,number,skipTransition,false));return;}
if(next.view.image==undefined||next.view.image!==next.photo.image)
{next.view.setImage(next.photo);}
var self=this;current.view.willAnimate();next.view.willAnimate();this.transition=new TransitionEffect(current.view,next.view,function(){self.transitionComplete(number);},this.shouldTighten);if(skipTransition||(new Date()).getTime()-this.lastPhotoChange.getTime()<transitionTime)
{this.transition.jump();}
else
{this.transition.doEffect(this.selectedTransition);}
this.currentPhotoNumber=number;this.lastPhotoChange=new Date();this.current=next;this.p_setAdvanceAnchorHandler();if(next===prev)
{this.prev=this.next;this.next=current;this.prev.photo=this.photos[this.prevPhotoNumber()];this.prev.photo.image.load(this.prev.view.setImage.bind(this.prev.view,this.prev.photo));}
else
{this.prev=current;this.next=prev;this.next.photo=this.photos[this.nextPhotoNumber()];this.next.photo.image.load(this.next.view.setImage.bind(this.next.view,this.next.photo));}
this.startNextPhotoTimer();},start:function()
{this.paused=false;this.showPhotoNumber(0);},pause:function()
{if(!this.paused){this.paused=true;this.cancelNextPhotoTimer();}},resume:function()
{if(this.paused){this.paused=false;this.startNextPhotoTimer();}},inactivate:function()
{this.pause();this.current.view.p_stopMovie();},startNextPhotoTimer:function(time)
{if(this.paused){return;}
if(this.nextPhotoTimer!=null){(function(){return false}).assert("trying to set overlapping timer");return;}
var self=this;var timedAdvance=function()
{delete self.nextPhotoTimer;var canAdvance=true;if(this.current.view.movieURL!=null)
{var movie=document[this.current.view.movieID];var status=null;try
{status=movie.GetPluginStatus();}
catch(e)
{status=null;}
if(status==null||status.startsWith("Error:"))
{}
else
{var time=movie.GetTime();var duration=movie.GetDuration();var timeScale=movie.GetTimeScale();var timeRemaining=duration-time;var timeRemainingInMS=timeRemaining/timeScale*1000;if(status=="Waiting"||status=="Loading")
{canAdvance=false;this.startNextPhotoTimer(timeRemainingInMS);}
else if(status=="Playable"||status=="Complete")
{if(timeRemainingInMS>0)
{canAdvance=false;this.startNextPhotoTimer(timeRemainingInMS);}}}}
if(canAdvance)
{self.advance();}}.bind(this)
this.nextPhotoTimer=setTimeout(timedAdvance,time||this.photoDuration);},cancelNextPhotoTimer:function()
{if(this.nextPhotoTimer!=null){clearTimeout(this.nextPhotoTimer);delete this.nextPhotoTimer;}},halt:function()
{this.cancelNextPhotoTimer();},unhalt:function()
{this.startNextPhotoTimer();},nextPhotoNumber:function()
{var number=this.currentPhotoNumber+1;if(number>=this.photos.length){number=0;}
return number;},prevPhotoNumber:function()
{var number=this.currentPhotoNumber-1;if(number<0){number=this.photos.length-1;}
return number;},advance:function()
{this.showPhotoNumber(this.nextPhotoNumber());},goBack:function()
{this.showPhotoNumber(this.prevPhotoNumber());},setMovieTime:function(time)
{this.current.view.setMovieTime(time);},setMovieParams:function(params)
{this.current.view.setMovieParams(params);},setImage:function(image)
{var current=this.current;current.photo.image=image;current.photo.image.load(current.view.setImage.bind(current.view,current.photo));},getAvailableTransitions:function()
{var te=new TransitionEffect;return te.effects;},setTransitionIndex:function(effectId,directionId)
{var effects=this.getAvailableTransitions();var effect=effects[effectId];if(effect!=null){if(effect.directions==null){if(effect.method!=null){this.selectedTransition=effect.method;}}
else{var dir=effect.directions[directionId];if(dir!=null&&dir.method!=null){this.selectedTransition=dir.method;}}}}});var IWHorizontalAlignment={kImageAlignLeft:0,kImageAlignCenter:1,kImageAlignRight:2}
var IWVerticalAlignment={kImageAlignTop:0,kImageAlignMiddle:1,kImageAlignBottom:2}
var IWPhotoGridLayoutConstants={kBorderThickness:6.0,vTextOffsetFromImage:5.0,vTextOffsetFromBottom:10.0,vTopSpacing:5.0,hMinSpacing:15.0}
var latestImageStream=null;var latestIndex=null;function IWStartSlideshow(url,imageStream,index,fullScreen)
{var windowWidth=800;var windowHeight=800;if(fullScreen)
{windowWidth=screen.availWidth;windowHeight=screen.availHeight;}
else
{if(screen.availHeight>975)
{windowWidth=1000;windowHeight=950;}
else if(screen.availHeight>775)
{windowWidth=800;windowHeight=750;}
else
{windowWidth=711;windowHeight=533;}}
windowWidth=Math.min(screen.availWidth,windowWidth);windowHeight=Math.min(screen.availHeight,windowHeight);var windowLeft=Math.round((screen.availWidth-windowWidth)/2);var windowTop=Math.round((screen.availHeight-windowHeight)/2)-25;windowTop=Math.max(windowTop,0);var slideWindow=window.open(url,'slideshow','scrollbars=no,titlebar=no,location=no,status=no,toolbar=no,resizable=no,width='+windowWidth+',height='+windowHeight+',top='+windowTop+',left='+windowLeft);if(slideWindow.screenY&&slideWindow.screenY>windowTop)
{slideWindow.screenY=windowTop;}
latestImageStream=imageStream;latestIndex=index;slideWindow.focus();return false;}
function IWUpdateVerticalAlignment(element)
{element=$(element);function setVerticalAlignmentAndClearClass(element,valign)
{var table=$(document.createElement("table"));table.setStyle({width:"100%",height:"100%",borderSpacing:0});var tr=document.createElement("tr");table.appendChild(tr);var td=document.createElement("td");td.setAttribute("valign",valign);tr.appendChild(td);element.className=element.className.replace(new RegExp('\\bvalign-'+valign+'\\b'),"");element.parentNode.replaceChild(table,element);td.appendChild(element);if(windowsInternetExplorer)
{var html=table.parentElement.innerHTML;table.parentElement.innerHTML=html;}}
var middleAligns=element.select('.valign-middle');for(var i=0;i<middleAligns.length;++i)
{setVerticalAlignmentAndClearClass(middleAligns[i],"middle");}
var bottomAligns=element.select('.valign-bottom');for(var i=0;i<bottomAligns.length;++i)
{setVerticalAlignmentAndClearClass(bottomAligns[i],"bottom");}}
function IWShowDiv(div,show)
{div.style.display=show?"inline":"none";}
function IWToggleDetailView(showDetail,index,divID,headerViewID,footerViewID,detailViewID,shadow)
{var grid=$(divID);var header=$(headerViewID);var footer=$(footerViewID);var detail=$(detailViewID);var showGrid=!showDetail;function showHide()
{IWShowDiv(grid,showGrid);IWShowDiv(header,showGrid);IWShowDiv(footer,showGrid);IWShowDiv(detail,showDetail);}
if(showDetail)
{var detailWidget=widgets[detailViewID];function showDetailView()
{showHide();detailWidget.willShow(index);IWSetSpacerHeight(grid,detailWidget.height());window.scrollTo(0,0);}
if(index!==undefined)
{detailWidget.showPhotoNumber(index,showDetailView);}
else
{showDetailView();}}
else
{showHide();if(isSafari&&!isEarlyWebKitVersion&&shadow)
{$(divID).select('.framedImage').each(function(framed)
{var renderShadowJob=shadow.applyToElement.bind(shadow,framed);IWJobQueue.sharedJobQueue.addJob(renderShadowJob);});}
if(grid.style.height)
{IWSetSpacerHeight(grid,parseFloat(grid.style.height));}}}
function IWSetSpacerHeight(photogrid,height)
{var parent=$(photogrid.parentNode);var spacers=parent.select('.spacer');var spacer=spacers[spacers.length-1];if(initialSpacerHeight==0)
{initialSpacerHeight=parseInt(spacer.style.height);}
var spacerHeight=Math.max(parseInt(photogrid.style.top)+height-spacer.offsetTop,initialSpacerHeight);spacer.style.height=spacer.style.lineHeight=px(spacerHeight);}
function IWLayoutPhotoGrid(divID,layout,stroke,imageStream,range,shadow,valignClass,opacity,slideshowParameters,slideshowURL,headerViewID,detailViewID,footerViewID,layoutOptions)
{if(range.length()==0)
{return;}
IWJobQueue.sharedJobQueue.clearJobs();function toggleDetailViewNotification(notification)
{var userInfo=notification.userInfo();IWToggleDetailView(userInfo.showDetailView,userInfo.index,divID,headerViewID,footerViewID,detailViewID,shadow);}
var showPhotoIndex=undefined;var hash=location.hash;if(hash.length>1)
{if(hash.match(/^\#(\d+)$/))
{var idx=RegExp.$1;if(idx<imageStream.length)
{showPhotoIndex=parseInt(idx);}}}
if(isiPhone)
{slideshowURL=slideshowURL.stringByDeletingLastPathComponent().stringByAppendingPathComponent("phoneshow.html");}
slideshowURL=slideshowURL.stringByAppendingAsQueryString(slideshowParameters);if(detailViewID!=null)
{var detailView=widgets[detailViewID];if(!detailView.preferenceForKey("mediaStreamObject"))
{if(showPhotoIndex!==undefined)
{detailView.setPreferenceForKey(showPhotoIndex,"startIndex");}
var mediaStreamObject={load:function(baseURL,callback){callback(imageStream);}};detailView.setPreferenceForKey(mediaStreamObject,"mediaStreamObject");NotificationCenter.addObserver(null,toggleDetailViewNotification,DetailViewToggleNotification,divID);if(slideshowParameters)
{detailView.setPlaySlideshowFunction(IWStartSlideshow.bind(null,slideshowURL,imageStream,0,slideshowParameters["fullScreen"]));}}}
var photogrid=$(divID);photogrid.innerHTML="";for(var i=0;i<range.length();++i)
{var frame=$(document.createElement('div'));var translation=layout.translationForTileAtIndex(i);var size=layout.tileSize();frame.style.cssText=iWPosition(true,translation.x,translation.y,size.width,size.height);frame.hide();photogrid.appendChild(frame);}
var textBoxSize=layout.mTextBoxSize;var renderThumb=function(i,streamIndex)
{var imageStreamEntry=imageStream[streamIndex];var wrapper=photogrid.childNodes[i];var textPos=layout.translationForTextAtIndexWithOffset(i,null);var textMarkup="";if(textBoxSize.height>0)
{var richTitle=imageStreamEntry.richTitle();if(richTitle==null)
{richTitle=imageStreamEntry.title();}
var valignClassName='';if(valignClass)
{valignClassName=' '+valignClass;}
var metric=imageStreamEntry.metric();if(metric!=null&&metric.length>0)
{metric='<span class="metric">'+metric+'</span>';}
else
{metric="";}
var showTitle=layoutOptions?layoutOptions.showTitle:true;var showMetric=layoutOptions?layoutOptions.showMetric:true;var richCaption='<div class="caption'+valignClassName+'">'+
(showTitle?('<span class="title">'+richTitle+'</span>'):'')+
((showTitle&&showMetric)?'<br />':'')+
(showMetric?metric:'')+'</div>';var opacityMarkup='';if(opacity<0.999)
{opacityMarkup=windowsInternetExplorer?" filter: progid:DXImageTransform.Microsoft.Alpha(opacity="+opacity*100+"); ":" opacity: "+opacity+"; ";}
var overflowMarkup="overflow: hidden; ";textMarkup='<div style="'+iWPosition(true,textPos.x,textPos.y,textBoxSize.width,textBoxSize.height)+opacityMarkup+overflowMarkup+'">'+
richCaption+'</div>';}
var thumbnailSize=imageStreamEntry.thumbnailNaturalSize();var scale=layout.p_scaleForImageOfSize(thumbnailSize);var scaledImageSize=thumbnailSize.scale(scale,scale,true);if(Math.abs(scaledImageSize.width-thumbnailSize.width)<=2&&Math.abs(scaledImageSize.height-thumbnailSize.height)<=2)
{scaledImageSize=thumbnailSize;}
var frameMarkup=stroke.markupForImageStreamEntry(imageStreamEntry,scaledImageSize);wrapper.insert(frameMarkup);wrapper.insert(textMarkup);if(textMarkup.length>0)
{var textWrapper=wrapper.lastChild;textWrapper.style.zIndex=1;}
IWUpdateVerticalAlignment(wrapper);var framed=$(wrapper).selectFirst('.framedImage');var framePos=layout.translationForImageOfSizeAtIndexWithOffset(new IWSize(parseFloat(framed.style.width||0),parseFloat(framed.style.height||0)),i,null);framed.setStyle({left:px(framePos.x),top:px(framePos.y),zIndex:1});if(detailViewID)
{var anchor=$(document.createElement("a"));anchor.setStyle({position:"absolute",left:framed.style.left,top:framed.style.top,width:framed.style.width,height:framed.style.height,zIndex:1});anchor.href='#'+streamIndex;anchor.onclick=IWToggleDetailView.bind(null,true,streamIndex,divID,headerViewID,footerViewID,detailViewID,shadow);if(windowsInternetExplorer&&(effectiveBrowserVersion>=7))
{var img=document.createElement('img');img.src=transparentGifURL();img.style.width=framed.style.width;img.style.height=framed.style.height;anchor.appendChild(img);}
framed.parentNode.insertBefore(anchor,framed.nextSibling);}
IWSetDivOpacity(framed,opacity);wrapper.show();if(shadow)
{if(windowsInternetExplorer)
{var imgs=framed.select('img');var left=0,top=0;var right=parseFloat(framed.style.width||0);var bottom=parseFloat(framed.style.height||0);for(var e=0;e<imgs.length;++e)
{var style=imgs[e].style;var l=parseFloat(style.left||0);var t=parseFloat(style.top||0);left=Math.min(l,left);top=Math.min(t,top);right=Math.max(l+parseFloat(style.width||0),right);bottom=Math.max(t+parseFloat(style.height||0),bottom);}
framed.setStyle({left:px(parseFloat(framed.style.left||0)+left),top:px(parseFloat(framed.style.top||0)+top),width:px(right-left),height:px(bottom-top)});var framedChildren=framed.childNodes;for(var c=0;c<framedChildren.length;++c)
{var child=framedChildren[c];if(child.nodeType==Node.ELEMENT_NODE)
{child.style.left=px(parseFloat(child.style.left||0)-left);child.style.top=px(parseFloat(child.style.top||0)-top);}}
var blurRadius=shadow.mBlurRadius*.75;var xOffset=shadow.mOffset.x-blurRadius;var yOffset=shadow.mOffset.y-blurRadius;var shadowDiv=framed.cloneNodeExcludingIDs(true);shadowDiv.style.left=px(framePos.x+xOffset);shadowDiv.style.top=px(framePos.y+yOffset);shadowDiv.style.filter="progid:DXImageTransform.Microsoft.MaskFilter()"+" progid:DXImageTransform.Microsoft.MaskFilter(color="+shadow.mColor+")"+" progid:DXImageTransform.Microsoft.Blur(pixelradius="+blurRadius+")"+" progid:DXImageTransform.Microsoft.Alpha(opacity="+shadow.mOpacity*opacity*100+")";framed.parentNode.insertBefore(shadowDiv,framed);}
else
{if(!isEarlyWebKitVersion)
{shadow.applyToElement(framed);}}}
imageStreamEntry.didInsertThumbnailMarkupIntoDocument();imageStreamEntry.unloadThumbnail();};for(var i=0;i<range.length();++i)
{var streamIndex=range.location()+i;var renderThumbJob=renderThumb.bind(null,i,streamIndex);imageStream[streamIndex].loadThumbnail(IWJobQueue.prototype.addJob.bind(IWJobQueue.sharedJobQueue,renderThumbJob));}
var headerView=widgets[headerViewID];if(headerView)
{if(slideshowParameters)
{headerView.setPlaySlideshowFunction(IWStartSlideshow.bind(null,slideshowURL,imageStream,0,slideshowParameters["fullScreen"]));}
headerView.setPreferenceForKey(imageStream.length,"entryCount");}
function setFooterOffset(height)
{var footer=$(footerViewID);var footerOffsetTop=photogrid.offsetTop+height-layout.mBottomPadding;footer.style.top=px(footerOffsetTop);}
var gridHeight=layout.totalHeightForCount(range.length());setFooterOffset(gridHeight);IWSetSpacerHeight(photogrid,gridHeight);photogrid.style.height=px(gridHeight);if(showPhotoIndex!==undefined)
{IWToggleDetailView(true,showPhotoIndex,divID,headerViewID,footerViewID,detailViewID,shadow);}}
var initialSpacerHeight=0;var IWPhotoGridLayout=Class.create({initialize:function(columnCount,maxImageSize,textBoxSize,tileSize,topPadding,bottomPadding,spacing,framePadding)
{this.mColumnCount=columnCount;this.mMaxImageSize=maxImageSize;this.mTextBoxSize=textBoxSize;this.mTileSize=tileSize;this.mTopPadding=topPadding;this.mBottomPadding=bottomPadding;this.mSpacing=spacing;this.mFramePadding=framePadding;this.mCachedDataValid=true;},tileSize:function()
{return this.mTileSize;},translationForTileAtIndex:function(index)
{var tileSize=this.mTileSize;var columnCount=this.mColumnCount;var translation=new IWPoint(tileSize.width*(index%columnCount)+IWPhotoGridLayoutConstants.kBorderThickness,tileSize.height*Math.floor(index/columnCount)+IWPhotoGridLayoutConstants.kBorderThickness+this.mTopPadding+IWPhotoGridLayoutConstants.vTopSpacing);return translation;},translationForImageOfSizeAtIndexWithOffset:function(imageSize,index,offset)
{var tileSize=this.mTileSize;var translation=new IWPoint(0,0);var imageAreaSize=new IWSize(tileSize.width,tileSize.height-(IWPhotoGridLayoutConstants.vTextOffsetFromImage+this.mTextBoxSize.height+IWPhotoGridLayoutConstants.vTextOffsetFromBottom));translation.x+=(imageAreaSize.width-imageSize.width)/2;translation.y+=(imageAreaSize.height-imageSize.height);if(offset!=null)
{translation.x+=offset.translation.width;translation.y+=offset.translation.height;}
return translation;},translationForTextAtIndexWithOffset:function(index,offset)
{var tileSize=this.mTileSize;var textBoxSize=this.mTextBoxSize;var translation=new IWPoint((tileSize.width-textBoxSize.width)/2.0,(tileSize.height-textBoxSize.height)-IWPhotoGridLayoutConstants.vTextOffsetFromBottom);if(offset!=null)
{translation.x+=offset.translation.width;translation.y+=offset.translation.height;}
return translation;},totalHeightForCount:function(count)
{if(count==0)
count=1;var columnCount=this.mColumnCount;var lastRow=Math.floor((count+columnCount-1)/columnCount);var tileSize=this.mTileSize;return tileSize.height*lastRow+IWPhotoGridLayoutConstants.kBorderThickness*2+this.mTopPadding+this.mBottomPadding;},p_scaleForImageOfSize:function(imageSize)
{var maxImageSize=this.mMaxImageSize;return Math.min((maxImageSize.width-this.mFramePadding.width)/imageSize.width,(maxImageSize.height-this.mFramePadding.height)/imageSize.height);}});var IWJobQueue=Class.create({initialize:function()
{this.mJobQueue=[];this.mTimeout=null;},addJob:function(job)
{this.mJobQueue.push(job);this.p_setTimeout();},clearJobs:function(job)
{this.p_cancelTimeout();this.mJobQueue=[];},p_runQueuedJobs:function()
{this.p_cancelTimeout();var startTime=new Date().getTime();var duration=0;while(this.mJobQueue.length>0&&duration<100)
{var job=this.mJobQueue.shift();if(job)
{job();}
duration=(new Date().getTime())-startTime;}
if(this.mJobQueue.length>0)
{this.p_setTimeout();}},p_cancelTimeout:function()
{if(this.mTimeout!=null)
{clearTimeout(this.mTimeout);this.mTimeout=null;}},p_setTimeout:function()
{if(this.mTimeout==null)
{this.mTimeout=setTimeout(this.p_runQueuedJobs.bind(this),0);}}});IWJobQueue.sharedJobQueue=new IWJobQueue();var AppleAnimator=Class.create({initialize:function(duration,interval,optionalFrom,optionalTo,optionalCallback)
{this.startTime=0;this.duration=duration;this.interval=interval;this.animations=new Array;this.timer=null;this.oncomplete=null;this._firstTime=true;var self=this;this.animate=function(self){function limit_3(a,b,c){return a<b?b:(a>c?c:a);}
var T,time;var ease;var time=(new Date).getTime();var dur=self.duration;var done;T=limit_3(time-self.startTime,0,dur);time=T/dur;ease=0.5-(0.5*Math.cos(Math.PI*time));done=T>=dur;var array=self.animations;var c=array.length;var first=self._firstTime;for(var i=0;i<c;++i)
{array[i].doFrame(self,ease,first,done,time);}
if(done)
{self.stop();if(self.oncomplete!=null)
{self.oncomplete();}}
self._firstTime=false;}
if(optionalFrom!==undefined&&optionalTo!==undefined&&optionalCallback!==undefined)
{this.addAnimation(new AppleAnimation(optionalFrom,optionalTo,optionalCallback));}},start:function(){if(this.timer==null)
{var timeNow=(new Date).getTime();var interval=this.interval;this.startTime=timeNow-interval;this.timer=setInterval(this.animate.bind(null,this),interval);}},stop:function(){if(this.timer!=null)
{clearInterval(this.timer);this.timer=null;}},addAnimation:function(animation){this.animations[this.animations.length]=animation;}});var AppleAnimation=Class.create({initialize:function(from,to,callback)
{this.from=from;this.to=to;this.callback=callback;this.now=from;this.ease=0;this.time=0;},doFrame:function(animation,ease,first,done,time){var now;if(done)
now=this.to;else
now=this.from+(this.to-this.from)*ease;this.now=now;this.ease=ease;this.time=time;this.callback(animation,now,first,done);}});function IWCommentSummaryInfoForURL(resourceURL,callback)
{function handleSummaryData(request)
{var result={};if(request.responseText)
{var r=request.responseText.match(/.*= ((true)|(false));.*\n.*= (\d+)/);if(r)
{result.enabled=(r[1]=="true");result.count=Number(r[4]);}}
callback(result);}
var summaryURL=resourceURL+"?wsc=summary.js&ts="+(new Date().getTime());new Ajax.Request(summaryURL,{method:'get',onSuccess:handleSummaryData,onFailure:callback.bind(null,{})});}
function IWCommentCountForURL(resourceURL,callback)
{function myCallback(info)
{if(info.count===undefined)
info.count=0;callback(info.count);}
IWCommentSummaryInfoForURL(resourceURL,myCallback);}
