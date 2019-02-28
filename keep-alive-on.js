'use strict';

const Bluebird = require('bluebird');
const HTTPS    = require('https');
const Agent    = require('agentkeepalive');

// TODO: Set TARGET, COUNT, CONCURRENCY
const TARGET = 'https://domain.com';
const COUNT = 1000;
const CONCURRENCY = 50;

const REQUESTS = new Array(COUNT);

const AGENT = new Agent.HttpsAgent({
  freeSocketTimeout: 30000, // free socket keepalive for 30 seconds
});

const OPTIONS = {
  agent: AGENT,
};

// A function that makes requests to the TARGET
// using HTTP Keep-Alive.
function makeRequest() {
  return new Bluebird((resolve, reject) => {
    HTTPS.get(TARGET, OPTIONS, (resp) => {
      let data = '';

      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        resolve(data);
      });

    })
    .on('error', (err) => {
      reject(err);
    });
  });
}

// Run the benchmark.
console.log(`Benchmark: Keep-Alive ON, ${COUNT} Requests, ${CONCURRENCY} Concurrency`);
console.time('total time');

Bluebird.map(REQUESTS, () => {
  return makeRequest().then(() => undefined);
}, { concurrency: CONCURRENCY })
.then(() => {
  console.timeEnd('total time')
});
