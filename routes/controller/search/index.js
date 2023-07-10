const APPROOT = require('app-root-path');
const express = require('express');
const router = express.Router();
const controller = require('./search.controller');
//메인페이지
router.all('/main', controller.main);
//검색 메인페이지
router.all('/page/main', controller.pageMain);
//문서별 검색
router.all('/page/docs',controller.pageDocs);
router.all('/page/simidocs',controller.pageSimidocs);
//문서 ID 검색
router.all('/doc', controller.doc);
//faq 검색
router.all('/faq', controller.faq);
//faq ID 검색
router.all('/faq/doc', controller.faqDoc);
// qna 검색
router.all('/qna', controller.qna);
// qna ID 검색
router.all('/qna/doc', controller.qnaDoc);
// 용어집 검색
router.all('/vocabulary', controller.vocabulary);
// 용어 상세 검색
router.all('/vocabulary/term', controller.vocaTerm);
// 카테고리별 워드클라우드
router.all('/wordcloud', controller.wordCloud);
// 마이페이지
router.all('/mypage/kwdlist', controller.myKwd);
router.all('/mypage/clickcont', controller.myClick);
//인기컨텐츠
router.all('/popcont', controller.popContents);
router.all('/test', controller.test);
module.exports = router;
