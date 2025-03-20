// eslint-disable
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_nochangesdetected = /** @type {(inputs: {}) => string} */ () => {
	return `no changes detected`
};

const pt_nochangesdetected = /** @type {(inputs: {}) => string} */ () => {
	return `nao foram detectadas alteracoes`
};

const es_nochangesdetected = /** @type {(inputs: {}) => string} */ () => {
	return `no se detectaron cambios`
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
const nochangesdetected = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.nochangesdetected(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("nochangesdetected", locale)
	if (locale === "en") return en_nochangesdetected(inputs)
	if (locale === "pt") return pt_nochangesdetected(inputs)
	if (locale === "es") return es_nochangesdetected(inputs)
	return "noChangesDetected"
};
export { nochangesdetected as "noChangesDetected" }