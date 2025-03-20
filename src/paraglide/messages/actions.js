// eslint-disable
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_actions = /** @type {(inputs: {}) => string} */ () => {
	return `actions`
};

const pt_actions = /** @type {(inputs: {}) => string} */ () => {
	return `ações`
};

const es_actions = /** @type {(inputs: {}) => string} */ () => {
	return `acciones`
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
export const actions = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.actions(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("actions", locale)
	if (locale === "en") return en_actions(inputs)
	if (locale === "pt") return pt_actions(inputs)
	if (locale === "es") return es_actions(inputs)
	return "actions"
};