const express = require('express');
const router = express.Router();

// controller
const {
    create,
    read,
    update,
    remove,
    list,
    joinGroup,
    handleGroupMemberStatus,
    listGroupMember
} = require('../controllers/group');

// middleware
const { authCheck, groupOwner } = require("../middlewares");

router.post('/group', authCheck, create);
router.put('/group/:groupId', authCheck, groupOwner, update);
router.delete('/group/:groupId', authCheck, groupOwner, remove);
router.get('/group/:groupId', read);
router.get('/groups', list);

router.post('/group/join/:groupId', authCheck, joinGroup);
router.put('/group/:groupId/handle-member-status', authCheck, groupOwner, handleGroupMemberStatus);

router.get('/group/:groupId/members', authCheck, listGroupMember);


module.exports = router;