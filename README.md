# FEMA Flood Insurance Compliance Application

This application helps manage and ensure compliance with FEMA flood insurance requirements.

## Project Structure

The project is organized into two main parts:
- `client/`: React frontend application
- `server/`: Node.js backend application

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL

### Installation

1. Clone the repository
```bash
git clone [repository-url]
cd fema-flood-insurance-compliance
```

2. Install dependencies
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Set up environment variables
- Copy `.env.example` to `.env` in both client and server directories
- Update the variables with your configuration

4. Start the development servers
```bash
# From the root directory
npm run dev
```

## Testing
```bash
# Run all tests
npm test

# Run frontend tests
npm run test:client

# Run backend tests
npm run test:server
```

## Docker
To run the application using Docker:
```bash
docker-compose up
```

## License
[License Type]
