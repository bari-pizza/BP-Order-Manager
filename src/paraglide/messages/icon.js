// eslint-disable
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_icon = /** @type {(inputs: {}) => string} */ () => {
	return `icon`
};

const pt_icon = /** @type {(inputs: {}) => string} */ () => {
	return `icone`
};

const es_icon = /** @type {(inputs: {}) => string} */ () => {
	return `icono`
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
export const icon = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.icon(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("icon", locale)
	if (locale === "en") return en_icon(inputs)
	if (locale === "pt") return pt_icon(inputs)
	if (locale === "es") return es_icon(inputs)
	return "icon"
};