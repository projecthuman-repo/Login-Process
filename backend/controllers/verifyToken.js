const express = require('express');
const router = express.Router();

const User = require("../models/user");
const Activity = require("../models/activity");
const Rank = require("../models/rank");
const App = require("../models/app");

router.post('/verify', async (req, res) => {
  const { appid, activityid } = req.body;
  const access_token = req.headers.authorization.split(' ')[1];

  try {
    // Verify access_token
    // Assuming you have a function to verify the access token using your chosen authentication/authorization mechanism
    // For example, using JWT verification
    const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET);

    // Retrieve user information from the access token
    const userId = decoded.userId;

    // Update user activity
    const userActivity = new UserActivity({
      userId: userId,
      activityId: activityid
    });

    await userActivity.save();

    // Update user rank if necessary
    const user = await User.findById(userId);
    const activity = await Activity.findById(activityid);

    if (activity.activityPoints >= user.rankPoints) {
      const rank = await Rank.findOne({ rankPoints: { $lte: activity.activityPoints } }).sort({ rankPoints: -1 });
      if (rank) {
        user.rank = rank.rankName;
      }
    }

    await user.save();

    res.json({ userid: user.id });
  } catch (error) {
    console.error('Error verifying access token:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
