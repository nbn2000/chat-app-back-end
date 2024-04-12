const db = require("../mongodb.config");
const tokenService = require("../Service/token.service");
const { ObjectId } = require("mongodb");
const crypto = require("crypto");

const userCol = db.collection("user");
class user {
  async signup(req, res) {
    try {
      const newUser = await req.body;
      newUser.lastActive = new Date();
      newUser.password = crypto
        .createHash("sha256")
        .update(newUser.password)
        .digest("hex");
      try {
        await userCol.createIndex({ phone: 1 }, { unique: true });
      } catch (err) {
        return res.status(401).json({
          message: "Phone number already exists",
          variant: "warning",
          error: err,
        });
      }
      try {
        await userCol.createIndex({ username: 1 }, { unique: true });
      } catch (err) {
        return res.status(401).json({
          message: "Username already exists",
          variant: "warning",
          error: err,
        });
      }
      await userCol.insertOne(newUser);
      return res.status(200).json({
        message: "User created successfully!",
        variant: "success",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Internal server error from signup",
        variant: "error",
        error: err,
      });
    }
  }

  async signin(req, res) {
    try {
      const { phone, password } = await req.body;
      const hash = crypto.createHash("sha256").update(password).digest("hex");
      const user = await userCol.findOne({ phone, password: hash });
      const token = await tokenService.generateToken(user);

      if (!user) {
        return res.status(404).json({
          message: "Password or Phone incorrect",
          variant: "warning",
        });
      }

      return res.status(200).json({
        message: "Welcome to your account",
        variant: "success",
        user,
        token,
      });
    } catch (err) {
      res.status(500).json({
        message: "Internal server error signin",
        variant: "error",
        error: err,
      });
    }
  }

  async getAll(req, res) {
    try {
      const users = await userCol.find().toArray();
      res.status(200).json({
        message: "users data recieved successfully",
        variant: "success",
        amount: users.length,
        users,
      });
    } catch (err) {
      res.status(500).json({
        message: "Internal server error",
        variant: "error",
        error: err,
      });
    }
  }

  async delete(req, res) {
    try {
      const id = (await req?.user?.user._id) || null;
      if (!id) {
        return res.status(401).json({
          message: "Unauthorized",
          variant: "warning",
        });
      }

      await userCol.deleteOne({ _id: new ObjectId(id) });

      return res.status(200).json({
        message: "Your account has been deleted successfully",
        variant: "info",
      });
    } catch (err) {
      res.status(500).json({
        message: "Internal server error from delete",
        variant: "error",
        error: err,
      });
    }
  }

  async editProfile(req, res) {
    try {
      const formData = req.body;
      const id = (await req?.user?.user._id) || null;
      if (!id) {
        return res.status(401).json({
          message: "Unauthorized",
          variant: "warning",
        });
      }
      formData.password = crypto
        .createHash("sha256")
        .update(formData.password)
        .digest("hex");
      try {
        await userCol.createIndex({ phone: 1, username: 1 }, { unique: true });
        await userCol.updateOne(
          ...[{ _id: new ObjectId(id) }, { $set: formData }]
        );
      } catch (err) {
        return res.status(401).json({
          message: "Phone number or username already exists",
          variant: "warning",
          error: err,
        });
      }

      return res
        .status(200)
        .json({ message: "Profile successfully updated", variant: "success" });
    } catch (err) {
      res.status(500).json({
        variant: "error",
        message: "Internal server error from editProfile",
        error: err,
      });
    }
  }

  async lastActive(req, res, next) {
    try {
      const id = req?.user?.user?._id;
      const now = new Date();
      await userCol.updateOne(
        { _id: new ObjectId(id) },
        { $set: { lastActive: now } }
      );
      next();
    } catch (err) {
      res.status(500).json({
        message: "Internal server error from lastActive",
        variant: "error",
        error: err,
      });
    }
  }
}

module.exports = new user();
