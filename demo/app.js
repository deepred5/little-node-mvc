const { App } = require('../index');

const app = new App({
  projectRoot: __dirname
});

app.listen(4441, () => {
  console.log(`app start at: 4441`);
})