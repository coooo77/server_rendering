# Server Rendering App Example

![](./doc/about_ssr.jpg)

[Node.js Full Course for Beginners | Complete All-in-One Tutorial | 7 Hours](https://www.youtube.com/embed/f2EqECiTBL8)

REF: [URL](https://github.com/gitdagray/node_js_resources)

## basic server rendering app with nodejs

- [HTML Favicon](https://www.w3schools.com/html/html_favicon.asp)
- [@use JSDoc](https://jsdoc.app/tags-type.html)
- [Rendering on the Web](https://web.dev/rendering-on-the-web/)
- [對於 SSR 的思考與使用場景](https://blog.kalan.dev/2020-11-23-rethink-ssr)
- [[教學] CSR 和 SSR 的差別是什麼? CSR 和 SSR 的超詳細比較!](https://shubo.io/rendering-patterns/)

## 6. Intro to Express JS framework

- `Express` module
- middleware
- regular expressions routes

## 7. Middleware

- handle urlencoded data (form data)、json、static files
- middleware
- handle cors
- error handler
- 404 handler
- apply all http methods at once

## 8: Routing

- build a route handler
- API route

## 9. MVC CRUD REST API

- build controllers

## 10. Authentication

- use bcrypt
- register a new user
- authenticate user

## 11. JWT Auth

- JWT_Verify_middleware
- logout = clear refresh token in backend and clear access token on client
- Access-Control-Allow-Credentials

```console
npm i dotenv jsonwebtoken cookie-parser
```

### JSON Web Tokens (JWT)

- hazards: xss(cross-site scripting), csrf(cs request forgery)

#### access token = short time

- sent as JSON
- Client stores in memory, lost automatically when app is closed
- Do not store in local storage or cookie
- issued at Authorization
- client uses for API Access until expires
- verified with Middleware
- new access token issued at Refresh request

#### refresh token = long time

- sent as httpOnly cookie (無法直接經由 JavaScript 存取使用者的 session cookie)
- not accessible via JavaScript
- must have expiry at some point
- issued at Authorization
- client uses to request the refresh token
- verified with endpoint & database
- must be allowed to expire or logout

#### create secret

```terminal
node
require('crypto').randomBytes(64).toString('hex')
```

```javascript
// set cookie in ur browser
res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 })
// clear cookie in ur browser
res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
```

```javascript
// get auth
await fetch('http://localhost:3500/auth', {
  method: 'POST',
  body: JSON.stringify({ user: 'walt3', pwd: '123456' }),
  headers: { 'content-type': 'application/json' },
}).then((e) => e.json())

// use token
await fetch('http://localhost:3500/employees', {
  method: 'get',
  headers: {
    'content-type': 'application/json',
    authorization: 'bearer YOUR_TOKEN',
  },
}).then((e) => e.json())
```

if u fetch api with credentials include, u must check url if it is whitelisted and set Access-Control-Allow-Credentials to true. Also issue refresh token with sameSite 'None', secure true

```javascript
// Fetch API
const res = await fetch('http://localhost:3500/auth', {
  method: 'POST',
  body: JSON.stringify({ user: getElValue('userInput'), pwd: getElValue('pwdInput') }),
  headers: { 'content-type': 'application/json' },
  credentials: 'include',
})

// Check origin
const allowedOrigins = require('../config/allowedOrigins')
const credentials = (req, res, next) => {
  const origin = req.headers.origin
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Credentials', true)
  }
  next()
}
module.exports = credentials

// issue refresh token
res.cookie('jwt', refreshToken, {
  httpOnly: true,
  sameSite: 'None',
  secure: true,
  maxAge: 24 * 60 * 60 * 1000,
})

// clear refresh token, but maxAge is wont be included
res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
```
