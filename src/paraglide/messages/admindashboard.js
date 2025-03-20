// eslint-disable
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const en_admindashboard = /** @type {(inputs: {}) => string} */ () => {
	return `admin dashboard`
};

const pt_admindashboard = /** @type {(inputs: {}) => string} */ () => {
	return `painel de administração`
};

const es_admindashboard = /** @type {(inputs: {}) => string} */ () => {
	return `pandel de administración`
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
const admindashboard = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.admindashboard(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("admindashboard", locale)
	if (locale === "en") return en_admindashboard(inputs)
	if (locale === "pt") return pt_admindashboard(inputs)
	if (locale === "es") return es_admindashboard(inputs)
	return "adminDashboard"
};
export { admindashboard as "adminDashboard" }