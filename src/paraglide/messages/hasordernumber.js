// eslint-disable
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_hasordernumber = /** @type {(inputs: {}) => string} */ () => {
	return `has order number`
};

const pt_hasordernumber = /** @type {(inputs: {}) => string} */ () => {
	return `tem numero de pedido`
};

const es_hasordernumber = /** @type {(inputs: {}) => string} */ () => {
	return `tiene numero de pedido`
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
const hasordernumber = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.hasordernumber(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("hasordernumber", locale)
	if (locale === "en") return en_hasordernumber(inputs)
	if (locale === "pt") return pt_hasordernumber(inputs)
	if (locale === "es") return es_hasordernumber(inputs)
	return "hasOrderNumber"
};
export { hasordernumber as "hasOrderNumber" }