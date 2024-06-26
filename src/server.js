const express = require("express");
const cors = require("cors");
const extractData = require("./index");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors({ origin: "*" }));

app.post("/scrape", async (req, res) => {
  const { area, industry } = req.body;
  const data = await extractData(area, industry);
  res.json(data);
});

app.post("/", (req, res) => {
  return res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});
