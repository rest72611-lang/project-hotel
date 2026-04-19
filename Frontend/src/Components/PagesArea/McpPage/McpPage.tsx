import { useState } from "react";
import { Navigate } from "react-router-dom";


import "./McpPage.css";
import { authService } from "../../../Services/AuthService";
import { aiFrontService } from "../../../Services/mcp-service";

function McpPage() {
    const user = authService.getUser();

    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    if (!user) {
        return <Navigate to="/login" />;
    }

    const userId = user.userId;

    async function ask(): Promise<void> {
        try {
            setError("");
            setAnswer("");

            const trimmedQuestion = question.trim();

            if (!trimmedQuestion) {
                setError("יש להזין שאלה.");
                return;
            }

            setLoading(true);

            const result = await aiFrontService.askVacationsQuestion(
                userId,
                trimmedQuestion
            );

            setAnswer(result);
        }
        catch (err: any) {
            setError(err.response?.data?.message || err.message);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="McpPage">
            <h1>דף תקשורת עם שרת MCP</h1>

            <div className="questionCard">
                <h2>Ask me anything about our vacations</h2>

                <label>Question</label>

                <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="כתוב כאן שאלה..."
                />

                <button onClick={ask} disabled={loading}>
                    {loading ? "Loading..." : "Ask"}
                </button>

                {error && <div className="errorText">{error}</div>}
            </div>

            {answer && (
                <div className="answerBox">
                    <h3>תשובה:</h3>
                    <pre>{answer}</pre>
                </div>
            )}
        </div>
    );
}

export default McpPage;