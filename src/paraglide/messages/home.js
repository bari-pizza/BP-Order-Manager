// eslint-disable
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_home = /** @type {(inputs: {}) => string} */ () => {
	return `home`
};

const pt_home = /** @type {(inputs: {}) => string} */ () => {
	return `inicio`
};

const es_home = /** @type {(inputs: {}) => string} */ () => {
	return `inicio`
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
export const home = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.home(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("home", locale)
	if (locale === "en") return en_home(inputs)
	if (locale === "pt") return pt_home(inputs)
	if (locale === "es") return es_home(inputs)
	return "home"
};