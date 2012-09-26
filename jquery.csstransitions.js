/*!
JQUERY PLUGIN CSS-TRANSITIONS
Copyright (c) 2012 Felipe Hefler

Licensed under the MIT license.
http://github.com/hefler/jquery-css-transitions/blob/master/LICENSE

GitHub
https://github.com/hefler/jquery-css-transitions
*/
(function($)
{
	/**
	Extends jQuery $.browser
	**/
	var bodyStyle = document.getElementsByTagName('body')[0].style;
	var hasCSSTransitions = (bodyStyle.transition !== undefined) || (bodyStyle.webkitTransition !== undefined) || (bodyStyle.MozTransition !== undefined) || (bodyStyle.msTransition !== undefined) || (bodyStyle.OTransition !== undefined);
	
	var defineVendorPrefix = function()
	{
		var pfx = '';
		if ($.browser.webkit) {
			pfx = "webkit";
		} else if ($.browser.msie) {
			pfx = "ms";
		} else if ($.browser.mozilla) {
			pfx = "moz";
		} else if ($.browser.opera) {
			pfx = "o";
		}
		return pfx;
	};
	
	var hasAnimationFrame = (window.requestAnimationFrame !== undefined) || (window.webkitRequestAnimationFrame !== undefined) || (window.mozRequestAnimationFrame !== undefined) || (window.oRequestAnimationFrame !== undefined);
	
	if(hasAnimationFrame && !window.requestAnimationFrame)
	{
		window.requestAnimationFrame = window[$.browser.vendorPrefix+'RequestAnimationFrame'];
		window.cancelRequestAnimationFrame = window[$.browser.vendorPrefix+'CancelRequestAnimationFrame'];
	}
	
	var setTransitionEndEvent = function()
	{
		var event = "transitionEnd";
		if ($.browser.webkit) {
			event = "webkitTransitionEnd";
		} else if ($.browser.msie) {
			event = (parseInt($.browser.version,10)>=10) ? "transitionend" : "msTransitionEnd";
		} else if ($.browser.mozilla) {
			event = "transitionend";
		} else if ($.browser.opera) {
			event = (parseInt($.browser.version,10)>=12) ? "otransitionend" : "oTransitionEnd";
		}
		return event;
	};
	
	$.extend($.browser, {
		vendorPrefix: defineVendorPrefix(),
		hasAnimationFrame: hasAnimationFrame,
		cssCapabilities: {
							hasTransitions: hasCSSTransitions,
							transitionEndEvent: setTransitionEndEvent()
						}
	});

	$.fn.cssTransitions = function(cssProps, duration, callback)
	{
		return this.each(function()
		{
			if (duration === undefined)
			{
				duration = 500;
			}
			
			var $this = $(this),
			data = $this.data('transitionsCount');
			if($.browser.cssCapabilities.hasTransitions)
			{
				/*
				This adds saves to the data the number of transitions.
				Later we can clear any transition left and preventing
				the browser from triggering the transitionEnd event.
				Thus calling only when the last transition is over.
				*/
				if(!data)
				{
					$(this).data('transitionsCount', {count: 0});
				} else {
					data.count++;
				}
				
				var transition = ($.browser.vendorPrefix.length>0 ? '-' : '')+$.browser.vendorPrefix+"-transition-duration";
				cssProps[transition] = (duration/1000)+"s";
				/*
				This makes sure it animates. Because no "displayed" object receives css transitions
				*/
				$this.show().css(cssProps);
				
				$this.on($.browser.cssCapabilities.transitionEndEvent,function(event)
				{
					var $target = $(event.target);
					var targetData = $target.data('transitionsCount');
					$target.off(event.type);
					
					/*
					This checks for the attribute previously added and clear the
					CSS transition, when the last transition pass.
					*/
					
					if(targetData)
					{
						targetData.count--;
						if(targetData.count <= 0)
						{
							targetData.count = 0;
							$target.css(transition,'');
						}
					}
					if ($.isFunction(callback))
					{
						callback(event);
					}
				});
			} else
			{
				$this.show().animate(cssProps, duration, callback ? callback : null);
			}
		});
	};
})(jQuery);