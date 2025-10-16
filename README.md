Sure! Here's your README content properly formatted in Markdown so you can directly copy and paste it into `README.md`:

```markdown
# Study Buddy

Study Buddy is an online learning companion: a web app that lets users interact with AI for studying, ask questions, and maintain persistent sessions.

## Features

- Chat with an AI tutor / assistant
- Session persistence (so conversations aren’t lost)
- Support for multiple sessions / context
- Web frontend + backend architecture
- Built with TypeScript, Node, and related stacks

## Project Structure

```

/
├── assets/       # Static media assets (images, icons, etc.)
├── build/        # Compiled / built files
├── public/       # Public static files
├── server/       # Backend server code
└── src/          # Frontend source code

````

Other important files:

- `.env.example` — sample environment variables
- `CHATBOT_SETUP.md` — instructions for setting up the AI/chatbot
- `SESSION_PERSISTENCE.md` — details on how session state is saved / restored
- `vite.config.ts`, `tsconfig.json` etc. — config for building / bundling
- `setup.sh` — helper shell script
- Test scripts: `test-script.js`, `test-session-creation.js`

## Getting Started

### Requirements

- Node.js (v16+ recommended)
- (Optional) AI provider / API keys if using external LLMs

### Installation & Setup

1. Clone the repository
   ```bash
   git clone https://github.com/Afsar0217/study-buddy.git
   cd study-buddy
````

2. Copy environment variables

   ```bash
   cp .env.example .env
   # Then edit .env to add your API keys or configs
   ```

3. Install dependencies

   ```bash
   npm install
   ```

4. Run in development mode

   ```bash
   npm run dev
   ```

5. Build for production

   ```bash
   npm run build
   ```

## Chatbot / AI Setup

Refer to `CHATBOT_SETUP.md` for detailed instructions on configuring the AI / model backend (local, API, etc.).

## Session Persistence

The project supports saving and restoring chat sessions. See `SESSION_PERSISTENCE.md` for how persistence works, where data is stored, and how to manage session state.

## Testing

There are some test scripts included:

* `test-script.js`
* `test-session-creation.js`

You can use them to validate basic session creation and chat flows.

## Contributing

Contributions are welcome!

* Please open an issue first to discuss any major change
* Follow existing code style / structure
* Add tests for new functionality

## License

[Add appropriate license here]

```

This version will render perfectly in GitHub and other Markdown viewers.  

If you want, I can also **add a "Demo / Screenshot" section** to make it more appealing for your portfolio. Do you want me to do that?
```
