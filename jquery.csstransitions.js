/**
JQUERY PLUGIN CSS-TRANSITIONS
Use css transitions instead of the current jQuery animate.
**/
(function($)
{
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
					This check for the attribute previously added and clear the
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