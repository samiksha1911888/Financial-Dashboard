import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "../App.css";

const suggestions = [
  "monthly trend",
  "category breakdown",
  "payment methods",
  "recent transactions",
  "net balance",
];

function Chat({ setChartPreview, setLastQuestion, incrementQueryCount }) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [listening, setListening] = useState(false);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, loading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const normalizeQuestion = (value) => value.trim().toLowerCase();

  const startVoice = () => {
    if (!window.webkitSpeechRecognition) {
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-IN";
    recognition.start();
    setListening(true);

    recognition.onresult = (event) => {
      setQuestion(event.results[0][0].transcript || "");
      setListening(false);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
  };

  const previewMeta = (chartType) => {
    if (chartType === "monthly") {
      return {
        title: "Cashflow trend",
        subtitle: "Assistant-selected monthly view from the database",
      };
    }

    if (chartType === "category") {
      return {
        title: "Category performance",
        subtitle: "Assistant-selected category ranking from the database",
      };
    }

    if (chartType === "payment") {
      return {
        title: "Payment method mix",
        subtitle: "Assistant-selected payment breakdown from the database",
      };
    }

    return null;
  };

  const sendQuestion = async (customQuestion) => {
    const finalQuestion = (customQuestion ?? question).trim();

    if (!finalQuestion) {
      return;
    }

    setLoading(true);
    setLastQuestion(finalQuestion);
    incrementQueryCount();

    try {
      const normalizedQuestion = normalizeQuestion(finalQuestion);
      const res = await axios.post("/api/ask-finance", {
        question: normalizedQuestion,
      });

      const payload = {
        question: finalQuestion,
        query: res.data.query || "POST /api/ask-finance",
        data: Array.isArray(res.data.data) ? res.data.data : [],
        showSql: false,
      };

      setHistory((prev) => [...prev, payload]);

      const meta = previewMeta(res.data.chartType);
      if (meta && payload.data.length > 0) {
        setChartPreview({
          type: res.data.chartType,
          data: payload.data,
          title: meta.title,
          subtitle: meta.subtitle,
        });
      }

      setQuestion("");
    } catch (error) {
      setHistory((prev) => [
        ...prev,
        {
          question: finalQuestion,
          query: "",
          data: [],
          showSql: false,
          error: "Could not fetch insight right now.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSql = (index) => {
    setHistory((prev) =>
      prev.map((item, itemIndex) =>
        itemIndex === index ? { ...item, showSql: !item.showSql } : item
      )
    );
  };

  return (
    <div className="chat-module">
      <div className="chat-toolbar">
        <div className="suggestion-row">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              className="chip-button"
              onClick={() => sendQuestion(suggestion)}
              type="button"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      <div className="ask-row">
        <input
          ref={inputRef}
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && sendQuestion()}
          placeholder="Ask about trends, categories, payments, or recent transactions"
        />
        <button className="ask-button" onClick={() => sendQuestion()} type="button">
          Ask
        </button>
        <button className="speak-button" onClick={startVoice} type="button">
          Voice
        </button>
      </div>

      {listening && <p className="soft-note">Listening for your question...</p>}
      {loading && <p className="soft-note">Preparing response...</p>}

      <div className="chat-feed">
        {history.length === 0 && !loading && (
          <div className="empty-console">
            Ask a question and this area will show the result table and the query intent used.
          </div>
        )}

        {history.map((item, index) => (
          <div key={`${item.question}-${index}`} className="chat-entry">
            <div className="chat-question">{item.question}</div>

            <div className="chat-answer">
              <div className="chat-actions">
                <button
                  className="mini-action"
                  onClick={() => toggleSql(index)}
                  type="button"
                >
                  {item.showSql ? "Hide query" : "View query"}
                </button>
              </div>

              {item.showSql && item.query && <pre className="query-box">{item.query}</pre>}
              {item.error && <p className="error-copy">{item.error}</p>}

              {item.data.length > 0 && (
                <div className="result-table-wrap">
                  <table>
                    <thead>
                      <tr>
                        {Object.keys(item.data[0]).map((key) => (
                          <th key={key}>{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {item.data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {Object.values(row).map((value, valueIndex) => (
                            <td key={valueIndex}>{String(value)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
    </div>
  );
}

export default Chat;
