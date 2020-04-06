const http = require("http");
const fs = require("fs");

//place in a variable since the function returns a server
const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;
  if (url === "/") {
    res.write(
      `<html><body><form action="/message" method="POST"><input type='text'name="message"><button type="submit">send</button></form></body></html>`
    );

    return res.end();
  }

  if (url === "/message" && method === "POST") {
    const body = [];

    req.on("data", chunk => {
      console.log(chunk);
      body.push(chunk);
    });

    req.on("end", () => {
      const parseBody = Buffer.concat(body).toString();
      const message = parseBody.split("=")[1].split('+').join(' ');
      
      fs.writeFile("message.txt", message, () => {
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  }
});

server.listen(3000);
