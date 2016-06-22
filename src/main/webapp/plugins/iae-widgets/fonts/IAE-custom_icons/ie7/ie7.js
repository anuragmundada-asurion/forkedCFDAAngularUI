/* To avoid CSS expressions while still supporting IE 7 and IE 6, use this script */
/* The script tag referencing this file must be placed before the ending body tag. */

/* Use conditional comments in order to target IE 7 and older:
	<!--[if lt IE 8]><!-->
	<script src="ie7/ie7.js"></script>
	<!--<![endif]-->
*/

(function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'IAE-custom_icons\'">' + entity + '</span>' + html;
	}
	var icons = {
		'iae-card': '&#xe911;',
		'iae-checkid': '&#xe912;',
		'iae-email': '&#xe913;',
		'iae-gear': '&#xe914;',
		'iae-business': '&#xe900;',
		'iae-catalog': '&#xe901;',
		'iae-hierarchy': '&#xe904;',
		'iae-performance': '&#xe905;',
		'iae-procurement': '&#xe908;',
		'iae-registration': '&#xe909;',
		'iae-subaward': '&#xe90c;',
		'iae-wage': '&#xe90e;',
		'0': 0
		},
		els = document.getElementsByTagName('*'),
		i, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		c = el.className;
		c = c.match(/iae-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
}());
