const http = require('http');
const url = require('url');
const crypto = require('crypto');

/**
 * Simple proof of work: concatenate the input string with a nonce, returning
 * the nonce when the last 3 digits of the hex-encoded SHA256 hash are '000'.
 * This version calculates the nonce by incrementing a number and converting it
 * to a hex string.
 * @param  String input         The starting string.
 * @param  int difficulty
 * @return String               The computed nonce.
 */
function work(input, difficulty = 4) {
    let id = 0;
    while (true) {
        const nonce = id.toString(16);

        const sha256 = crypto.createHash('sha256');
        sha256.update(input);
        sha256.update(nonce);

        if (sha256.digest('hex').endsWith('0'.repeat(difficulty))) {
            console.log(`Nonce ${nonce} found after ${id} times`);
            return nonce;
        }
        else id++;
    }
}

/**
 * @param  String input         The starting string.
 * @param  int nonce            nonce to validate
 * @param  int difficulty
 * @return bool                 true if valid, false otherwise
 */
function validateWork(input, nonce, difficulty = 4) {
    const sha256 = crypto.createHash('sha256');
    sha256.update(input);
    sha256.update(nonce);
    return sha256.digest('hex').endsWith('0'.repeat(difficulty));
}

http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const query = url.parse(req.url,true).query;
    const nonce = query.nonce;
    const doc = query.docId;
    if(!nonce) res.end("nonce not present");
    if(!doc) res.end("docId not present");

    console.log(`Received: nonce=${nonce} docId=${doc}`);
    if(doc && validateWork(doc, nonce)) res.end("matches :)");

    res.end("failed :(");

}).listen(3000, '0.0.0.0', function() {console.log('Listening to port:  ' + 3000);});
