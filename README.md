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

## 12. User Roles | Authorization

### authentication v.s. authorization

- authentication： the process of verifying who someone is (login)
- authorization ： the process of verifying what resources a user has access to (request api)

### user roles & permissions

1. add roles in config
2. add roles to user model
3. add roles when creating a new user (registerController)
4. add roles when issuing accessToken (authController and refreshTokenController)
5. add roles at middleware verifyJWT
6. verify roles at middleware verifyRoles
7. add verifyRoles to each api

## 13: Intro to MongoDB & Mongoose

* SQL database are built in a relational structure, related tables reference each other with joins as data is queried. these relational tables also normalize the data that means data is not duplicated in the tables that's the dry principle which stands for don't repeat yourself and that's applied to the structure
* NO-SQL database like MongoDB you can throw all of that out. mongodb stores data in collections. Individual records in the collections are called documents. the documents have a key value structure and look a lot like a json.
* for example, a collection holds all of the data about a user instead of breaking into related tables. and likewise duplicating and distributing the 
data where deemed necessary in a no-sql structure is permitted

#### advantage of mongodb

* **performance** - the speed at which a collection is queried is very fast
* **flexibility** - it's very easy to make structural changes like adding a new field without wreaking havoc in your total structure, it's like adding a new property to an object
* **scalability** - no-sql can support large databases with high request rates at a very low latency
* **usability** - we can get up and running with mongodb in the cloud very fast

## 14: Mongoose Data Models

* create schema in mongoose
* use schema in controllers (registerController)

## 15: Async CRUD Operations

* deploy your api on glitch.com (6:45:07)