// eslint-disable
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_addnewtarget = /** @type {(inputs: { targetName: NonNullable<unknown> }) => string} */ (i) => {
	return `add new ${i.targetName}`
};

const pt_addnewtarget = /** @type {(inputs: { targetName: NonNullable<unknown> }) => string} */ (i) => {
	return `adicionar novo ${i.targetName}`
};

const es_addnewtarget = /** @type {(inputs: { targetName: NonNullable<unknown> }) => string} */ (i) => {
	return `agregar nuevo ${i.targetName}`
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
const addnewtarget = (inputs, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.addnewtarget(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("addnewtarget", locale)
	if (locale === "en") return en_addnewtarget(inputs)
	if (locale === "pt") return pt_addnewtarget(inputs)
	if (locale === "es") return es_addnewtarget(inputs)
	return "addNewTarget"
};
export { addnewtarget as "addNewTarget" }