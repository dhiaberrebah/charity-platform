import User from '../models/user.model.js';
import { createNotification } from './notification.controller.js';

export const getPendingVerifications = async (req, res) => {
  try {
    const pendingUsers = await User.find({
      'documents.front': { $exists: true },
      'documents.back': { $exists: true },
      verificationStatus: 'pending'
    }).select('-password');

    res.json(pendingUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, rejectionReason } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.verificationStatus = status;
    user.verificationDate = new Date();
    user.verifiedBy = req.user._id;

    if (status === 'rejected') {
      user.rejectionReason = rejectionReason;
    }

    await user.save();

    // Create notification for the user
    const notificationMessage = status === 'verified' 
      ? 'Your ID verification has been approved!'
      : `Your ID verification was rejected. Reason: ${rejectionReason}`;

    await createNotification(
      'verification',
      notificationMessage,
      {
        userId: user._id,
        status,
        verifiedBy: req.user._id
      }
    );

    res.json({ message: 'Verification status updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};