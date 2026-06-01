const axios = require('axios');

/**
 * Fetches detailed LeetCode statistics for a given username using LeetCode's official GraphQL API.
 * This directly replaces the deprecated Heroku stats API, providing reliable and instant responses.
 *
 * @param {string} username - The LeetCode username.
 * @returns {Promise<object>} The user's detailed stats.
 */
const fetchLeetCodeStats = async (username) => {
  const normalized = username.trim();
  if (!normalized) {
    throw new Error('LeetCode username is required');
  }

  try {
    const graphResponse = await axios.post(
      'https://leetcode.com/graphql',
      {
        query: `query userStats($username: String!) {
          matchedUser(username: $username) {
            username
            profile {
              ranking
              reputation
            }
            contributions {
              points
            }
            submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
                submissions
              }
              totalSubmissionNum {
                difficulty
                count
                submissions
              }
            }
          }
        }`,
        variables: { username: normalized },
      },
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': `https://leetcode.com/${normalized}/`,
          'origin': 'https://leetcode.com',
          'content-type': 'application/json'
        },
        timeout: 10000,
      }
    );

    const data = graphResponse.data;
    if (data.errors && data.errors.length > 0) {
      const errMsg = data.errors[0].message;
      if (errMsg.includes('does not exist') || errMsg.includes('not found')) {
        throw new Error('LeetCode user not found');
      }
      throw new Error(errMsg);
    }

    const matchedUser = data?.data?.matchedUser;
    if (!matchedUser) {
      throw new Error('LeetCode user not found');
    }

    const stats = matchedUser.submitStatsGlobal?.acSubmissionNum || [];
    const totalStats = matchedUser.submitStatsGlobal?.totalSubmissionNum || [];

    const totals = stats.reduce(
      (acc, row) => {
        const count = Number(row.count || 0);
        const submissions = Number(row.submissions || 0);
        switch (row.difficulty) {
          case 'Easy':
            acc.easySolved = count;
            break;
          case 'Medium':
            acc.mediumSolved = count;
            break;
          case 'Hard':
            acc.hardSolved = count;
            break;
          case 'All':
            acc.totalSolved = count;
            acc.totalAcceptedSubmissions = submissions;
            break;
          default:
            break;
        }
        return acc;
      },
      { totalSolved: 0, easySolved: 0, mediumSolved: 0, hardSolved: 0, totalAcceptedSubmissions: 0 },
    );

    const allTotalRow = totalStats.find(row => row.difficulty === 'All');
    const totalSubmissions = allTotalRow ? Number(allTotalRow.submissions || 0) : 0;

    const acceptanceRate = totalSubmissions > 0
      ? Number(((totals.totalAcceptedSubmissions / totalSubmissions) * 100).toFixed(2))
      : 0;

    return {
      username: normalized,
      totalSolved: totals.totalSolved,
      easySolved: totals.easySolved,
      mediumSolved: totals.mediumSolved,
      hardSolved: totals.hardSolved,
      acceptanceRate,
      ranking: matchedUser.profile?.ranking || 'N/A',
      contributionPoints: matchedUser.contributions?.points || 0,
      reputation: matchedUser.profile?.reputation || 0,
    };
  } catch (error) {
    if (error.message && error.message.includes('LeetCode user not found')) {
      throw error;
    }
    throw new Error(`Unable to fetch stats for ${normalized}: ${error.message}`);
  }
};

module.exports = {
  fetchLeetCodeStats,
};
