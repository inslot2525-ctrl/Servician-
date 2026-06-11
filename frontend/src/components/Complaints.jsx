import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Activity, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

const API_BASE = "http://127.0.0.1:8080";

export function RaiseComplaint() {
  const [form, setForm] = useState({ name: "", email: "", company: "", category: "", description: "" });
  const [ticket, setTicket] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit() {
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/complaints`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("API Error");

      const data = await res.json();
      setTicket(data);
    } catch {
      setTicket({
        ticket_id: "ERROR",
        ai_analysis: "Backend not reachable. Start FastAPI server.",
        status: "Failed",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (ticket) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel" style={{ maxWidth: '800px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', padding: '1rem', background: ticket.status === 'Failed' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)', borderRadius: '50%', color: ticket.status === 'Failed' ? '#ef4444' : '#22c55e', marginBottom: '1rem' }}>
            {ticket.status === 'Failed' ? <AlertCircle size={40} /> : <CheckCircle2 size={40} />}
          </div>
          <h2>{ticket.status === 'Failed' ? 'Submission Failed' : 'Complaint Escalated Successfully'}</h2>
          <p style={{ color: 'var(--text-muted)' }}>Ticket ID: <strong style={{ color: 'var(--text-main)' }}>{ticket.ticket_id}</strong></p>
        </div>
        
        {ticket.status !== 'Failed' && (
          <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity size={20} color="var(--primary)" /> AI Analysis</h3>
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              {ticket.ai_analysis}
            </pre>
          </div>
        )}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button className="btn-ghost" onClick={() => { setTicket(null); setForm({ name: "", email: "", company: "", category: "", description: "" }); }}>Submit Another</button>
        </div>
      </motion.div>
    );
  }

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2>Raise a Complaint</h2>
        <p className="subtitle">Our AI intelligently categorizes, summarizes, and escalates your issue to the right team.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel">
        <div className="grid-2">
          <div className="form-group">
            <label>Full Name</label>
            <input className="input-field" name="name" value={form.name} onChange={update} placeholder="John Doe" />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input className="input-field" type="email" name="email" value={form.email} onChange={update} placeholder="john@example.com" />
          </div>
        </div>
        <div className="grid-2">
          <div className="form-group">
            <label>Company/Product</label>
            <input className="input-field" name="company" value={form.company} onChange={update} placeholder="Acme Corp" />
          </div>
          <div className="form-group">
            <label>Category</label>
            <input className="input-field" name="category" value={form.category} onChange={update} placeholder="Billing, Tech Support, etc." />
          </div>
        </div>
        <div className="form-group" style={{ marginBottom: '2rem' }}>
          <label>Detailed Description</label>
          <textarea className="input-field" name="description" value={form.description} onChange={update} placeholder="Please describe the issue in detail..." />
        </div>
        <button className="btn-primary" onClick={submit} disabled={isSubmitting || !form.name || !form.description} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isSubmitting ? 'Processing...' : <><ShieldAlert size={18} /> Escalate Issue</>}
        </button>
      </motion.div>
    </div>
  );
}

export function ComplaintsDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadComplaints() {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/complaints`);
      if (res.ok) {
        const data = await res.json();
        setComplaints(data.complaints || []);
      }
    } catch {
      setComplaints([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadComplaints();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Complaints Dashboard</h2>
          <p className="subtitle" style={{ marginBottom: 0 }}>Review AI-classified complaints and escalated tickets.</p>
        </div>
        <button className="btn-ghost" onClick={loadComplaints} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} style={isLoading ? { animation: 'spin 1s linear infinite' } : {}} /> Refresh
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {!isLoading && complaints.length === 0 && (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
            No complaints found. All good!
          </div>
        )}

        {complaints.map((c, i) => (
          <motion.div key={c.ticket_id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {c.ticket_id}
                  <span className={`status-badge status-${c.status}`}>{c.status}</span>
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  {c.name} ({c.email}) &bull; {c.company} &bull; {c.category}
                </p>
              </div>
            </div>
            
            <div className="grid-2" style={{ gap: '1.5rem' }}>
              <div>
                <h4 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Original Description</h4>
                <p style={{ background: 'rgba(15, 23, 42, 0.3)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.9375rem' }}>{c.description}</p>
              </div>
              <div>
                <h4 style={{ fontSize: '0.875rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Activity size={14} /> AI Analysis
                </h4>
                <pre style={{ background: 'rgba(99, 102, 241, 0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.2)', fontSize: '0.9375rem', whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0 }}>
                  {c.ai_analysis}
                </pre>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
