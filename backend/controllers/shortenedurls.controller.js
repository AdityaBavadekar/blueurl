import ShortenedUrl from '../models/ShortenedUrl.js';

const formatUrlCodeToShortenedUrl = (urlCode) => {
    return `[$root$]/${urlCode}`;
}

const shortenedUrlToDbUrl = (shortenedUrl) => {
    return shortenedUrl.replace('[$root$]/', process.env.BASE_URL);
}

export const createShortenedUrl = async (req, res) => {
    let originalUrl = req.body.url;
    let { urlCode } = req.body;
    if (!originalUrl) {
        return res.status(400).json({ message: "Original URL is required" });
    }
    if (!urlCode) {
        urlCode = Math.random().toString(36).substring(2, 8);
    }else{
        // Check that URL code has correct characters to avoid security issues
        const urlCodeRegex = /^[a-zA-Z0-9-_]+$/;
        if (!urlCodeRegex.test(urlCode)) {
            return res.status(400).json({ message: "URL code is invalid" });
        }
    }

    try {
        let shortenedUrl = await ShortenedUrl.findOne({ urlCode });
        if (shortenedUrl) {
            return res.status(400).json({ message: "URL code already exists" });
        }
        shortenedUrl = new ShortenedUrl({
            originalUrl,
            urlCode,
            shortUrl: formatUrlCodeToShortenedUrl(urlCode),
        });
        await shortenedUrl.save();
        shortenedUrl.shortUrl = shortenedUrlToDbUrl(shortenedUrl.shortUrl);
        console.log("New Shortened URL created");
        res.status(201).json(shortenedUrl);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error occurred" });
    }
};

export const getShortenedUrl = async (req, res) => {
    const { urlCode } = req.params;
    try {
        const shortenedUrl = await ShortenedUrl.findOne({ urlCode });
        if (!shortenedUrl) {
            return res.status(404).json({ message: "URL not found" });
        }
        res.status(200).json(shortenedUrl);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error occurred" });
    }
};

export const redirectWithShortenedUrl = async (req, res) => {
    const { urlCode } = req.params;
    try {
        const shortenedUrl = await ShortenedUrl.findOne({ urlCode });
        if (!shortenedUrl || shortenedUrl.isDeleted) {
            return res.status(404).json({ message: "URL not found" });
        }
        shortenedUrl.redirectCount = shortenedUrl.redirectCount + 1;
        await shortenedUrl.save();
        res.redirect(301, shortenedUrl.originalUrl);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error occurred" });
    }
};

export const deleteShortenedUrl = async (req, res) => {
    const { urlCode } = req.params;
    try {
        const shortenedUrl = await ShortenedUrl.findOne({ urlCode });
        if (!shortenedUrl) {
            return res.status(404).json({ message: "URL not found" });
        }
        // await shortenedUrl.remove();
        shortenedUrl.isDeleted = true;
        await shortenedUrl.save();
        res.status(200).json({ message: "URL deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error occurred" });
    }
};

export const getShortenedUrlsCount = async (req, res) => {
    try {
        const count = await ShortenedUrl.countDocuments();
        res.status(200).json({ count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error occurred" });
    }
};

export const getShortenedUrlStats = async (req, res) => {
    const { urlCode } = req.params;
    try {
        const shortenedUrl = await ShortenedUrl.findOne({ urlCode });
        if (!shortenedUrl) {
            return res.status(404).json({ message: "URL not found" });
        }
        res.status(200).json({
            originalUrl: shortenedUrl.originalUrl,
            urlCode: shortenedUrl.urlCode,
            redirectCount: shortenedUrl.redirectCount,
            createdAt: shortenedUrl.createdAt,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error occurred" });
    }
}

export const getAllRedirectCodes = async (req, res) => {
    let originalUrl = req.body.url;
    if (!originalUrl) {
        return res.status(400).json({ message: "Original URL is required" });
    }
    originalUrl = shortenedUrlToDbUrl(originalUrl);
    try {
        const codes = await ShortenedUrl.find({ originalUrl ,isDeleted: false }).select('urlCode');
        res.status(200).json(codes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error occurred" });
    }
};