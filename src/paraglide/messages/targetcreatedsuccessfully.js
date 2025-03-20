// eslint-disable
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_targetcreatedsuccessfully = /** @type {(inputs: { targetName: NonNullable<unknown>, fullName: NonNullable<unknown> }) => string} */ (i) => {
	return `${i.targetName} ${i.fullName} created successfully`
};

const pt_targetcreatedsuccessfully = /** @type {(inputs: { targetName: NonNullable<unknown>, fullName: NonNullable<unknown> }) => string} */ (i) => {
	return `${i.targetName} ${i.fullName} criado com sucesso`
};

const es_targetcreatedsuccessfully = /** @type {(inputs: { targetName: NonNullable<unknown>, fullName: NonNullable<unknown> }) => string} */ (i) => {
	return `${i.targetName} ${i.fullName} creado con éxito`
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
const targetcreatedsuccessfully = (inputs, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.targetcreatedsuccessfully(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("targetcreatedsuccessfully", locale)
	if (locale === "en") return en_targetcreatedsuccessfully(inputs)
	if (locale === "pt") return pt_targetcreatedsuccessfully(inputs)
	if (locale === "es") return es_targetcreatedsuccessfully(inputs)
	return "targetCreatedSuccessfully"
};
export { targetcreatedsuccessfully as "targetCreatedSuccessfully" }