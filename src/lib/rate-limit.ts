/**
 * Simple in-memory rate limiter using sliding window algorithm.
 *
 * For production multi-instance deployments, replace with
 * Redis/Upstash rate limiting.
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

// Clean up stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now - entry.lastRefill > 60_000) {
      store.delete(key);
    }
  }
}, 300_000);

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  retryAfterMs?: number;
}

/**
 * Check rate limit for a given identifier (IP, email, etc.)
 */
export async function rateLimit(
  identifier: string,
  config: RateLimitConfig,
): Promise<RateLimitResult> {
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
 */
export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "127.0.0.1"
  );
}
