// vite.config.ts
import { paraglideVitePlugin } from "file:///C:/Users/ccata/OneDrive/Bari%20Pizza%20Order%20Manger/node_modules/@inlang/paraglide-js/dist/index.js";
import { defineConfig } from "file:///C:/Users/ccata/OneDrive/Bari%20Pizza%20Order%20Manger/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/ccata/OneDrive/Bari%20Pizza%20Order%20Manger/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { qrcode } from "file:///C:/Users/ccata/OneDrive/Bari%20Pizza%20Order%20Manger/node_modules/vite-plugin-qrcode/dist/index.js";
import { VitePWA } from "file:///C:/Users/ccata/OneDrive/Bari%20Pizza%20Order%20Manger/node_modules/vite-plugin-pwa/dist/index.js";
import replace from "file:///C:/Users/ccata/OneDrive/Bari%20Pizza%20Order%20Manger/node_modules/@rollup/plugin-replace/dist/es/index.js";

// package.json
var package_default = {
  name: "bari-pizza-order-manger",
  private: true,
  version: "0.0.11",
  type: "module",
  scripts: {
    dev: "vite --host",
    test: "vitest",
    generate: "npx @inlang/paraglide-js compile --project ./project.inlang --outdir ./src/paraglide",
    build: "tsc -b && vite build",
    check: "tsc -b",
    serve: "npx serve -s dist",
    start: "vite preview",
    lint: "eslint . && tsc -b",
    preview: "vite preview",
    storybook: "storybook dev -p 6006",
    "build-storybook": "storybook build",
    chromatic: "npx chromatic --project-token=chpt_e20b10a74740ccf",
    "machine-translate": "inlang machine translate --project project.inlang"
  },
  dependencies: {
    "@emotion/react": "^11.13.0",
    "@emotion/styled": "^11.13.0",
    "@hookform/resolvers": "^3.9.0",
    "@lottiefiles/react-lottie-player": "^3.5.4",
    "@mui/base": "^5.0.0-beta.40",
    "@mui/icons-material": "^5.16.7",
    "@mui/material": "^5.16.7",
    "@mui/utils": "^6.0.1",
    "@mui/x-charts": "^7.15.0",
    "@mui/x-data-grid": "^7.15.0",
    "@mui/x-date-pickers": "^7.13.0",
    "@supabase/auth-ui-react": "^0.4.7",
    "@supabase/supabase-js": "^2.45.1",
    "@tanstack/react-query": "^5.51.23",
    "@tanstack/react-query-devtools": "^5.51.23",
    "@uidotdev/usehooks": "^2.4.1",
    dayjs: "^1.11.12",
    "framer-motion": "^11.5.4",
    "lottie-web": "^5.12.2",
    mockdate: "^3.0.5",
    react: "^18.3.1",
    "react-currency-input-field": "^3.8.0",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.52.2",
    "react-hook-mask": "^1.1.18",
    "react-joyride": "^2.9.3",
    "react-router-dom": "^6.28.0",
    "react-shepherd": "^6.1.8",
    "react-toastify": "^10.0.5",
    "react-transition-group": "^4.4.5",
    "usehooks-ts": "^3.1.0",
    zod: "^3.23.8"
  },
  devDependencies: {
    "@chromatic-com/storybook": "^1.7.0",
    "@eslint/js": "^9.8.0",
    "@faker-js/faker": "^8.4.1",
    "@inlang/cli": "^3.0.0",
    "@inlang/paraglide-js": "^2.0.0",
    "@playwright/test": "^1.48.1",
    "@rollup/plugin-replace": "^6.0.2",
    "@storybook/addon-a11y": "^8.2.9",
    "@storybook/addon-essentials": "^8.2.9",
    "@storybook/addon-interactions": "^8.2.9",
    "@storybook/addon-links": "^8.2.9",
    "@storybook/addon-onboarding": "^8.2.9",
    "@storybook/blocks": "^8.2.9",
    "@storybook/react": "^8.2.9",
    "@storybook/react-vite": "^8.2.9",
    "@storybook/test": "^8.2.9",
    "@tanstack/eslint-plugin-query": "^5.51.15",
    "@testing-library/jest-dom": "^6.4.8",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    chromatic: "^11.7.1",
    eslint: "^9.8.0",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.9",
    "eslint-plugin-storybook": "^0.8.0",
    globals: "^15.9.0",
    jsdom: "^24.1.1",
    "react-dialect": "^0.6.0",
    storybook: "^8.2.9",
    "storybook-addon-remix-react-router": "^3.0.0",
    "storybook-react-context": "^0.6.0",
    supabase: "^1.226.4",
    typescript: "^5.5.4",
    "typescript-eslint": "^8.0.0",
    vite: "^5.4.0",
    "vite-plugin-pwa": "^0.21.0",
    "vite-plugin-qrcode": "^0.2.3",
    "vite-tsconfig-paths": "^5.0.1",
    vitest: "^2.0.5"
  },
  optionalDependencies: {
    "@rollup/rollup-linux-x64-gnu": "4.9.5"
  }
};

// vite.config.ts
var vite_config_default = defineConfig({
  optimizeDeps: {
    include: ["@emotion/styled", "@emotion/react", "@mui/material/Tooltip"]
    // https://stackoverflow.com/questions/72097831/popper-styled-default-is-not-a-function-mui-5-6-0-material-ui
  },
  plugins: [
    paraglideVitePlugin({ project: "./project.inlang", outdir: "./src/paraglide" }),
    react(),
    replace({
      __APP_VERSION__: JSON.stringify(package_default.version)
    }),
    qrcode(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Bari Pizza Order Manager",
        short_name: "BP Order Manager",
        description: "Allows workers to manage orders on a daily basis",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/assets/icons/BP logo 192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/assets/icons/BP logo 512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ],
        screenshots: [
          {
            src: "/assets/screenshots/screenshot-wide-1280.png",
            sizes: "1280x720",
            type: "image/png",
            form_factor: "wide"
          },
          {
            src: "/assets/screenshots/screenshot-mobile-720.png",
            sizes: "720x1280",
            type: "image/png",
            form_factor: "narrow"
          }
        ]
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 5e6,
        // 5MB limit
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"]
      }
    })
  ]
  // test: {
  // only for vitest: https://stackoverflow.com/questions/72146352/vitest-defineconfig-test-does-not-exist-in-type-userconfigexport
  //     globals: true,
  //     environment: 'jsdom',
  //     setupFiles: './vitest.setup.ts',
  // },
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicGFja2FnZS5qc29uIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcY2NhdGFcXFxcT25lRHJpdmVcXFxcQmFyaSBQaXp6YSBPcmRlciBNYW5nZXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGNjYXRhXFxcXE9uZURyaXZlXFxcXEJhcmkgUGl6emEgT3JkZXIgTWFuZ2VyXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9jY2F0YS9PbmVEcml2ZS9CYXJpJTIwUGl6emElMjBPcmRlciUyME1hbmdlci92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IHBhcmFnbGlkZVZpdGVQbHVnaW4gfSBmcm9tICdAaW5sYW5nL3BhcmFnbGlkZS1qcyc7XHJcbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwidml0ZXN0XCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJ2aXRlL2NsaWVudFwiIC8+XHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xyXG5pbXBvcnQgeyBxcmNvZGUgfSBmcm9tICd2aXRlLXBsdWdpbi1xcmNvZGUnO1xyXG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSAndml0ZS1wbHVnaW4tcHdhJztcclxuaW1wb3J0IHJlcGxhY2UgZnJvbSAnQHJvbGx1cC9wbHVnaW4tcmVwbGFjZSc7XHJcbmltcG9ydCBwYWNrYWdlSnNvbiBmcm9tICcuL3BhY2thZ2UuanNvbic7XHJcbi8vIGh0dHBzOi8vd3d3Lm5wbWpzLmNvbS9wYWNrYWdlL3ZpdGUtcGx1Z2luLXB3YS92LzAuOS4xXHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gICAgb3B0aW1pemVEZXBzOiB7XHJcbiAgICAgICAgaW5jbHVkZTogWydAZW1vdGlvbi9zdHlsZWQnLCAnQGVtb3Rpb24vcmVhY3QnLCAnQG11aS9tYXRlcmlhbC9Ub29sdGlwJ10sXHJcbiAgICAgICAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNzIwOTc4MzEvcG9wcGVyLXN0eWxlZC1kZWZhdWx0LWlzLW5vdC1hLWZ1bmN0aW9uLW11aS01LTYtMC1tYXRlcmlhbC11aVxyXG4gICAgfSxcclxuICAgIHBsdWdpbnM6IFtcclxuICAgICAgICBwYXJhZ2xpZGVWaXRlUGx1Z2luKHsgcHJvamVjdDogJy4vcHJvamVjdC5pbmxhbmcnLCBvdXRkaXI6ICcuL3NyYy9wYXJhZ2xpZGUnIH0pLFxyXG4gICAgICAgIHJlYWN0KCksXHJcbiAgICAgICAgcmVwbGFjZSh7XHJcbiAgICAgICAgICAgIF9fQVBQX1ZFUlNJT05fXzogSlNPTi5zdHJpbmdpZnkocGFja2FnZUpzb24udmVyc2lvbiksXHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgcXJjb2RlKCksXHJcbiAgICAgICAgVml0ZVBXQSh7XHJcbiAgICAgICAgICAgIHJlZ2lzdGVyVHlwZTogJ2F1dG9VcGRhdGUnLFxyXG4gICAgICAgICAgICBtYW5pZmVzdDoge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ0JhcmkgUGl6emEgT3JkZXIgTWFuYWdlcicsXHJcbiAgICAgICAgICAgICAgICBzaG9ydF9uYW1lOiAnQlAgT3JkZXIgTWFuYWdlcicsXHJcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0FsbG93cyB3b3JrZXJzIHRvIG1hbmFnZSBvcmRlcnMgb24gYSBkYWlseSBiYXNpcycsXHJcbiAgICAgICAgICAgICAgICB0aGVtZV9jb2xvcjogJyNmZmZmZmYnLFxyXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZF9jb2xvcjogJyNmZmZmZmYnLFxyXG4gICAgICAgICAgICAgICAgZGlzcGxheTogJ3N0YW5kYWxvbmUnLFxyXG4gICAgICAgICAgICAgICAgc3RhcnRfdXJsOiAnLycsXHJcbiAgICAgICAgICAgICAgICBpY29uczogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3JjOiAnL2Fzc2V0cy9pY29ucy9CUCBsb2dvIDE5Mi5wbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaXplczogJzE5MngxOTInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3JjOiAnL2Fzc2V0cy9pY29ucy9CUCBsb2dvIDUxMi5wbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaXplczogJzUxMng1MTInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIHNjcmVlbnNob3RzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzcmM6ICcvYXNzZXRzL3NjcmVlbnNob3RzL3NjcmVlbnNob3Qtd2lkZS0xMjgwLnBuZycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpemVzOiAnMTI4MHg3MjAnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybV9mYWN0b3I6ICd3aWRlJyxcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3JjOiAnL2Fzc2V0cy9zY3JlZW5zaG90cy9zY3JlZW5zaG90LW1vYmlsZS03MjAucG5nJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZXM6ICc3MjB4MTI4MCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtX2ZhY3RvcjogJ25hcnJvdycsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHdvcmtib3g6IHtcclxuICAgICAgICAgICAgICAgIG1heGltdW1GaWxlU2l6ZVRvQ2FjaGVJbkJ5dGVzOiA1MDAwMDAwLCAvLyA1TUIgbGltaXRcclxuICAgICAgICAgICAgICAgIGdsb2JQYXR0ZXJuczogWycqKi8qLntqcyxjc3MsaHRtbCxpY28scG5nLHN2Z30nXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KSxcclxuICAgIF0sXHJcbiAgICAvLyB0ZXN0OiB7XHJcbiAgICAvLyBvbmx5IGZvciB2aXRlc3Q6IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzcyMTQ2MzUyL3ZpdGVzdC1kZWZpbmVjb25maWctdGVzdC1kb2VzLW5vdC1leGlzdC1pbi10eXBlLXVzZXJjb25maWdleHBvcnRcclxuICAgIC8vICAgICBnbG9iYWxzOiB0cnVlLFxyXG4gICAgLy8gICAgIGVudmlyb25tZW50OiAnanNkb20nLFxyXG4gICAgLy8gICAgIHNldHVwRmlsZXM6ICcuL3ZpdGVzdC5zZXR1cC50cycsXHJcbiAgICAvLyB9LFxyXG59KTtcclxuIiwgIntcbiAgICBcIm5hbWVcIjogXCJiYXJpLXBpenphLW9yZGVyLW1hbmdlclwiLFxuICAgIFwicHJpdmF0ZVwiOiB0cnVlLFxuICAgIFwidmVyc2lvblwiOiBcIjAuMC4xMVwiLFxuICAgIFwidHlwZVwiOiBcIm1vZHVsZVwiLFxuICAgIFwic2NyaXB0c1wiOiB7XG4gICAgICAgIFwiZGV2XCI6IFwidml0ZSAtLWhvc3RcIixcbiAgICAgICAgXCJ0ZXN0XCI6IFwidml0ZXN0XCIsXG4gICAgICAgIFwiZ2VuZXJhdGVcIjogXCJucHggQGlubGFuZy9wYXJhZ2xpZGUtanMgY29tcGlsZSAtLXByb2plY3QgLi9wcm9qZWN0LmlubGFuZyAtLW91dGRpciAuL3NyYy9wYXJhZ2xpZGVcIixcbiAgICAgICAgXCJidWlsZFwiOiBcInRzYyAtYiAmJiB2aXRlIGJ1aWxkXCIsXG4gICAgICAgIFwiY2hlY2tcIjogXCJ0c2MgLWJcIixcbiAgICAgICAgXCJzZXJ2ZVwiOiBcIm5weCBzZXJ2ZSAtcyBkaXN0XCIsXG4gICAgICAgIFwic3RhcnRcIjogXCJ2aXRlIHByZXZpZXdcIixcbiAgICAgICAgXCJsaW50XCI6IFwiZXNsaW50IC4gJiYgdHNjIC1iXCIsXG4gICAgICAgIFwicHJldmlld1wiOiBcInZpdGUgcHJldmlld1wiLFxuICAgICAgICBcInN0b3J5Ym9va1wiOiBcInN0b3J5Ym9vayBkZXYgLXAgNjAwNlwiLFxuICAgICAgICBcImJ1aWxkLXN0b3J5Ym9va1wiOiBcInN0b3J5Ym9vayBidWlsZFwiLFxuICAgICAgICBcImNocm9tYXRpY1wiOiBcIm5weCBjaHJvbWF0aWMgLS1wcm9qZWN0LXRva2VuPWNocHRfZTIwYjEwYTc0NzQwY2NmXCIsXG4gICAgICAgIFwibWFjaGluZS10cmFuc2xhdGVcIjogXCJpbmxhbmcgbWFjaGluZSB0cmFuc2xhdGUgLS1wcm9qZWN0IHByb2plY3QuaW5sYW5nXCJcbiAgICB9LFxuICAgIFwiZGVwZW5kZW5jaWVzXCI6IHtcbiAgICAgICAgXCJAZW1vdGlvbi9yZWFjdFwiOiBcIl4xMS4xMy4wXCIsXG4gICAgICAgIFwiQGVtb3Rpb24vc3R5bGVkXCI6IFwiXjExLjEzLjBcIixcbiAgICAgICAgXCJAaG9va2Zvcm0vcmVzb2x2ZXJzXCI6IFwiXjMuOS4wXCIsXG4gICAgICAgIFwiQGxvdHRpZWZpbGVzL3JlYWN0LWxvdHRpZS1wbGF5ZXJcIjogXCJeMy41LjRcIixcbiAgICAgICAgXCJAbXVpL2Jhc2VcIjogXCJeNS4wLjAtYmV0YS40MFwiLFxuICAgICAgICBcIkBtdWkvaWNvbnMtbWF0ZXJpYWxcIjogXCJeNS4xNi43XCIsXG4gICAgICAgIFwiQG11aS9tYXRlcmlhbFwiOiBcIl41LjE2LjdcIixcbiAgICAgICAgXCJAbXVpL3V0aWxzXCI6IFwiXjYuMC4xXCIsXG4gICAgICAgIFwiQG11aS94LWNoYXJ0c1wiOiBcIl43LjE1LjBcIixcbiAgICAgICAgXCJAbXVpL3gtZGF0YS1ncmlkXCI6IFwiXjcuMTUuMFwiLFxuICAgICAgICBcIkBtdWkveC1kYXRlLXBpY2tlcnNcIjogXCJeNy4xMy4wXCIsXG4gICAgICAgIFwiQHN1cGFiYXNlL2F1dGgtdWktcmVhY3RcIjogXCJeMC40LjdcIixcbiAgICAgICAgXCJAc3VwYWJhc2Uvc3VwYWJhc2UtanNcIjogXCJeMi40NS4xXCIsXG4gICAgICAgIFwiQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5XCI6IFwiXjUuNTEuMjNcIixcbiAgICAgICAgXCJAdGFuc3RhY2svcmVhY3QtcXVlcnktZGV2dG9vbHNcIjogXCJeNS41MS4yM1wiLFxuICAgICAgICBcIkB1aWRvdGRldi91c2Vob29rc1wiOiBcIl4yLjQuMVwiLFxuICAgICAgICBcImRheWpzXCI6IFwiXjEuMTEuMTJcIixcbiAgICAgICAgXCJmcmFtZXItbW90aW9uXCI6IFwiXjExLjUuNFwiLFxuICAgICAgICBcImxvdHRpZS13ZWJcIjogXCJeNS4xMi4yXCIsXG4gICAgICAgIFwibW9ja2RhdGVcIjogXCJeMy4wLjVcIixcbiAgICAgICAgXCJyZWFjdFwiOiBcIl4xOC4zLjFcIixcbiAgICAgICAgXCJyZWFjdC1jdXJyZW5jeS1pbnB1dC1maWVsZFwiOiBcIl4zLjguMFwiLFxuICAgICAgICBcInJlYWN0LWRvbVwiOiBcIl4xOC4zLjFcIixcbiAgICAgICAgXCJyZWFjdC1ob29rLWZvcm1cIjogXCJeNy41Mi4yXCIsXG4gICAgICAgIFwicmVhY3QtaG9vay1tYXNrXCI6IFwiXjEuMS4xOFwiLFxuICAgICAgICBcInJlYWN0LWpveXJpZGVcIjogXCJeMi45LjNcIixcbiAgICAgICAgXCJyZWFjdC1yb3V0ZXItZG9tXCI6IFwiXjYuMjguMFwiLFxuICAgICAgICBcInJlYWN0LXNoZXBoZXJkXCI6IFwiXjYuMS44XCIsXG4gICAgICAgIFwicmVhY3QtdG9hc3RpZnlcIjogXCJeMTAuMC41XCIsXG4gICAgICAgIFwicmVhY3QtdHJhbnNpdGlvbi1ncm91cFwiOiBcIl40LjQuNVwiLFxuICAgICAgICBcInVzZWhvb2tzLXRzXCI6IFwiXjMuMS4wXCIsXG4gICAgICAgIFwiem9kXCI6IFwiXjMuMjMuOFwiXG4gICAgfSxcbiAgICBcImRldkRlcGVuZGVuY2llc1wiOiB7XG4gICAgICAgIFwiQGNocm9tYXRpYy1jb20vc3Rvcnlib29rXCI6IFwiXjEuNy4wXCIsXG4gICAgICAgIFwiQGVzbGludC9qc1wiOiBcIl45LjguMFwiLFxuICAgICAgICBcIkBmYWtlci1qcy9mYWtlclwiOiBcIl44LjQuMVwiLFxuICAgICAgICBcIkBpbmxhbmcvY2xpXCI6IFwiXjMuMC4wXCIsXG4gICAgICAgIFwiQGlubGFuZy9wYXJhZ2xpZGUtanNcIjogXCJeMi4wLjBcIixcbiAgICAgICAgXCJAcGxheXdyaWdodC90ZXN0XCI6IFwiXjEuNDguMVwiLFxuICAgICAgICBcIkByb2xsdXAvcGx1Z2luLXJlcGxhY2VcIjogXCJeNi4wLjJcIixcbiAgICAgICAgXCJAc3Rvcnlib29rL2FkZG9uLWExMXlcIjogXCJeOC4yLjlcIixcbiAgICAgICAgXCJAc3Rvcnlib29rL2FkZG9uLWVzc2VudGlhbHNcIjogXCJeOC4yLjlcIixcbiAgICAgICAgXCJAc3Rvcnlib29rL2FkZG9uLWludGVyYWN0aW9uc1wiOiBcIl44LjIuOVwiLFxuICAgICAgICBcIkBzdG9yeWJvb2svYWRkb24tbGlua3NcIjogXCJeOC4yLjlcIixcbiAgICAgICAgXCJAc3Rvcnlib29rL2FkZG9uLW9uYm9hcmRpbmdcIjogXCJeOC4yLjlcIixcbiAgICAgICAgXCJAc3Rvcnlib29rL2Jsb2Nrc1wiOiBcIl44LjIuOVwiLFxuICAgICAgICBcIkBzdG9yeWJvb2svcmVhY3RcIjogXCJeOC4yLjlcIixcbiAgICAgICAgXCJAc3Rvcnlib29rL3JlYWN0LXZpdGVcIjogXCJeOC4yLjlcIixcbiAgICAgICAgXCJAc3Rvcnlib29rL3Rlc3RcIjogXCJeOC4yLjlcIixcbiAgICAgICAgXCJAdGFuc3RhY2svZXNsaW50LXBsdWdpbi1xdWVyeVwiOiBcIl41LjUxLjE1XCIsXG4gICAgICAgIFwiQHRlc3RpbmctbGlicmFyeS9qZXN0LWRvbVwiOiBcIl42LjQuOFwiLFxuICAgICAgICBcIkB0ZXN0aW5nLWxpYnJhcnkvcmVhY3RcIjogXCJeMTYuMC4wXCIsXG4gICAgICAgIFwiQHRlc3RpbmctbGlicmFyeS91c2VyLWV2ZW50XCI6IFwiXjE0LjUuMlwiLFxuICAgICAgICBcIkB0eXBlcy9yZWFjdFwiOiBcIl4xOC4zLjNcIixcbiAgICAgICAgXCJAdHlwZXMvcmVhY3QtZG9tXCI6IFwiXjE4LjMuMFwiLFxuICAgICAgICBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCI6IFwiXjQuMy4xXCIsXG4gICAgICAgIFwiY2hyb21hdGljXCI6IFwiXjExLjcuMVwiLFxuICAgICAgICBcImVzbGludFwiOiBcIl45LjguMFwiLFxuICAgICAgICBcImVzbGludC1wbHVnaW4tcmVhY3QtaG9va3NcIjogXCJeNS4xLjAtcmMuMFwiLFxuICAgICAgICBcImVzbGludC1wbHVnaW4tcmVhY3QtcmVmcmVzaFwiOiBcIl4wLjQuOVwiLFxuICAgICAgICBcImVzbGludC1wbHVnaW4tc3Rvcnlib29rXCI6IFwiXjAuOC4wXCIsXG4gICAgICAgIFwiZ2xvYmFsc1wiOiBcIl4xNS45LjBcIixcbiAgICAgICAgXCJqc2RvbVwiOiBcIl4yNC4xLjFcIixcbiAgICAgICAgXCJyZWFjdC1kaWFsZWN0XCI6IFwiXjAuNi4wXCIsXG4gICAgICAgIFwic3Rvcnlib29rXCI6IFwiXjguMi45XCIsXG4gICAgICAgIFwic3Rvcnlib29rLWFkZG9uLXJlbWl4LXJlYWN0LXJvdXRlclwiOiBcIl4zLjAuMFwiLFxuICAgICAgICBcInN0b3J5Ym9vay1yZWFjdC1jb250ZXh0XCI6IFwiXjAuNi4wXCIsXG4gICAgICAgIFwic3VwYWJhc2VcIjogXCJeMS4yMjYuNFwiLFxuICAgICAgICBcInR5cGVzY3JpcHRcIjogXCJeNS41LjRcIixcbiAgICAgICAgXCJ0eXBlc2NyaXB0LWVzbGludFwiOiBcIl44LjAuMFwiLFxuICAgICAgICBcInZpdGVcIjogXCJeNS40LjBcIixcbiAgICAgICAgXCJ2aXRlLXBsdWdpbi1wd2FcIjogXCJeMC4yMS4wXCIsXG4gICAgICAgIFwidml0ZS1wbHVnaW4tcXJjb2RlXCI6IFwiXjAuMi4zXCIsXG4gICAgICAgIFwidml0ZS10c2NvbmZpZy1wYXRoc1wiOiBcIl41LjAuMVwiLFxuICAgICAgICBcInZpdGVzdFwiOiBcIl4yLjAuNVwiXG4gICAgfSxcbiAgICBcIm9wdGlvbmFsRGVwZW5kZW5jaWVzXCI6IHtcbiAgICAgICAgXCJAcm9sbHVwL3JvbGx1cC1saW51eC14NjQtZ251XCI6IFwiNC45LjVcIlxuICAgIH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBK1UsU0FBUywyQkFBMkI7QUFHblgsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsY0FBYztBQUN2QixTQUFTLGVBQWU7QUFDeEIsT0FBTyxhQUFhOzs7QUNQcEI7QUFBQSxFQUNJLE1BQVE7QUFBQSxFQUNSLFNBQVc7QUFBQSxFQUNYLFNBQVc7QUFBQSxFQUNYLE1BQVE7QUFBQSxFQUNSLFNBQVc7QUFBQSxJQUNQLEtBQU87QUFBQSxJQUNQLE1BQVE7QUFBQSxJQUNSLFVBQVk7QUFBQSxJQUNaLE9BQVM7QUFBQSxJQUNULE9BQVM7QUFBQSxJQUNULE9B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
