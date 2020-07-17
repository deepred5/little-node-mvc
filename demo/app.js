const { App } = require('../index');

const app = new App();

app.listen(4441, () => {
  console.log(`app start at: 4441`);
})