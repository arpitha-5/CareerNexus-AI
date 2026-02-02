// AdaptiveTrackerPage.jsx
import React, { useState } from 'react';
import Navbar from '../../components/common/Navbar.jsx';
import { recalcAdaptivePlan } from '../../api/aiApi.js';
import AdaptiveLevelIndicator from '../../components/ai/AdaptiveLevelIndicator.jsx';

const AdaptiveTrackerPage = () => {
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(false);

  const recalc = async () => {
    setLoading(true);
    try {
      const { data } = await recalcAdaptivePlan();
      setState(data);
    } catch (err) {
      console.error(err);
      alert('Failed to recalculate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen theme-bg">
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 pt-24 pb-10 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold theme-text">Adaptive Engine</h1>
            <p className="text-xs theme-text-muted">
              Plan difficulty adjusts automatically based on quiz performance and activity.
            </p>
          </div>
          <button
            onClick={recalc}
            disabled={loading}
            className="rounded-md bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400"
          >
            {loading ? 'Recalculating...' : 'Recalculate Plan'}
          </button>
        </div>
        {state && (
          <AdaptiveLevelIndicator difficulty={state.difficulty} speedLabel={state.speedLabel} />
        )}
      </div>
    </div>
  );
};

export default AdaptiveTrackerPage;