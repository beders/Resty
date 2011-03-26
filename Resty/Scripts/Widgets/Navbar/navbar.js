//
//  iWeb - navbar.js
//  Copyright (c) 2007-2008 Apple Inc. All rights reserved.
//

var NavBar=Class.create(Widget,{widgetIdentifier:"com-apple-iweb-widget-NavBar",initialize:function($super,instanceID,widgetPath,sharedPath,sitePath,preferences,runningInApp)
{if(instanceID)
{$super(instanceID,widgetPath,sharedPath,sitePath,preferences,runningInApp);if(!this.preferenceForKey("useStaticFeed")&&this.preferenceForKey("dotMacAccount"))
{var depthPrefix=this.preferenceForKey("path-to-root");if(!depthPrefix||depthPrefix=="")
depthPrefix="./";this.xml_feed=depthPrefix+"?webdav-method=truthget&depth=infinity&ns=iweb&filterby=in-navbar";}
else
{this.xml_feed="feed.xml";if(this.sitePath)
{this.xml_feed=this.sitePath+"/"+this.xml_feed;}}
this.changedPreferenceForKey("navbar-css");this.regenerate();}},regenerate:function()
{new Ajax.Request(this.xml_feed,{method:'get',onSuccess:this.populateNavItems.bind(this)});return true;},getStyleElement:function(key)
{if(!this.styleElement)
{var head=document.getElementsByTagName("head")[0];if(head)
{var newElement=document.createElement("style");newElement.type="text/css";head.appendChild(newElement);this.styleElement=newElement;}}
return this.styleElement;},substWidgetPath:function(text)
{var result=text.replace(/\$WIDGET_PATH/gm,this.widgetPath);return result;},addCSSSelectorPrefix:function(text)
{var prefix="div#"+this.instanceID+" ";text=text.replace(/\/\*[^*]*\*+([^/][^*]*\*+)*\//gm,"");text=text.replace(/(^\s*|\}\s*)([^{]+)({[^}]*})/gm,function(match,beforeSelectorList,selectorList,propertyList){var result=beforeSelectorList;var selectors=selectorList.split(",");for(var i=0;i<selectors.length;i++){result+=prefix+selectors[i];if(i+1<selectors.length)result+=",";}
result+=propertyList;return result;});return text;},changedPreferenceForKey:function(key)
{if(key=="navbar-css")
{var text=this.preferenceForKey(key);if(!text)
{text="";}
text=this.substWidgetPath(text);text=this.addCSSSelectorPrefix(text);var styleElement=this.getStyleElement();if(styleElement)
{if(!windowsInternetExplorer)
{var node=document.createTextNode(text);if(node)
{while(styleElement.hasChildNodes())
{styleElement.removeChild(styleElement.firstChild);}
styleElement.appendChild(node);}}
else
{styleElement.styleSheet.cssText=text;}}}},populateNavItems:function(req)
{var items;var feedRoot=ajaxGetDocumentElement(req);if(feedRoot){var parsedFeed=this.getAtomFeedItems(feedRoot);var items=parsedFeed.resultArray;var currentPageGUID=null;var isCollectionPage="NO";var curPagePat=null;if(this.runningInApp)
curPagePat=/\.#current#.$/;else
{currentPageGUID=this.preferenceForKey("current-page-GUID");isCollectionPage=this.preferenceForKey("isCollectionPage");}
var navDiv=this.div("navbar-list");var navBgDiv=navDiv.parentNode;$(navBgDiv).ensureHasLayoutForIE();while(navDiv.firstChild){navDiv.removeChild(navDiv.firstChild);}
var depthPrefix=this.preferenceForKey("path-to-root");if(!depthPrefix||depthPrefix=="")
depthPrefix="./";for(var x=0;x<items.length;x++){var navItem=document.createElement("li");var anchor=document.createElement("a");var title=items[x].title;var pageGUID=items[x].GUID;title=title.replace(/ /g,"\u00a0")+" ";var url=items[x].url;if(!this.runningInApp&&!url.match(/^http:/i))
url=depthPrefix+url;var inAppCurPage=this.runningInApp&&curPagePat.exec(unescape(new String(url)));if(inAppCurPage)
{url=url.replace(curPagePat,"");}
if(pageGUID==currentPageGUID||inAppCurPage){navItem.className='current-page';if(!this.runningInApp&&isCollectionPage!="YES"){url="";}}
else
navItem.className='noncurrent-page';anchor.setAttribute("href",url);anchor.appendChild(document.createTextNode(title));navItem.appendChild(anchor);navDiv.appendChild(navItem);}
if(this.preferences&&this.preferences.postNotification){this.preferences.postNotification("BLWidgetIsSafeToDrawNotification",1);}}},getAtomFeedItems:function(feedNode)
{var results=new Array;var pageOrder=new Array;if(feedNode)
{var generator="";var generatorElt=getFirstElementByTagName(feedNode,"generator");if(generatorElt&&generatorElt.firstChild){generator=allData(generatorElt);}
var pageGUIDs,pageGUIDsElt;for(var entryElt=feedNode.firstChild;entryElt;entryElt=entryElt.nextSibling){var isInNavbarElt=null;if(!pageGUIDs&&(pageGUIDsElt=findChild(entryElt,"site-navbar","urn:iweb:"))){pageGUIDs=allData(pageGUIDsElt).split(",");for(var x=0;x<pageGUIDs.length;x++){var pageGUID=pageGUIDs[x];pageOrder[""+pageGUID]=x;}}
if(entryElt.nodeName=="entry"&&(isInNavbarElt=findChild(entryElt,"in-navbar","urn:iweb:"))){if(!isInNavbarElt)
continue;var pageGUID="";if(isInNavbarElt.firstChild){pageGUID=""+allData(isInNavbarElt);}else{iWLog("no navBarElt child");}
if(pageGUID=="navbar-sort")
continue;var title="";var titleElt=findChild(entryElt,"title","urn:iweb:");if(!titleElt){iWLog("No iWeb title");titleElt=findChild(entryElt,"title");}
if(titleElt&&titleElt.firstChild){title=allData(titleElt);}
var linkElt=getFirstElementByTagName(entryElt,'link');url=linkElt.getAttribute("href");if(!url&&linkElement.firstChild){url=allData(linkElement);}
results[results.length]={title:title,url:url,GUID:pageGUID};}}}
if(pageGUIDs){results=$(results).reject(function(result){return(pageOrder[result.GUID]===undefined);});results.sort(function(lhs,rhs){return pageOrder[lhs.GUID]-pageOrder[rhs.GUID];});}
return{resultArray:results};},onload:function()
{},onunload:function()
{}});function findChild(element,nodeName,namespace)
{var child;for(child=element.firstChild;child;child=child.nextSibling){if(child.localName==nodeName||child.baseName==nodeName){if(!namespace){return child;}
var childNameSpace=child.namespaceURI;if(childNameSpace==namespace){return child;}}}
return null;}
function getFirstElementByTagName(node,tag_name){var elements=node.getElementsByTagName(tag_name);if(elements.length){return elements[0];}
else{return findChild(node,tag_name);}}
function allData(node)
{node=node.firstChild;var data=node.data;while((node=node.nextSibling)){data+=node.data;}
return data;}
