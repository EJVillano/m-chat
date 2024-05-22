const Conversation = require('../models/Conversation.js');
const Message = require('../models/Message.js');

module.exports.sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { _id: senderId } = req.user; // Extract senderId from decoded token
        const { id: receiverId } = req.params; // Extract receiverId from request parameters

        console.log("Decoded token:", req.user); // Log decoded token to check if senderId is present

        // Validate senderId
        if (!senderId) {
            return res.status(400).send({ error: "Sender ID is missing" });
        }

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
