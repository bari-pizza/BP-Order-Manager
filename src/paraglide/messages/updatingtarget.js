// eslint-disable
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_updatingtarget = /** @type {(inputs: { targetName: NonNullable<unknown> }) => string} */ (i) => {
	return `updating ${i.targetName}`
};

const pt_updatingtarget = /** @type {(inputs: { targetName: NonNullable<unknown> }) => string} */ (i) => {
	return `atualizando ${i.targetName}`
};

const es_updatingtarget = /** @type {(inputs: { targetName: NonNullable<unknown> }) => string} */ (i) => {
	return `actualizando ${i.targetName} `
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
const updatingtarget = (inputs, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.updatingtarget(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("updatingtarget", locale)
	if (locale === "en") return en_updatingtarget(inputs)
	if (locale === "pt") return pt_updatingtarget(inputs)
	if (locale === "es") return es_updatingtarget(inputs)
	return "updatingTarget"
};
export { updatingtarget as "updatingTarget" }