// eslint-disable
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_tosendpwresetemailtotarget = /** @type {(inputs: { targetName: NonNullable<unknown> }) => string} */ (i) => {
	return `to send password a reset email to ${i.targetName}`
};

const pt_tosendpwresetemailtotarget = /** @type {(inputs: { targetName: NonNullable<unknown> }) => string} */ (i) => {
	return `enviar correio electronico de redefinicao de senha para ${i.targetName}`
};

const es_tosendpwresetemailtotarget = /** @type {(inputs: { targetName: NonNullable<unknown> }) => string} */ (i) => {
	return `enviar correo electronico de restablecimiento de contraseña para ${i.targetName}`
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
const tosendpwresetemailtotarget = (inputs, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.tosendpwresetemailtotarget(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("tosendpwresetemailtotarget", locale)
	if (locale === "en") return en_tosendpwresetemailtotarget(inputs)
	if (locale === "pt") return pt_tosendpwresetemailtotarget(inputs)
	if (locale === "es") return es_tosendpwresetemailtotarget(inputs)
	return "toSendPWResetEmailToTarget"
};
export { tosendpwresetemailtotarget as "toSendPWResetEmailToTarget" }