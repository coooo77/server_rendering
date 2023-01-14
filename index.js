const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const fsPromise = fs.promises
const { logEvents } = require('./utils/logEvent')

const PORT = process.env.PORT || 3500

app.get('/', (req, res) => {
  // res.send('hello world')
  // res.sendFile('./views/index.html', { root: __dirname })

  /**
  path must be absolute or specify root to res.sendFile 
  ❌ path.join('views', 'index.html')
  ✔️ path.join(__dirname, 'views', 'index.html')
  */
  res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

/**
you can use regular expressions to specify routes
^ ➡️ start with
& ➡️ end with
| ➡️ or
(.html)? with optional extension
*/
app.get('^/&|index(.html)?', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

app.get('^/new-page(.html)?', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'new-page.html'))
})

app.get('^/old-page(.html)?', (req, res) => {
  // 302 by default
  res.redirect(301, '/new-page')
})

// route handlers
app.get('/Hello(.html)?', (req, res, next) => {
  console.log('attempted to load hello.html')
}, (res, req) => res.send('Hello, world'))

// chaining route handlers
const one = (req, res, next) => {
  console.log('one');
  next();
}
const two = (req, res, next) => {
  console.log('two');
  next();
}
const three = (req, res) => {
  console.log('three');
  res.send('Finished!');
}
app.get('/chain(.html)?', [one, two, three]);

app.get('/*', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
})


app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`))