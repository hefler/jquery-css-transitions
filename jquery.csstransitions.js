/*!
JQUERY PLUGIN CSS-TRANSITIONS
Copyright (c) 2013 Felipe Hefler

Licensed under the MIT license.
http://github.com/hefler/jquery-css-transitions/blob/master/LICENSE

GitHub
https://github.com/hefler/jquery-css-transitions
*/
(function($)
{
	/**
	Extends CSS props
	**/
	if(!$.cssHooks)
	{
		throw ("jQuery 1.4.3 or higher required.");
	}
	//From jQuery documentation
	var getStyleSupport = function(prop)
	{
		var vendorProperty, supportedProperty,
			capProp = prop.charAt(0).toUpperCase() + prop.slice(1),
			prefixes = ["moz", "webkit", "o", "ms"],
			body = document.body.style;

		if(prop in body)
		{
			supportedProperty = prop;
		}
		else
		{
			var leng = prefixes.length;
			for(var i=0; i < leng; i++)
			{
				vendorProperty = prefixes[i] + capProp;
				if(vendorProperty in body)
				{
					supportedProperty = vendorProperty;
					break;
				}
			}
		}
		$.support[prop] = supportedProperty;
		return supportedProperty;
	};

	var createStyleHook = function(cssPropName, cssProp)
	{
		var obj = {
			get: function(elem, computed, extra)
			{
				return $.css(elem, cssProp);
			},
			set: function(elem, value)
			{
				elem.style[cssProp] = value;
			}
		};
		return obj.clone;
	};

	/*Looks up if the property exist inside cssHooks. If none is found, it make sure to add one.*/
	var lookupAndAddToCSSHooks = function(props)
	{
		var leng = props.length;
		for (var i=0; i < leng; i++)
		{
			var cssPropName = props[i];
			var cssProp = getStyleSupport(cssPropName);

			if (cssProp && cssProp !== cssPropName)
			{
				$.cssHooks[cssPropName] = createStyleHook(cssPropName, cssProp);
			}
		}
	};

	lookupAndAddToCSSHooks(['transition', 'transitionDuration', 'transitionDelay','transitionProperty','transitionTimingFunction','animationFrame', 'transitionend']);
	//Tells that this is 'pure' numbers only (no 'px' appending).
	$.cssNumber.transition = $.cssNumber.transitionDuration = $.cssNumber.transitionDelay = true;

	var bodyStyle = document.getElementsByTagName('body')[0].style;

	var hasTransition = (bodyStyle.transition !== undefined) || (bodyStyle.webkitTransition !== undefined) || (bodyStyle.MozTransition !== undefined) || (bodyStyle.msTransition !== undefined) || (bodyStyle.OTransition !== undefined);
	var hasAnimationFrame = (window.requestAnimationFrame !== undefined) || (window.webkitRequestAnimationFrame !== undefined) || (window.mozRequestAnimationFrame !== undefined) || (window.oRequestAnimationFrame !== undefined);

	var navAgent = window.navigator.userAgent;

	var setTransitionEndEventName = function()
	{
		var event = "transitionend";
		if (window.WebKitTransitionEvent) {
			event = "webkitTransitionEnd";
		} else if (window.MSTransitionEvent) {
			event = "msTransitionEnd";
		} else if (window.OTransitionEvent) {
			event = "otransitionend";
		}
		return event;
	};

	$.extend($, {
		navigator: {
			iPad: (navAgent.match(/iPad/i) == "iPad"),
			iPod: (navAgent.match(/iPod/i) == "iPod"),
			iPhone: (navAgent.match(/iPhone/i) == "iPhone"),
			android: (navAgent.match(/Android/i) == "Android"),
			msieMob: (navAgent.match(/IEMobile/i) == "IEMobile"),
			webkit: (navAgent.match(/WebKit/i) == "WebKit"),
			msie: (navAgent.match(/MSIE/i) == "MSIE"),
			mozilla: (navAgent.match(/Mozilla/i) == "Mozilla"),
			opera: (navAgent.match(/Opera/i) == "Opera")
		},
		css3: {
			transitionEndEvent: setTransitionEndEventName()
		}
	});

	var getVendorPrefix = function()
	{
		var prefix = '';
		if($.navigator.webkit)
		{
			prefix = 'webkit';
		} else if ($.navigator.msie)
		{
			prefix = 'ms';
		} else if ($.navigator.mozilla)
		{
			prefix = 'moz';
		} else if ($.navigator.opera)
		{
			prefix = 'o';
		}
		return prefix;
	};
	if(hasAnimationFrame && !window.requestAnimationFrame)
	{
		var vendorPrefix = getVendorPrefix();
		window.requestAnimationFrame = window[vendorPrefix+'RequestAnimationFrame'];
		window.cancelRequestAnimationFrame = window[vendorPrefix+'CancelRequestAnimationFrame'];
	}

	$.extend($.support, {
		animationFrame: hasAnimationFrame,
		transition: hasTransition
	});

	$.fn.cssTransitions = function(cssProperties, duration, callback)
	{
		return this.each(function()
		{
			if (duration === undefined)
			{
				duration = 500;
			}

			var $this = $(this),
			data = $this.data('transitionsCount');
			if($.support.transition)
			{
				/*
				This adds to the data the number of transitions.
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
				var transitionCSS = "transitionDuration";
				cssProperties[transitionCSS] = (duration*0.001)+'s';
				/*
				This makes sure it animates. Because not "displayed" object receives no css transitions
				*/
				$this.show().css(cssProperties);

				$this.on($.css3.transitionEndEvent, function(event)
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
							$target.css(transitionCSS,'');
						}
					}
					if ($.isFunction(callback))
					{
						callback(event);
					}
				});
			} else
			{
				$this.show().animate(cssProperties, duration, callback ? callback : null);
			}
		});
	};
})(jQuery);