# Auth JS

This library offers a collection of utilities for dealing with authentication and authorization, revolving around OAuth 2.0 and OpenID Connect.

The code of this library is written in pure JS as ECMAScript modules (e.g.: `import`/`export`), using JS Doc to provide type annotations in the TypeScript flavor. The intention of this choice is to make it easy to import its utilities with little or no build tools while still offering accurate type signatures and LSP-friendly documentation.

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
