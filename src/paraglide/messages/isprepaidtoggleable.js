// eslint-disable
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_isprepaidtoggleable = /** @type {(inputs: {}) => string} */ () => {
	return `is prepaid toggleable`
};

const pt_isprepaidtoggleable = /** @type {(inputs: {}) => string} */ () => {
	return `e pago toggleavel`
};

const es_isprepaidtoggleable = /** @type {(inputs: {}) => string} */ () => {
	return `es pago toggleable`
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
const isprepaidtoggleable = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.isprepaidtoggleable(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("isprepaidtoggleable", locale)
	if (locale === "en") return en_isprepaidtoggleable(inputs)
	if (locale === "pt") return pt_isprepaidtoggleable(inputs)
	if (locale === "es") return es_isprepaidtoggleable(inputs)
	return "isPrepaidToggleable"
};
export { isprepaidtoggleable as "isPrepaidToggleable" }