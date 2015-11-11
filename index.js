(function(root, factory) {
  if (typeof define === "function" && define.amd) {
    define(['jquery'], function($) {
      return (root.Tooltip = factory($));
    });
  } else if (typeof module === "object" && module.exports) {
    module.exports = (root.Tooltip = factory(require('jquery')));
  } else {
    root.Tooltip = factory(root.$);
  }
})(this, function($) {
  return function() {
    var elem;
    var html;
    var options = {};
    var container = document.createElement('div');
    var isOver = false;
    container.className = 'tooltip';
    var tooltipArrow = document.createElement('div');
    tooltipArrow.className = "tooltip-arrow";
    container.appendChild(tooltipArrow);
    var tooltipInner = document.createElement('div');
    tooltipInner.className = "tooltip-inner";
    container.appendChild(tooltipInner);

    var getBounds = function(el) {
      var bounds = $(el).offset();
      bounds.width = el.offsetWidth;
      bounds.height = el.offsetHeight;
      return bounds;

    };

    var getActualOffset = function(placement, pos, actualWidth, actualHeight) {
      return placement == 'bottom' ? {
        top: pos.top + pos.height,
        left: pos.left + pos.width / 2 - actualWidth / 2
      } :
        placement == 'top' ? {
          top: pos.top - actualHeight,
          left: pos.left + pos.width / 2 - actualWidth / 2
        } :
          placement == 'left' ? {
            top: pos.top + pos.height / 2 - actualHeight / 2,
            left: pos.left - actualWidth
          } :
            {
              top: pos.top + pos.height / 2 - actualHeight / 2,
              left: pos.left + pos.width
            }
    };

    var replaceArrow = function(delta, dimension, position) {
      $(tooltipArrow).css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
    }

    var applyOffset = function(offset, placement) {
      var width = container.offsetWidth;
      var height = container.offsetHeight;

      var marginTop = parseInt($(container).css('margin-top'), 10);
      var marginLeft = parseInt($(container).css('margin-left'), 10);

      if (isNaN(marginTop))
        marginTop = 0;
      if (isNaN(marginLeft))
        marginLeft = 0;

      offset.top = offset.top + marginTop;
      offset.left = offset.left + marginLeft;

      $(container).offset(offset).addClass('in');

      var actualWidth = container.offsetWidth;
      var actualHeight = container.offsetHeight;

      if (placement == 'top' && actualHeight != height) {
        offset.top = offset.top + height - actualHeight;
        $(container).offset(offset);
      }

      if (/bottom|top/.test(placement)) {
        var delta = 0

        if (offset.left < 0) {
          delta = offset.left * -2;
          offset.left = 0;

          $(container).offset(offset);

          actualWidth = container.offsetWidth;
          actualHeight = container.offsetHeight;
        }

        replaceArrow(delta - width + actualWidth, actualWidth, 'left');
      } else {
        replaceArrow(actualHeight - height, actualHeight, 'top');
      }

    };

    var getTopPositionFromNode = function(node) {
      var i = 0;
      while (node !== null) {
        i += node.offsetTop;
        node = node.offsetParent;
      }
      return i;
    };

    var showTooltip = function(event) {
      var placement = options.placement;

      var el = event.currentTarget;


      $(container).css({
        top: 0,
        left: 0,
        display: 'block'
      }).addClass('fade').addClass(placement);

      $(container).insertAfter($(el));

      var positionOfElem = getBounds(el);
      var actualWidth = container.offsetWidth;
      var actualHeight = container.offsetHeight;

      var parent = $(el).parent();
      var orgPlacement = placement;
      var docScroll = document.documentElement.scrollTop || document.body.scrollTop;
      var parentWidth = $(parent).outerWidth();
      var parentHeight = $(parent).outerHeight();
      var parentLeft = $(parent).offset().left;

      placement = placement == 'bottom' && positionOfElem.top + positionOfElem.height + actualHeight - docScroll > parentHeight ? 'top' :
        placement == 'top' && positionOfElem.top - docScroll - actualHeight < 0 ? 'bottom' :
          placement == 'right' && positionOfElem.right + actualWidth > parentWidth ? 'left' :
            placement == 'left' && positionOfElem.left - actualWidth < parentLeft ? 'right' :
              placement;

      $(container).removeClass(orgPlacement).addClass(placement);

      var actualOffset = getActualOffset(placement, positionOfElem, actualWidth, actualHeight);

      applyOffset(actualOffset, placement);


    };

    var onMouseOver = function(event) {
      if (!isOver) {
        showTooltip(event);
        isOver = true;
      }
    };

    var onMouseLeave = function(event) {
      isOver = false;
      $(container).remove();
    }

    var render = function() {
      tooltipInner.innerHTML = html;
    };

    var bindEvents = function() {
      $(elem).on('mouseover', onMouseOver);
      $(elem).on('mouseleave', onMouseLeave);
    };

    var initialize = function(element, htmlStr, opts) {
      elem = element;
      html = htmlStr;
      options = opts || {};
      options.placement = opts.placement || 'bottom';
      render();
      bindEvents();
    }
    return {
      init: initialize
    };
  }
});