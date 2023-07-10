const APPROOT = require('app-root-path');
const path = require('path');
const fileName = path.basename(__filename);
const Util = require(`${APPROOT}/util/util`);
const logger = require(`${APPROOT}/util/logger`)(module);
const Search = require(`${APPROOT}/routes/service/search.service.js`);
const ResponseModel = require(`${APPROOT}/routes/models/response/index`);

module.exports = {
  main: async (req, res) => {
    try {
      if (req.method === "POST") req.query = req.body;
      req.query.searchIndex = 'popcontents';
      const searchResult = await Search.getMainData(req.query);
      //console.log(JSON.stringify(searchResult));
      
      let modelResult;

      if (Util.getEmpty(req.query.category) || req.query.category === "all") {
        modelResult = await ResponseModel.getAllData(req.query, searchResult, res);
      }else{
        modelResult = await ResponseModel.getAllData(req.query, searchResult, res);
      }
      //console.log(modelResult)
      res.send(Util.sendResStatusByOk(req.query, modelResult, null));
    } catch (err) {
      // 4-1. If an error occurs, Send Error Info.
      logger.error('---------------------------------------', fileName);
      logger.error(`${req.originalUrl} / (method:${req.method})`, fileName);
      logger.error(err);
      logger.error('---------------------------------------', fileName);
      res.send(Util.errHandler(req, res, err));
    }
  },
  pageMain: async (req, res) => {
    try {      
      if (req.method === "POST") req.query = req.body;
      let spregex = /[\{\}\[\]\/?.,;:\)*~`^\_+<>@\#$%&\\\=\(\'\"]/g;
      if(spregex.test(req.query.keyword)){
        return res.send({
          code: 400,
          message: "You cannot include special characters in keywords."
        });
      }
      let regex = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);
      if(Util.getEmpty(req.query.from_date)^Util.getEmpty(req.query.to_date) == 1){
        return res.send({
          code: 400,
          message: "Enter both from_date and to_date, or do not enter both."
        });
      }else if(!Util.getEmpty(req.query.from_date)){
        if(!regex.test(req.query.from_date) || !regex.test(req.query.to_date)){
          return res.send({
            code: 400,
            message: "from_date/to_date parameter invalid format."
          });
        }
      }
      
      req.query.searchIndex = 'stream';  
      const categoryResult = await Search.getCategoryBoost(req.query);
      let categoryBoostResult = categoryResult.responses[0];
      if(categoryBoostResult.hits.total.value > 0){
        req.query.categoryList = categoryBoostResult.hits.hits[0]._source.categoryList_k;
      }
      const searchResult = await Search.getPageMain(req.query);
      //console.log(JSON.stringify(categoryResult));
      let modelResult;

      if (Util.getEmpty(req.query.category) || req.query.category === "all") {
        modelResult = await ResponseModel.getAllData(req.query, searchResult, res);
      }else{
        modelResult = await ResponseModel.getAllData(req.query, searchResult, res);
      }
      res.send(Util.sendResStatusByOk(req.query, modelResult, null));
    } catch (err) {
      // 4-1. If an error occurs, Send Error Info.
      logger.error('---------------------------------------', fileName);
      logger.error(`${req.originalUrl} / (method:${req.method})`, fileName);
      logger.error(err);
      logger.error('---------------------------------------', fileName);
      res.send(Util.errHandler(req, res, err));
    }
  },
  pageDocs: async (req, res) => {
    try {
      if (req.method === "POST") req.query = req.body;
      let spregex = /[\{\}\[\]\/?.,;:\)*~`^\_+<>@\#$%&\\\=\(\'\"]/g;
      if(Util.getEmpty(req.query.streamDocsId)){
        return res.send({
          code: 400,
          message: "streamDocsId is requierd parameter."
        });
      }else if(spregex.test(req.query.keyword)){
        return res.send({
          code: 400,
          message: "You cannot include special characters in keywords."
        });
      }
      req.query.searchIndex = 'page';
      const searchResult = await Search.getPageDocs(req.query);
      //console.log(JSON.stringify(searchResult));
      let modelResult;
      modelResult = await ResponseModel.getPageDocs(req.query, searchResult, res);
      res.send(Util.sendResStatusByOk(req.query, modelResult, null));
    } catch (err) {
      // 4-1. If an error occurs, Send Error Info.
      logger.error('---------------------------------------', fileName);
      logger.error(`${req.originalUrl} / (method:${req.method})`, fileName);
      logger.error(err);
      logger.error('---------------------------------------', fileName);
      res.send(Util.errHandler(req, res, err));
    }
  },
  vocabulary: async (req, res) => {
    try {
      if (req.method === "POST") req.query = req.body;
      req.query.searchIndex = 'vocabulary';
      const searchResult = await Search.getVocabulary(req.query);
      //console.log(JSON.stringify(searchResult));
      let modelResult;
      modelResult = await ResponseModel.getVocaData(req.query, searchResult, res);
      res.send(Util.sendResStatusByOk(req.query, modelResult, null));
    } catch (err) {
      // 4-1. If an error occurs, Send Error Info.
      logger.error('---------------------------------------', fileName);
      logger.error(`${req.originalUrl} / (method:${req.method})`, fileName);
      logger.error(err);
      logger.error('---------------------------------------', fileName);
      res.send(Util.errHandler(req, res, err));
    }
  },
  vocaTerm: async (req, res) => {
    try {
      if (req.method === "POST") req.query = req.body;
      req.query.searchIndex = 'vocabulary';
      if(Util.getEmpty(req.query.id)){
        return res.send({
          code: 400,
          message: "id is requierd parameter."
        });
      }
      const searchResult = await Search.getVocaTerm(req.query);
      //console.log(JSON.stringify(searchResult));
      let modelResult;
      modelResult = await ResponseModel.getVocaTermData(req.query, searchResult, res);
      res.send(Util.sendResStatusByOk(req.query, modelResult, null));
    } catch (err) {
      // 4-1. If an error occurs, Send Error Info.
      logger.error('---------------------------------------', fileName);
      logger.error(`${req.originalUrl} / (method:${req.method})`, fileName);
      logger.error(err);
      logger.error('---------------------------------------', fileName);
      res.send(Util.errHandler(req, res, err));
    }
  },
  doc: async (req, res) => {
    try {
      if (req.method === "POST") req.query = req.body;
      req.query.searchIndex = 'page';
      if(Util.getEmpty(req.query.id)){
        return res.send({
          code: 400,
          message: "id is requierd parameter."
        });
      }
      const searchResult = await Search.getDocuments(req.query);
      //console.log(JSON.stringify(searchResult));
      let modelResult;
      modelResult = await ResponseModel.getDocuments(req.query, searchResult, res);
      res.send(Util.sendResStatusByOk(req.query, modelResult, null));
    } catch (err) {
      // 4-1. If an error occurs, Send Error Info.
      logger.error('---------------------------------------', fileName);
      logger.error(`${req.originalUrl} / (method:${req.method})`, fileName);
      logger.error(err);
      logger.error('---------------------------------------', fileName);
      res.send(Util.errHandler(req, res, err));
    }
  },
  wordCloud: async (req, res) => {
    try {
      if (req.method === "POST") req.query = req.body;
      if(Util.getEmpty(req.query.keyword)){
        return res.send({
          code: 400,
          message: "keyword is requierd parameter."
        });
      }
      let regex = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);
      if(Util.getEmpty(req.query.from_date)^Util.getEmpty(req.query.to_date) == 1){
        return res.send({
          code: 400,
          message: "Enter both from_date and to_date, or do not enter both."
        });
      }else if(!Util.getEmpty(req.query.from_date)){
        if(!regex.test(req.query.from_date) || !regex.test(req.query.to_date)){
          return res.send({
            code: 400,
            message: "from_date/to_date parameter invalid format."
          });
        }
      }
      req.query.searchIndex = 'page';
      const searchResult = await Search.getWordcloud(req.query);
      //console.log(JSON.stringify(searchResult));
      let modelResult;
      modelResult = await ResponseModel.getWordcloud(req.query, searchResult);
      res.send(Util.sendResStatusByOk(req.query, modelResult, null));
    } catch (err) {
      // 4-1. If an error occurs, Send Error Info.
      logger.error('---------------------------------------', fileName);
      logger.error(`${req.originalUrl} / (method:${req.method})`, fileName);
      logger.error(err);
      logger.error('---------------------------------------', fileName);
      res.send(Util.errHandler(req, res, err));
    }
  },
  faq: async (req, res) => {
    try {
      if (req.method === "POST") req.query = req.body;
      req.query.searchIndex = 'faq';
      const searchResult = await Search.getFaq(req.query);
      //console.log(JSON.stringify(searchResult));
      let modelResult;
      modelResult = await ResponseModel.getFaqData(req.query, searchResult, res);
      res.send(Util.sendResStatusByOk(req.query, modelResult, null));
    } catch (err) {
      // 4-1. If an error occurs, Send Error Info.
      logger.error('---------------------------------------', fileName);
      logger.error(`${req.originalUrl} / (method:${req.method})`, fileName);
      logger.error(err);
      logger.error('---------------------------------------', fileName);
      res.send(Util.errHandler(req, res, err));
    }
  },
  faqDoc: async (req, res) => {
    try {
      if (req.method === "POST") req.query = req.body;
      req.query.searchIndex = 'faq';
      if(Util.getEmpty(req.query.id)){
        return res.send({
          code: 400,
          message: "id is requierd parameter."
        });
      }
      const searchResult = await Search.getDocuments(req.query);
      //console.log(JSON.stringify(searchResult));
      let modelResult;
      modelResult = await ResponseModel.getFaqDocData(req.query, searchResult, res);
      res.send(Util.sendResStatusByOk(req.query, modelResult, null));
    } catch (err) {
      // 4-1. If an error occurs, Send Error Info.
      logger.error('---------------------------------------', fileName);
      logger.error(`${req.originalUrl} / (method:${req.method})`, fileName);
      logger.error(err);
      logger.error('---------------------------------------', fileName);
      res.send(Util.errHandler(req, res, err));
    }
  },
  qna: async (req, res) => {
    try {
      if (req.method === "POST") req.query = req.body;
      if(Util.getEmpty(req.query.userId)){
        return res.send({
          code: 400,
          message: "userId is requierd parameter."
        });
      }
      req.query.searchIndex = 'qna';
      const searchResult = await Search.getQna(req.query);
      //console.log(JSON.stringify(searchResult));
      let modelResult;
      modelResult = await ResponseModel.getQnaData(req.query, searchResult, res);
      res.send(Util.sendResStatusByOk(req.query, modelResult, null));
    } catch (err) {
      // 4-1. If an error occurs, Send Error Info.
      logger.error('---------------------------------------', fileName);
      logger.error(`${req.originalUrl} / (method:${req.method})`, fileName);
      logger.error(err);
      logger.error('---------------------------------------', fileName);
      res.send(Util.errHandler(req, res, err));
    }
  },
  qnaDoc: async (req, res) => {
    try {
      if (req.method === "POST") req.query = req.body;
      req.query.searchIndex = 'qna';
      if(Util.getEmpty(req.query.id)){
        return res.send({
          code: 400,
          message: "id is requierd parameter."
        });
      }
      const searchResult = await Search.getDocuments(req.query);
      //console.log(JSON.stringify(searchResult));
      let modelResult;
      modelResult = await ResponseModel.getQnaDocData(req.query, searchResult, res);
      res.send(Util.sendResStatusByOk(req.query, modelResult, null));
    } catch (err) {
      // 4-1. If an error occurs, Send Error Info.
      logger.error('---------------------------------------', fileName);
      logger.error(`${req.originalUrl} / (method:${req.method})`, fileName);
      logger.error(err);
      logger.error('---------------------------------------', fileName);
      res.send(Util.errHandler(req, res, err));
    }
  },
  myKwd: async (req, res) => {
    try {
      if (req.method === "POST") req.query = req.body;
      if(Util.getEmpty(req.query.userId)){
        return res.send({
          code: 400,
          message: "userId is requierd parameter."
        });
      }
      req.query.searchIndex = 'mypage';
      const searchResult = await Search.getMykeyword(req.query);
      //console.log(JSON.stringify(searchResult));
      let modelResult;
      modelResult = await ResponseModel.getMykeyword(req.query, searchResult);
      res.send(Util.sendResStatusByOk(req.query, modelResult, null));
    } catch (err) {
      // 4-1. If an error occurs, Send Error Info.
      logger.error('---------------------------------------', fileName);
      logger.error(`${req.originalUrl} / (method:${req.method})`, fileName);
      logger.error(err);
      logger.error('---------------------------------------', fileName);
      res.send(Util.errHandler(req, res, err));
    }
  },
  myClick: async (req, res) => {
    try {
      if (req.method === "POST") req.query = req.body;
      if(Util.getEmpty(req.query.userId)){
        return res.send({
          code: 400,
          message: "userId is requierd parameter."
        });
      }
      req.query.searchIndex = 'mypage';
      const searchResult = await Search.getMyclick(req.query);

      let result = searchResult.responses[0];
      let results = [];
      let logTotal = result.hits.total.value;
      let logResults = result.hits.hits;
      
      if (logTotal > 0){
        for(let i = 0; i<logResults.length; i++){
          let logSource = logResults[i]._source;
          let docId = logSource.docId_k;
          let docQuery;
          if(docId.indexOf('_') > 0){
            docQuery = {"id":docId,"searchIndex":"page"}
          }else{
            docQuery = {"id":docId,"searchIndex":"stream"}
          }
  
          const docResult = await Search.getDocuments(docQuery);
          let docSource = docResult.responses[0].hits.hits[0]._source;
          let logResult = {}
          logResult['log'] = logSource;
          logResult['doc'] = docSource;
          logResult['total'] = logTotal;
          results.push(logResult);
        }
      }
      //console.log(JSON.stringify(searchResult));
      let modelResult;
      modelResult = await ResponseModel.getMyclick(req.query, results);
      res.send(Util.sendResStatusByOk(req.query, modelResult, null));
    } catch (err) {
      // 4-1. If an error occurs, Send Error Info.
      logger.error('---------------------------------------', fileName);
      logger.error(`${req.originalUrl} / (method:${req.method})`, fileName);
      logger.error(err);
      logger.error('---------------------------------------', fileName);
      res.send(Util.errHandler(req, res, err));
    }
  },
  popContents: async (req, res) => {
    try {
      if (req.method === "POST") req.query = req.body;
      req.query.searchIndex = 'popcontents';
      const searchResult = await Search.getPopData(req.query);
      //console.log(JSON.stringify(searchResult));
      
      let modelResult = await ResponseModel.getPopContents(req.query, searchResult, res);

      //console.log(modelResult)
      res.send(Util.sendResStatusByOk(req.query, modelResult, null));
    } catch (err) {
      // 4-1. If an error occurs, Send Error Info.
      logger.error('---------------------------------------', fileName);
      logger.error(`${req.originalUrl} / (method:${req.method})`, fileName);
      logger.error(err);
      logger.error('---------------------------------------', fileName);
      res.send(Util.errHandler(req, res, err));
    }
  },
  pageSimidocs: async (req, res) => {
    try {
      if (req.method === "POST") req.query = req.body;
      if(Util.getEmpty(req.query.id)){
        return res.send({
          code: 400,
          message: "id is requierd parameter."
        });
      }
      req.query.searchIndex = 'page';
      const docResult = await Search.getDocuments(req.query);
      const searchResult = await Search.getSimidocs(req.query,docResult);
      
      //console.log(JSON.stringify(searchResult));
      let modelResult;
      modelResult = await ResponseModel.getSimidocs(req.query, searchResult);
      //console.log(modelResult);
      res.send(Util.sendResStatusByOk(req.query, modelResult, null));
    } catch (err) {
      // 4-1. If an error occurs, Send Error Info.
      logger.error('---------------------------------------', fileName);
      logger.error(`${req.originalUrl} / (method:${req.method})`, fileName);
      logger.error(err);
      logger.error('---------------------------------------', fileName);
      res.send(Util.errHandler(req, res, err));
    }
  },
  test: async function(req, res){
    try {
      if (req.method === "POST") req.query = req.body;
      console.log(req.query);
      res.send(Util.sendResStatusByOk(req.query, null));
    } catch (err) {
      // 4-1. If an error occurs, Send Error Info.
      logger.error('---------------------------------------', fileName);
      logger.error(`${req.originalUrl} / (method:${req.method})`, fileName);
      logger.error(err);
      logger.error('---------------------------------------', fileName);
      res.send(Util.errHandler(req, res, err));
    }
  }
}
