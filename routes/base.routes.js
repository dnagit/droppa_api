import express from "express";
const router = express.Router();

express.application.prefix = express.Router.prefix = function (
  path,
  middleware = null,
  configure
) {
 
  configure(router);
  
  if (middleware) {
    this.use(path, middleware, router);
  } else {
    this.use(path, router);
  }
  return router;
};

 

export default express;
