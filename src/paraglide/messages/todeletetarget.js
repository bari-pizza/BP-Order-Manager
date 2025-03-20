// eslint-disable
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_todeletetarget = /** @type {(inputs: { targetName: NonNullable<unknown> }) => string} */ (i) => {
	return `to delete ${i.targetName}`
};

const pt_todeletetarget = /** @type {(inputs: { targetName: NonNullable<unknown> }) => string} */ (i) => {
	return `apagar ${i.targetName}`
};

const es_todeletetarget = /** @type {(inputs: { targetName: NonNullable<unknown> }) => string} */ (i) => {
	return `eliminar ${i.targetName}`
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
const todeletetarget = (inputs, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.todeletetarget(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("todeletetarget", locale)
	if (locale === "en") return en_todeletetarget(inputs)
	if (locale === "pt") return pt_todeletetarget(inputs)
	if (locale === "es") return es_todeletetarget(inputs)
	return "toDeleteTarget"
};
export { todeletetarget as "toDeleteTarget" }