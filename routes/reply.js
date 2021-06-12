const express = require('express');
const router = express.Router();
const Topic = require('../models').topic;

// controller
const {
    create,
    read,
    update,
    remove,
    list
} = require('../controllers/reply');

// middleware
const { authCheck, topicOwner, isGroupMember, groupOwner, replyOwner } = require("../middlewares");

router.post('/reply', authCheck, async (req, res, next) => {
    const { topicId } = req.body;
    if(!topicId) return res.status(403).send({ success: false, message: "Missing topicId params!"});
    const topic = await Topic.findOne({ where: { id: topicId } });
    if(!topic) return res.status(403).send({ success: false, message: "Topic not found!"});
    req.body.groupId = topic.groupId;
    next()
}, isGroupMember, create);

router.put('/reply/:replyId', authCheck, replyOwner,update);
router.delete('/reply/:replyId', authCheck, replyOwner, remove);


module.exports = router;