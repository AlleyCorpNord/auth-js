import { z } from "zod";

export const GrantType = Object.freeze({
  /** @see {@link https://www.rfc-editor.org/rfc/rfc8628.html#section-3.4 RFC 8628 Section 3.4} */
  DeviceCode: "urn:ietf:params:oauth:grant-type:device_code",

  /** @see {@link https://www.rfc-editor.org/rfc/rfc7523.html#section-2.1 RFC 7523 Section 2.1} */
  JWTBearer: "urn:ietf:params:oauth:grant-type:jwt-bearer",

  /** @see {@link https://www.rfc-editor.org/rfc/rfc7522.html#section-2.1 RFC 7522 Section 2.1} */
  SAML2Bearer: "urn:ietf:params:oauth:grant-type:saml2-bearer",

  /** @see {@link https://datatracker.ietf.org/doc/html/rfc8693 RFC 8693} */
  TokenExchange: "urn:ietf:params:oauth:grant-type:token-exchange",
});
/** @typedef {typeof GrantType[keyof typeof GrantType]} GrantType */

/** @see {@link https://datatracker.ietf.org/doc/html/rfc8693#TokenTypeIdentifiers} */
export const TokenType = Object.freeze({
  /**
   * Indicates that the token is an OAuth 2.0 access token issued by the given
   * authorization server.
   *
   * @see {@link https://datatracker.ietf.org/doc/html/rfc8693#section-3-3.1}
   */
  AccessToken: "urn:ietf:params:oauth:token-type:access_token",

  /**
   * Indicates that the token is an ID Token as defined in Section 2 of
   * [OpenID.Core](https://openid.net/specs/openid-connect-core-1_0.html).
   *
   * @see {@link https://datatracker.ietf.org/doc/html/rfc8693#section-3-3.5}
   */
  IdToken: "urn:ietf:params:oauth:token-type:id_token",

  /**
   * JSON Web Token (JWT) is a compact, URL-safe means of representing claims to
   * be transferred between two parties.  The claims in a JWT are encoded as a
   * JSON object that is used as the payload of a JSON Web Signature (JWS)
   * structure or as the plaintext of a JSON Web Encryption (JWE) structure,
   * enabling the claims to be digitally signed or integrity protected with a
   * Message Authentication Code (MAC) and/or encrypted.
   *
   * @see {@link https://www.rfc-editor.org/rfc/rfc7519.html RFC 7519}
   */
  JWT: "urn:ietf:params:oauth:token-type:jwt",

  /**
   * Indicates that the token is an OAuth 2.0 refresh token issued by the given
   * authorization server.
   *
   * @see {@link https://datatracker.ietf.org/doc/html/rfc8693#section-3-3.3}
   */
  RefreshToken: "urn:ietf:params:oauth:token-type:refresh_token",

  /**
   * Indicates that the token is a base64url-encoded SAML 1.1
   * [OASIS.saml-core-1.1](https://www.oasis-open.org/committees/download.php/3406/oasis-sstc-saml-core-1.1.pdf)
   * assertion.
   *
   * @see {@link https://datatracker.ietf.org/doc/html/rfc8693#section-3-3.7}
   */
  SAML1: "urn:ietf:params:oauth:token-type:saml1",

  /**
   * Indicates that the token is a base64url-encoded SAML 2.0
   * [OASIS.saml-core-2.0-os](http://docs.oasis-open.org/security/saml/v2.0/saml-core-2.0-os.pdf)
   * assertion.
   *
   * @see {@link https://datatracker.ietf.org/doc/html/rfc8693#section-3-3.9}
   */
  SAML2: "urn:ietf:params:oauth:token-type:saml2"
});
/** @typedef {typeof TokenType[keyof typeof TokenType]} TokenType */

/**
 * @see {@link https://www.rfc-editor.org/rfc/rfc6749#section-5.1 RFC 6749 - Section 5.1}
 */
export const AccessTokenSuccessResponse = z
  .object({
    /**
     * @spec REQUIRED.  The access token issued by the authorization server.
     */
    access_token: z.string().trim().min(1),

    /**
     * @spec RECOMMENDED.  The lifetime in seconds of the access token.  For
     * example, the value "3600" denotes that the access token will expire in one
     * hour from the time the response was generated. If omitted, the
     * authorization server SHOULD provide the expiration time via other means or
     * document the default value.
     */
    expires_in: z.number().int().nullish(),

    /**
     * @spec OPTIONAL.  The refresh token, which can be used to obtain new access
     * tokens using the same authorization grant as described in
     * [Section 6](https://www.rfc-editor.org/rfc/rfc6749#section-6).
     */
    refresh_token: z.string().trim().min(1).nullish(),

    /**
     * @spec OPTIONAL, if identical to the scope requested by the client;
     * otherwise, REQUIRED.  The scope of the access token as described by
     * [Section 3.3](https://www.rfc-editor.org/rfc/rfc6749#section-3.3).
     */
    scope: z.string().trim().min(1).nullish(),

    /**
     * @spec REQUIRED.  The type of the token issued as described in
     * [Section 7.1](https://www.rfc-editor.org/rfc/rfc6749#section-7.1).
     * Value is case insensitive.
     */
    token_type: z.string().trim().min(1),
  })
  .passthrough();
/** @typedef {z.infer<typeof AccessTokenSuccessResponse>} AccessTokenSuccessResponse */

export const AccessTokenErrorCode = Object.freeze({
  /**
   * Client authentication failed (e.g., unknown client, no client
   * authentication included, or unsupported authentication method).  The
   * authorization server MAY return an HTTP 401 (Unauthorized) status code to
   * indicate which HTTP authentication schemes are supported.  If the client
   * attempted to authenticate via the "Authorization" request header field,
   * the authorization server MUST respond with an HTTP 401 (Unauthorized)
   * status code and include the "WWW-Authenticate" response header field
   * matching the authentication scheme used by the client.
   */
  InvalidClient: "invalid_client",

  /**
   * The provided authorization grant (e.g., authorization code, resource
   * owner credentials) or refresh token is invalid, expired, revoked, does
   * not match the redirection URI used in the authorization request, or was
   * issued to another client.
   */
  InvalidGrant: "invalid_grant",

  /**
   * The request is missing a required parameter, includes an unsupported
   * parameter value (other than grant type), repeats a parameter, includes
   * multiple credentials, utilizes more than one mechanism for authenticating
   * the client, or is otherwise malformed.
   */
  InvalidRequest: "invalid_request",

  /**
   * The requested scope is invalid, unknown, malformed, or exceeds the scope
   * granted by the resource owner.
   */
  InvalidScope: "invalid_scope",

  /**
   * The authenticated client is not authorized to use this authorization
   * grant type.
   */
  UnauthorizedClient: "unauthorized_client",

  /**
   * The authorization grant type is not supported by the authorization
   * server.
   */
  UnsupportedGrantType: "unsupported_grant_type",
});
/** @typedef {typeof AccessTokenErrorCode[keyof typeof AccessTokenErrorCode]} AccessTokenErrorCode */

/**
 * @see {@link https://www.rfc-editor.org/rfc/rfc6749#section-5.2 RFC 6749 - Section 5.2}
 */
export const AccessTokenErrorResponse = z.object({
  /**
   * @spec REQUIRED.  A single ASCII [USASCII] error code from
   * {@link AccessTokenErrorCode}
   *
   * Values for the "error" parameter MUST NOT include characters outside the
   * set %x20-21 / %x23-5B / %x5D-7E.
   */
  error: z.nativeEnum(AccessTokenErrorCode),

  /**
   * @spec OPTIONAL.  Human-readable ASCII [USASCII] text providing additional
   * information, used to assist the client developer in understanding the error
   * that occurred. Values for the "error_description" parameter MUST NOT
   * include characters outside the set %x20-21 / %x23-5B / %x5D-7E.
   */
  error_description: z.string().trim().min(1).nullish(),

  /**
   * @spec OPTIONAL.  A URI identifying a human-readable web page with
   * information about the error, used to provide the client developer with
   * additional information about the error. Values for the "error_uri"
   * parameter MUST conform to the URI-reference syntax and thus MUST NOT
   * include characters outside the set %x21 / %x23-5B / %x5D-7E.
   */
  error_uri: z.string().trim().min(1).nullish()
}).passthrough();
/** @typedef {z.infer<typeof AccessTokenErrorResponse>} AccessTokenErrorResponse */

