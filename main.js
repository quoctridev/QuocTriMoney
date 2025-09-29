import express from "express";
import dotenv from "dotenv";
import { payment } from "./controller/getPayment.js";
import { botCommand } from "./controller/botCommand.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => res.send("Hello world"));
app.post("/hooks/payment", payment);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

botCommand();
