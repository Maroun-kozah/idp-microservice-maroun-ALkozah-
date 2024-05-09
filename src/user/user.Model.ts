import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const tokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
    expires: { type: Date, required: true }
});

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    dateOfBirth: { type: Date },
    tokens: [tokenSchema]  // Embedding token schema
});


// Adding an index for the email field to improve performance on queries
userSchema.index({ email: 1 });

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Creating models
const User = mongoose.model('User', userSchema);

// Export models and schemas
export { User, tokenSchema };
