// eslint-disable
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_areyousureyouwant = /** @type {(inputs: { message: NonNullable<unknown> }) => string} */ (i) => {
	return `are you sure you want ${i.message}?`
};

const pt_areyousureyouwant = /** @type {(inputs: { message: NonNullable<unknown> }) => string} */ (i) => {
	return `tem certeza que voce quer ${i.message}?`
};

const es_areyousureyouwant = /** @type {(inputs: { message: NonNullable<unknown> }) => string} */ (i) => {
	return `estas segura que quieres ${i.message}?`
};

/**
* This function has been compiled by [Paraglide JS](https://inlang.com/m/gerre34r).
*
* - Changing this function will be over-written by the next build.
*
* - If you want to change the translations, you can either edit the source files e.g. `en.json`, or
* use another inlang app like [Fink](https://inlang.com/m/tdozzpar) or the [VSCode extension Sherlock](https://inlang.com/m/r7kp499g).
* 
* @param {{ message: NonNullable<unknown> }} inputs
* @param {{ locale?: "en" | "pt" | "es" }} options
* @returns {string}
*/
/* @__NO_SIDE_EFFECTS__ */
const areyousureyouwant = (inputs, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.areyousureyouwant(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("areyousureyouwant", locale)
	if (locale === "en") return en_areyousureyouwant(inputs)
	if (locale === "pt") return pt_areyousureyouwant(inputs)
	if (locale === "es") return es_areyousureyouwant(inputs)
	return "areYouSureYouWant"
};
export { areyousureyouwant as "areYouSureYouWant" }