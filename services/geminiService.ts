
import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

export const generateReportSummary = async (transactions: Transaction[]): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }

    if (transactions.length === 0) {
        return "There are no transactions to analyze in the selected period.";
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
You are a financial analyst assistant for a tool called Cashflow. Based on the following list of transactions, provide a concise summary and analysis. The transactions are provided in a JSON format.

Data:
${JSON.stringify({ transactions }, null, 2)}

Your analysis should include:
1.  **Overall Summary**: A brief overview of the financial activity, including total income, total expenses, and the net cash flow (income - expenses).
2.  **Key Insights**: Analyze transaction descriptions to identify the largest sources of income and biggest areas of expense. Mention the top 2-3 examples and their values.
3.  **Observations or Recommendations**: Point out any notable patterns, trends, or potential areas for financial improvement (e.g., high spending in a specific area, inconsistent income). Keep it brief and actionable.

Present the report in clear, easy-to-read markdown format. Start with a top-level heading '# Financial Summary'. Use bullet points for lists.
Do not include the raw JSON data in your response.
Be friendly and encouraging.
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Gemini API call failed:", error);
        throw new Error("Failed to generate AI summary. The API call was unsuccessful.");
    }
};