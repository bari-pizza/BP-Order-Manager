// eslint-disable
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en__delete = /** @type {(inputs: {}) => string} */ () => {
	return `delete`
};

const pt__delete = /** @type {(inputs: {}) => string} */ () => {
	return `apagar`
};

const es__delete = /** @type {(inputs: {}) => string} */ () => {
	return `eliminar`
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
const _delete = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr._delete(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("_delete", locale)
	if (locale === "en") return en__delete(inputs)
	if (locale === "pt") return pt__delete(inputs)
	if (locale === "es") return es__delete(inputs)
	return "delete"
};
export { _delete as "delete" }