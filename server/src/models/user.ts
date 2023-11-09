import mongoose, { Schema } from "mongoose";

export interface IUser {
  _id?: string;
  username: string;
  password: string;
  availableMoney: number;
  purchasedItems: string[];
}

const UserSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  availableMoney: { type: Number, default: 5000 },
  purchasedItems: [
    { type: mongoose.Schema.Types.ObjectId, ref: "product", default: [] },
  ],
});

export const UserModel = mongoose.model<IUser>("user", UserSchema);
