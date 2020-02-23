import mongoose, { Schema } from "mongoose";

const CustomerSchema: Schema = new Schema({
  name: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  email: {
    type: mongoose.Schema.Types.String,
    unique: true,
    required: true,
  },
  phone: {
    type: mongoose.Schema.Types.String,
    unique: true,
    required: true,
  },
});

CustomerSchema.virtual("id").get(() => this._id);

const CustomerModel = mongoose.model("Customer", CustomerSchema, "Customer");

export default CustomerModel;
