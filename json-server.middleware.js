module.exports = (req, res, next) => {
  // Allow requests from any origin
  res.header('Access-Control-Allow-Origin', '*');
  
  // Allow specific headers
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
  // Allow specific methods
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
};