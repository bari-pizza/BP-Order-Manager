// eslint-disable
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_selectbusinessdate = /** @type {(inputs: {}) => string} */ () => {
	return `select business date`
};

const pt_selectbusinessdate = /** @type {(inputs: {}) => string} */ () => {
	return `selecionar data`
};

const es_selectbusinessdate = /** @type {(inputs: {}) => string} */ () => {
	return `seleccione fecha`
};

/**
* This function has been compiled by [Paraglide JS](https://inlang.com/m/gerre34r).
*
* - Changing this function will be over-written by the next build.
*
* - If you want to change the translations, you can either edit the source files e.g. `en.json`, or
* use another inlang app like [Fink](https://inlang.com/m/tdozzpar) or the [VSCode extension Sherlock](https://inlang.com/m/r7kp499g).
* 
* @param {{}} inputs
* @param {{ locale?: "en" | "pt" | "es" }} options
* @returns {string}
*/
/* @__NO_SIDE_EFFECTS__ */
const selectbusinessdate = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.selectbusinessdate(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("selectbusinessdate", locale)
	if (locale === "en") return en_selectbusinessdate(inputs)
	if (locale === "pt") return pt_selectbusinessdate(inputs)
	if (locale === "es") return es_selectbusinessdate(inputs)
	return "selectBusinessDate"
};
export { selectbusinessdate as "selectBusinessDate" }