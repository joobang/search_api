/* Search API */
// node.js Module
const APPROOT = require('app-root-path');
const path = require('path');
const fileName = path.basename(__filename);
const Util = require(`${APPROOT}/util/util`);
const logger = require(`${APPROOT}/util/logger`)(module);
const Gateway = require(`${APPROOT}/routes/service/gateway.service.js`);
const ResponseModel = require(`${APPROOT}/routes/models/response/index`);

module.exports = {
  //[자동완성]
  autocomplete: async (req, res) => {
    try {
      if (req.method === "POST") req.query = req.body;
      req.query.gatewayService = 'autocomplete';
      req.query.sort = 'weight,_score,keyword.keyword'; // sort

      const searchResult = await Gateway.getGatewayServiceResult(req.query, res);
      const modelResult = await ResponseModel.getAutoData(req.query, searchResult);

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
  //[연관검색어 || 추천검색어]
  related: async (req, res) => {
    try {
      if (req.method === "POST") req.query = req.body;
      req.query.gatewayService = 'related';
      req.query.sort = 'timestamp';

      const searchResult = await Gateway.getGatewayServiceResult(req.query, res);
      //[추천검색어 + 연관검색어] 일때	
      const modelResult = await ResponseModel.getRelatedData(req.query, searchResult.responses);
      //console.log(modelResult);
      // [ 연관검색어]
      //      const modelResult = await ResponseModel.getRelatedData(req.query, searchResult);

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


  // [ 인기검색어 ]
  popquery: async (req, res) => {
    try {
      if (req.method === "POST") req.query = req.body;
      req.query.gatewayService = "popquery";
      req.query.sort = 'timestamp';


      const searchResult = await Gateway.getGatewayServiceResult(req.query, res);
      const modelResult = await ResponseModel.getPopData(req.query, searchResult);

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


  //speller 테스트
  speller: async (req, res) => {
    try {
      if (req.method === "POST") req.query = req.body;
      req.query.gatewayService = "speller";

      if (req.query.keyword === undefined || req.query.label === undefined) {
        logger.error('Missing parameter');
        res.status(412).send('Missing parameter');
        return;
      }
      const searchResult = await Gateway.getSpellerCheck(req.query, res);
      // 5. Send Result
      //console.log(searchResult);
      res.json(Util.sendSpeller(req.query, searchResult));
    } catch (err) {
      // 4-1. If an error occurs, Send Error Info.
      logger.error('---------------------------------------', fileName);
      logger.error(`${req.originalUrl} / (method:${req.method})`, fileName);
      logger.error(err);
      logger.error('---------------------------------------', fileName);
      res.send(Util.errHandler(req, res, err));
    }
  },
  // [ 검색로깅 ]
  // searchlog: async (req, res) => {
  //   try {
  //     if (req.method === "POST") req.query = req.body;
  //     req.query.gatewayService = "searchlog";
  //     if(Util.getEmpty(req.query.userId)){
  //       return res.send({
  //         code: 400,
  //         message: "userId is requierd parameter."
  //       });
  //     }
  //     if(Util.getEmpty(req.query.keyword)){
  //       return res.send({
  //         code: 400,
  //         message: "keyword is requierd parameter."
  //       });
  //     }
  //     const logResult = await Gateway.setSearchlog(req.query);

  //     res.send(Util.sendResStatusByOk(req.query, logResult, null));

  //   } catch (err) {
  //     // 4-1. If an error occurs, Send Error Info.
  //     logger.error('---------------------------------------', fileName);
  //     logger.error(`${req.originalUrl} / (method:${req.method})`, fileName);
  //     logger.error(err);
  //     logger.error('---------------------------------------', fileName);
  //     res.send(Util.errHandler(req, res, err));
  //   }
  // },
  // [ 액션로깅 ]
  actionlog: async (req, res) => {
    try {
      if (req.method === "POST") req.query = req.body;
      req.query.gatewayService = "actionlog";
      if(Util.getEmpty(req.query.ssoId)){
        return res.send({
          code: 400,
          message: "ssoId is requierd parameter."
        });
      }
      if(Util.getEmpty(req.query.docId) && req.query != 'search'){
        return res.send({
          code: 400,
          message: "docId is requierd parameter."
        });
      }
      if(Util.getEmpty(req.query.keyword)){
        return res.send({
          code: 400,
          message: "keyword is requierd parameter."
        });
      }
      const logResult = await Gateway.setActionlog(req.query);

      res.send(Util.sendResStatusByOk(req.query, logResult, null));

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
      req.query.gatewayService = "qna";
      if(Util.getEmpty(req.query.ssoId)){
        return res.send({
          code: 400,
          message: "ssoId is requierd parameter."
        });
      }
      const logResult = await Gateway.setQna(req.query);

      res.send(Util.sendResStatusByOk(req.query, logResult, null));

    } catch (err) {
      // 4-1. If an error occurs, Send Error Info.
      logger.error('---------------------------------------', fileName);
      logger.error(`${req.originalUrl} / (method:${req.method})`, fileName);
      logger.error(err);
      logger.error('---------------------------------------', fileName);
      res.send(Util.errHandler(req, res, err));
    }
  },
  updateQna: async (req, res) => {
    try {
      if (req.method === "POST") req.query = req.body;
      req.query.gatewayService = "qna";
      if(Util.getEmpty(req.query.docId)){
        return res.send({
          code: 400,
          message: "docId is requierd parameter."
        });
      }
      const logResult = await Gateway.updateQna(req.query);

      res.send(Util.sendResStatusByOk(req.query, logResult, null));

    } catch (err) {
      // 4-1. If an error occurs, Send Error Info.
      logger.error('---------------------------------------', fileName);
      logger.error(`${req.originalUrl} / (method:${req.method})`, fileName);
      logger.error(err);
      logger.error('---------------------------------------', fileName);
      res.send(Util.errHandler(req, res, err));
    }
  },
  deleteQna: async (req, res) => {
    try {
      if (req.method === "POST") req.query = req.body;
      req.query.gatewayService = "qna";
      if(Util.getEmpty(req.query.docId)){
        return res.send({
          code: 400,
          message: "docId is requierd parameter."
        });
      }
      const logResult = await Gateway.deleteQna(req.query);

      res.send(Util.sendResStatusByOk(req.query, logResult, null));

    } catch (err) {
      // 4-1. If an error occurs, Send Error Info.
      logger.error('---------------------------------------', fileName);
      logger.error(`${req.originalUrl} / (method:${req.method})`, fileName);
      logger.error(err);
      logger.error('---------------------------------------', fileName);
      res.send(Util.errHandler(req, res, err));
    }
  }
};

