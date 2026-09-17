/**
 * Pull the origin name out of a ticket's `class` attribute.
 *
 * Origin names contain spaces, so `origin-logo-Bari Pizza` lands in the DOM as two separate
 * class tokens -- which is why selectors build it as `.origin-logo-Bari.Pizza` and why the
 * dots get turned back into spaces here.
 *
 * Matching greedily to the end of the attribute used to be safe, because the old Lottie
 * wrapper rendered `lottie-round ${className}` and left the origin class last. MUI's Avatar
 * appends its own generated classes after the caller's, so the capture started swallowing
 * `css-1abc-MuiAvatar-root`. Drop the framework-generated tokens before matching.
 */
export const parseOriginName = (classAttribute: string | null | undefined) => {
    const ownTokens = (classAttribute ?? '')
        .split(/\s+/)
        .filter((token) => token && !token.startsWith('css-') && !token.startsWith('Mui'));

    return ownTokens
        .join(' ')
        .match(/origin-logo-(.*)/)?.[1]
        ?.replace(/\./g, ' ')
        .trim();
};
