module.exports = {
    root: process.cwd(), //获取当前执行node启动命令所在的目录
    hostname: '127.0.0.1',
    port: 9527,
    compress: /\.(html|js|css|md)/,
    cache: {
        maxAge: 600, // 秒（6分钟）
        expires: true,
        cacheControl: true,
        lastModified: true,
        etag: true
    }
};
