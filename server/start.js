const app = require('./index.js');
let port = 80;
app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});