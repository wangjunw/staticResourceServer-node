// 使用node自带模块，压缩（gzip，deflate）文件
const { createDeflate, createGzip } = require('zlib');
module.exports = (rs, req, res) => {
    // 获取浏览器支持的压缩方式
    const acceptEncoding = req.headers['accept-encoding'];
    if (!acceptEncoding || !acceptEncoding.match(/\b(gzip|deflate)\b/)) {
        return rs;
    } else if (acceptEncoding.match(/\bgzip\b/)) {
        res.setHeader('Content-Encoding', 'gzip');
        // 直接放在rs.pipe中即可
        return rs.pipe(createGzip());
    } else if (acceptEncoding.match(/\bdeflate\b/)) {
        res.setHeader('Content-Encoding', 'deflate');
        return rs.pipe(createDeflate());
    }
};
