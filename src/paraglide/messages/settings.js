// eslint-disable
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_settings = /** @type {(inputs: {}) => string} */ () => {
	return `settings`
};

const pt_settings = /** @type {(inputs: {}) => string} */ () => {
	return `configurações`
};

const es_settings = /** @type {(inputs: {}) => string} */ () => {
	return `configuraciones`
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
export const settings = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.settings(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("settings", locale)
	if (locale === "en") return en_settings(inputs)
	if (locale === "pt") return pt_settings(inputs)
	if (locale === "es") return es_settings(inputs)
	return "settings"
};