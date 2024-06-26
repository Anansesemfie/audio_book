import HELPERS from "../../utils/helpers";
import { isEmail } from "validator";

const Externals = (Mongoose: any) => {
  return new Mongoose.Schema({
    email: {
      type: String,
      required: false,
      validate: [isEmail, "Please enter a valid email"],
    },
    phone: {
      type: String,
      required: false,
    },
    active: {
      type: Boolean,
      required: false,
      default: true,
    },
    createdAt: {
      type: Date,
      default: HELPERS.currentTime(),
    },
  });
};

export default Externals;
