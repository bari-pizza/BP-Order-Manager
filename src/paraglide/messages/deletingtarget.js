// eslint-disable
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_deletingtarget = /** @type {(inputs: { targetName: NonNullable<unknown>, fullName: NonNullable<unknown> }) => string} */ (i) => {
	return `deleting ${i.targetName} ${i.fullName}`
};

const pt_deletingtarget = /** @type {(inputs: { targetName: NonNullable<unknown>, fullName: NonNullable<unknown> }) => string} */ (i) => {
	return `apagando ${i.targetName} ${i.fullName}`
};

const es_deletingtarget = /** @type {(inputs: { targetName: NonNullable<unknown>, fullName: NonNullable<unknown> }) => string} */ (i) => {
	return `eliminando ${i.targetName} ${i.fullName}`
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
const deletingtarget = (inputs, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.deletingtarget(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("deletingtarget", locale)
	if (locale === "en") return en_deletingtarget(inputs)
	if (locale === "pt") return pt_deletingtarget(inputs)
	if (locale === "es") return es_deletingtarget(inputs)
	return "deletingTarget"
};
export { deletingtarget as "deletingTarget" }