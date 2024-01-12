

# WittyAI Chatbot
## Overview
WittyAI is a chatbot application designed to bring humor and cleverness to everyday interactions. Inspired by the playful banter of online communities like Reddit, this chatbot stands out with its sassy and sarcastic demeanor. It's built to assist users in their daily tasks and queries while maintaining a unique, engaging personality. This version of WittyAI is the "skeleton" version, which lays the foundation without predefined roles.

## Features
- Minimalistic UI
- Intelligent Conversations: Engages users with smart, witty responses.
- Task Assistance: Helps with daily tasks and information retrieval.
- Customizable AI Role. 

## Key Components
### Frontend

- React-based User Interface: A user-friendly interface for interaction with the chatbot.
- Responsive Chat Window: Includes a chat window with a floating input area and message display, styled using styled-components.
- Input Handling: Manages user inputs, sends them to the backend, and displays the chatbot's responses.
- Styled Components and Framer Motion
### Backend

- Node.js/Express: Manages API requests to the OpenAI GPT model.
- Session Management: Handles session management and stores chat history in an SQLite database.
- Security Features: Includes rate limiting, a honeypot mechanism for spam protection, logging (using Winston), and input sanitation.

### Database
- SQLite: Stores messages and chat history and manages predefined greetings and responses.

### Security and Performance

- Robust Security: Implements input validation and sanitation to prevent malicious inputs.
- Performance Optimization: Includes rate limiting and consideration for reCAPTCHA implementation.
- Cache Policy Configuration: For enhanced performance of static assets.

### Development and Testing

- Modular Codebase: Ensures maintainability and scalability.
- Unit Testing: Potential for unit testing using tools like Jest.
- Deployment Strategies: Explores various deployment strategies and integration into existing web applications.

### Challenges and Solutions

Throughout development, challenges such as database initialization, error handling, and environment variable management were tackled. Efforts were made to enhance the user experience and application performance through responsive design and caching strategies.

## Getting Started

To get started with WittyAI, follow these steps:

1. **Clone the Repository**

```bash
git clone https://github.com/yourusername/WittyAI.git
```

2. **Install Dependencies**

Navigate to the WittyAI directory and install the necessary packages.

```bash
cd WittyAI
npm install
```
3. **Environment Setup**

Set up your .env file with the required API keys and configurations.

Run the Application

```bash
npm run start
```

## Backend Environment Variables

To run the backend of the WittyAI project, you need to set the following environment variables in your `.env` file located in the backend directory:

- `API_KEY`: The API key for accessing the OpenAI GPT services.
- `API_URL`: The URL endpoint for the OpenAI API.
- `NODE_ENV`: The environment where the application is running. Typically set to `development` for development and `production` for production environments.
- `SESSION_SECRET`: A secret key used for securing sessions. Use a random, long string.
- `PORT`: The port of the server.
- `ALLOWED_ORIGINS`: The allowed CORS domains split by comma.

**Example `.env` File:**

```env
API_KEY=your_openai_api_key
API_URL=https://api.openai.com/v1/chat/completions
NODE_ENV=development
SESSION_SECRET=your_random_secret
PORT=your_server_port
ALLOWED_ORIGINS=http://localhost:3000,https://example.com
...
```

**Security Note**: Ensure that your .env file is added to .gitignore and never pushed to public repositories, especially when it contains sensitive information like API keys or secrets.

## Configuration

WittyAI allows you to customize the role prompts through environment variables. This feature provides the flexibility to change the behavior of the chatbot without altering the codebase. Below are the environment variables you can set to customize the role prompts:
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
## Usage

Interact with WittyAI through its web interface or integrate it into your existing platforms. Simply start by typing in your query or command and let WittyAI take care of the rest with its flair.

## Contributing

Contributions to WittyAI are welcome! If you have suggestions or improvements, feel free to fork the repository and submit a pull request.
## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements
    OpenAI for GPT models
    Teijo Virta - Original Creator
    All contributors and supporters