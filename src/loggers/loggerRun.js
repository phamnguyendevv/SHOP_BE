
import MyLogger from "./myLogger.js";
const myLogger = new MyLogger();





const logger = (req, res, next) => {
  const requestId = req.headers["x-request-id"] || Date.now().toString();
  req.requestId = requestId;
  // console.log(req)
  const params = [
    req.path,
    { requestId: requestId },
    req.method === "POST" ? req.body : req.query,
  ];

  myLogger.log(`Input params :: ${req.method}`, params);
  next();
}

export default logger;
