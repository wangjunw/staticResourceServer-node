const { createDeflate, createGzip } = require('zlib');
module.exports = (rs, req, res) => {
    const acceptEncoding = req.header['accept-encoding'];
    if (!acceptEncoding || !acceptEncoding.match(/\b(gzip|deflate)/)) {
        return rs;
    } else if (acceptEncoding.match(/\bgzip\b/)) {
        res.setHeader('Content-Encoding', 'gzip');
        return res.pipe(createGzip());
    } else if (acceptEncoding.match(/\bdeflate\b/)) {
        res.setHeader('Content-Encoding', 'deflate');
        return res.pipe(createDeflate());
    }
};
