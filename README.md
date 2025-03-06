# Chatlyst - AI powered Chatbot

<img src=https://res.cloudinary.com/dxlzstktn/image/upload/v1707327094/Prome/WittyScreenshot_jap9jw.png alt="Chatbot">


## Overview
Chatlyst is a chatbot application originally designed to bring humor and cleverness to everyday interactions. Inspired by the playful banter of online communities like Reddit, this chatbot stands out with its sassy and sarcastic demeanor. It's built to assist users in their daily tasks and queries while maintaining a unique, engaging personality. This version of Chatlyst is the "skeleton" version, which lays the foundation without predefined roles.

## Live Demo
A live demo of Chatlyst is available at [teijovirta.com](https://www.teijovirta.com).

**Note about first load**: The backend is hosted on Render's free tier, which puts the service to sleep after inactivity. The first request might take 30-60 seconds to wake up the service. Subsequent requests will be much faster.

## Features
- Minimalistic UI
- Intelligent Conversations: Engages users with smart, witty responses.
- Task Assistance: Helps with daily tasks and information retrieval.
- Customizable AI Role. 

## Technologies Used

### Frontend
- React 18
- TypeScript
- Styled Components for styling
- Framer Motion for animations
- Axios for API requests
- Vite as build tool and development server

### Backend
- Node.js
- Express.js
- TypeScript
- PostgreSQL for database
- express-session for session management
- connect-pg-simple for PostgreSQL session storage
- Winston for logging
- Dotenv for environment variable management

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: Render PostgreSQL

## Requirements

### Development Requirements
- Node.js (v16 or higher)
- npm (v7 or higher)
- PostgreSQL (v13 or higher)
- OpenAI API key


## Component Documentation
The project uses Storybook for component documentation. To view the component documentation:

1. Start Storybook development server:
```bash
npm run storybook
```

2. Open your browser and navigate to `http://localhost:6006`

The component documentation includes:
- Interactive examples of each component
- Props documentation
- Different component states and variations
- Component usage guidelines

## Key Components
### Frontend
- React-based User Interface: A user-friendly interface for interaction with the chatbot.
- Responsive Chat Window: Includes a chat window with a floating input area and message display, styled using styled-components.
- Input Handling: Manages user inputs, sends them to the backend, and displays the chatbot's responses.
- Styled Components and Framer Motion

### Backend
- Node.js/Express: Manages API requests to the OpenAI GPT model.
- Session Management: Handles sessions and stores chat history in a PostgreSQL database (previously SQLite).
- Security Features: Includes rate limiting, a honeypot mechanism for spam protection, logging (using Winston), and input sanitation.
- Middleware Configurations: Provides trust proxy support, CORS handling, JSON parsing, and session and cache policy configurations.

### Database
- PostgreSQL: Stores messages and chat history, managing predefined greetings and responses.
- Database Cleanup: Periodically clears messages.

### Security and Performance
- Security: Implements input validation and sanitation to prevent malicious inputs.
- Performance Optimization: Includes rate limiting and consideration for reCAPTCHA implementation.
- Cache Policy Configuration: For enhanced performance of static assets.

#### Modular Codebase

The project is structured to ensure maintainability and scalability, facilitating a clean separation of concerns between the frontend and backend. This structure supports easier updates, testing, and understanding of the codebase.

## Getting Started

To get started with Chatlyst, follow these steps:

1. **Clone the Repository**

```bash
git clone https://github.com/aksiooma/Chatlyst.git
```

2. **Install Dependencies**

Navigate to the Chatlyst directory and install the necessary packages.

```bash
cd Chatlyst
npm install
```
```bash
cd Chatlyst/server
npm install
```

## PostgreSQL Setup

The application requires PostgreSQL database for message storage and session management. All necessary tables are created automatically on first run.

**Install PostgreSQL**
   - Download and install from [postgresql.org](https://www.postgresql.org/download/)
   - Or use package manager:
     ```bash
     # Ubuntu
     sudo apt-get install postgresql
     # macOS
     brew install postgresql
     ```

Required environment variables for database connection:
```env
POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_password
POSTGRES_DB=your_database_name
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
```


## **Environment Setup**

Set up your .env file with the required API keys and configurations.

Run the Application

```bash
npm run start
```

## Backend Environment Variables

To run the backend of the Chatlyst project, you need to set the following environment variables in your `.env` file located in the backend directory:

- `API_KEY`: The API key for accessing the OpenAI GPT services.
- `API_URL`: The URL endpoint for the OpenAI API.
- `NODE_ENV`: The environment where the application is running. Typically set to `development` for development and `production` for production environments.
- `SESSION_SECRET`: A secret key used for securing sessions. Use a random, long string.
- `PORT`: The port of the server.
- `ALLOWED_ORIGINS`: The allowed CORS domains split by comma.
- `POSTGRES_USER`: The username for the PostgreSQL database.
- `POSTGRES_PASSWORD`: The password for the PostgreSQL database.
- `POSTGRES_DB`: The name of the PostgreSQL database.
- `POSTGRES_HOST`: The host address of the PostgreSQL database.
- `POSTGRES_PORT`: The port number for PostgreSQL (default: 5432).

**Example `.env` File:**

```env
API_KEY=your_openai_api_key
API_URL=https://api.openai.com/v1/chat/completions
NODE_ENV=development
SESSION_SECRET=your_random_secret
PORT=3000
ALLOWED_ORIGINS=http://localhost:3000,https://example.com
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
POSTGRES_DB=your_db_name
POSTGRES_HOST=your_db_host
POSTGRES_PORT=5432
...
```

**Security Note**: Ensure that your .env file is added to .gitignore and never pushed to public repositories, especially when it contains sensitive information like API keys or secrets.

## Configuration

Chatlyst allows you to customize the role prompts through environment variables. This feature provides the flexibility to change the behavior of the chatbot without altering the codebase. Below are the environment variables you can set to customize the role prompts:
- `GREETING`: A custom greeting message for the chatbot. This is a JSON-formatted string.
- `SYSTEM_ROLE_PROMPT`: Sets the system's role prompt. Default is "Default system role prompt".
- `ASSISTANT_ROLE_PROMPT`: Sets the assistant's role prompt. Default is "Default assistant role prompt".
- `USER_ROLE_PROMPT`: Sets the user's role prompt. Default is "Default user role prompt".

To set these variables, add them to your `.env` file in the server root of the project like this:

```env
SYSTEM_ROLE_PROMPT=Your custom system role prompt
ASSISTANT_ROLE_PROMPT=Your custom assistant role prompt
USER_ROLE_PROMPT=Your custom user role prompt
GREETING = []
...
```

## OpenAI Model Configuration

The chatbot uses OpenAI's GPT-4-mini model with the following configuration:
- Temperature: 0.8 (balances creativity and coherence)
- Top_p: 1 (nucleus sampling, acts as fallback for temperature)
- Frequency penalty: 2.0 (reduces repetition in longer conversations)
- Presence penalty: 0.5 (encourages some topic variation)
- Max tokens: 500 (limits response length)

These settings are optimized for engaging, natural and playful conversation while maintaining coherence. The model and its parameters can be found in `server/src/controllers/messageController.ts`.

- Higher temperature (>0.8) = more creative, random responses
- Lower temperature (<0.5) = more focused, deterministic responses
- Higher frequency_penalty = less repetition
- Higher presence_penalty = more topic changes

**Note**: OpenAI models are regularly updated and may require version changes. The current implementation uses 'gpt-4o-mini' for optimal performance and cost balance.

## Port Configuration for Development and Production

In this project, the server is configured to listen on different ports for development and production environments:

    - Development: The server uses a custom port defined in process.env.VITE_PORT or defaults to 3000.
    - Production: In environments like Heroku, the server uses the dynamically assigned port from process.env.PORT.

## API Documentation

The Chatlyst backend provides the following API endpoints:

### Message Endpoint
- **URL**: `/message`
- **Method**: `POST`
- **Authentication**: Session-based
- **Request Body**:
  ```json
  {
    "messages": [
      { "role": "user", "content": "Hello, how are you?" }
    ],
    "honeypot": "" // Anti-spam field, should be left empty
  }
  ```
- **Response**:
  ```json
  {
    "message": "I'm doing well, thank you for asking!"
  }
  ```
- **Rate Limiting**: 15 requests per 5 minutes

### History Endpoint
- **URL**: `/history`
- **Method**: `GET`
- **Authentication**: Session-based
- **Response**:
  ```json
  [
    { "role": "user", "content": "Hello, how are you?" },
    { "role": "assistant", "content": "I'm doing well, thank you for asking!" }
  ]
  ```

### Greeting Endpoint
- **URL**: `/greeting`
- **Method**: `GET`
- **Authentication**: None
- **Response**:
  ```json
  {
    "greeting": "Greetings, mere mortal. How may I grace you with my unparalleled wisdom today?"
  }
  ```

## Usage
Interact with Chatlyst through its web interface or integrate it into your existing platforms. Simply start by typing in your query or command and let Chatlyst take care of the rest with its flair.


## Contributing
Contributions to Chatlyst are welcome. If you have suggestions or improvements, feel free to fork the repository and submit a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements
    OpenAI for GPT models
    Teijo Virta - Original Creator
    All contributors and supporters

