const express = require("express");
const fs = require("fs");
const spdy = require("spdy");
const https = require("https");

// watch -n 1 ss -s

let expressApp;
const httpsOptions = {
  key: fs.readFileSync("certs/privkey.pem"),
  cert: fs.readFileSync("certs/cert.pem"),
  ca: fs.readFileSync("certs/chain.pem"),
};
const http1Port = 443;
const http2Port = 8443;
const fileData = [];

function initExpressApp() {
  expressApp = express();
  expressApp.use("/http1", express.static("public"));
  expressApp.use("/http2", express.static("public"));
  initServerRoutes();
}

function initServerRoutes() {
  expressApp.get("/", (req, res) => {
    res.send("Hello World!");
  });

  expressApp.get("/serverpush", (req, res) => {
    let htmlData = fs.readFileSync("./public/http2.html", "utf8");
    for (let i = 1; i <= 384; i++) {
      let imgData = fs.readFileSync(`./public/images/part-${i}.jpg`);
      let stream = res.push(`/http2/images/part-${i}.jpg`, {
        status: 200,
        method: "GET",
        request: {
          accept: "*/*",
        },
        response: {
          "content-type": "image/jpg",
          "accept-ranges": "bytes",
          "content-length": imgData.length,
        },
      });
      stream.on("error", function (err) {
        console.log("steam error", err);
      });
      stream.end(imgData);
    }
    res.end(htmlData);
  });
}

function initHttpV1Server() {
  const httpsServer = https.createServer(httpsOptions, expressApp);
  //httpsServer.keepAliveTimeout =  1;
  httpsServer.listen(http1Port, () => {
    console.log(`HTTPS Server Listening on port: ${http1Port}`);
  });
  // httpsServer.on("connection", function (socket) {
  //   //  console.log("A new connection was made by a client.");
  //  });
}

function initHttpV2Server() {
  spdy.createServer(httpsOptions, expressApp).listen(http2Port, (error) => {
    if (error) {
      console.error(error);
      return process.exit(1);
    } else {
      console.log(`HTTP2 Server Listening on port: ${http2Port}`);
    }
  });
}

initExpressApp();
initHttpV1Server();
initHttpV2Server();
