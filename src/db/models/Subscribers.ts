import { ObjectId } from "bson";
import HELPERS from "../../utils/helpers";

const Subscribers = (Mongoose: any) => {
  return new Mongoose.Schema(
    {
      //active and inactive subscriptions
      parent: {
        type: ObjectId,
        required: [true, "missing subscription key"],
      },
      user: {
        type: ObjectId,
        required: [true, "missing user ID"],
      },
      status: {
        type: String,
        default: "Active",
      },
      active: {
        type: Boolean,
        default: true,
      },
      ref: {
        type: String,
        required: [true, "Reference ID is required"],
        unique: [true, "Reference ID exist already"],
      },
      createdAt: {
        type: Date,
        default: HELPERS.currentTime(),
      },
    },
    {
      timestamp: true,
    }
  );
};

export default Subscribers;
