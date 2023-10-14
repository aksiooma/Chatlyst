import expressSession from 'express-session';

declare module 'express-serve-static-core' {
  interface Request {
    session: expressSession.Session & {
      greeting?: string;
    };
  }
}
