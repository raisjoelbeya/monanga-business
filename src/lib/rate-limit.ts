import { NextRequest } from "next/server";
import { LRUCache } from "lru-cache";
import { logger } from "./logger";

type Options = {
    maxRequests?: number;
    timeWindow?: number;
    getKey?: (req: NextRequest) => string | Promise<string>;
};

const requestCache = new LRUCache<string, number>({
    max: 10_000,
    ttl: 60 * 60 * 1000, // 1h max
});

export const rateLimit = (options: Options = {}) => {
    const {
        maxRequests = 5,
        timeWindow = 60_000,
        getKey = (req) => {
            const forwarded = req.headers.get("x-forwarded-for");
            return forwarded ? forwarded.split(",")[0] : "unknown";
        },
    } = options;

    return async (req: NextRequest) => {
        const key = `rate-limit:${await getKey(req)}`;
        const current = requestCache.get(key) || 0;

        if (current >= maxRequests) {
            logger?.warn?.("Rate limit exceeded", {
                key,
                current,
                max: maxRequests,
                path: req.nextUrl.pathname,
                method: req.method,
            });

            return new Response(
                JSON.stringify({
                    error: "Trop de requêtes. Veuillez réessayer plus tard.",
                    retryAfter: Math.ceil(timeWindow / 1000),
                }),
                {
                    status: 429,
                    headers: {
                        "Content-Type": "application/json",
                        "Retry-After": Math.ceil(timeWindow / 1000).toString(),
                        "X-RateLimit-Limit": maxRequests.toString(),
                        "X-RateLimit-Remaining": "0",
                        "X-RateLimit-Reset": (Date.now() + timeWindow).toString(),
                    },
                }
            );
        }

        requestCache.set(key, current + 1, { ttl: timeWindow });

        const response = new Response();
        response.headers.set("X-RateLimit-Limit", maxRequests.toString());
        response.headers.set(
            "X-RateLimit-Remaining",
            (maxRequests - current - 1).toString()
        );
        response.headers.set("X-RateLimit-Reset", (Date.now() + timeWindow).toString());

        return response;
    };
};

export const authRateLimit = rateLimit({
    maxRequests: 10,
    timeWindow: 60 * 1000,
    getKey: async (req) => {
        if (req.nextUrl.pathname.includes("/api/auth/")) {
            try {
                if (req.method === "POST") {
                    const body = await req.json();
                    if (body?.email) return `auth:${body.email}`;
                }
            } catch {
                // fallback
            }
        }
        const forwarded = req.headers.get("x-forwarded-for");
        return forwarded ? forwarded.split(",")[0] : "unknown";
    },
});

export const apiRateLimit = rateLimit({
    maxRequests: 100,
    timeWindow: 60 * 1000,
});

export const sensitiveActionRateLimit = rateLimit({
    maxRequests: 3,
    timeWindow: 60 * 60 * 1000,
});

export const isRateLimited = (
    key: string,
    max: number,
    windowMs: number
): boolean => {
    const cacheKey = `custom:${key}`;
    const current = requestCache.get(cacheKey) || 0;

    if (current >= max) return true;

    requestCache.set(cacheKey, current + 1, { ttl: windowMs });
    return false;
};

export const resetRateLimit = (key: string): void => {
    requestCache.delete(`custom:${key}`);
};
