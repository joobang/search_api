const APPROOT = require('app-root-path');
const express = require('express');
const router = express.Router();
const controller = require('./gateway.controller');

router.all('/autocomplete', controller.autocomplete);
router.all('/related', controller.related);
router.all('/popquery', controller.popquery);
router.all('/speller', controller.speller);

router.all('/actionlog', controller.actionlog);
router.all('/qna', controller.qna);
router.all('/qna/update', controller.updateQna);
router.all('/qna/delete', controller.deleteQna);

module.exports = router;
