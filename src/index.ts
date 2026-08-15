import { createGracefulClient } from "@pontx/sdk";
import type { APIs } from "./apis/pinhere/apis";
import { specMeta } from "./apis/pinhere/apiMeta";
import {
  DEFAULT_BASE_URL,
  requestPinhere,
  type PinhereRequestOptions,
} from "./runtime";

export type PinhereClientOptions = PinhereRequestOptions;
export type PinhereClient = APIs;

export function createPinhereClient(options: PinhereClientOptions = {}): PinhereClient {
  return createGracefulClient<APIs>({
    pontxSpecMeta: specMeta as never,
    baseUrl: options.baseUrl ?? DEFAULT_BASE_URL,
    baseRequestFn: (url, init) => requestPinhere(url, init, options),
  }) as unknown as PinhereClient;
}

const pinhereClient = createPinhereClient();

export { PinhereHttpError } from "./runtime";
export type { APIs } from "./apis/pinhere/apis";
export * as schemas from "./apis/pinhere/schemas";
export { pinhereClient };
export default pinhereClient;
