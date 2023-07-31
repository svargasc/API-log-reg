const zod = require("zod");

const registerValidation = zod.object({
  name: zod.string({
    required_error: 'Full this input',
    
  }),
  username: zod.string({
    required_error: "Username is required",
  }),
  email: zod.string({
    message: "Invalid email",
  }),
  password: zod
    .string({
      required_error: "Invalid mail or password",
    })
    .min(6, {
      message: "Password must be a leat 6 characters",
    }),
});

const loginValidation = zod.object({
  username: zod.string({
    required_error: "Username is required",
  }),
  email: zod.string({
    message: "Invalid email",
  }),
  password: zod
    .string({
      required_error: "Invalid mail or password",
    })
    .min(6, {
      message: "Password must be a leat 6 characters",
    }),
});

module.exports = { registerValidation, loginValidation };
