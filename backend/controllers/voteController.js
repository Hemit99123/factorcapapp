const Vote = require('../models/vote');

const voteController = {
  getVotes: async (req, res) => {
    try {
      const { factID } = req.body;

      if (factID === undefined) {
        return res.status(400).json({ message: 'factID is required in the request body' });
      }

      const verifiedCount = await Vote.countDocuments({ factID, verified: true });
      const unverifiedCount = await Vote.countDocuments({ factID, verified: false });

      res.json({ verifiedCount, unverifiedCount });
    } catch (error) {
      console.error('Error in getVerifiedAgreementNumber:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  createVote: async (req, res) => {
    try {
      const { factID, verified } = req.body;

      if (!factID || verified === undefined) {
        return res.status(400).json({ message: 'factID and verified fields are required in the request body' });
      }

      const newVote = new Vote({ factID, verified });
      await newVote.save();
      res.status(201).json({ message: 'Created new fact' });
    } catch (error) {
      console.error('Error in createFact:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
};

module.exports = voteController;
