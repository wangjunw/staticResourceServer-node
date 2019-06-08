const { cache } = require('../config/config.js');
function refreshRes(stats, res) {
    // 支持哪些缓存方法，做对应的配置
    const { maxAge, expires, cacheControl, lastModified, etag } = cache;
    // 会有问题，应该是不支持了吧
    // if (expires) {
    //     // 在当前请求的时间基础上加上一段时间
    //     res.setHeader(
    //         'Expires',
    //         new Date(Date().now() + maxAge * 1000).toUTCString()
    //     );
    // }
    if (cacheControl) {
        // 直接设置600秒
        res.setHeader('Cache-Control', `public, max-age=${maxAge}`);
    }
    if (lastModified) {
        // stats.mtime：修改时间
        res.setHeader('Last-Modified', stats.mtime.toUTCString());
    }
    if (etag) {
        res.setHeader('ETag', `${stats.size}-${stats.mtime}`);
    }
}

module.exports = function isFresh(stats, req, res) {
    refreshRes(stats, res);
    // 从请求头获取对应字段
    const lastModified = req.headers['if-modified-since'];
    const etag = req.headers['if-none-match'];
    // 如果二者都没有，说明是第一次请求
    if (!lastModified && !etag) {
        return false;
    }
    // 如果和请求头设置的不一样，说明失效了
    if (lastModified && lastModified !== res.getHeader('Last-Modified')) {
        return false;
    }
    if (etag && etag !== res.getHeader('ETag')) {
        return false;
    }
    return true;
};
