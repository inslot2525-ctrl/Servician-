import { motion } from 'framer-motion';
import { Bot, AlertCircle, Users, ArrowRight } from 'lucide-react';

export default function Dashboard({ role, onStart, onLogout }) {
  const isCompany = role === 'company';

  return (
    <div className="app-container" style={{ flexDirection: 'column' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 4rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-panel)', backdropFilter: 'blur(12px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>C</div>
          <span style={{ fontSize: '1.25rem', fontWeight: '600' }}>Careflow</span>
        </div>
        <button className="btn-ghost" onClick={onLogout}>Sign Out</button>
      </header>

      <main style={{ padding: '4rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <h1>AI Customer Resolution Platform</h1>
          <p className="subtitle" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Welcome to the {isCompany ? 'Company' : 'User'} Portal. Experience next-generation AI support that resolves issues faster and smarter.
          </p>
        </motion.div>

        <div className="grid-3" style={{ marginBottom: '4rem' }}>
          <FeatureCard 
            icon={<Bot size={24} />} 
            title="Knowledge Bot" 
            desc="AI answers strictly from uploaded company manuals and policies." 
          />
          <FeatureCard 
            icon={<AlertCircle size={24} />} 
            title="Complaint Intelligence" 
            desc="Automatic summarization, sentiment analysis, and smart prioritization." 
          />
          <FeatureCard 
            icon={<Users size={24} />} 
            title="Human Escalation" 
            desc="Unresolved matters are quickly packaged into actionable tickets." 
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary" 
            style={{ fontSize: '1.125rem', padding: '1rem 2.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            onClick={onStart}
          >
            Enter Portal <ArrowRight size={20} />
          </motion.button>
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-panel" 
      style={{ padding: '2rem' }}
    >
      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
        {icon}
      </div>
      <h3 style={{ marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-muted)' }}>{desc}</p>
    </motion.div>
  );
}
