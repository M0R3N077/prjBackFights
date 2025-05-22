
const Post = require('../models/Post');
const mongoose = require('mongoose');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs');

// Get all posts for a specific martial art
exports.getPostsByMartialArt = async (req, res) => {
  try {
    const { martialArtId } = req.params;
    
    console.log(`Buscando posts para a arte marcial: ${martialArtId}`);
    
    const posts = await Post.find({ martialArtId })
      .populate('userId', 'name email avatar')
      .populate('comments.userId', 'name email avatar')
      .sort({ createdAt: -1 });
    
    // Transform posts to match the expected frontend format
    const formattedPosts = posts.map(post => ({
      id: post._id,
      userId: post.userId._id,
      userName: post.userId.name,
      userAvatar: post.userId.avatar || '',
      content: post.content,
      mediaUrl: post.mediaUrl,
      mediaType: post.mediaType,
      timestamp: post.createdAt,
      reactions: post.reactions,
      comments: post.comments.map(comment => ({
        id: comment._id,
        userId: comment.userId._id,
        userName: comment.userId.name,
        userAvatar: comment.userId.avatar || '',
        content: comment.content,
        timestamp: comment.createdAt
      }))
    }));

    console.log(`Encontrados ${formattedPosts.length} posts`);

    res.json({
      success: true,
      posts: formattedPosts
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching posts',
      error: error.message
    });
  }
};

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { content, martialArtId } = req.body;
    let mediaUrl = null;
    let mediaType = null;
    
    console.log(`Criando post para arte marcial: ${martialArtId}`);
    console.log(`Conteúdo: ${content}`);
    console.log(`Usuário: ${req.user.id}`);
    console.log(`Arquivo enviado: ${req.file ? 'Sim' : 'Não'}`);
    
    // Handle file upload if included
    if (req.file) {
      try {
        // Upload to cloudinary if a file was included
        console.log(`Enviando arquivo para Cloudinary: ${req.file.path}`);
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'martial_world_posts'
        });
        
        // Remove temp file after upload
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        
        mediaUrl = result.secure_url;
        mediaType = req.file.mimetype.startsWith('image/') ? 'image' : 'video';
        console.log(`Upload bem-sucedido. URL: ${mediaUrl}, Tipo: ${mediaType}`);
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        // If upload fails, we'll continue without the media
      }
    }
    
    const newPost = new Post({
      userId: req.user.id,
      martialArtId,
      content,
      mediaUrl,
      mediaType
    });
    
    const savedPost = await newPost.save();
    console.log(`Post salvo com ID: ${savedPost._id}`);
    
    // Populate user data
    await savedPost.populate('userId', 'name email avatar');
    
    // Format the response
    const formattedPost = {
      id: savedPost._id,
      userId: savedPost.userId._id,
      userName: savedPost.userId.name,
      userAvatar: savedPost.userId.avatar || '',
      content: savedPost.content,
      mediaUrl: savedPost.mediaUrl,
      mediaType: savedPost.mediaType,
      timestamp: savedPost.createdAt,
      reactions: { count: 0, users: [] },
      comments: []
    };
    
    console.log('Post formatado para resposta:', {
      id: formattedPost.id,
      userId: formattedPost.userId,
      userName: formattedPost.userName
    });
    
    res.status(201).json({
      success: true,
      post: formattedPost
    });
  } catch (error) {
    console.error('Error creating post:', error);
    
    // Cleanup any temporary files if error occurs
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating post',
      error: error.message
    });
  }
};

// Toggle reaction on a post
exports.toggleReaction = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;
    
    console.log(`Alternando reação para o post: ${postId} pelo usuário: ${userId}`);
    
    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Check if user has already reacted
    const userIndex = post.reactions.users.indexOf(userId);
    
    if (userIndex > -1) {
      // User already reacted, remove reaction
      post.reactions.users.pull(userId);
      post.reactions.count = Math.max(0, post.reactions.count - 1);
      console.log('Reação removida');
    } else {
      // Add new reaction
      post.reactions.users.push(userId);
      post.reactions.count += 1;
      console.log('Reação adicionada');
    }
    
    await post.save();
    console.log(`Contagem atual de reações: ${post.reactions.count}`);
    
    res.json({
      success: true,
      reactions: post.reactions
    });
  } catch (error) {
    console.error('Error toggling reaction:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling reaction',
      error: error.message
    });
  }
};

// Add a comment to a post
exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    
    console.log(`Adicionando comentário ao post: ${postId}`);
    console.log(`Conteúdo do comentário: ${content}`);
    console.log(`Usuário: ${userId}`);
    
    if (!content || content.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required'
      });
    }
    
    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    const newComment = {
      _id: new mongoose.Types.ObjectId(),
      userId,
      content,
      createdAt: new Date()
    };
    
    post.comments.push(newComment);
    await post.save();
    console.log(`Comentário salvo com ID: ${newComment._id}`);
    
    // Get user details
    const user = await mongoose.model('User').findById(userId).select('name email avatar');
    
    const formattedComment = {
      id: newComment._id,
      userId: user._id,
      userName: user.name,
      userAvatar: user.avatar || '',
      content: newComment.content,
      timestamp: newComment.createdAt
    };
    
    console.log('Comentário formatado para resposta:', {
      id: formattedComment.id,
      userId: formattedComment.userId,
      userName: formattedComment.userName
    });
    
    res.status(201).json({
      success: true,
      comment: formattedComment
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding comment',
      error: error.message
    });
  }
};

// Delete a post (only for post owner)
exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;
    
    console.log(`Tentativa de exclusão do post: ${postId} pelo usuário: ${userId}`);
    
    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Check if user is the post owner
    if (post.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this post'
      });
    }
    
    // Delete the post
    await Post.findByIdAndDelete(postId);
    console.log(`Post ${postId} excluído com sucesso`);
    
    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting post',
      error: error.message
    });
  }
};
