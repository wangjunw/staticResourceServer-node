const fs = require('fs');
const util = require('util');
// 让一个遵循异常优先的回调风格的函数， 即 (err, value) => ... 回调函数是最后一个参数,
// 返回一个返回值是一个 promise 版本的函数。
const stat = util.promisify(fs.stat);
const readdir = util.promisify(fs.readdir);
const config = require('../config/config.js');

// 模板引擎
const handlebars = require('handlebars');
const path = require('path');
// 读取模板文件，__dirname：被执行js文件的绝对路径
const tplPath = path.join(__dirname, '../template/dir.tpl');
const source = fs.readFileSync(tplPath, 'utf-8');
// 编译模板，参数需要是字符串
const template = handlebars.compile(source);

module.exports = async function(req, res, filePath) {
    try {
        const stats = await stat(filePath);
        // 判断访问的路径是文件还是文件夹
        if (stats.isFile()) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            // 如果是文件，以流的方式返回，性能好一些
            fs.createReadStream(filePath).pipe(res);
        } else if (stats.isDirectory()) {
            // 如果是目录读取目录
            const files = await readdir(filePath);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            const dir = path.relative(config.root, filePath);
            const data = {
                files,
                title: path.basename(filePath),
                dir: dir ? `/${dir}` : ''
            };
            res.end(template(data));
        }
    } catch (e) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end(`${filePath} is not a directory or file`);
    }
};
