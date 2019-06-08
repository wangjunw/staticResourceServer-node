const path = require('path');
const mime = {
    '.js': 'js',
    '.md': 'md',
    '.txt': 'txt',
    '.json': 'json',
    '.png': 'img',
    '.jpg': 'img',
    '.jpeg': 'img'
};
module.exports = file => {
    let type = path.extname(file);
    return mime[type] || 'dir';
};
