# little-node-mvc
a mini mvc nodejs framework

# usage
```javascript
const { App } = require('little-node-mvc');

const app = new App();

const port = 8080;
const hostAddress = '0.0.0.0';

app.listen(port, hostAddress, () => {
  console.log(`app start at: http://${hostAddress}:${port}`);
})
```
访问`http://0.0.0.0:8080/do_not_delete/health_check`

使用方法详见[little-node-mvc-template](https://github.com/deepred5/little-node-mvc-template)