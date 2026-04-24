import { useState } from "react";
import { Navigate } from "react-router-dom";

import "./McpPage.css";
import { authService } from "../../../Services/AuthService";
import { aiFrontService } from "../../../Services/mcp-service";
import Spinner from "../ShardArea/Spinner";

const suggestedQuestions = [
    "Which vacations did I like?",
    "Show me all upcoming vacations.",
    "What is the price of vacation 3?",
    "Tell me about vacation 2."
];

function McpPage() {
    // This page is also limited to regular users to keep admin navigation focused on management tasks.
    const user = authService.getUser();

    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const trimmedQuestion = question.trim();

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
            <div className="McpPageIntro">
                <h1>Vacation AI Assistant</h1>
                <p>
                    Ask about your vacations, likes, prices, dates, or a specific vacation ID.
                    The assistant now checks backend data before answering system-related questions.
                </p>
            </div>

            <div className="questionCard">
                <h2>Ask a vacation question</h2>
                <p className="questionCardDescription">
                    Use natural language, or pick one of the quick examples below to get started faster.
                </p>

                <div className="suggestionsRow">
                    {suggestedQuestions.map((suggestion) => (
                        <button
                            key={suggestion}
                            type="button"
                            className="suggestionChip"
                            onClick={() => setQuestion(suggestion)}
                            disabled={loading}
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>

                <label>Question</label>

                <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Example: Which vacations did I like?"
                />

                <button onClick={ask} disabled={loading || !trimmedQuestion}>
                    {loading ? "Checking vacation data..." : "Ask Assistant"}
                </button>

                {error && <div className="errorText">{error}</div>}
            </div>

            {loading && <Spinner />}

            {!loading && !answer && !error && (
                <div className="answerEmptyState">
                    <h3>Ready when you are.</h3>
                    <p>
                        Ask about your vacations, prices, dates, likes, or a specific vacation ID to get a verified answer.
                    </p>
                </div>
            )}

            {!loading && answer && (
                <div className="answerBox">
                    <h3>Verified Answer</h3>
                    <pre>{answer}</pre>
                </div>
            )}
        </div>
    );
}

export default McpPage;
