import express from 'express';
import dotenv from 'dotenv';
import { appRouter } from './app.router.js';
import { connection } from './DB/connection.js';
dotenv.config();
const app = express();
const port = process.env.PORT;
connection();


// Routing
appRouter(app, express);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));