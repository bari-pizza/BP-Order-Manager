// eslint-disable
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_addtarget = /** @type {(inputs: { targetName: NonNullable<unknown> }) => string} */ (i) => {
	return `add ${i.targetName}`
};

const pt_addtarget = /** @type {(inputs: { targetName: NonNullable<unknown> }) => string} */ (i) => {
	return `adicionar ${i.targetName}`
};

const es_addtarget = /** @type {(inputs: { targetName: NonNullable<unknown> }) => string} */ (i) => {
	return `agregar ${i.targetName}`
};

/**
* This function has been compiled by [Paraglide JS](https://inlang.com/m/gerre34r).
*
* - Changing this function will be over-written by the next build.
*
* - If you want to change the translations, you can either edit the source files e.g. `en.json`, or
* use another inlang app like [Fink](https://inlang.com/m/tdozzpar) or the [VSCode extension Sherlock](https://inlang.com/m/r7kp499g).
* 
* @param {{ targetName: NonNullable<unknown> }} inputs
* @param {{ locale?: "en" | "pt" | "es" }} options
* @returns {string}
*/
/* @__NO_SIDE_EFFECTS__ */
const addtarget = (inputs, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.addtarget(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("addtarget", locale)
	if (locale === "en") return en_addtarget(inputs)
	if (locale === "pt") return pt_addtarget(inputs)
	if (locale === "es") return es_addtarget(inputs)
	return "addTarget"
};
export { addtarget as "addTarget" }