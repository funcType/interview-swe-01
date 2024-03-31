const express = require('express');
const axios = require('axios');
const { randomUUID } = require('crypto');

const app = express();
app.use(express.json());

const port = process.env.PORT || 3300;
const thirdPartyUrl = process.env.THIRD_PARTY_URL || 'http://localhost:3000';

const transactions = {};

// Helper function to simulate latency
const simulateLatency = (latency) => {
  return new Promise((resolve) => setTimeout(resolve, latency));
};

// Function to notify mobile application
const notifyMobileApp = (transaction) => {
  // TODO: Implement notification mechanism to notify the mobile app about the transaction status
  console.log(`Notifying mobile app about transaction status: ${transaction.status}`);
};

// Endpoint to handle transaction requests
app.post('/transaction', async (req, res) => {
  const id = randomUUID();
  const webhookUrl = req.body.webhookUrl;

  try {
    // Make a request to third-party service
    // TODO: Send transaction request to the third-party service
    const response = await axios.post(`${thirdPartyUrl}/transaction`, { id, webhookUrl });

    // Update transaction status
    const status = response.data.status;
    transactions[id] = { id, status, webhookUrl };

    // Notify mobile application
    notifyMobileApp(transactions[id]);

    res.status(200).json(transactions[id]);
  } catch (error) {
    console.error('Error processing transaction:', error);

    // Handle timeout or failure
    transactions[id] = { id, status: 'failed', webhookUrl };

    // Notify mobile application
    notifyMobileApp(transactions[id]);

    res.status(500).json({ error: 'Transaction failed' });
  }
});

// Endpoint to check transaction status
app.get('/transaction/:id', (req, res) => {
  const id = req.params.id;
  const transaction = transactions[id];

  if (!transaction) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  res.status(200).json(transaction);
});

app.listen(port, () => {
  console.log(`Your API is listening on port ${port}`);
});

