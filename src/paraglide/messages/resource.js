// eslint-disable
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_resource = /** @type {(inputs: {}) => string} */ () => {
	return `resource`
};

const pt_resource = /** @type {(inputs: {}) => string} */ () => {
	return `recursos`
};

const es_resource = /** @type {(inputs: {}) => string} */ () => {
	return `recursos`
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
export const resource = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.resource(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("resource", locale)
	if (locale === "en") return en_resource(inputs)
	if (locale === "pt") return pt_resource(inputs)
	if (locale === "es") return es_resource(inputs)
	return "resource"
};