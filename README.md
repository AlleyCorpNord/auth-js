# Auth JS

This library offers a collection of utilities for dealing with authentication and authorization, revolving around OAuth 2.0 and OpenID Connect.

The code of this library is written in pure JS as ECMAScript modules (e.g.: `import`/`export`), using JS Doc to provide type annotations in the TypeScript flavor. The intention of this choice is to make it easy to import its utilities with little or no build tools while still offering accurate type signatures and LSP-friendly documentation.

Here are some contexts in which you might want to use parts of this library:

## Validating the access token response from a provider

```ts
import { AccessTokenSuccessResponse } from "https://esm.sh/gh/AlleyCorpNord/auth-js/oauth-2.0.js";

function example(tokenResopnse) {
  try {
    const successResponse = AccessTokenSuccessResponse.parse(tokenResponse);
    // successResponse.access_token is a non-empty string
  } catch (err) {
    console.warn(`Token response was not successful: ${err?.message}`);
  }
}
```

## And when that provider customizes their access token response...

```ts
import { AcccessTokenSuccessResponse } from "https://esm.sh/gh/AlleyCorpNord/auth-js/oauth-2.0,js";

const MedplumAccessTokenResponse = AccessTokenSuccessResponse.extend({
  profile: fhir.referenceTo(medplum.profile),
           // ^-- Fictitious Zod schemas for FHIR and Medplum resources
  project: fhir.referenceTo(medplum.project)
});

const tokenResponse = MedplumAccessTokenResponse.parse(await getToken())
tokenResponse.project // is known to be a FHIR Reference to a Medplum Project
```

## You'd like to exchange one access token for another

Often, this situation arises when you want the frontend to communicate directly with an external service but don't want to have to force the user to authenticate with that service. Instead, you have the external service trust your identity provider by granting the service provider some way of validating the identity provider's issued access token the user is providing.

To put this into concrete terms, let's assume that you're using Auth0 as an _identity provider_ and Medplum as the _service provider_. In this setting, you want Medplum to use the access token that was issued to the user by Auth0 when they logged in. That way, the frontend can make requests directly to Medplum without requiring the user to also setup an account with Medplum and authenticate with this service. As the service provider now, Medplum needs to be able to validate an access token issued by Auth0, thus you give Medplum some client credentials and configuration for it to query Auth0 for the identity of the user bearing the received token.

This transaction is codified as a proposed standard in [RFC 8693 OAuth 2.0 Token Exchange][rfc-8693].

While the exchange process is fairly simple, we offer a convenience method for eperforming this exchange and validating results:

```ts
const medplumResult = await exchangeToken(
  auth0AccessToken,
  clientIdCreatedInMedplumGivenToAuth0,
  medplumTokenEndpoint
);

if (medplumResult.success) {
  const tokenResponse = medplumResult.value;
  tokenResponse.access_token // Your new Medplum access token!
} else {
  const errorResponse = medplumResult.value;
  errorResponse.error // Type of OAuth 2.0 error you encountered
}
```

[rfc-8693]: https://www.rfc-editor.org/rfc/rfc8693.html
