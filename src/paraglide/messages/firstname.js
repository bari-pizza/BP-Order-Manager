// eslint-disable
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_firstname = /** @type {(inputs: {}) => string} */ () => {
	return `first name`
};

const pt_firstname = /** @type {(inputs: {}) => string} */ () => {
	return `nome`
};

const es_firstname = /** @type {(inputs: {}) => string} */ () => {
	return `nombre`
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
const firstname = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.firstname(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("firstname", locale)
	if (locale === "en") return en_firstname(inputs)
	if (locale === "pt") return pt_firstname(inputs)
	if (locale === "es") return es_firstname(inputs)
	return "firstName"
};
export { firstname as "firstName" }