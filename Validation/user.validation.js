const AJV = require("ajv");
const ajv = new AJV();

class userValidation {
  static async check(schema, data) {
    return new Promise(async (res, rej) => {
      try {
        const result = await ajv.validate(schema, data);
        if (!result) {
          return rej(ajv.errorsText());
        } else {
          return res(null);
        }
      } catch (err) {
        rej(err);
      }
    });
  }

  static async signup(req, res, next) {
    const schema = {
      type: "object",
      properties: {
        fullname: {
          type: "string",
          minLength: 3,
          maxLength: 25,
        },
        username: {
          type: "string",
          minLength: 5,
          maxLength: 20,
          pattern: "^[a-z0-9_]*$",
        },
        phone: {
          type: "string",
          minLength: 16,
          maxLength: 16,
          pattern: "^[+][0-9]{3} [0-9]{2} [0-9]{3} [0-9]{4}$",
        },
        password: {
          type: "string",
          minLength: 5,
          maxLength: 15,
          pattern: "^[a-zA-Z0-9_]*$",
        },
      },
      required: ["fullname", "username", "phone", "password"],
      additionalProperties: false,
    };

    try {
      await userValidation.check(schema, req.body);
      next();
    } catch (err) {
      return res.status(400).json({
        message: err,
        variant: "warning",
      });
    }
  }
}

module.exports = userValidation;
