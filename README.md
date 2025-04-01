# My Langchain SQL Agent App

This project is a Next.js application that integrates a SQL agent using Langchain. It allows users to interact with a SQL database through a user-friendly interface.

## Project Structure

```
my-langchain-sqlagent-app
├── components
│   └── AgentUI.tsx          # UI component for interacting with the SQL agent
├── lib
│   └── sqlAgent.ts          # Logic for SQL database interactions
├── pages
│   ├── api
│   │   └── sqlAgent.ts      # API route for SQL agent requests
│   └── index.tsx            # Main page component
├── public
│   └── favicon.ico          # Application favicon
├── package.json              # npm configuration file
├── tsconfig.json             # TypeScript configuration file
└── README.md                 # Project documentation
```

## Features

- **User Interface**: The `AgentUI` component provides an interface for users to input SQL queries and view results.
- **SQL Agent Logic**: The `SqlAgent` class handles database connections and query execution.
- **API Integration**: The API route processes user requests and communicates with the SQL agent.

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/my-langchain-sqlagent-app.git
   ```

2. Navigate to the project directory:
   ```
   cd my-langchain-sqlagent-app
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Run the application:
   ```
   npm run dev
   ```

5. Open your browser and go to `http://localhost:3000` to access the application.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.