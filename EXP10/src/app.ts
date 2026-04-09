import cors from "cors";
import express from "express";
import userRoutes from "./routes/userRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({ message: "REST API is running" });
});

app.use("/api/users", userRoutes);

export default app;
