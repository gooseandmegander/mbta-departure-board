'use strict';

const http = require('http');
const https = require('https');
const url = require('url');
let timer;
const PORT = 8000;

/**
 * getRoutes
 */
function getRoutes() {
  return new Promise(function (resolve, reject) {
    https.get('https://api-v3.mbta.com/predictions?filter[stop]=place-sstat&include=stop&sort=-departure_time', {
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
        'X-API-Key': 'efb54286315f4f7882e1172735431042'
      }
    }, (res) => {
      const { statusCode } = res;

      let error;
      if (statusCode !== 200) {
        error = new Error('Request failed');
      }

      if (error) {
        console.error(error.message);
        res.resume();
        return;
      }

      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => {
        rawData += chunk;
      });
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData);
          resolve(parsedData);
        } catch (err) {
          console.error(err.message);
        }
      });
    }).on('error', (err) => {
      console.error('received error');
    });
  });
};

http.createServer((request, response) => {

  response.writeHead(200, {
    Connection: 'keep-alive',
    'Content-type': 'text/event-stream',
    'Cache-control': 'no-cache',
    'Access-Control-Allow-Origin': '*'
  });

  clearInterval(timer);
  timer = setInterval(() => {
    response.write('\n\n');
    getRoutes()
      .then(res => {
        response.write(`data: ${JSON.stringify(res)}`);
        response.write('\n\n');
        console.log(JSON.stringify(res));
      })
  }, 10000);

  response.on('close', () => {
    response.writeHead(404);
    response.end();
  })
}).listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});