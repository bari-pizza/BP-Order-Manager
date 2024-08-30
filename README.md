# Adding Vitest

Installation

```shell
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

vite.config.ts

```typescript
/// <reference types="vitest" />
/// <reference types="vite/client" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './vitest.setup.ts', // Optional setup file
    },
});
```

Package.json

```json
"scripts": {
  "test": "vitest"
},
```

tsconfig.json

```json
{
    "files": [],
    "references": [{ "path": "./tsconfig.app.json" }, { "path": "./tsconfig.node.json" }],
    "compilerOptions": {
        "types": ["jest", "node", "testing-library__jest-dom"]
    }
}
```

vitest.setup.ts

```typescript
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/vitest';
import { configure } from '@testing-library/dom';

configure({ asyncUtilTimeout: 5000 }); // Set global timeout to 5 seconds
```

Create tests in /src/tests directory. Should end with test.tsx.

### Links

[Conditional Typing in TS](https://dev.to/maissenayed/conditional-react-props-with-typescript-43lg)

[Turn text into png/svg](https://maketext.io/)
