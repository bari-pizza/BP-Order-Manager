// eslint-disable
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_mobile = /** @type {(inputs: {}) => string} */ () => {
	return `mobile`
};

const pt_mobile = /** @type {(inputs: {}) => string} */ () => {
	return `mobile`
};

const es_mobile = /** @type {(inputs: {}) => string} */ () => {
	return `movil`
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
export const mobile = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.mobile(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("mobile", locale)
	if (locale === "en") return en_mobile(inputs)
	if (locale === "pt") return pt_mobile(inputs)
	if (locale === "es") return es_mobile(inputs)
	return "mobile"
};