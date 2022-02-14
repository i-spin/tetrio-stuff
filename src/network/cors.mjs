var host = process.env.HOST || "0.0.0.0";
var port = process.env.PORT || 8080;

import { createServer } from "cors-anywhere";
createServer({
  originWhitelist: [],
  requireHeader: ["origin", "x-requested-with"],
  removeHeaders: ["cookie", "cookie2"],
}).listen(port, host, function () {
  console.log("Running CORS Anywhere on " + host + ":" + port);
});
