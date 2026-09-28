# Simple JWT Authentication

A React login exercise demonstrating authentication, a JWT-shaped token, browser storage, and a protected dashboard.

## Theory

**Authentication** checks that a user is who they claim to be, usually by verifying credentials such as a username and password. **Authorization** decides what an authenticated user is allowed to access.

A JSON Web Token (JWT) is a compact, URL-safe string made of three dot-separated parts: a header, a payload, and a signature. The payload contains claims, such as a user ID, role, and expiration time. JWT payloads are encoded, not encrypted, so they must not contain secrets. A server signs a real JWT and verifies its signature before trusting its claims.

Basic login flow:

1. The user submits their credentials to the server over HTTPS.
2. The server verifies the credentials and creates a signed token with claims and an expiration.
3. The client stores the token and sends it with later requests, commonly in an authorization header.
4. The server verifies the token and authorizes the requested action based on its claims.
5. The client clears the token when the user signs out; expired tokens require signing in again.

## Run the demo

```sh
npm install
npm run dev
```

Demo accounts:

| Username | Password | Role |
| --- | --- | --- |
| `admin` | `password123` | Administrator |
| `student` | `password123` | Student |

Successful login stores a one-hour demo token in `localStorage`. The dashboard is shown only when a valid, unexpired token is present. Signing out clears it.

## Security note

This is a frontend-only simulation. It does not contact a server, verify real credentials, or cryptographically sign a JWT. The client-side check and token can be modified by anyone using browser tools, so this is not production authentication. A real app must authenticate and authorize on a trusted backend, use HTTPS, and securely sign and verify tokens. For production browser sessions, consider secure, HttpOnly, SameSite cookies.

## Build

```sh
npm run build
```