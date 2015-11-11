# rb-tooltip
A javascript module to create tooltips on mouseover of any dom element


To use the module

var Tooltip  = require('rb-tooltip');

var dom_tooltip = Tooltip();

dom_tooltip.init("dom elem to be bound with the tooltip",
								"<div>Tooltip HTML</div>",//html string for tooltip
								{placement : "top"} // default "bottom"
);
