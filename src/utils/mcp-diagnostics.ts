// ----------------------------
// MCP STDERR DIAGNOSTICS
// ----------------------------

/**
 * Log lines use a fixed prefix so users can grep process output (stdio or HTTP server stderr).
 *
 * # Reason: Cursor sometimes fails before JSON-RPC reaches this process (e.g.
 * "Authentication failed: too-many-requests"). If "CallTool received" never appears,
 * the failure is on the MCP host/client side, not in this server or Actual API.
 */

const PREFIX = '[actual-mcp]';

function formatErrorChain(err: unknown): string {
  if (!(err instanceof Error)) {
    return String(err);
  }
  const parts: string[] = [`${err.name}: ${err.message}`];
  let cause: unknown = err.cause;
  let depth = 0;
  while (cause instanceof Error && depth < 8) {
    parts.push(`caused by: ${cause.name}: ${cause.message}`);
    cause = cause.cause;
    depth += 1;
  }
  return parts.join(' | ');
}

/**
 * Call at the start of tools/call handling — proves the host delivered the RPC to this process.
 */
export function logCallToolReceived(toolName: string): void {
  process.stderr.write(
    `${PREFIX} CallTool received: ${toolName} (host reached this MCP server process)\n`
  );
}

/**
 * Call after the tool handler returns (success or MCP-level error object, no throw).
 */
export function logCallToolHandlerReturned(toolName: string, isErrorResult: boolean): void {
  process.stderr.write(
    `${PREFIX} CallTool handler returned: ${toolName} isError=${isErrorResult}\n`
  );
}

/**
 * Call when the outer handler catches a thrown value (init, bugs, etc.).
 */
export function logCallToolThrew(toolName: string, err: unknown): void {
  process.stderr.write(`${PREFIX} CallTool threw: ${toolName}: ${formatErrorChain(err)}\n`);
  if (err instanceof Error && err.stack) {
    process.stderr.write(`${err.stack}\n`);
  }
}
