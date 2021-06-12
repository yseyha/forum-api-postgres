const Reply = require('../models').reply;

exports.create = async (req, res) => {
    try {
        const { topicId, description } = req.body;

        // handle empty params
        if (!topicId) throw "Missing topicId params!"
        if (!description || description === '') throw "description params is missing or empty!"

        const newReply = await Reply.create({
            userId: req.user.id,
            topicId,
            description,
        });

        if (newReply) {
            res.status(200).json({
                success: true,
                message: "Reply created successfully.",
                results: newReply
            });
        } else throw "Reply created failed!"

    } catch (error) {
        console.log(error);
        res.status(400).send({ success: false, message: error });
    }
}

exports.read = async (req, res) => {
}

exports.update = async (req, res) => {
    try {
        const { replyId } = req.params;
        if(!replyId) throw "Missing replyId params!";

        const { description } = req.body;

        const oldReply = await Reply.findOne({ where: { id: replyId } });
        if(!oldReply) throw "Reply not found!"

        const updateReply = await oldReply.update({ description });
        if(updateReply) {
            res.status(200).json({
                success: true,
                message: "Reply updated successfully.",
                results: updateReply
            });
        } else throw "Update Reply failed!"

    } catch (error) {
        console.log(error);
        res.status(400).send({ success: false, message: error });
    }
}

exports.remove = async (req, res) => {
    try {
        const { replyId } = req.params;
        if(!replyId) throw "Missing replyId param!";

        const reply = await Reply.destroy({ where: { id: replyId } });

        if(reply) {
            res.status(200).json({
                success: true,
                message: "reply deleted succesfully.",
                results: { replyId }
            });
        } else throw "Delete failed!";
        
    } catch (error) {
        console.log(error);
        res.status(400).send({ success: false, message: error });
    }
}

exports.list = async (req, res) => {
}
