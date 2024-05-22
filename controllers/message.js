const Conversation = require('../models/Conversation.js');
const Message = require('../models/Message.js');

module.exports.sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { userId: senderId } = req.user; // Extract senderId from decoded token
        const { id: receiverId } = req.params; // Extract receiverId from request parameters

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        const newMessage = new Message({
            senderId: senderId,
            receiverId: receiverId, // Correct spelling to "receiverId"
            message: message
        });

        // Validate and save the new message
        const savedMessage = await newMessage.save();

        conversation.messages.push(savedMessage._id);
        await conversation.save();

        res.status(201).send({ newMessage: savedMessage });

    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Internal Server Error" });
    }
};
