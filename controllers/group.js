const User = require('../models').user;
const Group = require('../models').group;
const GroupMember = require('../models').groupmember;

exports.create = async (req, res) => {
    try {
        const { name, description, type } = req.body;

        if(!name) throw "Name is required!";
        if(!type) throw "Group type is required!";

        const newGroup = await Group.create({
            userId: req.user.id,
            name,
            description,
            type
        });

        res.status(200).json({
            success: true,
            message: "Group created successfully.",
            results: newGroup
        });

    } catch (error) {
        console.log(error);
        res.status(400).send({ success: false, message: error });
    };
};

exports.read = async (req, res) => {
    try {
        const { groupId } = req.params;

        if (!groupId) throw "Request params groupId not found or invalid!";

        const group = await Group.findOne({ where: { id: groupId }});
        
        if (group) {
            res.status(200).json({
                success: true,
                message: "success",
                results: group
            });
        } else throw "Group not found!";

    } catch (error) {
        console.log(error);
        res.status(400).send({ success: false, message: error });
    };
};

exports.update = async (req, res) => {
    try {
        const { name, description, type } = req.body;

        const oldGroup = await Group.findOne({ where: { id: req.params.groupId }});

        if (oldGroup) {
            const newGroup = await oldGroup.update({ name, description, type });

            if (newGroup) {
                res.status(200).json({
                    success: true,
                    message: "Group updated successfully.",
                    results: newGroup
                });
            } else throw "Update failed!";

        } else throw "Group not exist!";

    } catch (error) {
        console.log(error);
        res.status(400).send({ success: false, message: error });
    };
};

exports.remove = async (req, res) => {
    try {
        const group = await Group.destroy({ where: { id: req.params.groupId } });

        if(group) {
            res.status(200).json({
                success: true,
                message: "Group deleted succesfully.",
                results: { groupId: req.params.grouId }
            });
        } else throw "Invalid group!";
        
    } catch (error) {
        console.log(error);
        res.status(400).send({ success: false, message: error });
    }
};

exports.list = async (req, res) => {
    try {
        // let qureyEverything = { include: { all: true, nested: true }};
        let qurey = { 
            where: { banned: false },
            attributes: { exclude: ['userId'] },
            include: {
                model: User,
                attributes: ['id', 'name', 'email']
            },
        };
        const group = await Group.findAndCountAll(qurey);

        if (group) {
            res.status(200).json({
                success: true,
                message: "success",
                results: group
            });
        } else throw "Group is empty!";

    } catch (error) {
        console.log(error);
        res.status(400).send({ success: false, message: error });
    };
};

exports.joinGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user.id;

        if(!groupId) throw "Param groupId is required!";

        // Make sure group is not empty
        const groupExisted = await Group.findOne({ where: { id: groupId } });
        if(!groupExisted) throw "Invalid group!";

        // Make sure user not joined in this group before
        const isJoined = await GroupMember.findOne({ where: { groupId, userId } });

        if (!isJoined) {

            const status = groupExisted.type === "Private" ? "Pending" : "Approved";
            const message = groupExisted.type === "Private" ? "Requested to join group & wating for approval." : "Succesfully join to group.";

            const joined = await GroupMember.create({ userId, groupId, status });
            
            if (joined) {
                res.status(200).json({
                    success: true,
                    message,
                    results: joined
                });
            } else throw "Join failed!";
        } else throw "User already joined in this group.";

    } catch (error) {
        console.log(error);
        res.status(400).send({ success: false, message: error });
    };
};

exports.handleGroupMemberStatus = async (req, res) => {
    try {
        const { memberId, status } = req.body;
        if (!status) throw "Missing param status!"

        const member = await GroupMember.findOne({ where: { userId: memberId, groupId: req.params.groupId }})
        if (!member) throw "Member not found!"

        const memberUpdate = await member.update({ status });
        if (memberUpdate) {
            res.status(200).json({
                success: true,
                message: `Member has been update status to: ${status}`,
                results: memberUpdate
            });
        } else throw "Update status failed!";

    } catch (error) {
        console.log(error);
        res.status(400).send({ success: false, message: error });
    };
};

exports.listGroupMember = async (req, res) => {
    try {
        const { groupId } = req.params
        if (!groupId) throw "Missing params id!"

        const groupMembers = await GroupMember.findAndCountAll({ where: { groupId }});
        console.log(groupMembers);
        if(groupMembers || groupMembers.count > 0) {
            res.status(200).json({
                success: true,
                message: `Success.`,
                results: groupMembers
            });
        } else throw "Unable to get member group!"

    } catch (error) {
        console.log(error);
        res.status(400).send({ success: false, message: error });
    };
};