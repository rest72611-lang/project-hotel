import { useState } from "react";
import { Navigate } from "react-router-dom";

import "./McpPage.css";
import { authService } from "../../../Services/AuthService";
import { aiFrontService } from "../../../Services/mcp-service";
import Spinner from "../ShardArea/Spinner";

function McpPage() {
    // This page is also limited to regular users to keep admin navigation focused on management tasks.
    const user = authService.getUser();

    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (user.role?.toLowerCase() === "admin") {
        return <Navigate to="/home" />;
    }

    async function ask(): Promise<void> {
        try {
            setError("");
            setAnswer("");

            const trimmedQuestion = question.trim();

            if (!trimmedQuestion) {
                setError("Please enter a question.");
                return;
            }

            setLoading(true);

            // The backend now derives the current user from the bearer token.
            const result = await aiFrontService.askVacationsQuestion(trimmedQuestion);

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
            <h1>MCP Communication Page</h1>

            <div className="questionCard">
                <h2>Ask me anything about our vacations</h2>

                <label>Question</label>

                <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Type your question here..."
                />

                <button onClick={ask} disabled={loading}>
                    Ask
                </button>

                {error && <div className="errorText">{error}</div>}
            </div>

            {loading && <Spinner />}

            {!loading && answer && (
                <div className="answerBox">
                    <h3>Answer:</h3>
                    <pre>{answer}</pre>
                </div>
            )}
        </div>
    );
}

export default McpPage;
