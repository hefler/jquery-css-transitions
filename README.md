jquery-css-transitions
======================

A jQuery plugin for using CSS transitions when available instead of the animate() from jQuery. Everything is handled by the browser.

This plugin is meant to be used in replacement of the default <code>animate()</code> function from **jQuery**.

## Usage ##

The plugin works in the same fashion as the <code>css()</code> and <code>animate()</code> functions combined. Ex.:

##### Ordinary jQuery #####
	$('selector').animate({opacity: 1}, 1200, function(){ console.log('Animation ended');});

##### Normal with CSS transitions #####
	$('selector').cssTransitions({opacity: 1}, 1200, function(){ console.log('Animation with css-transitions ended');});

