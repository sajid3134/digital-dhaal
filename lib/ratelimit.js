// Fixed-window in-memory rate limiter. Fine for a single-process deployment;
// swap for Redis if this ever runs on more than one instance.

const buckets = new Map();

export function rateLimit(key, limit, windowMs) {
  const nowMs = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || nowMs > bucket.reset) {
    buckets.set(key, { count: 1, reset: nowMs + windowMs });
    return true;
  }
  if (bucket.count >= limit) return false;
  bucket.count += 1;
  return true;
}

export function getClientIp(request) {
  const fwd = request.headers.get("x-forwarded-for");
  return fwd ? fwd.split(",")[0].trim() : "local";
}

// Periodically drop expired buckets so the map can't grow forever.
setInterval(() => {
  const nowMs = Date.now();
  for (const [key, bucket] of buckets) {
    if (nowMs > bucket.reset) buckets.delete(key);
  }
}, 60_000).unref?.();
