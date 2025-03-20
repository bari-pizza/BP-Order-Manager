// eslint-disable
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_orders = /** @type {(inputs: {}) => string} */ () => {
	return `orders`
};

const pt_orders = /** @type {(inputs: {}) => string} */ () => {
	return `pedidos`
};

const es_orders = /** @type {(inputs: {}) => string} */ () => {
	return `pedidos`
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
export const orders = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.orders(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("orders", locale)
	if (locale === "en") return en_orders(inputs)
	if (locale === "pt") return pt_orders(inputs)
	if (locale === "es") return es_orders(inputs)
	return "orders"
};