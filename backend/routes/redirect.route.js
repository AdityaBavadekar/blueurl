import { Router } from "express";
import { redirectWithShortenedUrl } from "../controllers/shortenedurls.controller.js";

const router = Router();

router.get('/:urlCode', redirectWithShortenedUrl);

export { router as redirectRouter };