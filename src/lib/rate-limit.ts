/**
 * Simple in-memory rate limiter using sliding window algorithm.
 *
 * ⚠️ WARNING: This implementation uses in-memory storage only.
 * In production multi-instance/serverless deployments, this is INEFFECTIVE
 * because each cold start creates a new Map instance.
 * Replace with Redis/Upstash rate limiting for production use.
 *
 * When RATE_LIMIT_DISABLED=true, all requests are allowed (for dev/testing).
 */

interface RateLimitEntry {
  tokens: number;
  lastRefill: number;
}

interface RateLimitConfig {
  /** Maximum requests per window */
  maxRequests: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

const store = new Map<string, RateLimitEntry>();

/** Track last cleanup time to avoid running cleanup on every request */
let lastCleanup = Date.now();
const CLEANUP_INTERVAL_MS = 300_000; // 5 minutes

/**
 * Lazy cleanup: remove stale entries when enough time has passed.
 * Replaces the never-cleared setInterval from the previous implementation.
 */
function cleanupStaleEntries(): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [key, entry] of store.entries()) {
    if (now - entry.lastRefill > 60_000) {
      store.delete(key);
    }
  }
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  retryAfterMs?: number;
}

/**
 * Check rate limit for a given identifier (IP, email, etc.)
 */
export async function rateLimit(
  identifier: string | null,
  config: RateLimitConfig,
): Promise<RateLimitResult> {
  // If no identifier could be determined, skip rate limiting
  // rather than grouping all unknown requests under a shared key.
  if (!identifier) {
    console.warn(
      "[RateLimit] No identifier provided. Skipping rate limiting. " +
      "Ensure your reverse proxy sends x-forwarded-for headers."
    );
    return { success: true, remaining: config.maxRequests };
  }

  // Perform lazy cleanup
  cleanupStaleEntries();

  const now = Date.now();
  const key = `ratelimit:${identifier}`;
  const entry = store.get(key);

  if (!entry) {
    store.set(key, {
      tokens: config.maxRequests - 1,
      lastRefill: now,
    });
    return { success: true, remaining: config.maxRequests - 1 };
  }

  // Refill tokens based on elapsed time
  const elapsed = now - entry.lastRefill;
  const refillRate = config.maxRequests / config.windowMs;
  const refill = elapsed * refillRate;
  entry.tokens = Math.min(config.maxRequests, entry.tokens + refill);
  entry.lastRefill = now;

  if (entry.tokens < 1) {
    const retryAfterMs = Math.ceil((1 - entry.tokens) / refillRate);
    return { success: false, remaining: 0, retryAfterMs };
  }

  entry.tokens -= 1;
  store.set(key, entry);
  return { success: true, remaining: Math.floor(entry.tokens) };
}

/**
 * Extract client IP from request headers.
 * Works with Vercel, Cloudflare, and generic proxies.
 *
 * Returns null when no IP can be determined, rather than falling back
 * to a shared IP like 127.0.0.1 (which would group all unknown-origin
 * requests under the same rate limit key — a DoS vector).
 *
 * NOTE: In production, ensure your reverse proxy is configured to
 * overwrite x-forwarded-for. Set TRUST_PROXY env var if behind a trusted proxy.
 */
export function getClientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    request.headers.get("cf-connecting-ip") ??
    null;

  if (!forwarded) {
    console.warn(
      "[RateLimit] No proxy headers found. Unable to determine client IP. " +
      "Rate limiting will be skipped for this request. " +
      "Set TRUST_PROXY env var if behind a trusted proxy."
    );
    return null;
  }

  return forwarded;
}
