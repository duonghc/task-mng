import express from 'express';
import v1Routes from './routes/v1';
import { errorHandler } from './middleware/error/errorHandler';
import { setSecurityHeaders } from './middleware/securityHeaders';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(express.json());
app.use(setSecurityHeaders);

app.use('/api/v1', v1Routes);

app.use(errorHandler);

export default app;
