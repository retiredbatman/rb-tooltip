# rb-tooltip
A javascript module to create tooltips on mouseover of any dom element


To use the module

var Tooltip  = require('rb-tooltip');

var dom_tooltip = Tooltip();

dom_tooltip.init("elem id to on which tooltip is to be bound",
								"<div>Tooltip HTML</div>"//html string for tooltip
);
