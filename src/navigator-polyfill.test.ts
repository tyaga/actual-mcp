import { describe, expect, it } from 'vitest';
import './navigator-polyfill.js';

describe('navigator-polyfill', () => {
  it('defines navigator.platform so Actual API bundle can load in Node', () => {
    expect(globalThis.navigator).toBeDefined();
    expect(globalThis.navigator.platform).toBe(process.platform === 'win32' ? 'Win32' : 'MacIntel');
  });
});
