import { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "@langchain/openai";
import { SqlDatabase } from "langchain/sql_db";
import { createSqlAgent, SqlToolkit } from "langchain/agents/toolkits/sql";
import { DataSource } from "typeorm";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { query } = req.body;
    // Configure datasource – here using SQLite with the Chinook sample database.
    const datasource = new DataSource({
      type: "postgres",
      schema: "public",
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || "5432", 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    try {
      await datasource.initialize();

      // Create a SQL database object using the datasource parameters
      const db = await SqlDatabase.fromDataSourceParams({
        appDataSource: datasource,
      });

      // Initialize the language model and agents.
      const model = new OpenAI({ temperature: 0 });
      const toolkit = new SqlToolkit(db, model);
      const sqlAgent = createSqlAgent(model, toolkit);

      // STEP 1: Agent generates the SQL query from user input
      const sqlAgentResult = await sqlAgent.invoke({ input: query });
      // Assume the generated SQL query appears in the output.
      // (In practice, you may need to parse or validate the output to extract the SQL query.)
      const generatedSQL = sqlAgentResult.output;
      console.log("Generated SQL:", generatedSQL);

      // STEP 2: Execute the generated SQL query directly on the datasource.
      // For security, you might need to sanitize or whitelist allowed queries.
      const queryResult = await datasource.query(generatedSQL);
      console.log("Query Result:", queryResult);

      // STEP 3: Use a secondary agent (or model call) to form a final answer.
      // The prompt includes the original question, the generated query and its results.
      const finalPrompt = `User question: ${query}
Generated SQL Query: ${generatedSQL}
SQL Query Result: ${JSON.stringify(queryResult, null, 2)}
Based on the above, provide a clear answer to the user's question.`;
      const finalAnswer = await model.call(finalPrompt);

      // Clean up the datasource connection
      await datasource.destroy();

      res.status(200).json({
        finalAnswer,
        generatedSQL,
        queryResult,
        intermediateSteps: sqlAgentResult.intermediateSteps,
      });
    } catch (error: any) {
      try {
        if (datasource && datasource.isInitialized) await datasource.destroy();
      } catch (_) {}
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
