import express from "express";
import { extractData } from "./index";

const app = express();
const port = 3000;

app.use(express.json());

app.post("/scrape", async (req, res) => {
  const { area, industry } = req.body;
  const data = await extractData(area, industry);
  res.json(data);
});

app.listen(port, () => {
  `Server is listening at port ${port}`;
});
