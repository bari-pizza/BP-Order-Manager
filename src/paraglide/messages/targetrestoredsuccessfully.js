// eslint-disable
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_targetrestoredsuccessfully = /** @type {(inputs: { targetName: NonNullable<unknown>, fullName: NonNullable<unknown> }) => string} */ (i) => {
	return `${i.targetName} ${i.fullName} restored successfully`
};

const pt_targetrestoredsuccessfully = /** @type {(inputs: { targetName: NonNullable<unknown>, fullName: NonNullable<unknown> }) => string} */ (i) => {
	return `${i.targetName} ${i.fullName} restaurado com sucesso`
};

const es_targetrestoredsuccessfully = /** @type {(inputs: { targetName: NonNullable<unknown>, fullName: NonNullable<unknown> }) => string} */ (i) => {
	return `${i.targetName} ${i.fullName} restaurado con éxito`
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
const targetrestoredsuccessfully = (inputs, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.targetrestoredsuccessfully(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("targetrestoredsuccessfully", locale)
	if (locale === "en") return en_targetrestoredsuccessfully(inputs)
	if (locale === "pt") return pt_targetrestoredsuccessfully(inputs)
	if (locale === "es") return es_targetrestoredsuccessfully(inputs)
	return "targetRestoredSuccessfully"
};
export { targetrestoredsuccessfully as "targetRestoredSuccessfully" }