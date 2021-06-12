const Topic = require('../models').topic;

exports.create = async (req, res) => {
    try {
        const { groupId, title, description, type } = req.body;

        // handle empty params
        if (!groupId) throw "Missing groupId params!"
        if (!title) throw "Missing title params!"
        if (!description) throw "Missing description params!"
        if (!type) throw "Missing type params!"

        const newTopic = await Topic.create({
            groupId,
            userId: req.user.id,
            title,
            description,
            type
        });

        if (newTopic) {
            res.status(200).json({
                success: true,
                message: "Topic created successfully.",
                results: newTopic
            });
        } else throw "Topic created failed!"

    } catch (error) {
        console.log(error);
        res.status(400).send({ success: false, message: error });
    }
}

exports.read = async (req, res) => {
    try {
        const { topicId } = req.params;
        if(!topicId) throw "Missing topicId params!"

        const topic = await Topic.findOne({ where: { id: topicId } });
        if(topic) {
            res.status(200).json({
                success: true,
                message: "Topic created successfully.",
                results: topic
            });
        } else throw "Topic not found!"

    } catch (error) {
        console.log(error);
        res.status(400).send({ success: false, message: error });
    }
}

exports.update = async (req, res) => {
    try {
        const { topicId } = req.params;
        if(!topicId) throw "Missing topicId params!";

        const { title, description, type } = req.body;

        const oldTopic = await Topic.findOne({ where: { id: topicId } });
        if(!oldTopic) throw "Topic not found!"

        const updateTopic = await oldTopic.update({ title, description, type });
        if(updateTopic) {
            res.status(200).json({
                success: true,
                message: "Topic updated successfully.",
                results: updateTopic
            });
        } else throw "Update topic failed!"

    } catch (error) {
        console.log(error);
        res.status(400).send({ success: false, message: error });
    }
}

exports.remove = async (req, res) => {
    try {
        const { topicId } = req.params;
        if(!topicId) throw "Missing topicId param!";

        const topic = await Topic.destroy({ where: { id: topicId } });

        if(topic) {
            res.status(200).json({
                success: true,
                message: "Topic deleted succesfully.",
                results: { topicId }
            });
        } else throw "Delete failed!";
        
    } catch (error) {
        console.log(error);
        res.status(400).send({ success: false, message: error });
    }
}

exports.list = async (req, res) => {
    try {
        
    } catch (error) {
        console.log(error);
        res.status(400).send({ success: false, message: error });
    }
}

exports.banTopic = async (req, res) => {
    try {
        const { banned } = req.body;
        console.log(typeof(banned));
        if(typeof(banned) !== 'boolean') throw "Missing or invalid banned params!";

        const topic = await Topic.findOne({ where: { id: req.params.topicId } });
        if(!topic) throw "Topic not found!";

        const topicBan = await topic.update({ banned });
        if(topicBan) {
            res.status(200).json({
                success: true,
                message: `Topic banned has been set to: ${banned}.`,
                results: topicBan
            });
        } else throw "Topic ban failed!"

    } catch (error) {
        console.log(error);
        res.status(400).send({ success: false, message: error });
    }
}