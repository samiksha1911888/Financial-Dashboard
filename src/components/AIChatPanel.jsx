import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const suggestions = [
  "Monthly Trend",
  "Top Category",
  "Payment Methods",
  "Recent Transactions",
];

function buildInsightMessage(question, rows) {
  if (!rows.length) {
    return `No rows returned for "${question}".`;
  }

  return `${rows.length} result${rows.length > 1 ? "s" : ""} returned for "${question}".`;
}

function formatPromptCount(count) {
  return `${count} ${count === 1 ? "prompt" : "prompts"}`;
}

function AIChatPanel({
  setChartPreview,
  setLastQuestion,
  incrementQueryCount,
  lastQuestion,
  queryCount,
  chartPreview,
}) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const feedEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof feedEndRef.current?.scrollIntoView === "function") {
      feedEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history, loading]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      }
    };
  }, []);

  const previewRows = useMemo(() => {
    if (!chartPreview?.data?.length) {
      return [];
    }

    return chartPreview.data.map((item) => ({
      ...item,
      label: item.category || item.paymentMethod || item.month,
      value: Number(item.value ?? item.expense ?? item.total ?? Math.abs(item.net ?? 0)),
      income: Number(item.income || 0),
      expense: Number(item.expense || 0),
    }));
  }, [chartPreview]);

  const previewBarHeight = useMemo(
    () => Math.max(240, previewRows.length * 42),
    [previewRows.length]
  );

  const sendQuestion = async (customQuestion) => {
    const finalQuestion = (customQuestion ?? question).trim();

    if (!finalQuestion) {
      return;
    }

    setLoading(true);
    setLastQuestion(finalQuestion);
    incrementQueryCount();

    try {
      const response = await axios.post("/api/ask-finance", {
        question: finalQuestion.toLowerCase(),
      });

      const rows = Array.isArray(response.data.data) ? response.data.data : [];
      const nextEntry = {
        question: finalQuestion,
        response: buildInsightMessage(finalQuestion, rows),
        rows,
      };

      setHistory((prev) => [...prev, nextEntry]);

      if (response.data.chartType && rows.length) {
        setChartPreview({
          type: response.data.chartType,
          data: rows,
          title: finalQuestion,
          subtitle: "AI-updated chart from your finance API",
        });
      }

      setQuestion("");
    } catch (error) {
      setHistory((prev) => [
        ...prev,
        {
          question: finalQuestion,
          response: "The assistant could not fetch data right now.",
          rows: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError("Voice input not supported in this browser");
      return;
    }

    setVoiceError("");

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript || "")
        .join(" ")
        .trim();

      setQuestion(transcript);
    };

    recognition.onerror = () => {
      setVoiceError("Voice input not supported in this browser");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <section className="ai-panel glass-card fade-in">
      <div className="card-head">
        <div>
          <p className="eyebrow">AI Assistant</p>
          <h2>Query your data using natural language</h2>
          <span>{formatPromptCount(queryCount)} • {lastQuestion || "No prompt yet"}</span>
        </div>
      </div>

      <div className="suggestion-strip">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            className="suggestion-chip"
            onClick={() => sendQuestion(suggestion)}
          >
            {suggestion}
          </button>
        ))}
      </div>

      <div className="ai-input-row">
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && sendQuestion()}
          placeholder="Ask your data or speak..."
        />
        <button
          type="button"
          className={`mic-button ${isListening ? "listening" : ""}`}
          onClick={toggleVoiceInput}
          aria-label={isListening ? "Stop voice input" : "Start voice input"}
          title={isListening ? "Stop voice input" : "Start voice input"}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 15a3 3 0 0 0 3-3V7a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3m5-3a1 1 0 1 1 2 0 7 7 0 0 1-6 6.93V21h2a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2h2v-2.07A7 7 0 0 1 5 12a1 1 0 1 1 2 0 5 5 0 0 0 10 0" />
          </svg>
        </button>
        <button type="button" className="send-button" onClick={() => sendQuestion()}>
          Ask AI
        </button>
      </div>

      {loading && <p className="ai-status">Thinking through your finance data...</p>}
      {isListening && <p className="ai-status">Listening...</p>}
      {voiceError && <p className="ai-status voice-error">{voiceError}</p>}

      <div className="ai-panel-grid">
        <div className="ai-history">
          {history.length === 0 && !loading && (
            <div className="ai-empty">Try "Show monthly trend" or "Payment methods".</div>
          )}

          {history.map((item, index) => (
            <div key={`${item.question}-${index}`} className="ai-entry">
              <div className="ai-bubble user">{item.question}</div>
              <div className="ai-bubble bot">
                <p>{item.response}</p>
                {item.rows.length > 0 && (
                  <div className="ai-table-wrap">
                    <table>
                      <thead>
                        <tr>
                          {Object.keys(item.rows[0]).map((key) => (
                            <th key={key}>{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {item.rows.slice(0, 5).map((row, rowIndex) => (
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
          <div ref={feedEndRef} />
        </div>

        <div className="ai-preview-card">
          <div className="ai-preview-head">
            <strong>{chartPreview?.title || "Live preview"}</strong>
            <span>{chartPreview?.subtitle || "Dynamic chart/result preview"}</span>
          </div>
{!previewRows.length ? (
  <div className="ai-preview-empty">Ask a question to see a live preview here.</div>
) : chartPreview?.type === "monthly" ? (
  <div className="ai-preview-chart">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={previewRows} margin={{ top: 10, right: 12, left: 12, bottom: 20 }}>
        <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
        <XAxis
          dataKey="month"
          stroke="rgba(255,255,255,0.62)"
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="rgba(255,255,255,0.62)"
          tickLine={false}
          axisLine={false}
          width={52}
          tickFormatter={(value) => {
            const num = Number(value || 0);
            if (num >= 100000) return `${(num / 100000).toFixed(num >= 1000000 ? 0 : 1)}L`;
            if (num >= 1000) return `${(num / 1000).toFixed(num >= 10000 ? 0 : 1)}K`;
            return `${num}`;
          }}
        />
        <Tooltip
          contentStyle={{
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(14,18,28,0.96)",
            color: "#f8fafc",
          }}
        />
        <Line type="monotone" dataKey="income" stroke="#6CFF8F" strokeWidth={2.5} dot={false} />
        <Line type="monotone" dataKey="expense" stroke="#FF7070" strokeWidth={2.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
) : (
  <div className="ai-preview-chart">
    <ResponsiveContainer width="100%" height={previewBarHeight}>
      <BarChart
        data={previewRows}
        layout="vertical"
        margin={{ top: 10, right: 12, left: 12, bottom: 10 }}
        barCategoryGap="22%"
      >
        <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
        <XAxis
          type="number"
          stroke="rgba(255,255,255,0.62)"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11 }}
          tickFormatter={(value) => {
            const num = Number(value || 0);
            if (num >= 100000) return `${(num / 100000).toFixed(num >= 1000000 ? 0 : 1)}L`;
            if (num >= 1000) return `${(num / 1000).toFixed(num >= 10000 ? 0 : 1)}K`;
            return `${num}`;
          }}
        />
        <YAxis
          type="category"
          dataKey="label"
          stroke="rgba(255,255,255,0.62)"
          tickLine={false}
          axisLine={false}
          width={78}
          tick={{ fontSize: 11 }}
        />
        <Tooltip
          contentStyle={{
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(14,18,28,0.96)",
            color: "#f8fafc",
          }}
        />
        <Bar dataKey="value" fill="#E9FF54" radius={[0, 10, 10, 0]} barSize={18} />
      </BarChart>
    </ResponsiveContainer>
  </div>
)}
  </div>
      </div>
    </section>
  );
}

export default AIChatPanel;
