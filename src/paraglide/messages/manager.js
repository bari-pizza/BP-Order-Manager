// eslint-disable
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_manager = /** @type {(inputs: {}) => string} */ () => {
	return `manager`
};

const pt_manager = /** @type {(inputs: {}) => string} */ () => {
	return `gerente`
};

const es_manager = /** @type {(inputs: {}) => string} */ () => {
	return `gerente`
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
export const manager = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.manager(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("manager", locale)
	if (locale === "en") return en_manager(inputs)
	if (locale === "pt") return pt_manager(inputs)
	if (locale === "es") return es_manager(inputs)
	return "manager"
};