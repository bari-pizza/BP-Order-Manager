// eslint-disable
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_sendingpwresetemailtotarget = /** @type {(inputs: { targetName: NonNullable<unknown> }) => string} */ (i) => {
	return `sending password reset email to ${i.targetName}`
};

const pt_sendingpwresetemailtotarget = /** @type {(inputs: { targetName: NonNullable<unknown> }) => string} */ (i) => {
	return `enviando correio electronico para ${i.targetName}`
};

const es_sendingpwresetemailtotarget = /** @type {(inputs: { targetName: NonNullable<unknown> }) => string} */ (i) => {
	return `enviando correo electronico para ${i.targetName}`
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
const sendingpwresetemailtotarget = (inputs, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.sendingpwresetemailtotarget(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("sendingpwresetemailtotarget", locale)
	if (locale === "en") return en_sendingpwresetemailtotarget(inputs)
	if (locale === "pt") return pt_sendingpwresetemailtotarget(inputs)
	if (locale === "es") return es_sendingpwresetemailtotarget(inputs)
	return "sendingPWResetEmailToTarget"
};
export { sendingpwresetemailtotarget as "sendingPWResetEmailToTarget" }