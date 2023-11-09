import express, { urlencoded } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import { userRouter } from "./routes/user";
import { productRouter } from "./routes/product";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/user", userRouter);
app.use("/product", productRouter);

mongoose
  .connect(process.env.DB_CONNECT)
  .then(() => {
    console.log("Connect to MongoDB Atlas.");
  })
  .catch((err) => {
    console.log("Connection failed");
    console.log(err);
  });

app.listen(3001, () => {
  console.log("server is running on port 3001.");
});
