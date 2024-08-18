// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/vitest';
import { configure } from '@testing-library/dom';
import { vi } from 'vitest';

configure({ asyncUtilTimeout: 5000 }); // Set global timeout to 5 seconds

vi.mock('@lottiefiles/react-lottie-player', () => ({
    Player: () => null,
}));
