'use strict';

const Bluebird = require('bluebird');
const HTTPS    = require('https');

// TODO: Set TARGET, COUNT, CONCURRENCY
const TARGET = 'https://domain.com';
const COUNT = 1000;
const CONCURRENCY = 50;

const REQUESTS = new Array(COUNT);

// A function that makes requests to the TARGET
// without reusing connection.
function makeRequest() {
  return new Bluebird((resolve, reject) => {
    HTTPS.get(TARGET, (resp) => {
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
console.log(`Benchmark: Keep-Alive OFF, ${COUNT} Requests, ${CONCURRENCY} Concurrency`);

console.time('total time');
Bluebird.map(REQUESTS, () => {
  return makeRequest().then(() => undefined);
}, { concurrency: CONCURRENCY })
.then(() => {
  console.timeEnd('total time')
});
