// eslint-disable
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_targetdeletedsuccessfully = /** @type {(inputs: { targetName: NonNullable<unknown>, fullName: NonNullable<unknown> }) => string} */ (i) => {
	return `${i.targetName} ${i.fullName} deleted successfully`
};

const pt_targetdeletedsuccessfully = /** @type {(inputs: { targetName: NonNullable<unknown>, fullName: NonNullable<unknown> }) => string} */ (i) => {
	return `${i.targetName} ${i.fullName} apagado com sucesso`
};

const es_targetdeletedsuccessfully = /** @type {(inputs: { targetName: NonNullable<unknown>, fullName: NonNullable<unknown> }) => string} */ (i) => {
	return `${i.targetName} ${i.fullName} eliminado con éxito`
};

/**
* This function has been compiled by [Paraglide JS](https://inlang.com/m/gerre34r).
*
* - Changing this function will be over-written by the next build.
*
* - If you want to change the translations, you can either edit the source files e.g. `en.json`, or
* use another inlang app like [Fink](https://inlang.com/m/tdozzpar) or the [VSCode extension Sherlock](https://inlang.com/m/r7kp499g).
* 
* @param {{ targetName: NonNullable<unknown>, fullName: NonNullable<unknown> }} inputs
* @param {{ locale?: "en" | "pt" | "es" }} options
* @returns {string}
*/
/* @__NO_SIDE_EFFECTS__ */
const targetdeletedsuccessfully = (inputs, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.targetdeletedsuccessfully(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("targetdeletedsuccessfully", locale)
	if (locale === "en") return en_targetdeletedsuccessfully(inputs)
	if (locale === "pt") return pt_targetdeletedsuccessfully(inputs)
	if (locale === "es") return es_targetdeletedsuccessfully(inputs)
	return "targetDeletedSuccessfully"
};
export { targetdeletedsuccessfully as "targetDeletedSuccessfully" }