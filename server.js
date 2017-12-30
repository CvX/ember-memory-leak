/* eslint-env node */
'use strict';

const FastBootAppServer = require('fastboot-app-server');

let requestCount = 0;
let memoryBefore, memoryAfter;

let serverOptions = {
  distPath: 'dist',
  gzip: true,
  host: '0.0.0.0',
  workerCount: 1,

  beforeMiddleware(app) {
    app.use((req, res, next) => {
      requestCount++;

      global.gc();
      let x = next();
      global.gc();

      let usage = process.memoryUsage();

      if (requestCount == 100) {
        memoryBefore = usage.heapUsed;
      }

      if (requestCount == 500) {
        memoryAfter = usage.heapUsed;
        console.log(`\n\nRESULTS:\n\nbefore: ${memoryBefore / 1024} KB\nafter:  ${memoryAfter / 1024} KB\n\n`);
      }

      return x;
    });
  },
};

const server = new FastBootAppServer(serverOptions);
server.start();
