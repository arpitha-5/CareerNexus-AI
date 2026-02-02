import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Ananya, CS Undergrad',
    quote:
      'CareerNexus AI turned my scattered learning into a focused roadmap. The AI mentor and XP system kept me consistent.',
  },
  {
    name: 'Rahul, Full-stack Mentor',
    quote:
      'I can assign adaptive tasks, track student progress, and let the AI handle insights. Huge upgrade over generic LMS tools.',
  },
  {
    name: 'Placement Cell Admin',
    quote:
      'From resume analytics to internship tracking, everything is in one place with clean dashboards and powerful filters.',
  },
];

const TestimonialsSection = () => (
  <section id="community" className="lb-testimonials">
    <div className="lb-testimonials-inner">
      <p className="lb-testimonials-kicker">VOICES FROM THE BRIDGE</p>
      <h2 className="lb-testimonials-title">Loved by students, mentors &amp; admins</h2>
      <div className="lb-testimonials-grid">
        {testimonials.map((t, idx) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="lb-testimonial-card"
          >
            <p className="lb-testimonial-quote">“{t.quote}”</p>
            <p className="lb-testimonial-name">{t.name}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
