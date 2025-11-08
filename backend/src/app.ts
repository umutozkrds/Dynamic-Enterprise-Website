import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./router/userRouter.js";
import sliderRouter from "./router/sliderRouter.js";
import categoryRouter from "./router/categoryRouter.js";
import subCategoryRouter from "./router/subCategoryRouter.js";
dotenv.config();

const port = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/sliders", sliderRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/sub-categories", subCategoryRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
