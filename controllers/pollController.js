
const Poll = require('../models/Poll');
const mongoose = require('mongoose');

// Format poll for response
const formatPoll = (poll) => {
  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
  
  return {
    id: poll._id,
    question: poll.question,
    options: poll.options.map(opt => ({
      id: opt._id,
      text: opt.text,
      votes: opt.votes,
      percentage: totalVotes > 0 ? (opt.votes / totalVotes) * 100 : 0,
      voters: opt.voters.map(voter => voter.toString())
    })),
    createdBy: poll.createdBy._id,
    creatorName: poll.createdBy.name,
    creatorAvatar: poll.createdBy.avatar,
    martialArtId: poll.martialArtId,
    createdAt: poll.createdAt,
    totalVotes
  };
};

exports.getByMartialArt = async (req, res) => {
  try {
    const { martialArtId } = req.params;
    
    const polls = await Poll.find({ martialArtId })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name avatar');
    
    res.json({
      success: true,
      polls: polls.map(formatPoll)
    });
  } catch (error) {
    console.error('Error fetching polls:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching polls',
      error: error.message
    });
  }
};

exports.create = async (req, res) => {
  try {
    const { question, options, martialArtId } = req.body;
    const userId = req.user.id;
    
    // Validations
    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Question is required'
      });
    }
    
    if (!options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'At least two options are required'
      });
    }
    
    // Check for duplicate options
    const uniqueOptions = new Set(options);
    if (uniqueOptions.size !== options.length) {
      return res.status(400).json({
        success: false,
        message: 'All options must be unique'
      });
    }
    
    // Create poll
    const pollOptions = options.map(opt => ({
      text: opt,
      votes: 0,
      voters: []
    }));
    
    const newPoll = new Poll({
      question,
      options: pollOptions,
      createdBy: userId,
      martialArtId
    });
    
    const savedPoll = await newPoll.save();
    await savedPoll.populate('createdBy', 'name avatar');
    
    res.status(201).json({
      success: true,
      poll: formatPoll(savedPoll)
    });
  } catch (error) {
    console.error('Error creating poll:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating poll',
      error: error.message
    });
  }
};

exports.vote = async (req, res) => {
  try {
    const { pollId } = req.params;
    const { optionId } = req.body;
    const userId = req.user.id;
    
    if (!mongoose.Types.ObjectId.isValid(pollId) || !mongoose.Types.ObjectId.isValid(optionId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid poll or option ID format'
      });
    }
    
    // Find poll
    const poll = await Poll.findById(pollId).populate('createdBy', 'name avatar');
    
    if (!poll) {
      return res.status(404).json({
        success: false,
        message: 'Poll not found'
      });
    }
    
    // Check if user already voted in this poll
    const hasVoted = poll.options.some(option => 
      option.voters.some(voter => voter.toString() === userId)
    );
    
    if (hasVoted) {
      return res.status(400).json({
        success: false,
        message: 'You have already voted in this poll'
      });
    }
    
    // Find the option and update votes
    const option = poll.options.id(optionId);
    
    if (!option) {
      return res.status(404).json({
        success: false,
        message: 'Option not found'
      });
    }
    
    // Add the vote
    option.votes += 1;
    option.voters.push(userId);
    
    await poll.save();
    
    res.json({
      success: true,
      poll: formatPoll(poll)
    });
  } catch (error) {
    console.error('Error voting in poll:', error);
    res.status(500).json({
      success: false,
      message: 'Error voting in poll',
      error: error.message
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const { pollId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(pollId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid poll ID format'
      });
    }
    
    const poll = await Poll.findById(pollId).populate('createdBy', 'name avatar');
    
    if (!poll) {
      return res.status(404).json({
        success: false,
        message: 'Poll not found'
      });
    }
    
    res.json({
      success: true,
      poll: formatPoll(poll)
    });
  } catch (error) {
    console.error('Error fetching poll:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching poll',
      error: error.message
    });
  }
};
