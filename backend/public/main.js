const urlInput = document.getElementById('url');
const shortCodeInput = document.getElementById('short-code');
const shortenBtn = document.getElementById('shorten-btn');
const resetBtn = document.getElementById('reset-btn');
const resultDiv = document.getElementById('result');
const shortUrlDisplay = document.getElementById('short-url');
const shortUrlCodeConatiner = document.getElementById('short-code-container');

const baseURL = "https://blueurl.vercel.app";

shortenBtn.addEventListener('click', () => {
    const url = urlInput.value.trim();

    if (!url) {
        alert("Enter URL to shorten");
        return;
    }

    var shortCode = shortCodeInput.value.trim();

    if (!url || !isValidUrl(url)) {
        alert("Invalid URL!");
        return;
    }

    fetch(baseURL + '/api/shorten', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        cors: 'no-cors',
        body: JSON.stringify({
            url,
            urlCode: shortCode
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log("Response: ", JSON.stringify(data));
        if (data.message) {
            alert(data.message);
            return;
        }else{
            shortCode = data.urlCode;
            const shortUrl = data.shortUrl;
            shortUrlDisplay.textContent = shortUrl;
            shortUrlDisplay.href = shortUrl;
            resultDiv.classList.remove('hidden');
        }
    });
    
});

resetBtn.addEventListener('click', () => {
    urlInput.value = '';
    shortCodeInput.value = '';
    shortCodeInput.classList.add('hidden');
    resultDiv.classList.add('hidden');
});

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

urlInput.addEventListener('input', () => {
    const text = urlInput.value.trim();
    if (!text || text === '') {
        shortUrlCodeConatiner.classList.add('hidden');
    }else{
        shortUrlCodeConatiner.classList.remove('hidden');
    }
});

document.body.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        shortenBtn.click();
    }
});