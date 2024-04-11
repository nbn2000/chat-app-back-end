const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const router = require("./src/Router");
const port = process.env.PORT || 8080;
const auth = require("./src/Middleware/Auth");
const user = require("./src/Controller/user");
app.use(express.json());
app.use(cors());
app.use(auth);
app.use(user.lastActive);
app.use(router);
app.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}`)
);
