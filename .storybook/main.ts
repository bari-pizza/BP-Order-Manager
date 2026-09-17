import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
    // No .mdx glob: the docs addon that compiles MDX is not installed, so Vite tries to parse
    // src/stories/Configure.mdx as JS and throws an error overlay over every story.
    stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: [
        '@storybook/addon-onboarding',
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@chromatic-com/storybook',
        '@storybook/addon-interactions',
        'storybook-addon-remix-react-router',
        '@storybook/addon-a11y',
    ],
    framework: {
        name: '@storybook/react-vite',
        options: {},
    },
};
export default config;
