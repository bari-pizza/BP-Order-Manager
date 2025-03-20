// eslint-disable
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_hasordername = /** @type {(inputs: {}) => string} */ () => {
	return `has order name`
};

const pt_hasordername = /** @type {(inputs: {}) => string} */ () => {
	return `tem nome de pedido`
};

const es_hasordername = /** @type {(inputs: {}) => string} */ () => {
	return `tiene nombre de pedido`
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
const hasordername = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.hasordername(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("hasordername", locale)
	if (locale === "en") return en_hasordername(inputs)
	if (locale === "pt") return pt_hasordername(inputs)
	if (locale === "es") return es_hasordername(inputs)
	return "hasOrderName"
};
export { hasordername as "hasOrderName" }