import { runCLI } from "pontx/sdk-cli";
import {
  ACCESS_TOKEN_ENV,
  authorizePinhereRequest,
  BASE_URL_ENV,
  DEFAULT_BASE_URL,
  SESSION_COOKIE_ENV,
} from "./src/runtime";

export default runCLI({
  name: "pontx-pinhere",
  executeApi: {
    baseURL: process.env[BASE_URL_ENV] ?? DEFAULT_BASE_URL,
    previewSensitiveFields: [
      "attributes",
      "base64",
      "code",
      "codeVerifier",
      "completionSummary",
      "description",
      "dom",
      "lastError",
      "outerHTML",
      "pageUrl",
      "payload",
      "reason",
      "redirectUri",
      "redirectUrl",
      "responseBody",
      "summary",
      "text",
      "title",
    ],
    beforeRequest: (request) => request.meta.apiName === "exchangeOAuthToken"
      ? request
      : ({
          ...request,
          init: authorizePinhereRequest(request.init, {
            accessToken: process.env[ACCESS_TOKEN_ENV],
            sessionCookie: process.env[SESSION_COOKIE_ENV],
          }),
        }),
  },
});
