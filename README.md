jquery-css-transitions
======================

A jQuery plugin for using CSS transitions when available instead of the animate() from jQuery. Everything is handled by the browser.

This plugin is meant to be used in replacement of the default <code>animate()</code> function from **jQuery**.

## Usage ##

The plugin works in the same fashion as the <code>css()</code> and <code>animate()</code> functions combined. Ex.:

##### Ordinary jQuery Animation #####
	$('selector').animate({opacity: 1}, 1200, function(){ console.log('Animation ended');});

##### Normal with CSS transitions #####
	$('selector').cssTransitions({opacity: 1}, 1200, function(){ console.log('Animation with css-transitions ended');});

## Why use this? ##
The idea is simple: the browser handles it all. When using <code>animate()</code>, **jQuery** changes the property value every loop by incrementing/decrementing according to the duration.<sup>†</sup>.

<sup>†</sup> You can see this behaviour with the *console* on. Fade in a element and you will see the inline style for opacity gradually changing e.g.: 0.0123 … 0.0345 … 0.1234…