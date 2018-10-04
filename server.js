const express = require("express");
const compression = require("compression");
const helmet = require("helmet");
const port = process.env.PORT || 8080;

const app = express();

app.use(compression());
app.use(helmet());
app.use(express.static("build"));

app.get("*", (req, res) => {
  res.redirect("/");
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server started on port ${port}.`);
});
