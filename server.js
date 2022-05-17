var http = require("http"); //引入http模块（用来创建http服务器）
var fs = require("fs"); //引入fs模块（用来操作文件系统）
var url = require("url"); //引入url模块（用来解析url）
var port = process.argv[2]; //拿到执行此脚本命令的第二个参数（即为port），如node server.js 8888，那么port = 8888

if (!port) {
  console.log("请指定端口号 \n 如：node server.js 8888");
  process.exit(1);
}

var server = http.createServer(function (request, response) {
  //解析url拿到解析后的对象，形如 parsedUrl 图（见下文）
  var parsedUrl = url.parse(request.url, true);
  //带query的path，见下文pathWithQuery
  var pathWithQuery = request.url;
  var queryString = "";
  //判断是否带query
  if (pathWithQuery.indexOf("?") >= 0) {
    //带query的话则拿到它
    queryString = pathWithQuery.substring(pathWithQuery.indexOf("?"));
  }
  var path = parsedUrl.pathname;
  var query = parsedUrl.query;
  //拿到请求方法
  var method = request.method;

  /******** 从这里开始看，上面不要看 ************/

  //命令行打印日志
  console.log("有人发请求过来！路径（带查询参数）为：" + pathWithQuery);

  //处理 / 路由
  if (path === "/") {
    //设置响应状态码为200
    response.statusCode = 200;
    //设置响应头content-type字段
    response.setHeader("Content-Type", "text/html;charset=utf-8");
    //设置响应体内容
    response.write(`
            <!DOCTYPE html>
              <head>
                <link rel="stylesheet" href="/style.css">
              </head>
              <body>
                <h1>hello world</h1>
                <script src="/main.js"></script>
              </body>
            </html>
    `);
    //结束并响应请求
    response.end();
    //处理 /style.css路由
  } else if (path === "/style.css") {
    //同理，不过由于是css类型文件，故头部字段content-type配置不同
    response.statusCode = 200;
    response.setHeader("Content-Type", "text/css;charset=utf-8");
    response.write(`h1{color: red;}`);
    response.end();
  } else if (path === "/main.js") {
    response.statusCode = 200;
    response.setHeader("Content-Type", "text/javascript;charset=utf-8");
    response.write(`console.log('这是JS内容')`);
    response.end();
  } else {
    //兜底，除了上面几种路由，其它路由都走此逻辑
    response.statusCode = 404;
    response.setHeader("Content-Type", "text/html;charset=utf-8");
    response.write(`你访问的页面不存在`);
    response.end();
  }

  /******** 代码结束，下面不要看 ************/
});

//监听port端口，只有执行了此语句才算启动了服务
server.listen(port);
//命令行打印日志
console.log("监听 " + port + " 成功 \n 请打开http://localhost:" + port);
