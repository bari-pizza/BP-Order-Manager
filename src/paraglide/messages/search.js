// eslint-disable
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_search = /** @type {(inputs: {}) => string} */ () => {
	return `search`
};

const pt_search = /** @type {(inputs: {}) => string} */ () => {
	return `pesquisar`
};

const es_search = /** @type {(inputs: {}) => string} */ () => {
	return `buscar`
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
export const search = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.search(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("search", locale)
	if (locale === "en") return en_search(inputs)
	if (locale === "pt") return pt_search(inputs)
	if (locale === "es") return es_search(inputs)
	return "search"
};