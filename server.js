const http = require('http');
const https = require('https');

function httpGetRequest(url) {
    return new Promise((resolve, reject) => {
        https.get(url, response => {
            let body = '';
            response.on('data', data => (body += data));
            response.on('end', () => resolve(body));
        }).on('error', error => reject(error));
    });
}

function parseTimeStories(html) {
    const liRegex = /<li class="latest-stories__item">([\s\S]*?)<\/li>/g;
    const titleRegex = /<h3 class="latest-stories__item-headline">([\s\S]*?)<\/h3>/;
    const linkRegex = /<a[^>]*?href=["'](.*?)["']/;

    const stories = [];
    const liMatches = html.match(liRegex);
    if (!liMatches) return [];

    
    for (const liTag of liMatches.slice(0, 6)) {
        const titleMatch = liTag.match(titleRegex);
        const title = titleMatch ? titleMatch[1].trim() : '';

        const linkMatch = liTag.match(linkRegex);
        const rawLink = linkMatch ? linkMatch[1].trim() : '';
        const link = rawLink.startsWith('http') ? rawLink : `https://time.com${rawLink}`;

        stories.push({ title, link });
    }
    return stories;
}

const server = http.createServer((req, res) => {
    if (req.url === '/getTimeStories' && req.method === 'GET') {
        httpGetRequest('https://time.com')
            .then(html => {
                const stories = parseTimeStories(html);
                sendResponse(res, 200, stories);
            })
            .catch(error => {
                console.error('Error fetching or parsing HTML:', error);
                sendResponse(res, 500, {
                    msg: 'Encountered Server Error',
                    code: 500
                });
            });
    } else {
        sendResponse(res, 404, {
            msg: 'The requested URL was not found',
            code: 404
        });
    }
});

function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(data, null, 2));
    res.end();
}

const port = 8080;
server.listen(port, () => {
    console.log(`Listening at port ${port}`);
    console.log(`Visit http://localhost:${port}/getTimeStories`);
});
