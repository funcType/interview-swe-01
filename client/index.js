const express = require("express");
const axios = require("axios");
const { randomUUID } = require("crypto");

const app = express();
app.use(express.json());

const port = process.env.PORT || 3100;
const yourApiUrl = process.env.YOUR_API || "http://localhost:3200";
const pendingTransactions = new Set();

app.post("/transaction", (req, res) => {
  const { id } = req.body;

  // Fix: Check if the transaction is already being processed
  if (pendingTransactions.has(id)) {
    console.log(`Transaction ${id} is already being processed`);
    return res.status(409).send("Transaction is already being processed");
  }

  pendingTransactions.add(id);

  axios.post(`${yourApiUrl}/transaction`, req.body)
    .then((yourResponse) => {
      const { id, status } = yourResponse.data;
      console.log(`Transaction ${id} is ${status}`);
      pendingTransactions.delete(id); //Refactor: Removed the transaction from pending list
    })
    .catch((error) => {
      console.log("Error while calling your API", error);
      pendingTransactions.delete(id); // Refactor: Removed the transaction from pending list
    });

  res.send();
});

app.put("/transaction", (req, res) => {
  const { id, status } = req.body;
  console.log(`Transaction ${id} marked as ${status}`);
  res.send();
});

app.listen(port, () => {
  console.log(`Client mock is listening on port ${port}`);
});
