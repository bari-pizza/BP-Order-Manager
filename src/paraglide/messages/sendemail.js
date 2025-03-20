// eslint-disable
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_sendemail = /** @type {(inputs: {}) => string} */ () => {
	return `send email`
};

const pt_sendemail = /** @type {(inputs: {}) => string} */ () => {
	return `enviar correio electronico`
};

const es_sendemail = /** @type {(inputs: {}) => string} */ () => {
	return `enviar correo electronico`
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
const sendemail = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.sendemail(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("sendemail", locale)
	if (locale === "en") return en_sendemail(inputs)
	if (locale === "pt") return pt_sendemail(inputs)
	if (locale === "es") return es_sendemail(inputs)
	return "sendEmail"
};
export { sendemail as "sendEmail" }