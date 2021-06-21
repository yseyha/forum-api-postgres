const express = require('express');
const router = express.Router();
const Topic = require('../models').topic;

// controller
const {
    create,
    read,
    update,
    remove,
    listGroupTopics,
    banTopic
} = require('../controllers/topic');

// middleware
const { authCheck, topicOwner, isGroupMember, groupOwner } = require("../middlewares");

router.post('/topic', authCheck, isGroupMember, create);
router.put('/topic/:topicId', authCheck, topicOwner, update);
router.delete('/topic/:topicId', authCheck, topicOwner, remove);
router.get('/topic/:topicId', read);
router.get('/topics/:groupId', listGroupTopics);

router.put('/topic/ban/:topicId', authCheck, async (req, res, next) => {
    const topic = await Topic.findOne({ where: { id: req.params.topicId} });
    req.params.groupId = topic.groupId;
    next()
}, groupOwner, banTopic);


module.exports = router;