import { useEffect, useState } from "react";

const API_BASE = "https://servician-production.up.railway.app";

export default function App() {
  const [screen, setScreen] = useState("login");
  const [role, setRole] = useState(null);

  function login(selectedRole) {
    setRole(selectedRole);
    setScreen("dashboard");
  }

  function logout() {
    setRole(null);
    setScreen("login");
  }

  if (screen === "login") return <LoginPage login={login} />;

  if (screen === "dashboard") {
    return (
      <Dashboard
        role={role}
        logout={logout}
        start={() => setScreen(role)}
      />
    );
  }

  if (screen === "company") return <CompanyPortal logout={logout} />;

  return <UserPortal logout={logout} />;
}

function LoginPage({ login }) {
  return (
    <div className="login-page">
      <header className="landing-header">
        <div className="brand">
          <span className="brand-mark">C</span>
          <span>Careflow</span>
        </div>
        <nav className="landing-nav">
          <a href="#product">Product</a>
          <a href="#enterprise">Enterprise</a>
          <a href="#pricing">Pricing</a>
          <a href="#resources">Resources</a>
        </nav>
        <div className="header-actions">
          <button className="ghost-btn" type="button">Sign in</button>
          <button className="light-btn" type="button">Contact sales</button>
        </div>
      </header>

      <div className="hero">
        <p className="eyebrow">Careflow AI</p>
        <h1>Built for extraordinary support performance.</h1>
        <p>
          AI-powered customer care for company support bots, complaint escalation,
          and fast, accurate customer resolution.
        </p>
        <div className="hero-actions">
          <button onClick={() => login("company")}>Get started</button>
          <button className="ghost-btn" onClick={() => login("user")}>
            Request a demo
          </button>
        </div>
      </div>

      <div className="login-grid">
        <div className="login-card">
          <h2>User Login</h2>
          <p>Ask support questions and raise complaints.</p>
          <button onClick={() => login("user")}>Login as User</button>
        </div>

        <div className="login-card">
          <h2>Company Login</h2>
          <p>Upload company documents, run support bots, and manage complaints.</p>
          <button onClick={() => login("company")}>Login as Company</button>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ role, start, logout }) {
  return (
    <div>
      <nav className="topbar">
        <h2>Careflow</h2>
        <button onClick={logout}>Logout</button>
      </nav>

      <section className="dashboard-hero">
        <h1>AI Customer Resolution Platform</h1>
        <p>
          Careflow helps companies create AI support bots from their own
          documents. Customers can get accurate answers, raise complaints, and
          receive faster escalation support.
        </p>

        <div className="feature-grid">
          <Feature
            title="Company Knowledge Bot"
            text="Upload company policies, FAQs, manuals, and service documents. The bot answers from company knowledge."
          />
          <Feature
            title="AI Complaint Intelligence"
            text="Complaints are summarized, classified, prioritized, and prepared for escalation."
          />
          <Feature
            title="Human Escalation"
            text="Unresolved issues are turned into actionable tickets for support teams."
          />
        </div>

        <button className="big-btn" onClick={start}>
          Get Started as {role === "company" ? "Company" : "User"}
        </button>
      </section>
    </div>
  );
}

function Feature({ title, text }) {
  return (
    <div className="feature-card">
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

function CompanyPortal({ logout }) {
  const [page, setPage] = useState("upload");

  return (
    <div className="portal">
      <Sidebar
        title="Company Portal"
        logout={logout}
        page={page}
        setPage={setPage}
        items={[
          ["upload", "Upload Docs"],
          ["bot", "Support Bot"],
          ["complaints", "Complaints"],
        ]}
      />

      <main className="content">
        {page === "upload" && <UploadDocs />}
        {page === "bot" && <SupportBot title="Company Support Bot" />}
        {page === "complaints" && <ComplaintsDashboard />}
      </main>
    </div>
  );
}

function UserPortal({ logout }) {
  const [page, setPage] = useState("support");

  return (
    <div className="portal">
      <Sidebar
        title="User Portal"
        logout={logout}
        page={page}
        setPage={setPage}
        items={[
          ["support", "Support Bot"],
          ["complaint", "Raise Complaint"],
        ]}
      />

      <main className="content">
        {page === "support" && <SupportBot title="User Support Bot" />}
        {page === "complaint" && <RaiseComplaint />}
      </main>
    </div>
  );
}

function Sidebar({ title, items, page, setPage, logout }) {
  return (
    <aside className="sidebar">
      <h2>Careflow</h2>
      <p>{title}</p>

      <div className="menu">
        {items.map(([key, label]) => (
          <button
            key={key}
            className={page === key ? "active" : ""}
            onClick={() => setPage(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <button className="logout" onClick={logout}>
        Logout
      </button>
    </aside>
  );
}

function UploadDocs() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  async function upload() {
    if (!file) {
      setMessage("Select a document first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setMessage(data.message || "Document uploaded successfully.");
    } catch {
      setMessage("Upload failed. Check backend.");
    }
  }

  return (
    <section>
      <h1>Upload Company Documents</h1>
      <p className="subtitle">
        Upload company FAQs, policies, manuals, refund rules, or service documents.
      </p>

      <div className="panel">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={upload}>Upload Document</button>
        {message && <p className="status">{message}</p>}
      </div>
    </section>
  );
}

function SupportBot({ title }) {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hello. I am Careflow support assistant. Ask me anything related to uploaded company documents.",
    },
  ]);
  const [input, setInput] = useState("");

  async function send() {
    if (!input.trim()) return;

    const userText = input;
    setInput("");

    setMessages((prev) => [...prev, { role: "user", text: userText }]);

    try {
      const res = await fetch(
        `${API_BASE}/query?q=${encodeURIComponent(userText)}`,
        { method: "POST" }
      );

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "bot", text: data.response || "No answer received." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Backend not reachable. Start FastAPI server." },
      ]);
    }
  }

  return (
    <section>
      <h1>{title}</h1>
      <p className="subtitle">
        This bot uses company-specific RAG to answer from uploaded documents.
      </p>

      <div className="chat-box">
        <div className="messages">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "msg user" : "msg bot"}>
              {m.text}
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input
            placeholder="Ask your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button onClick={send}>Send</button>
        </div>
      </div>
    </section>
  );
}

function RaiseComplaint() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    category: "",
    description: "",
  });

  const [ticket, setTicket] = useState(null);

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit() {
    try {
      const res = await fetch(`${API_BASE}/complaints`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setTicket(data);
    } catch {
      setTicket({
        ticket_id: "ERROR",
        ai_analysis: "Backend not reachable. Start FastAPI server.",
        status: "Failed",
      });
    }
  }

  return (
    <section>
      <h1>Raise Complaint</h1>
      <p className="subtitle">
        Submit your issue. Careflow classifies, summarizes, prioritizes, and escalates it.
      </p>

      <div className="panel">
        <input name="name" placeholder="Your name" onChange={update} />
        <input name="email" placeholder="Your email" onChange={update} />
        <input name="company" placeholder="Company name" onChange={update} />
        <input name="category" placeholder="Complaint category" onChange={update} />
        <textarea
          name="description"
          placeholder="Describe your complaint..."
          onChange={update}
        />
        <button onClick={submit}>Submit Complaint</button>
      </div>

      {ticket && (
        <div className="panel">
          <h2>Complaint Created</h2>
          <p><strong>Ticket ID:</strong> {ticket.ticket_id}</p>
          <p><strong>Status:</strong> {ticket.status}</p>
          <pre>{ticket.ai_analysis}</pre>
        </div>
      )}
    </section>
  );
}

function ComplaintsDashboard() {
  const [complaints, setComplaints] = useState([]);

  async function loadComplaints() {
    try {
      const res = await fetch(`${API_BASE}/complaints`);
      const data = await res.json();
      setComplaints(data.complaints || []);
    } catch {
      setComplaints([]);
    }
  }

  useEffect(() => {
    loadComplaints();
  }, []);

  return (
    <section>
      <h1>Complaints Dashboard</h1>
      <p className="subtitle">
        View AI-classified complaints and escalation-ready tickets.
      </p>

      <button onClick={loadComplaints}>Refresh Complaints</button>

      <div className="ticket-list">
        {complaints.length === 0 && <p>No complaints yet.</p>}

        {complaints.map((c) => (
          <div className="ticket" key={c.ticket_id}>
            <h3>{c.ticket_id}</h3>
            <p><strong>Customer:</strong> {c.name}</p>
            <p><strong>Company:</strong> {c.company}</p>
            <p><strong>Status:</strong> {c.status}</p>
            <pre>{c.ai_analysis}</pre>
          </div>
        ))}
      </div>
    </section>
  );
}
