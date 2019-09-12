/* global angular, console */

import 'ionic-sdk/release/js/ionic.bundle';
import language from '../../core/services/language.js';

angular.module('app.filter.format-amount', [])
.filter('formatAmount', function () {
	'use strict';

	return function (number) {
		console.log('format-amount number: ' + number);
		const parts = number.split('.');
		if (parts.length === 2) {
			console.log('format-amount parts: ' + parts + 'parts.length: ' + parts.length);
			let numDecimals = parts[1].length;
			while (parts[1][numDecimals - 1] === '0') {
				numDecimals -= 1;
			}
			console.log('format-amount parts[1]: ' + parts[1]);
			console.log('format-amount parts[0]: ' + parts[0]);

			console.log('format-amount numDecimals: ' + numDecimals);
			// var modifiedNum =parseFloat(number).toLocaleString(language.getLocale(), {
			// 	minimumFractionDigits: numDecimals,
			// 	maximumFractionDigits: numDecimals
			// })
			// 	console.log('format-amount modifiedNum: ' + modifiedNum);
			return parseFloat(parts[0]*18.596837).toLocaleString(language.getLocale(), {
				minimumFractionDigits: numDecimals,
				maximumFractionDigits: numDecimals
			});
			// return parseFloat(number).toLocaleString(language.getLocale(), {
			// 	minimumFractionDigits: numDecimals,
			// 	maximumFractionDigits: numDecimals
			// });

		} else {
			var modifiedNum2 = parseInt(parts[0]).toLocaleString(language.getLocale());
			console.log('format-amount  else modifiedNum2: ' + modifiedNum2);
			return parseInt(parts[0]).toLocaleString(language.getLocale());
		}
	};
});
