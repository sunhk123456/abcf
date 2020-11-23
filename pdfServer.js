/**
 * @Description: 启动pdf服务器工程
 *
 * @author: liuxiuqian
 *
 * @date: 2019/2/28
 */
/**
 * 静态资源服务
 *
 */
const express = require('express');
const path = require('path');// 引入path
const ip = require('ip'); // ip 的插件

const app = express();
const IP = ip.address();
const port = 6069;

// 设置静态资源目录
app.use(express.static(path.join(__dirname, 'pdfServer/download')));
// 增加，页面文件放在这个目录下
app.use(express.static(path.join(__dirname, 'pdfServer/pdf')));

app.listen(port, () => {
  console.info('startup success', 'http://'+IP+':'+port)
})
