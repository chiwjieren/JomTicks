const jsonServer = require('json-server');
const server = jsonServer.create();
const middlewares = jsonServer.defaults();
const path = require('path');

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add custom middleware
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Use JSON Server router
const router = jsonServer.router(path.join(__dirname, 'db.json'));
server.use(router);

server.listen(3001, () => {
  console.log('JSON Server is running on http://localhost:3001');
}); 