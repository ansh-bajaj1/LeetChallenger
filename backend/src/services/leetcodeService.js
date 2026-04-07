const axios = require('axios');

const fetchLeetCodeStats = async (username) => {
  const normalized = username.trim();
  const url = `https://leetcode-stats-api.herokuapp.com/${normalized}`;

  try {
    const response = await axios.get(url, { timeout: 10000 });
    const data = response.data || {};

    if (data.status === 'error') {
      throw new Error(data.message || 'LeetCode user not found');
    }

    return {
      username: normalized,
      totalSolved: data.totalSolved || 0,
      easySolved: data.easySolved || 0,
      mediumSolved: data.mediumSolved || 0,
      hardSolved: data.hardSolved || 0,
      acceptanceRate: Number.parseFloat(data.acceptanceRate || 0),
      ranking: data.ranking || 'N/A',
      contributionPoints: data.contributionPoints || 0,
      reputation: data.reputation || 0,
    };
  } catch (error) {
    throw new Error(`Unable to fetch stats for ${normalized}`);
  }
};

module.exports = {
  fetchLeetCodeStats,
};
