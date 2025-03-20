// eslint-disable
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_torestoretarget = /** @type {(inputs: { targetName: NonNullable<unknown> }) => string} */ (i) => {
	return `to restore ${i.targetName}`
};

const pt_torestoretarget = /** @type {(inputs: { targetName: NonNullable<unknown> }) => string} */ (i) => {
	return `restorar ${i.targetName}`
};

const es_torestoretarget = /** @type {(inputs: { targetName: NonNullable<unknown> }) => string} */ (i) => {
	return `restorar ${i.targetName}`
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
const torestoretarget = (inputs, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.torestoretarget(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("torestoretarget", locale)
	if (locale === "en") return en_torestoretarget(inputs)
	if (locale === "pt") return pt_torestoretarget(inputs)
	if (locale === "es") return es_torestoretarget(inputs)
	return "toRestoreTarget"
};
export { torestoretarget as "toRestoreTarget" }