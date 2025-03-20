// eslint-disable
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_restoringtarget = /** @type {(inputs: { targetName: NonNullable<unknown>, fullName: NonNullable<unknown> }) => string} */ (i) => {
	return `restoring ${i.targetName} ${i.fullName}`
};

const pt_restoringtarget = /** @type {(inputs: { targetName: NonNullable<unknown>, fullName: NonNullable<unknown> }) => string} */ (i) => {
	return `restorando ${i.targetName} ${i.fullName}`
};

const es_restoringtarget = /** @type {(inputs: { targetName: NonNullable<unknown>, fullName: NonNullable<unknown> }) => string} */ (i) => {
	return `restorando ${i.targetName} ${i.fullName}`
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
const restoringtarget = (inputs, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.restoringtarget(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("restoringtarget", locale)
	if (locale === "en") return en_restoringtarget(inputs)
	if (locale === "pt") return pt_restoringtarget(inputs)
	if (locale === "es") return es_restoringtarget(inputs)
	return "restoringTarget"
};
export { restoringtarget as "restoringTarget" }