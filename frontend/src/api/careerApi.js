import axiosClient from './axiosClient.js';

const careerApi = {
    /**
     * Analyze career profile and get recommendations
     * POST /api/career/career-guidance
     * @param {Object} data - { skills, interests, academics, goals, experience }
     */
    analyzeCareer: async (data) => {
        try {
            const response = await axiosClient.post('/career/career-guidance', data);
            return response.data?.data || null;
        } catch (error) {
            console.error('Error analyzing career:', error);
            throw error;
        }
    },

    /**
     * get learning roadmap
     * POST /api/career/roadmap
     */
    getRoadmap: async (career, skillGaps) => {
        try {
            const response = await axiosClient.post('/career/roadmap', { career, skillGaps });
            return response.data?.data || null;
        } catch (error) {
            console.error('Error fetching roadmap:', error);
            return null;
        }
    },

    /**
     * Generate interview prep
     * POST /api/career/interview
     */
    getInterviewPrep: async (career, skillGaps) => {
        try {
            const response = await axiosClient.post('/career/interview', { career, skillGaps });
            return response.data?.data || null;
        } catch (error) {
            console.error('Error fetching interview prep:', error);
            return null;
        }
    }
};

export default careerApi;
