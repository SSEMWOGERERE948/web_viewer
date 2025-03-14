// lib/cors.ts
import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';

// Configure CORS options
const cors = Cors({
  methods: ['GET', 'POST', 'OPTIONS'],
  origin: ['http://localhost:80', 'http://localhost'], // Add OnlyOffice server origin
  credentials: true,
});

// Helper method to initialize middleware
export function initMiddleware(middleware: any) {
  return (req: NextApiRequest, res: NextApiResponse) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result: any) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}

export const corsMiddleware = initMiddleware(cors);