import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const API_BASE = "http://127.0.0.1:8080";

export default function UploadDocs() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [isUploading, setIsUploading] = useState(false);

  async function upload() {
    if (!file) {
      setStatus({ type: 'error', msg: 'Please select a document first.' });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    setStatus({ type: '', msg: '' });

    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed.");

      const data = await res.json();
      setStatus({ type: 'success', msg: data.message || `Successfully processed ${data.chunks_created} chunks.` });
      setFile(null);
    } catch {
      setStatus({ type: 'error', msg: 'Upload failed. Ensure backend is running.' });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2>Upload Documents</h2>
        <p className="subtitle">Enhance the AI's knowledge base by uploading company policies, FAQs, or manuals.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel" 
        style={{ maxWidth: '600px' }}
      >
        <div style={{ border: '2px dashed var(--border-focus)', borderRadius: '12px', padding: '3rem 2rem', textAlign: 'center', marginBottom: '1.5rem', background: 'rgba(99, 102, 241, 0.05)' }}>
          <Upload size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>Select a file to upload</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>Supported formats: PDF, DOCX, TXT</p>
          
          <input 
            type="file" 
            id="file-upload"
            style={{ display: 'none' }}
            onChange={(e) => setFile(e.target.files[0])}
            accept=".pdf,.docx,.txt"
          />
          <label htmlFor="file-upload" className="btn-ghost" style={{ display: 'inline-block', cursor: 'pointer' }}>
            Choose File
          </label>
        </div>

        {file && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', marginBottom: '1.5rem' }}>
            <FileText size={24} color="var(--text-muted)" />
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: '500', margin: 0 }}>{file.name}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: 0 }}>{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
        )}

        <button 
          className="btn-primary" 
          onClick={upload} 
          disabled={!file || isUploading}
          style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
        >
          {isUploading ? (
            <><Loader2 className="animate-spin" size={18} style={{ animation: 'spin 1s linear infinite' }} /> Processing...</>
          ) : (
            <>Upload and Process</>
          )}
        </button>

        {status.msg && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: '8px', display: 'flex', gap: '0.75rem', alignItems: 'flex-start', background: status.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)', color: status.type === 'error' ? '#fca5a5' : '#86efac', border: `1px solid ${status.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)'}` }}
          >
            {status.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
            <span style={{ flex: 1 }}>{status.msg}</span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
