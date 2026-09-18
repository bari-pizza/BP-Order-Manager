/** Shared device frames for Storybook (toolbar viewport + Home Controls). */
export const shopViewports = {
    iphoneSe: {
        name: 'iPhone SE',
        styles: { width: '375px', height: '667px' },
        type: 'mobile' as const,
    },
    iphone13: {
        name: 'iPhone 13',
        styles: { width: '390px', height: '844px' },
        type: 'mobile' as const,
    },
    iphone13ProMax: {
        name: 'iPhone 13 Pro Max',
        styles: { width: '428px', height: '926px' },
        type: 'mobile' as const,
    },
    pixel5: {
        name: 'Pixel 5',
        styles: { width: '393px', height: '851px' },
        type: 'mobile' as const,
    },
    ipadMini: {
        name: 'iPad Mini',
        styles: { width: '768px', height: '1024px' },
        type: 'tablet' as const,
    },
    laptop: {
        name: 'Laptop',
        styles: { width: '1366px', height: '768px' },
        type: 'desktop' as const,
    },
    wide: {
        name: 'Wide desktop',
        styles: { width: '1440px', height: '900px' },
        type: 'desktop' as const,
    },
} as const;

export type ShopViewportKey = keyof typeof shopViewports;
