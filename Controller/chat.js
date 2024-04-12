const db = require("../mongodb.config");
const { ObjectId } = require("mongodb");

const uc = db.collection("user");
const ch = db.collection("chat");

class chatController {
  async sendMessage(req, res) {
    try {
      const from = await req?.user.user._id;
      const data = await req.body;
      data.createdAt = new Date();
      data.updatedAt = null;
      data.from = from;

      await ch.insertOne(data);

      res.status(200).json({
        messages: "Xabar yuborildi",
        variant: "success",
      });
    } catch (err) {
      res.status(500).json({
        message: "Something went wrong",
        variant: "error",
      });
    }
  }

  async getMessages(req, res) {
    try {
      const userId = await req.params?.id;
      const from = await req?.user?.user?._id;
      const user = await uc.findOne({ _id: new ObjectId(userId) });
      const sender = await ch.find({ from: from, to: userId }).toArray();
      const receiver = await ch.find({ from: userId, to: from }).toArray();

      const chat = [...sender, ...receiver].sort((a, b) => {
        return new Date(a.createdAt) - new Date(b.createdAt);
      });

      res.status(200).json({
        user,
        messages: chat,
      });
    } catch (err) {
      res.status(500).json({
        message: "Something went wrong",
        variant: "error",
      });
    }
  }

  async handleDelete(req, res) {
    try {
      await ch.deleteOne({});
      res
        .status(200)
        .json({ variant: "success", message: "Xabar o'chirirldi" });
    } catch (err) {
      res.status(500).json({
        variant: "error",
        message: "Kitob o'chirilmadi",
        error: err,
      });
    }
  }
}

module.exports = new chatController();
