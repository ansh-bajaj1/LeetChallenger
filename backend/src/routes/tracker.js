const express = require('express');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Connection = require('../models/Connection');
const DirectTrack = require('../models/DirectTrack');
const Challenge = require('../models/Challenge');
const { fetchLeetCodeStats } = require('../services/leetcodeService');

const router = express.Router();

router.use(auth);

const isConnected = async (userA, userB) =>
  Connection.exists({
    status: 'accepted',
    $or: [
      { requester: userA, recipient: userB },
      { requester: userB, recipient: userA },
    ],
  });

const parseQuestionNumbers = (input) => {
  if (!Array.isArray(input)) {
    return [];
  }

  return [...new Set(input.map((item) => Number(item)).filter((item) => Number.isInteger(item) && item > 0))];
};

router.post('/request', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ message: 'Target username is required' });
    }

    const recipient = await User.findOne({ username: String(username).trim().toLowerCase() });
    if (!recipient) {
      return res.status(404).json({ message: 'Target user not found' });
    }

    if (recipient._id.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot send request to yourself' });
    }

    const requesterId = req.user.id;
    const recipientId = recipient._id;

    const existing = await Connection.findOne({
      $or: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId },
      ],
    });

    if (existing) {
      return res.status(409).json({ message: `Connection already ${existing.status}` });
    }

    const connection = await Connection.create({
      requester: requesterId,
      recipient: recipientId,
      status: 'pending',
    });

    return res.status(201).json({ message: 'Request sent', connection });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to send request' });
  }
});

router.get('/requests', async (req, res) => {
  const requests = await Connection.find({ recipient: req.user.id, status: 'pending' })
    .populate('requester', 'name username')
    .sort({ createdAt: -1 });

  return res.json({ requests });
});

router.post('/requests/:id/respond', async (req, res) => {
  const { action } = req.body;
  if (!['accept', 'reject'].includes(action)) {
    return res.status(400).json({ message: 'Action must be accept or reject' });
  }

  const connection = await Connection.findOne({
    _id: req.params.id,
    recipient: req.user.id,
    status: 'pending',
  });

  if (!connection) {
    return res.status(404).json({ message: 'Request not found' });
  }

  connection.status = action === 'accept' ? 'accepted' : 'rejected';
  await connection.save();

  return res.json({ message: `Request ${connection.status}`, connection });
});

router.get('/connections', async (req, res) => {
  const connections = await Connection.find({
    status: 'accepted',
    $or: [{ requester: req.user.id }, { recipient: req.user.id }],
  })
    .populate('requester', 'name username')
    .populate('recipient', 'name username')
    .sort({ updatedAt: -1 });

  const mates = connections.map((connection) => {
    const requester = connection.requester;
    const recipient = connection.recipient;
    const friend = requester._id.toString() === req.user.id ? recipient : requester;

    return {
      connectionId: connection._id,
      username: friend.username,
      name: friend.name,
      leetcodeUsername: friend.leetcodeUsername || null,
      canCompare: Boolean(friend.leetcodeUsername),
      linkedAt: connection.updatedAt,
    };
  });

  const unreadChallengesBySender = await Challenge.aggregate([
    {
      $match: {
        recipient: new mongoose.Types.ObjectId(req.user.id),
        isRead: false,
      },
    },
    {
      $group: {
        _id: '$sender',
        count: { $sum: 1 },
      },
    },
  ]);

  const unreadMap = unreadChallengesBySender.reduce((acc, row) => {
    acc[row._id.toString()] = row.count;
    return acc;
  }, {});

  const matesWithChallengeCount = mates.map((mate) => {
    const connection = connections.find((item) => item._id.toString() === mate.connectionId.toString());
    const requester = connection.requester;
    const recipient = connection.recipient;
    const friend = requester._id.toString() === req.user.id ? recipient : requester;

    return {
      ...mate,
      unreadChallenges: unreadMap[friend._id.toString()] || 0,
    };
  });

  return res.json({ mates: matesWithChallengeCount });
});

router.get('/compare/:username', async (req, res) => {
  try {
    const targetUsername = String(req.params.username).trim().toLowerCase();
    const targetUser = await User.findOne({ username: targetUsername });
    const currentUser = await User.findById(req.user.id);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: 'Target user not found' });
    }

    const hasConnection = await isConnected(req.user.id, targetUser._id);

    if (!hasConnection) {
      return res.status(403).json({ message: 'You are not connected with this user' });
    }

    if (!currentUser.leetcodeUsername || !targetUser.leetcodeUsername) {
      return res.status(400).json({
        message: 'Both users must complete profile with LeetCode username before compare',
      });
    }

    const [myStats, targetStats] = await Promise.all([
      fetchLeetCodeStats(currentUser.leetcodeUsername),
      fetchLeetCodeStats(targetUser.leetcodeUsername),
    ]);

    return res.json({
      me: {
        username: currentUser.username,
        leetcodeUsername: currentUser.leetcodeUsername,
        stats: myStats,
      },
      friend: {
        username: targetUser.username,
        leetcodeUsername: targetUser.leetcodeUsername,
        stats: targetStats,
      },
      deltaSolved: myStats.totalSolved - targetStats.totalSolved,
      chartSeries: [
        {
          label: 'Easy',
          me: myStats.easySolved,
          friend: targetStats.easySolved,
        },
        {
          label: 'Medium',
          me: myStats.mediumSolved,
          friend: targetStats.mediumSolved,
        },
        {
          label: 'Hard',
          me: myStats.hardSolved,
          friend: targetStats.hardSolved,
        },
      ],
      meta: {
        meAcceptanceRate: myStats.acceptanceRate,
        friendAcceptanceRate: targetStats.acceptanceRate,
        meRanking: myStats.ranking,
        friendRanking: targetStats.ranking,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to compare stats' });
  }
});

router.post('/direct', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ message: 'LeetCode username is required' });
    }

    const leetCodeUsername = String(username).trim().toLowerCase();
    await fetchLeetCodeStats(leetCodeUsername);

    const track = await DirectTrack.findOneAndUpdate(
      { owner: req.user.id, leetCodeUsername },
      { owner: req.user.id, leetCodeUsername },
      { new: true, upsert: true },
    );

    return res.status(201).json({ message: 'Direct tracking added', track });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to add tracking user' });
  }
});

router.get('/direct', async (req, res) => {
  const list = await DirectTrack.find({ owner: req.user.id }).sort({ createdAt: -1 });

  const withStats = await Promise.all(
    list.map(async (item) => {
      try {
        const stats = await fetchLeetCodeStats(item.leetCodeUsername);
        return {
          id: item._id,
          username: item.leetCodeUsername,
          stats,
        };
      } catch (error) {
        return {
          id: item._id,
          username: item.leetCodeUsername,
          error: 'Unable to fetch stats right now',
        };
      }
    }),
  );

  return res.json({ tracked: withStats });
});

router.post('/challenges/send', async (req, res) => {
  try {
    const { username, questionNumbers, note } = req.body;
    if (!username) {
      return res.status(400).json({ message: 'Friend username is required' });
    }

    const friend = await User.findOne({ username: String(username).trim().toLowerCase() });
    if (!friend) {
      return res.status(404).json({ message: 'Friend user not found' });
    }

    if (friend._id.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot challenge yourself' });
    }

    const connected = await isConnected(req.user.id, friend._id);
    if (!connected) {
      return res.status(403).json({ message: 'You can challenge only connected mates' });
    }

    const cleanedQuestions = parseQuestionNumbers(questionNumbers);
    if (cleanedQuestions.length === 0) {
      return res.status(400).json({ message: 'Send at least one valid question number' });
    }

    const challenge = await Challenge.create({
      sender: req.user.id,
      recipient: friend._id,
      questionNumbers: cleanedQuestions,
      note: String(note || '').trim(),
    });

    return res.status(201).json({ message: 'Challenge sent', challenge });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to send challenge' });
  }
});

router.get('/challenges/inbox', async (req, res) => {
  const challenges = await Challenge.find({ recipient: req.user.id })
    .populate('sender', 'name username')
    .sort({ createdAt: -1 })
    .limit(50);

  const unreadCount = challenges.filter((item) => !item.isRead).length;
  return res.json({ challenges, unreadCount });
});

router.get('/challenges/sent', async (req, res) => {
  const challenges = await Challenge.find({ sender: req.user.id })
    .populate('recipient', 'name username')
    .sort({ createdAt: -1 })
    .limit(50);

  return res.json({ challenges });
});

router.post('/challenges/:id/read', async (req, res) => {
  const challenge = await Challenge.findOne({
    _id: req.params.id,
    recipient: req.user.id,
  });

  if (!challenge) {
    return res.status(404).json({ message: 'Challenge not found' });
  }

  if (!challenge.isRead) {
    challenge.isRead = true;
    await challenge.save();
  }

  return res.json({ message: 'Challenge marked as read' });
});

module.exports = router;
