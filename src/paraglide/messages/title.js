// eslint-disable
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_title = /** @type {(inputs: {}) => string} */ () => {
	return `title`
};

const pt_title = /** @type {(inputs: {}) => string} */ () => {
	return `titulo`
};

const es_title = /** @type {(inputs: {}) => string} */ () => {
	return `titulo`
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
export const title = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.title(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("title", locale)
	if (locale === "en") return en_title(inputs)
	if (locale === "pt") return pt_title(inputs)
	if (locale === "es") return es_title(inputs)
	return "title"
};