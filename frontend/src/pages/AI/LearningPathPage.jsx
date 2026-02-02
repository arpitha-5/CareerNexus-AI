// LearningPathPage.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar.jsx';
import { generateLearningPlan, getLearningPlan } from '../../api/aiApi.js';
import WeeklyPlanner from '../../components/ai/WeeklyPlanner.jsx';

const LearningPathPage = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const { data } = await getLearningPlan();
        setPlan(data);
      } catch (err) {
        // Silent fail if no plan exists yet
        console.log("No existing plan found");
      }
    };
    fetchPlan();
  }, []);

  const generate = async () => {
    setLoading(true);
    try {
      const { data } = await generateLearningPlan();
      setPlan(data);
    } catch (err) {
      console.error(err);
      alert('Failed to generate learning path');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen theme-bg">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 pt-24 pb-10 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold theme-text">Personalized Learning Path</h1>
            <p className="text-xs theme-text-muted">
              Week-by-week plan auto-generated from your skills and resume.
            </p>
          </div>
          <button
            onClick={generate}
            disabled={loading}
            className="rounded-md bg-indigo-500 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-400"
          >
            {loading ? 'Generating...' : 'Generate / Refresh'}
          </button>
        </div>
        {plan && <WeeklyPlanner learningPath={plan.learningPath} />}
      </div>
    </div>
  );
};

export default LearningPathPage;