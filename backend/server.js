import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js'
import cors from 'cors';
import path, { dirname } from 'path';

import { shortenedUrlsRouter } from './routes/shortenedurls.route.js';
import { redirectRouter } from './routes/redirect.route.js';
import { fileURLToPath } from 'url';

dotenv.config();
connectDB();

const app = express()

// Allows to parse req.body as json
app.use(express.json());
app.use(cors(
    {
        origin: process.env.CORS_ORIGIN || '*',
        methods: 'GET,POST,DELETE'
    }
));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

  
app.use('/api/', shortenedUrlsRouter);
app.get('/api-docs', (req, res) => {
    const apiDoc = {
        status: 'BLUE URL API is Live',
        endpoints: [
            {
                method: 'GET',
                path: '/',
                description: 'Returns a message indicating the API is working'
            },
            {
                method: 'POST',
                path: '/api/shortenedurls',
                params: {
                    originalUrl: 'string',
                    urlCode: 'string (optional)',
                },
                description: 'Creates a new shortened URL'
            },
            {
                method: 'GET',
                path: '/api/shortenedurls',
                description: 'Returns the count of shortened URLs'
            },
            {
                method: 'GET',
                path: '/api/shortenedurls/stats/[urlCode]',
                description: 'Returns the stats of a shortened URL'
            },
            {
                method: 'GET',
                path: '/[urlCode]',
                description: 'Redirects to the original URL based on the shortened URL'
            },
            {
                method: 'GET',
                path: '/api/shortenedurls/[urlCode]',
                description: 'Returns the full details of a shortened URL'
            },
            {
                method: 'GET',
                path: '/api/info',
                description: 'Returns this API documentation'
            },
            {
                method: 'DELETE',
                path: '/api/shortenedurls/[urlCode]',
                description: 'Deletes a shortened URL'
            },
            {
                method: 'POST',
                path: '/api/shortenedurls/redirects',
                params: {
                    url: 'string',
                },
                description: 'Returns all the redirect codes for a given URL'
            }
        ]
    };
    res.status(200).json(apiDoc);
});

app.use('/', redirectRouter);

const port  = process.env.PORT || 5080;

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
})