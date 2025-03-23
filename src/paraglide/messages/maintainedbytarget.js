// eslint-disable
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_maintainedbytarget = /** @type {(inputs: { targetName: NonNullable<unknown> }) => string} */ (i) => {
	return `maintained by ${i.targetName}`
};

const pt_maintainedbytarget = /** @type {(inputs: { targetName: NonNullable<unknown> }) => string} */ (i) => {
	return `mantido por ${i.targetName}`
};

const es_maintainedbytarget = /** @type {(inputs: { targetName: NonNullable<unknown> }) => string} */ (i) => {
	return `mantenido por ${i.targetName}`
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
const maintainedbytarget = (inputs, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.maintainedbytarget(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("maintainedbytarget", locale)
	if (locale === "en") return en_maintainedbytarget(inputs)
	if (locale === "pt") return pt_maintainedbytarget(inputs)
	if (locale === "es") return es_maintainedbytarget(inputs)
	return "maintainedByTarget"
};
export { maintainedbytarget as "maintainedByTarget" }