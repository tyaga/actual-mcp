/**
 * @actual-app/api ships a browser-oriented bundle that reads `navigator` at module load.
 * Node.js does not define `navigator`; install a minimal stub before importing that package.
 */
if (typeof globalThis.navigator === 'undefined') {
  const platform = process.platform === 'win32' ? 'Win32' : 'MacIntel';
  Object.defineProperty(globalThis, 'navigator', {
    value: { platform },
    configurable: true,
    enumerable: true,
    writable: false,
  });
}

export {};
