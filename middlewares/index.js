const jwt = require('jsonwebtoken');
const User = require('../models').user;
const Group = require('../models').group;
const GroupMember = require('../models').groupmember;
const Topic = require('../models').topic;
const Reply = require('../models').reply;

exports.authCheck = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(' ')[1];

            // check token
            const jwtUser = jwt.verify(token, process.env.JWT_SECRET);

            // check and verify with user in db
            const dbUser = await User.findOne({
                where: { email: jwtUser.email, id: jwtUser.id },
                attributes: {exclude: ['password']},
            });

            if (dbUser) {
                req.user = dbUser;
                next();
            } else throw "Invalid user or token";
        } else throw 'Undefinded header token!';

    } catch (error) {
        console.log(error);
        res.status(403).send({ success: false, message: error });
    }
};

exports.adminCheck = async (req, res, next) => {
    const user = await User.findOne({ where: { email: req.user.email } });
    if (user?.role !== 'Admin') return res.status(403).send({ success: false, message: 'Permission Denied!' });
    next();
};

exports.groupOwner = async (req, res, next) => {
    try {
        const { groupId } = req.params
        if (!groupId) throw 'Missing groupId params!'

        const group = await Group.findOne({ where: { id: groupId } })
        if (group) {
            if (group.userId === req.user.id) {
                next()
            } else throw 'Permission Denied! You are not owner of this group.'
        } else throw 'Group not exist!'

    } catch (error) {
        console.log(error);
        res.status(403).send({ success: false, message: error });
    }
}

exports.isGroupMember = async (req, res, next) => {
    try {
        const { groupId } = req.body;
        if (!groupId) throw "Missing groupId params";

        const groupMember = await GroupMember.findOne({ where: { userId: req.user.id, groupId } });
        if(groupMember) {
            next();
        } else throw 'Permission Denied! You are not member or group not exist.';
        
    } catch (error) {
        console.log(error);
        res.status(403).send({ success: false, message: error });
    }
}

exports.topicOwner = async (req, res, next) => {
    try {
        const { topicId } = req.params
        if (!topicId) throw 'Missing topicId params!'

        const topic = await Topic.findOne({ where: { id: topicId } })
        if (topic) {
            if (topic.userId === req.user.id) {
                next()
            } else throw 'Permission Denied! You are not owner of this topic.'
        } else throw 'topic not exist!'

    } catch (error) {
        res.status(403).send({ success: false, message: error });
    }
}

exports.replyOwner = async (req, res, next) => {
    try {
        const { replyId } = req.params
        if (!replyId) throw 'Missing replyId params!'

        const reply = await Reply.findOne({ where: { id: replyId } })
        if (reply) {
            if (reply.userId === req.user.id) {
                next()
            } else throw 'Permission Denied! You are not owner of this reply.'
        } else throw 'reply not exist!'

    } catch (error) {
        res.status(403).send({ success: false, message: error });
    }
}