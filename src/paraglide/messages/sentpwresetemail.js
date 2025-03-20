// eslint-disable
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_sentpwresetemail = /** @type {(inputs: {}) => string} */ () => {
	return `sent password reset email`
};

const pt_sentpwresetemail = /** @type {(inputs: {}) => string} */ () => {
	return `enviado correio electronico de redefinicao de senha`
};

const es_sentpwresetemail = /** @type {(inputs: {}) => string} */ () => {
	return `enviado correo electronico de restablecimiento de contraseña`
};

/**
* This function has been compiled by [Paraglide JS](https://inlang.com/m/gerre34r).
*
* - Changing this function will be over-written by the next build.
*
* - If you want to change the translations, you can either edit the source files e.g. `en.json`, or
* use another inlang app like [Fink](https://inlang.com/m/tdozzpar) or the [VSCode extension Sherlock](https://inlang.com/m/r7kp499g).
* 
* @param {{}} inputs
* @param {{ locale?: "en" | "pt" | "es" }} options
* @returns {string}
*/
/* @__NO_SIDE_EFFECTS__ */
const sentpwresetemail = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.sentpwresetemail(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("sentpwresetemail", locale)
	if (locale === "en") return en_sentpwresetemail(inputs)
	if (locale === "pt") return pt_sentpwresetemail(inputs)
	if (locale === "es") return es_sentpwresetemail(inputs)
	return "sentPWResetEmail"
};
export { sentpwresetemail as "sentPWResetEmail" }