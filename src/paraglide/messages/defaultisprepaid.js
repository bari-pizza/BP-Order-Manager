// eslint-disable
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_defaultisprepaid = /** @type {(inputs: {}) => string} */ () => {
	return `default is prepaid`
};

const pt_defaultisprepaid = /** @type {(inputs: {}) => string} */ () => {
	return `pre-definidoo e pre-pago`
};

const es_defaultisprepaid = /** @type {(inputs: {}) => string} */ () => {
	return `predeterminado es pago`
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
const defaultisprepaid = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.defaultisprepaid(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("defaultisprepaid", locale)
	if (locale === "en") return en_defaultisprepaid(inputs)
	if (locale === "pt") return pt_defaultisprepaid(inputs)
	if (locale === "es") return es_defaultisprepaid(inputs)
	return "defaultIsPrepaid"
};
export { defaultisprepaid as "defaultIsPrepaid" }