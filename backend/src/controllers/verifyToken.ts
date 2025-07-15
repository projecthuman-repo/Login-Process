import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import User from '../models/user';
import Activity from '../models/activity';
import Rank from '../models/rank';
import UserActivity from '../models/userActivity';
import UserRank from '../models/userRank';

const router = express.Router();

interface JwtPayload {
  userId: string;
}

router.post('/verify', async (req: Request, res: Response) => {
  const { appid, activityid } = req.body;

  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  const access_token = req.headers.authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as JwtPayload;

    const userId = decoded.userId;

    // Record user activity
    const userActivity = new UserActivity({
      userId: userId,
      activityId: activityid
    });

    await userActivity.save();

    // Fetch user and activity
    const user = await User.findById(userId);
    const activity = await Activity.findById(activityid);

    if (!user || !activity) {
      return res.status(404).json({ error: 'User or Activity not found' });
    }

    // Ensure user.rankPoints exists (add a check or default value if needed)
    const userRankPoints = (user as any).rankPoints ?? 0;

    if (activity.activityPoints >= userRankPoints) {
      const rank = await Rank.findOne({
        rankPoints: { $lte: activity.activityPoints }
      }).sort({ rankPoints: -1 });

      if (rank) {
        (user as any).rank = rank.rankName; // If 'rank' field not in User model, cast to 'any'

        const existingUserRank = await UserRank.findOne({
          user: userId,
          rank: rank._id
        });

        if (!existingUserRank) {
          const newUserRank = new UserRank({
            user: userId,
            rank: rank._id,
            app: appid,
            dateAchieved: new Date(),
            isActive: true
          });

          await newUserRank.save();
        }
      }
    }

    await user.save();

    res.json({ userId: user._id });
  } catch (error) {
    console.error('Error verifying access token:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
