import { NextApiRequest, NextApiResponse } from "next";

import { ChatOpenAI, OpenAI } from "@langchain/openai";
import { SqlDatabase } from "langchain/sql_db";
import { SqlToolkit } from "langchain/agents/toolkits/sql";
import { DataSource } from "typeorm";
import { createReactAgent } from "@langchain/langgraph/prebuilt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { query } = req.body;

    const llm = new ChatOpenAI({
      model: "gpt-4o-mini",
      temperature: 0,
    });

    const datasource = new DataSource({
      type: "postgres",
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || "5432", 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const db = await SqlDatabase.fromDataSourceParams({
      appDataSource: datasource,
    });

    const toolkit = new SqlToolkit(db, llm);

    const tools = toolkit.getTools();

    const agentExecutor = createReactAgent({ llm, tools });

    const events = await agentExecutor.stream(
      { messages: [["user", query]] },
      { streamMode: "values" }
    );

    const result = [];

    for await (const event of events) {
      const lastMsg = event.messages[event.messages.length - 1];
      if (lastMsg.tool_calls?.length) {
      console.dir(lastMsg.tool_calls, { depth: null });
      result.push({ type: "tool_calls", data: lastMsg.tool_calls });
      } else if (lastMsg.content) {
      console.log(lastMsg.content);
      result.push({ type: "content", data: lastMsg.content });
      }
    }

    res.status(200).json({ result: result[result.length - 1]?.data });

  }
}
