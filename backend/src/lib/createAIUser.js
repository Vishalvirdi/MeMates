import User from '../models/user.model.js';

export const createAIAssistant = async () => {
    try {
        // Check if AI assistant already exists
        const existingAI = await User.findOne({ isAI: true });
        if (existingAI) return existingAI;

        // Create new AI assistant user
        const aiUser = new User({
            username: "AI Assistant",
            fullName: "AI Chat Assistant",
            password: "ai-" + Math.random().toString(36).slice(-8), // Random password
            gender: "AI",
            isAI: true,
            profilePic: "/ai-avatar.png" // Add a default AI avatar image
        });

        await aiUser.save();
        return aiUser;
    } catch (error) {
        console.error("Error creating AI assistant:", error);
        throw error;
    }
};