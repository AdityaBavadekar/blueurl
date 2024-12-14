import ShortenedUrl from '../models/ShortenedUrl.js';
import bcrypt from 'bcryptjs';

const formatUrlCodeToShortenedUrl = (urlCode) => {
    return `[$root$]/${urlCode}`;
}

const shortenedUrlToDbUrl = (shortenedUrl) => {
    return shortenedUrl.replace('[$root$]', process.env.BASE_URL || 'https://blueurl.vercel.app/');
}

export const createShortenedUrl = async (req, res) => {
    let originalUrl = req.body.url;
    let { urlCode, password } = req.body;
    if (!originalUrl) {
        return res.status(400).json({ message: "Original URL is required" });
    }
    if (!urlCode) {
        urlCode = Math.random().toString(36).substring(2, 8);
    }else{
        // Check that URL code has correct characters to avoid security issues
        const urlCodeRegex = /^[a-zA-Z0-9-_.]+$/;
        if (!urlCodeRegex.test(urlCode) || urlCode == 'api') {
            return res.status(400).json({ message: "URL code is invalid" });
        }
    }

    try {
        let shortenedUrl = await ShortenedUrl.findOne({ urlCode });
        if (shortenedUrl) {
            return res.status(400).json({ message: "URL code already exists" });
        }
        let hashedPassword;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }
        shortenedUrl = new ShortenedUrl({
            originalUrl,
            urlCode,
            shortUrl: formatUrlCodeToShortenedUrl(urlCode),
            password: hashedPassword,
        });
        await shortenedUrl.save();
        shortenedUrl.shortUrl = shortenedUrlToDbUrl(shortenedUrl.shortUrl);
        console.log("New Shortened URL created");
        res.status(201).json({
            ...shortenedUrl._doc,
            password: undefined
        });
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
        res.status(200).json({
            ...shortenedUrl._doc,
            password: undefined,
        });
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
    const { password } = req.body;
    try {
        const shortenedUrl = await ShortenedUrl.findOne({ urlCode });
        if (!shortenedUrl) {
            return res.status(404).json({ message: "URL not found" });
        }
        if (shortenedUrl.password) {
            if (!password) {
                return res.status(400).json({ message: "Password is required. This URL is password protected" });
            }
            const isMatch = await bcrypt.compare(password, shortenedUrl.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Password is invalid. This URL is password protected" });
            }
            // Only password protected URLs can be permanently deleted
            await shortenedUrl.remove();
            res.status(200).json({ message: "URL permanently deleted" });
        }else{
            shortenedUrl.isDeleted = true;
            await shortenedUrl.save();
            res.status(200).json({ message: "URL marked as deleted" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error occurred" });
    }
};

export const undoDeleteShortenedUrl = async (req, res) => {
    const { urlCode } = req.params;
    try {
        const shortenedUrl = await ShortenedUrl.findOne({ urlCode });
        if (!shortenedUrl) {
            return res.status(404).json({ message: "URL not found" });
        }
        shortenedUrl.isDeleted = false;
        await shortenedUrl.save();
        res.status(200).json({ message: "URL restored" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error occurred" });
    }
}

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