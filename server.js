/**
 * 用于开发环境的服务启动
*/
const path = require('path'); // 获取绝对路径有用

const express = require('express'); // express服务器端框架

const app = express(); // 实例化express服务

const compression = require('compression')

const PORT = 8000; // 服务启动端口号

app.use(express.static(path.join(__dirname, 'dist')));
app.use(compression())

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

/** 启动服务 *
 * */
app.listen(PORT, () => {
  console.log('本地服务启动地址: http://localhost:%s', PORT);
});
