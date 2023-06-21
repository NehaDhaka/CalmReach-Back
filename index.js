const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const messageRoute = require("./routes/messageRoutes");
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use("/api", userRoutes);
app.use("/api/messages", messageRoute);

const server = app.listen(process.env.PORT, () => {
  console.log(`Server started on Port ${process.env.PORT}`);
});
