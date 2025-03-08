/**
 * The main application instance imported from the server module.
 * @type {Object}
 */
const app = require("./src/server");

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Mock server running at http://localhost:${PORT}`);
});
