//
//  iWeb - Paste.js
//  Copyright (c) 2007-2008 Apple Inc. All rights reserved.
//

var Paste=Class.create(PrefMarkupWidget,{widgetIdentifier:"com-apple-iweb-widget-HTMLRegion",initialize:function($super,instanceID,widgetPath,sharedPath,sitePath,preferences,runningInApp)
{if(instanceID)
{$super(instanceID,widgetPath,sharedPath,sitePath,preferences,runningInApp);}
if(runningInApp)
{window.onresize=this.resize.bind(this);}
var parentDiv=this.div('htmlRegion');this.m_views={};this.m_views["html-snippet"]=new HTMLRegionSnippetView(this,parentDiv);this.m_views["default-image-status"]=new HTMLRegionDefaultImageStatus(this,parentDiv);var iframe_src=eval(instanceID+'_htmlMarkupURL');this.m_iframe='<iframe id="'+instanceID+'-frame" '+'src="'+iframe_src+'" '+'frameborder="0" style="width: 100%; height: 100%;" '+'scrolling="no" marginheight="0" marginwidth="0" allowTransparency="true"></frame>';this.updateFromPreferences();},updateFromPreferences:function()
{if(this.preferenceForKey('emptyLook')===true)
{this.showView("default-image-status");}
else
{this.showView("html-snippet");}},changedPreferenceForKey:function(key)
{if(key=="emptyLook")
{if(this.preferenceForKey(key)===false)
{if(this.m_currentView==this.m_views["html-snippet"])
{this.m_views["html-snippet"].render();}
this.showView("html-snippet");this.preferences.postNotification("BLWidgetShouldStartAutoSizingNotification",1);}
else
{this.showView("default-image-status");}}},resize:function()
{$H(this.m_views).each(function(pair){pair.value.resize();});}});var HTMLRegionSnippetView=Class.create(View,{m_divId:"html-snippet",m_divClass:"HTMLRegionSnippetView",render:function()
{this.ensureDiv().update(this.m_widget.m_iframe);if(this.m_widget.runningInApp)
{this.m_widget.preferences.postNotification("BLWidgetIsSafeToDrawNotification",0);}}});var HTMLRegionDefaultImageStatus=Class.create(StatusView,{m_divId:"default-image-status",m_divClass:"HTMLRegionStatusView",badgeImage:"HTMLRegionWorldMap.png",badgeImageWidth:198,badgeImageHeight:94});