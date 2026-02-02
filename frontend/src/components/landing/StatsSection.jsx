import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { label: 'Students Empowered', value: '25K+' },
  { label: 'AI-Generated Roadmaps', value: '8.2K' },
  { label: 'Internships & Placements', value: '3.1K' },
  { label: 'Average Resume Uplift', value: '+34%' },
];

const StatsSection = () => (
  <section className="lb-stats">
    <div className="lb-stats-inner">
      <div className="lb-stats-grid">
        {stats.map((s, idx) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
            className="lb-stats-card"
          >
            <p className="lb-stats-value">{s.value}</p>
            <p className="lb-stats-label">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default StatsSection;
