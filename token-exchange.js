import { z } from "zod";
import {
  AccessTokenErrorResponse,
  AccessTokenSuccessResponse,
  GrantType,
  TokenType,
} from "./oauth-2.0.js";

/**
 * Exchange the given `accessToken` for another from the given `tokenEndpoint`
 * using the given `clientId`.
 *
 * @param {string} accessToken
 * @param {string} clientId
 * @param {string} tokenEndpoint
 * @param {AbortSignal} [abortSignal]
 * @returns {Promise<AccessTokenResponse>}
 * @see {@link https://www.rfc-editor.org/rfc/rfc8693.html RFC 8693}
 */
export async function exchangeToken(
  accessToken,
  clientId,
  tokenEndpoint,
  abortSignal
) {
  const tokenExchangeRequestBody = new URLSearchParams();
  tokenExchangeRequestBody.set("client_id", clientId);
  tokenExchangeRequestBody.set("grant_type", GrantType.TokenExchange);
  tokenExchangeRequestBody.set("subject_token", accessToken);
  tokenExchangeRequestBody.set("subject_token_type", TokenType.AccessToken);

  const response = await fetch(tokenEndpoint, {
    body: tokenExchangeRequestBody.toString(),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
    signal: abortSignal,
  });

  if (response.status >= 400 && response.status < 500) {
    // TODO: Use a success response for token exchange instead of generic access token success
    return err(AccessTokenErrorResponse.parse(await response.json()));
  }

  if (response.status >= 200 && response.status < 300) {
    // TODO: Use an error response for token exchange instead of generic access token error
    return ok(AccessTokenSuccessResponse.parse(await response.json()));
  }

  throw response.statusText;
}

/**
 * Create a schema for the union of a success value and error value as a result.
 *
 * @template {z.ZodTypeAny} SuccessResult
 * @template {z.ZodTypeAny} ErrorResult
 * @param {SuccessResult} successSchema
 * @param {ErrorResult} errorSchema
 */
function result(successSchema, errorSchema) {
  return z.union([
    z.object({
      success: z.literal(true),
      value: successSchema,
    }),
    z.object({
      success: z.literal(false),
      value: errorSchema,
    }),
  ]);
}

/**
 * @template A
 * @param {A} value
 * @returns {{ success: true, value: A }}
 */
function ok(value) {
  return { success: true, value };
}

/**
 * @template E
 * @param {E} value
 * @returns {{ success: false, value: E }}
 */
function err(value) {
  return { success: false, value };
}

export const AccessTokenResponse = result(
  AccessTokenSuccessResponse,
  AccessTokenErrorResponse
);
/** @typedef {z.infer<typeof AccessTokenResponse>} AccessTokenResponse */
