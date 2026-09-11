/**
 * App identity for the reference backend: an OAuth application with
 * "client credentials" enabled. Tokens obtained with the client_credentials
 * grant are *app actor* tokens, so every issue is created by the application
 * (the name and icon set on the Linear app), not by a person. No browser
 * consent, no refresh token to persist: a token lasts 30 days and a new one is
 * requested when the cached one is missing or close to expiry.
 */

const TOKEN_URL = "https://api.linear.app/oauth/token";
/** Request a new token this long before the cached one expires. */
const RENEW_MARGIN_MS = 60 * 60 * 1000;

export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
}

interface CachedToken {
  accessToken: string;
  /** Epoch ms. */
  expiresAt: number;
}

interface TokenResponse {
  access_token?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
}

let cached: CachedToken | null = null;
let pending: Promise<CachedToken> | null = null;

async function requestToken(cfg: OAuthConfig): Promise<CachedToken> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      scope: "read,write",
      client_id: cfg.clientId,
      client_secret: cfg.clientSecret,
    }),
  });
  const json = (await res.json()) as TokenResponse;
  if (!res.ok || !json.access_token || !json.expires_in) {
    throw new Error(`Linear client_credentials failed: ${json.error_description ?? json.error ?? res.status}`);
  }
  return { accessToken: json.access_token, expiresAt: Date.now() + json.expires_in * 1000 };
}

/** A valid app-actor access token; concurrent callers share one request. */
export async function accessToken(cfg: OAuthConfig): Promise<string> {
  if (cached && cached.expiresAt - Date.now() > RENEW_MARGIN_MS) return cached.accessToken;
  if (!pending) {
    pending = requestToken(cfg)
      .then((token) => (cached = token))
      .finally(() => {
        pending = null;
      });
  }
  return (await pending).accessToken;
}
