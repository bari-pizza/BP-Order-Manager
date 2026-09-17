import { addons } from 'storybook/manager-api';

// Open the bottom addon panel on Controls by default so prop knobs aren't hidden.
addons.setConfig({
    showPanel: true,
    panelPosition: 'bottom',
    selectedPanel: 'storybook/controls/panel',
});
