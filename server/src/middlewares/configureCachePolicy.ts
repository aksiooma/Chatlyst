
//configureCachePolicy.ts
import express, { Application } from 'express';
const path = require('path');

  //Cache policy for versioned files
  const longCache = 'public, max-age=31536000, immutable'; // 1 year

  // Cache policy for non-versioned files
  const shortCache = 'public, max-age=600'; // 10 minutes

  const configureCors = (app: Application) => {
  app.use('/assets', express.static(path.join(__dirname, 'assets'), {
    setHeaders: (res, path) => {
      if (/\-(?:[a-fA-F\d]{8}|[a-fA-F\d]{13}|[a-fA-F\d]{20})\.(?:css|js|jpg|jpeg|png|webp|svg)$/.test(path)) {
        res.setHeader('Cache-Control', longCache);
      } else {
        res.setHeader('Cache-Control', shortCache);
      }
    }
  }));
};

export default configureCors;