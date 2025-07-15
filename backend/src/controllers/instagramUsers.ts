/**
 * @module instagramUsers
 */

import express, { Request, Response } from 'express';
import InstagramUser from '../models/instagramUser';

const instagramUsersRouter = express.Router();

/**
 * GET /api/instagramUsers/
 * Returns a list of all registered Instagram users
 */
instagramUsersRouter.get('/', async (req: Request, res: Response) => {
  const instagramUsers = await InstagramUser.find({});
  res.json({
    status: 'Success',
    numberOfInstagramUsers: instagramUsers.length,
    data: { instagramUsers }
  });
});

/**
 * POST /api/instagramUsers/
 * Registers a new Instagram user or logs in if they already exist
 */
instagramUsersRouter.post('/', async (req: Request, res: Response) => {
  const { firstName, lastName, email, phoneNumber } = req.body;

  const existingUser = await InstagramUser.findOne({ email });

  if (existingUser) {
    return res.status(200).json({
      status: 'Success',
      message: 'User successfully logged in'
    });
  }

  const instagramUser = new InstagramUser({
    firstName,
    lastName,
    email,
    phoneNumber
  });

  const savedInstagramUser = await instagramUser.save();

  res.status(201).json({
    status: 'Success',
    savedInstagramUser
  });
});

export default instagramUsersRouter;
