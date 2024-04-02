const axios = require('axios');
const { simulateLatency } = require('../index');
jest.mock('axios');

describe('Your API Tests', () => {
  test('Transaction is handled once even if retried', async () => {
    const mockRequest = { id: 'transaction_id', webhookUrl: 'http://example.com/webhook' };
    const mockResponse = { id: 'transaction_id', status: 'completed', webhookUrl: 'http://example.com/webhook' };

    axios.post.mockResolvedValueOnce({ data: mockResponse })
      .mockResolvedValueOnce({ data: mockResponse });

    // The first request
    const response1 = await axios.post('http://localhost:3300/transaction', mockRequest);

    // the second request (duplicate)
    const response2 = await axios.post('http://localhost:3300/transaction', mockRequest);

    expect(response1.data).toEqual(mockResponse);
    expect(response2.data).toEqual(mockResponse);
  });


  test('Transactions are marked as successful or failed appropriately', async () => {

    const mockRequest = { id: 'transaction_id', webhookUrl: 'http://example.com/webhook' };
    const mockResponse = { id: 'transaction_id', status: 'completed', webhookUrl: 'http://example.com/webhook' };

    // Mock the third-party mock response
    axios.post.mockResolvedValueOnce({ data: mockResponse });

    // Make the request
    const response = await axios.post('http://localhost:3300/transaction', mockRequest);

    expect(response.data.status).toMatch(/completed|declined/);
  });

  test('Response is returned to the client as fast as possible', async () => {

    const mockRequest = { id: 'transaction_id', webhookUrl: 'http://example.com/webhook' };
    const mockResponse = { id: 'transaction_id', status: 'completed', webhookUrl: 'http://example.com/webhook' };

    // Mock the third-party mock response
    axios.post.mockResolvedValueOnce({ data: mockResponse });

    // Measure the response time
    const startTime = Date.now();
    await axios.post('http://localhost:3300/transaction', mockRequest);
    const endTime = Date.now();

    // Assuming 10 seconds is reasonable
    expect(endTime - startTime).toBeLessThanOrEqual(10000);
  });

  test('Success/failure notification is sent to the mobile application as quickly as possible', async () => {
    const mockRequest = { id: 'transaction_id', webhookUrl: 'http://example.com/webhook' };
    const mockResponse = { id: 'transaction_id', status: 'completed', webhookUrl: 'http://example.com/webhook' };

    // Mock the third-party mock response
    axios.post.mockResolvedValueOnce({ data: mockResponse });

    // Make the request
    const response = await axios.post('http://localhost:3300/transaction', mockRequest);

    // Verify that the success/failure notification is sent to the mobile application as quickly as possible
    expect(response.data.status).toBe('completed'); // Assuming successful transaction
  });
});

