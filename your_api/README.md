# Interview SWE-01

This repository contains code for the Interview Software Engineer (SWE) 01 project. It includes tests for API functionality using Jest.

## Getting Started

To get started with this project, follow these steps:

### Prerequisites

- [Docker](https://www.docker.com/) installed on your system.

### Installation

1. Clone this repository to your local machine:

    ```bash
    git clone https://github.com/your_username/interview-swe-01.git
    ```

2. Navigate to the project directory:

    ```bash
    cd interview-swe-01
    ```
3. Install dependencies:

    ```bash
    npm install
    ```    

3. Build the Docker image:

    ```bash
    docker-compose up --build
    ```

### Running Tests

To run the tests, execute the following command:

```bash
npx jest your_api/tests/your_api.test.js

### Test Flow Diagram

1. **Test 'Transaction is handled once even if retried'**

    - Send transaction request to http://localhost:3300/ transaction
    - Mock response from API
    - Receive response with status 'completed'
    - Verify response equality

2. **Test 'Transactions are marked as successful or failed appropriately'**

    - Send transaction request to http://localhost:3300/transaction
    - Mock response from API
    - Receive response with status 'completed' or 'declined'
    - Verify response status match

3. **Test 'Response is returned to the client as fast as possible'**

    - Send transaction request to http://localhost:3300/transaction
    - Mock response from API
    - Measure response time
    - Verify response time within 10000 ms

4. **Test 'Success/failure notification is sent to the mobile application as quickly as possible'**

    - Send transaction request to http://localhost:3300/transaction
    - Mock response from API
    - Receive response with status 'completed'
    - Verify response status 'completed'
