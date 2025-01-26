const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema(
    {
        googleId: { type: String, unique: true, sparse: true, },
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String },
        bio: { type: String },
        profilePic: { type: mongoose.Schema.Types.ObjectId, ref: 'fs.files' },
        // posts: [{
        //     uploads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'fs.files' }], // References to GridFS
        //     desc: { type: String },
        //     createdAt: { type: Date, default: Date.now }
        // }]
    },
    {
        timestamps: true
    }
)

// Hash the password before saving the user model
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

// Compare entered password with the hashed password
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

module.exports = mongoose.model('User', UserSchema)