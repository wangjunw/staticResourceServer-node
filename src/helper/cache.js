const { cache } = require('../config/config.js');
function refreshRes(stats, res) {
    // 支持哪些缓存方法
    const { maxAge, expires, cacheControl, lastModified, etag } = cache;
    if (expires) {
        // 在当前请求的时间基础上加上一段时间
        res.setHeader(
            'Expires',
            new Date(Date().now() + maxAge * 1000).toUTCString()
        );
    }
    if (cacheControl) {
        res.setHeader('Cache-Control', `public, max-age=${maxAge}`);
    }
    if (lastModified) {
        res.setHeader('Last-Modified', stats.mtime.toUTCString());
    }
    if (etag) {
        res.setHeader('ETag', `${stats.size}-${stats.mtime}`);
    }
}

modules.exports = function isFresh(stats, req, res) {
    refreshRes(stats, res);
    const lastModified = req.header['if-modified-since'];
    const etag = req.header['if-none-match'];
    // 如果没有二者，说明是第一次请求
    if (!lastModified && !etag) {
        return false;
    }
    // 如果和设置的不一样，说明失效了
    if (lastModified && lastModified !== res.getHeader('Last-Modified')) {
        return false;
    }

    if (etag && etag !== res.getHeader('ETag')) {
        return false;
    }
    return true;
};
