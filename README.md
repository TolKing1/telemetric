# Telemetric Documentation

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed Node.js and npm.
- You have a Telegram API ID and Hash. You can obtain these by creating an application on [my.telegram.org](https://my.telegram.org).
- You have a Gemini API key. You can obtain this by creating an account on [Gemini](https://www.gemini.com).
- You have set up your environment variables in a `.env` file at the root of your project:

```env
TELEGRAM_API_ID=your_api_id
TELEGRAM_API_HASH=your_api_hash
TELEGRAM_SESSION=
GEMINI_API_KEY=your_gemini_api_key
```

Note: You don't actually need to provide a value for `TELEGRAM_SESSION`, just include the variable itself because it is automatically created for you.

## Installation

1. **Clone the repository:**

    ```sh
    git clone https://github.com/TolKing1/telemetric.git
    cd telemetric
    ```

2. **Install the dependencies:**

    ```sh
    npm install
    ```

## Running the Project

1. **Set up your environment variables:**

    Ensure your `.env` file is correctly set up with the required variables as mentioned in the Prerequisites section.

2. **Start the project in production mode:**

    ```sh
    npm run start
    ```

3. **Fill in your number and codes:**

     After starting the project for the first time, fill in your number and codes in the console. 
     
     *Note: For next runs, simply start the project as your session will be saved in the `.env` file. You dont need to provide telephone number and code*

## Telegram usage

### Gemini Feature Documentation

#### 1. Prompt Creation
Want to create a prompt in any chat? Just type:

```sh
pr [Prompt]
```

For example:
```sh
pr What is the weather like today?
```

Replace `Prompt` with your actual prompt. Your message will magically transform to display the actual message you intended.

#### 2. Message Translation
Need to translate a message? Just reply with:

```sh
tr [Language]
```

For example:

```sh
tr Spanish
```

Your message will be translated and sent to your private chat (**Favourites**).

*Note: Make sure to reply to the message you want to translate.*
## Logging

The project uses `winston` for logging. Logs are output to both the console and a file located at `logs/all.log`.

### Log Levels

- `debug`: Detailed information, typically of interest only when diagnosing problems.
- `info`: Confirmation that things are working as expected.
- `warn`: An indication that something unexpected happened, or indicative of some problem in the near future.
- `error`: Due to a more serious problem, the software has not been able to perform some function.

### Example Log Messages

- `[YYYY-MM-DD HH:mm:ss] [INFO] - You are now connected.`
- `[YYYY-MM-DD HH:mm:ss] [ERROR] - Failed to send message to chat -1001254068214: Some error message`

## Project Structure

- `src/`: Source file for ts files
  - `client.ts`: Initializes the Telegram client.
  - `config.ts`: Loads and exports configuration from environment variables.
  - `handler/`: Handlers
    - `message/`: Handlers of message type
  - `services/`: Service classes for handlers
  - `utils/`: Utility tools and functions
- `.env`: Env file with your private data
