jquery-css-transitions
======================

A jQuery plugin for using CSS transitions when available instead of the old animate().

This plugin is meant to be used in replacement of the default <code>animate()</code> function from **jQuery**.

## Usage ##

The plugin works in the same fashion as the <code>css()</code> and <code>animate()</code> functions combined. Ex.:

##### Ordinary jQuery #####
	$('selector').animate({opacity: 1}, 1.2, function(){ console.log('Animation ended');});

##### Normal with CSS transitions #####
	$('selector').cssTransitions({opacity: 1}, 1.2, function(){ console.log('Animation with css-transitions ended');});

---
### Note ###
As for **jQuery 1.8** and on you don't need to use this plug-in as the animation engine was totally revamped taking advantage of CSS3 transitions.