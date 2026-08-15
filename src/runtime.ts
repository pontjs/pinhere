export const DEFAULT_BASE_URL = "https://pinhere.dev/api/v1";
export const ACCESS_TOKEN_ENV = "PINHERE_ACCESS_TOKEN";
export const SESSION_COOKIE_ENV = "PINHERE_SESSION_COOKIE";
export const BASE_URL_ENV = "PINHERE_BASE_URL";

const runtimeEnv: Record<string, string | undefined> =
  typeof process === "undefined" ? {} : process.env;

export type PinhereRequestOptions = {
  accessToken?: string;
  sessionCookie?: string;
  baseUrl?: string;
  fetchImpl?: typeof fetch;
};

export class PinhereHttpError extends Error {
  readonly status: number;
  readonly responseBody: unknown;

  constructor(status: number, responseBody: unknown) {
    super(`Pinhere request failed with HTTP ${status}.`);
    this.name = "PinhereHttpError";
    this.status = status;
    this.responseBody = responseBody;
  }
}

function clean(value: string | undefined) {
  const result = value?.trim();
  return result || undefined;
}

export function resolvePinhereCredentialHeaders(options: PinhereRequestOptions = {}) {
  const accessToken = clean(options.accessToken ?? runtimeEnv[ACCESS_TOKEN_ENV]);
  const sessionCookie = clean(options.sessionCookie ?? runtimeEnv[SESSION_COOKIE_ENV]);
  if (accessToken && sessionCookie) {
    throw new Error(`Set only one of ${ACCESS_TOKEN_ENV} and ${SESSION_COOKIE_ENV}.`);
  }
  if (!accessToken && !sessionCookie) {
    throw new Error(`${ACCESS_TOKEN_ENV} or ${SESSION_COOKIE_ENV} is required to call Pinhere.`);
  }
  return accessToken
    ? { Authorization: `Bearer ${accessToken}` }
    : { Cookie: sessionCookie! };
}

export function authorizePinhereRequest(init: RequestInit, options: PinhereRequestOptions = {}) {
  const headers = new Headers(init.headers);
  for (const [name, value] of Object.entries(resolvePinhereCredentialHeaders(options))) {
    headers.set(name, value);
  }
  return { ...init, headers };
}

function isOAuthTokenExchange(url: URL) {
  return url.pathname.endsWith("/oauth/token");
}

async function decode(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";
  let value: unknown;
  if (contentType.includes("json")) value = await response.json();
  else if (contentType.startsWith("image/")) value = await response.blob();
  else value = await response.text();
  if (!response.ok) throw new PinhereHttpError(response.status, value);
  return value;
}

export async function requestPinhere(
  input: string,
  init: RequestInit,
  options: PinhereRequestOptions = {},
) {
  const baseUrl = options.baseUrl ?? runtimeEnv[BASE_URL_ENV] ?? DEFAULT_BASE_URL;
  const url = new URL(input, baseUrl);
  const fetchImpl = options.fetchImpl ?? fetch;
  const authorizedInit = isOAuthTokenExchange(url)
    ? init
    : authorizePinhereRequest(init, options);
  return decode(await fetchImpl(url, authorizedInit));
}
