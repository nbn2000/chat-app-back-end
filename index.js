const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const router = require("./Router");
const port = process.env.PORT || 8080;
const auth = require("./Middleware/Auth");
const user = require("./Controller/user");
app.use(express.json());
app.use(cors());
app.get("/", async (req, res) => {
  res.send("Wrong website please check again");
});
app.use(auth);
app.use(user.lastActive);
app.use(router);
app.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}`)
);
