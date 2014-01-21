/**
 *  Project:      CSS3 animated tooltip
 *  Description:  A simple, css3 animated tooltip
 *  Author:       Csikós Árpád <arpad.csikos@gmail.com>
 *  License:      Apache License, Version 2.0 <http://www.apache.org/licenses/LICENSE-2.0.html>
 *  Source:       https://github.com/csikosarpad/tooltip
 *
 *  Usage:        
      $('.csstooltip').cssTooltip({
        pos       : 'right',
        trigger   : 'hover',
        animated  : 'fadeInRight'
      });
 *      
 *
 *
 */

/**
 * 
 * @param {type} opt
 * @returns {undefined}
 */
$.fn.cssTooltip = function(opt) {
  var def = {
    pos       : 'right',
    trigger   : 'hover',
    animated  : false
  },
  toolTipId = 0,
  newStyle  = '',
  title     = '',
  tooltip   = {
    obj         : {},
    windowWidth : $(window).innerWidth(),
    xPos        : 0,
    yPos        : 0,
    tWidth      : 0,
    correction  : 0
  },
  pos       = def.pos,
  trigger   = def.trigger,
  animated  = def.animated;
  
  if ( typeof opt !== 'undefined' ) {
    pos       = opt.pos,
    trigger   = opt.trigger,
    animated  = opt.animated;    
  }  
  
  if ( typeof opt !== 'undefined' && opt.reset === true ) {
    reset();
  }
  
  reset = function(){
    $('#dynamicStyle').remove();
    $('.inline-tooltip').removeClass('clicked');
    $('.css-tooltip').removeClass('clicked').removeAttr('data-xpos style');
  };
  
  if ( $('#dynamicStyle').length < 1 ) {
    $('<style type="text/css" id="dynamicStyle" />').appendTo('head');
  }

  if ( pos !== 'undefined' ) {
    $(this).addClass('tooltip-' + pos);
  }  

  $(this).each(function() {
    toolTipId++;
    title = $(this).attr('title') || $(this).attr('data-content');
    if ($(this).find('.css-tooltip').length === 0) {
      $('<span class="css-tooltip" id="cssTool_' + toolTipId + '">' + title + '</span>').appendTo(this);
      toolTipId++;
      $('<span class="css-tooltip" id="cssTool_' + toolTipId + '">' + title + '</span>').appendTo($(this).find('.inline-tooltip'));
    }
  });

  if (trigger === 'hover') {
    if (animated) {
      $(this).on('mouseenter', function() {
        $(this).find('.css-tooltip').addClass(animated + ' animated');
      });
      $(this).on('mouseleave', function() {
        $(this).find('.css-tooltip').removeClass(animated + ' animated');
      });
    }
  }

  if (trigger === 'click') {
    $(this).addClass('no-hover');
    $('body').unbind('click.csstooltip');
    $('body').bind('click.csstooltip', function(ev) {
      if (animated) {
        $(this).find('.css-tooltip').removeClass(animated + ' animated');
        }

      tooltip.obj.obj = $(ev.target).find('.css-tooltip');
      
      if ($('.csstooltip .inline-tooltip').css('display') === 'none') {
        return false;
      } else {
        if ($(ev.target).is('.inline-tooltip')) {          
          $('.csstooltip, .inline-tooltip').removeClass('clicked');
          $(ev.target).addClass('clicked');
          if (animated) {
            $(this).find('.css-tooltip').addClass(animated + ' animated');
          }
        } else {
          $('.csstooltip, .inline-tooltip').removeClass('clicked');
        }
      }
      
      tooltip.obj.leftPos = parseInt( $(tooltip.obj.obj).css('left'), 10);
      
      tooltip.windowWidth = $(window).innerWidth();
      tooltip.xPos = ev.pageX;
      tooltip.yPos = ev.pageY;
      tooltip.tWidth = $(ev.target).find('.css-tooltip').innerWidth();

      if ( ( tooltip.windowWidth - tooltip.xPos ) < tooltip.tWidth ) {
        tooltip.correction = ( tooltip.xPos - ( tooltip.windowWidth - tooltip.tWidth ) ) * -1;
        if ( !$(ev.target).find('.css-tooltip').attr('data-xpos') ) {
          $(tooltip.obj.obj).attr('data-xpos', parseInt( $(tooltip.obj.obj).css('left'), 10) );
          tooltip.obj.origLeftPos = $(tooltip.obj.obj).attr('data-xpos');
          $(tooltip.obj.obj).css('left', tooltip.obj.leftPos + tooltip.correction);
        } else {
          $(tooltip.obj.obj).css('left', tooltip.obj.origLeftPos + tooltip.correction);
        }
        
        newStyle = "#" + $(tooltip.obj.obj).attr('id') + ":before{left:" + (tooltip.correction * -1 + 25) + "px;}";
        newStyle += "#" + $(tooltip.obj.obj).attr('id') + ":after{left:" + (tooltip.correction * -1 + 26) + "px;}";
        $("#dynamicStyle").text(newStyle);
      }

    });
  }
};


/**
 * 
 */
$(document).ready(function() {
  cssHover = function() {
    $('.csstooltip').removeClass('tooltip-top tooltip-right tooltip-bottom tooltip-left no-hover');
    
    if ($('.csstooltip .inline-tooltip').css('display') === 'none') {
      $('.csstooltip').cssTooltip({
        pos       : 'right',
        trigger   : 'hover',
        animated  : 'pulse'
      });
    } else {
      $('.csstooltip').cssTooltip({
        pos       : 'top',
        trigger   : 'click',
        animated  : false
      });
    }
  };

  cssHover();

  $(window).resize(function() {
    $('.csstooltip').cssTooltip({reset: true});
    cssHover();
  });
  
});