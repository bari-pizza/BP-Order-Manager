// eslint-disable
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_driver = /** @type {(inputs: {}) => string} */ () => {
	return `driver`
};

const pt_driver = /** @type {(inputs: {}) => string} */ () => {
	return `driver`
};

const es_driver = /** @type {(inputs: {}) => string} */ () => {
	return `driver`
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
export const driver = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.driver(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("driver", locale)
	if (locale === "en") return en_driver(inputs)
	if (locale === "pt") return pt_driver(inputs)
	if (locale === "es") return es_driver(inputs)
	return "driver"
};