const User = require('../models/userSchema')
const Feed = require('../models/feedSchema')
const upload = require('../utils/multer-config');
const jwtSecret = process.env.JWT_SECRET
const jwt = require('jsonwebtoken');

exports.uploadFiles = upload.array('photos', 10);



exports.postFeed = async (req, res) => {
    const { desc } = req.body;

    try {
        let token = req.headers.authorization.split(' ')[1];

        const decoded = jwt.verify(token, jwtSecret);

        const currentUser = await User.findById(decoded.id);
        // Extract uploaded files' Cloudinary URLs
        const fileUrls = req.files.map((file) => file.path);

        // Create a new post
        const newPost = new Feed({
            user: currentUser._id,
            uploads: fileUrls, // Cloudinary URLs
            desc,
        });

        await newPost.save();

        res.status(201).json({ msg: 'Post added successfully!', post: newPost });
    } catch (error) {
        res.status(500).json({ msg: 'Failed to add post', error: error.message });
    }
};

exports.userFeed = async (req, res) => {
    const { userId } = req.params;

    try {
        const posts = await Feed.find({ user: userId })
            .populate('uploads') // Populate GridFS file references
            .sort({ createdAt: -1 }); // Sort by newest first

        res.status(200).json({ posts });
    } catch (error) {
        res.status(500).json({ msg: "Failed to retrieve posts", error: error.message });
    }
};

exports.retrieveFeeds = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        // Fetch posts with pagination
        const posts = await Feed.find({})
            .populate('user', 'username profilePic') // Populate user info
            .sort({ createdAt: -1 }) // Sort by newest
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        // Count total number of posts
        const totalPosts = await Feed.countDocuments();

        res.status(200).json({
            posts,
            totalPosts,
            totalPages: Math.ceil(totalPosts / limit),
            currentPage: parseInt(page),
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Failed to retrieve feed',
            error: error.message,
        });
    }
};
