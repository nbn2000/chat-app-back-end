const rt = require("express").Router();

// ==== Router for Users ====
const user = require("./Controller/user");
const uv = require("./Validation/user.validation");
rt.post("/signup", [uv.signup], user.signup);
rt.post("/signin", user.signin);
rt.get("/get/user", user.getAll);
rt.delete("/delete/user", user.delete);
rt.patch("/patch/profile", [uv.signup], user.editProfile);

// ==== Router for Chat ====
const chat = require("./Controller/chat");

rt.get("/get/chat/:id", chat.getMessages);
rt.post("/send/message", chat.sendMessage);
rt.delete("/delete/message", chat.handleDelete);

module.exports = rt;
