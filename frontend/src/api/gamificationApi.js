import client from './axiosClient.js';

export const getGamificationStats = () => client.get('/gamification/stats');
export const getLeaderboard = (limit = 10) => client.get('/gamification/leaderboard', { params: { limit } });
export const addXP = (amount, reason, meta) => client.post('/gamification/add-xp', { amount, reason, meta });
export const updateStreak = () => client.post('/gamification/update-streak');
export const getBadges = () => client.get('/gamification/badges');

