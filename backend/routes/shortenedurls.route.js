import { Router } from "express";
import { createShortenedUrl, getShortenedUrl, deleteShortenedUrl, getShortenedUrlsCount, getShortenedUrlStats, getAllRedirectCodes } from "../controllers/shortenedurls.controller.js";

const router = Router();

router.post('/shorten', createShortenedUrl);
router.post('/redirects', getAllRedirectCodes);
router.delete('/:urlCode', deleteShortenedUrl);
router.get('/', getShortenedUrlsCount);
router.get('/stats/:urlCode', getShortenedUrlStats);
router.get('/:urlCode', getShortenedUrl);

export { router as shortenedUrlsRouter };