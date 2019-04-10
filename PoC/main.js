const http = require('http');
const url = require('url');
const crypto = require('crypto');

/**
 * Simple proof of work: concatenate the input string with a nonce, returning
 * the nonce when the last 3 digits of the hex-encoded SHA256 hash are '000'.
 * This version calculates the nonce by incrementing a number and converting it
 * to a hex string.
 *
 * @param  String input         The starting string.
 * @param  String difficulty    The starting string.
 * @return String               The computed nonce.
 */
function work(input, difficulty = 4) {
    let id = 0;
    while (true) {
        const nonce = id.toString(16);

        const sha256 = crypto.createHash('sha256');
        sha256.update(input);
        sha256.update(nonce);

        if (sha256.digest('hex').slice(-1 * difficulty ) === '0'.repeat(difficulty)) {
            console.log(`Nonce ${nonce} found after ${id} times`);
            return nonce;
        }
        else id++;
    }
}

http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const query = url.parse(req.url,true).query;
    const pow = query.pow;
    const doc = query.docId;
    if(!pow) res.end("PoW not present");
    if(!doc) res.end("docId not present");

    let wrk = doc && work(doc);
    if(wrk !== pow) res.end("PoW sent doesn't match");

    res.end("Data reached, yeahh!!!");
}).listen(3000, '0.0.0.0', function() {console.log('Listening to port:  ' + 3000);});
