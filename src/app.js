const app = require('http');
const path = require('path');
const chalk = require('chalk');
const config = require('./config/config.js');
const route = require('./helper/route.js');

const server = app.createServer((req, res) => {
    // 请求路径的拼接
    const filePath = path.join(config.root, req.url);
    route(req, res, filePath);
});
server.listen(config.port, config.hostname, () => {
    let address = `http://${config.hostname}:${config.port}`;
    // 执行node app.js时，输出信息地址为绿色
    console.log(`Server started at ${chalk.green(address)}`);
});
