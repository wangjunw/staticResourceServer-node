# staticResourceServer-node

静态资源服务器-node 版

## 功能介绍

#### 静态资源服务器基础

1. `path`和`fs`等原生模块的熟练使用，搞清楚相对路径和绝对路径。

2. 区分文件类型

3. handlebars 模板的使用，注意使用方法

#### 支持文件压缩

使用 node 自带`zlib`模块，和`fs.createReadStream`配合。

#### 文件缓存功能

通过设置、获取 header 信息判断是否使用缓存

## 使用方法

安装依赖(没有 nodemon 需要单独安装，或者修改执行命令)。

```
npm install
npm run start
```

> 默认静态文件根目录为 static 目录。
