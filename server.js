import express from "express";
import cors from "cors";
import leetcodeRoutes from "./routes/leetcode.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "LeetCode API is running",
  });
});

app.use("/api/leetcode", leetcodeRoutes);

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

export default app;
