const proxy = require('http-proxy-middleware');//引入代理中间件

const apiProxy = proxy('/api', { target: 'http://localhost:8080',changeOrigin: true });//将服务器代理到localhost:8080端口上[本地服务器为localhost:3000]

/dapingAgent

/ovu-pcos

app.use('/api/*', apiProxy);//api子目录下的都是用代理
app.use('/api', proxy({target: 'http://www.example.org', changeOrigin: true}));
