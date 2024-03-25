const registroAccesoMiddleware = (req, res, next) => {
    console.log(`Solicitud recibida: ${req.method} ${req.path}`);
    next();
  };
  
  module.exports = registroAccesoMiddleware;
  console.log `${registroAccesoMiddleware}`;