// eslint-disable
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_ordername = /** @type {(inputs: {}) => string} */ () => {
	return `order name`
};

const pt_ordername = /** @type {(inputs: {}) => string} */ () => {
	return `nome do pedido`
};

const es_ordername = /** @type {(inputs: {}) => string} */ () => {
	return `nombre del pedido`
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
const ordername = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.ordername(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("ordername", locale)
	if (locale === "en") return en_ordername(inputs)
	if (locale === "pt") return pt_ordername(inputs)
	if (locale === "es") return es_ordername(inputs)
	return "orderName"
};
export { ordername as "orderName" }