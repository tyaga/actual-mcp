import { afterEach, describe, expect, it, vi } from 'vitest';
import { logCallToolReceived, logCallToolThrew } from './mcp-diagnostics.js';

describe('mcp-diagnostics', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('logCallToolReceived marks that the host reached this process', () => {
    const spy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
    logCallToolReceived('get-accounts');
    expect(spy.mock.calls[0][0]).toContain('[actual-mcp]');
    expect(spy.mock.calls[0][0]).toContain('CallTool received: get-accounts');
    expect(spy.mock.calls[0][0]).toContain('host reached this MCP server process');
  });

  it('logCallToolThrew prints cause chain', () => {
    const spy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
    const root = new Error('root');
    const wrapped = new Error('wrapped');
    wrapped.cause = root;
    logCallToolThrew('get-accounts', wrapped);
    const combined = spy.mock.calls.map((c) => String(c[0])).join('\n');
    expect(combined).toContain('wrapped');
    expect(combined).toContain('caused by:');
    expect(combined).toContain('root');
  });

  it('logCallToolThrew handles non-Error throws', () => {
    const spy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
    logCallToolThrew('x', 'string failure');
    expect(spy.mock.calls.some((c) => String(c[0]).includes('string failure'))).toBe(true);
  });
});
