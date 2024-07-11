# Comfy Online Store

### Prerequisites

- Node.js (v14.x or higher)
- npm (v6.x or higher)
- MongoDB (running instance)
- Docker (optional, if you want to use Docker)

### Installation

#### Without Docker

1. Install the dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. The application should now be running on `http://localhost:5000`.

#### With Docker

1. Build the Docker image:
   ```bash
   docker build -t couch-store .
   ```
2. Run the Docker container:
   ```bash
   docker run -p 5000:5000 couch-store
   ```
3. The application should now be running on `http://localhost:5000`.

4. For Docker, You will have to add products then they will show on products page

#### PayPal Testing Credentials

Email: sb-ca0lm31552190@personal.example.com
Password: >fX\*8/vc
