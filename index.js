const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromise = fs.promises
const { logEvents } = require('./utils/logEvent')

const PORT = process.env.PORT || 3500

// basically, those urls represent path to app folder
console.table({
  info: 'URLs you can test',
  basic: 'http://localhost:3500/',
  'new-page': 'http://localhost:3500/new-page',
  'old-page': 'http://localhost:3500/old-page.html',
  'www-page': 'http://localhost:3500/www-page.html',
  '404': 'http://localhost:3500/*',
  'json data': 'http://localhost:3500/data/data.json',
  'text data': 'http://localhost:3500/data/data.text',
  'img': 'http://localhost:3500/img/dragon.png',
})

/**
 * @see https://jsdoc.app/tags-type.html
 * @typedef HttpResponse
 * @type {http.ServerResponse<http.IncomingMessage> & { req: http.IncomingMessage }}
 */

/**
 * @param {String} filePath 
 * @param {String} contentType 
 * @param {HttpResponse} response 
 */
const serveFile = async (filePath, contentType, response) => {
  try {
    const isUtf8 = contentType.includes('image') ? '' : 'utf8'
    const isJson = contentType === 'application/json'
    const is404 = filePath.includes('404.html') ? 404 : 200

    const rawData = await fsPromise.readFile(filePath, isUtf8)
    const data = isJson ? JSON.parse(rawData) : rawData
    response.writeHead(is404, { 'Content-Type': contentType })
    response.end(isJson ? JSON.stringify(data) : data)
  } catch (error) {
    console.log(err);
    logEvents(`URL：${req.url}\tMETHOD：${req.method}`, 'reqLog.txt')

    // Internal Server Error
    response.statusCode = 500
    response.end()
  }
}

const server = http.createServer(async (req, res) => {
  console.log('\n New Request: ' + req.url)
  // if (req.url === '/' || req.url === 'index.html') {
  //   res.statusCode = 200
  //   res.setHeader('Content-type', 'text/html')
  //   const filePath = path.join(__dirname, 'views', 'index.html')
  //   const data = await fsPromise.readFile(filePath, 'utf8')
  //   res.end(data)
  // }

  // switch (req.url) {
  //   case '/':
  //     res.statusCode = 200
  //     res.setHeader('Content-type', 'text/html')
  //     const filePath = path.join(__dirname, 'views', 'index.html')
  //     const data = await fsPromise.readFile(filePath, 'utf8')
  //     res.end(data)
  //     break;
  //   default:
  //     break;
  // }

  logEvents(`URL：${req.url}\tMETHOD：${req.method}`, 'eventLog.txt')

  const extension = path.extname(req.url);

  console.table({
    url: req.url,
    'YOUR EXTENSION': extension
  })

  let contentType;
  switch (extension) {
    case '.css':
      contentType = 'text/css';
      break;
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.jpg':
      contentType = 'image/jpeg';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.txt':
      contentType = 'text/plain';
      break;
    case '.ico':
      contentType = 'image/x-icon';
      break;
    default:
      contentType = 'text/html';
  }

  const isHomePage = contentType === 'text/html' && req.url === '/'
  const isOtherHomePage = contentType === 'text/html' && req.url.slice(-1) === '/'
  const isOtherContentPage = contentType === 'text/html'

  // let filePath =
  //   contentType === 'text/html' && req.url === '/'
  //     ? path.join(__dirname, 'views', 'index.html')
  //     : contentType === 'text/html' && req.url.slice(-1) === '/'
  //       ? path.join(__dirname, 'views', req.url, 'index.html')
  //       : contentType === 'text/html'
  //         ? path.join(__dirname, 'views', req.url)
  //         : path.join(__dirname, req.url);

  let filePath =
    isHomePage ? path.join(__dirname, 'views', 'index.html')
      : isOtherHomePage ? path.join(__dirname, 'views', req.url, 'index.html')
        : isOtherContentPage ? path.join(__dirname, 'views', req.url)
          : path.join(__dirname, req.url);

  // makes .html extension not required in the browser
  if (!extension && req.url.slice(-1) !== '/') filePath += '.html';

  const fileExists = fs.existsSync(filePath);

  console.table(path.parse(filePath))

  if (fileExists) {
    serveFile(filePath, contentType, res);
  } else {
    switch (path.parse(filePath).base) {
      case 'old-page.html':
        // 301 redirects
        res.writeHead(301, { 'Location': '/new-page.html' });
        res.end();
        break;
      case 'www-page.html':
        res.writeHead(301, { 'Location': '/' });
        res.end();
        break;
      default:
        serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res);
    }
  }
})

server.listen(PORT, () => console.log(`Server listening on ${PORT}`))