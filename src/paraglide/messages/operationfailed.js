// eslint-disable
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_operationfailed = /** @type {(inputs: {}) => string} */ () => {
	return `operation failed - try again!`
};

const pt_operationfailed = /** @type {(inputs: {}) => string} */ () => {
	return `operação falhou - tente novamente!`
};

const es_operationfailed = /** @type {(inputs: {}) => string} */ () => {
	return `operación fallida - inténtalo de nuevo!`
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
const operationfailed = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.operationfailed(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("operationfailed", locale)
	if (locale === "en") return en_operationfailed(inputs)
	if (locale === "pt") return pt_operationfailed(inputs)
	if (locale === "es") return es_operationfailed(inputs)
	return "operationFailed"
};
export { operationfailed as "operationFailed" }