const fs = require('fs');
const util = require('util');
const config = require('../config/config.js');
// 让一个遵循异常优先的回调风格的函数， 即 (err, value) => ... 回调函数是最后一个参数,
// 返回一个返回值是一个 promise 版本的函数。
const stat = util.promisify(fs.stat);
const readdir = util.promisify(fs.readdir);

// 模板引擎
const handlebars = require('handlebars');
const path = require('path');
// 读取模板文件，__dirname：被执行js文件的绝对路径
const tplPath = path.join(__dirname, '../template/dir.tpl');
const source = fs.readFileSync(tplPath, 'utf-8');
// 编译模板，参数需要是字符串
const template = handlebars.compile(source);

// 获取文件类型
const mime = require('mime-types');
const getIcon = require('./getIcon');

// 支持压缩文件
const compress = require('./compress');

// 缓存设置
const isFresh = require('./cache');

module.exports = async function(req, res, rootPath, filePath) {
    try {
        const stats = await stat(filePath);
        // 判断访问的路径是文件还是文件夹
        if (stats.isFile()) {
            // 判断文件类型
            const contentType = mime.lookup(filePath);
            res.setHeader('Content-Type', `${contentType};charset=utf-8`);

            // 判断是否是新鲜的请求并使用缓存
            if (isFresh(stats, req, res)) {
                res.statusCode = 304;
                res.end();
                return;
            }
            res.statusCode = 200;

            // 如果是文件，以流的方式返回，性能好一些
            // fs.createReadStream(filePath).pipe(res);
            let rs = fs.createReadStream(filePath);
            // 如果是指定文件类型，进行压缩
            if (filePath.match(config.compress)) {
                rs = compress(rs, req, res);
            }
            rs.pipe(res);
        } else if (stats.isDirectory()) {
            // 如果是目录读取目录
            const files = await readdir(filePath);
            res.statusCode = 200;
            // 如果是文件夹，返回html网页即可
            res.setHeader('Content-Type', 'text/html');
            const relativePath = path.relative(rootPath, filePath);
            // 如果访问根路径，那么取得相对路径：relativePath为空字符串，这时不必拼接/，否则会出现//js的现象
            const data = {
                // 根据文件类型显示对应的图标
                files: files.map(file => ({
                    file,
                    icon: `${path.sep}icon${path.sep}${getIcon(file)}.png`
                })),
                title: path.basename(filePath),
                dir: relativePath
                    ? `${path.sep}${relativePath}`
                    : `${relativePath}`,
                splitter: path.sep
            };
            res.end(template(data));
        }
    } catch (e) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end(`${filePath} is not a directory or file`);
    }
};
