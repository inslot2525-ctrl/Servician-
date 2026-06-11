import { motion } from 'framer-motion';
import { User, Building2, ArrowRight } from 'lucide-react';

export default function Login({ onLogin }) {
  return (
    <div className="app-container" style={{ alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel"
        style={{ maxWidth: '800px', width: '100%' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '16px', background: 'var(--primary)', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>C</span>
          </div>
          <h1>Careflow AI</h1>
          <p className="subtitle" style={{ maxWidth: '500px', margin: '0 auto' }}>
            AI-powered customer care for support bots, complaint escalation, and rapid issue resolution.
          </p>
        </div>

        <div className="grid-2">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="glass-panel" 
            style={{ padding: '2rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--border-focus)' }}
            onClick={() => onLogin('user')}
          >
            <User size={32} color="var(--primary)" />
            <h3>User Portal</h3>
            <p style={{ color: 'var(--text-muted)', flex: 1 }}>Ask support questions and raise complaints seamlessly.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: '500', marginTop: '1rem' }}>
              Login as User <ArrowRight size={16} />
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="glass-panel" 
            style={{ padding: '2rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '1rem' }}
            onClick={() => onLogin('company')}
          >
            <Building2 size={32} color="var(--text-main)" />
            <h3>Company Portal</h3>
            <p style={{ color: 'var(--text-muted)', flex: 1 }}>Upload knowledge bases, configure bots, and manage complaints.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', fontWeight: '500', marginTop: '1rem' }}>
              Login as Company <ArrowRight size={16} />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
