const APPROOT = require('app-root-path');
const deepcopy = require('deepcopy');
const request = require('request-promise');
const Util = require(`${APPROOT}/util/util`);
const Payload = require(`${APPROOT}/routes/models/payload/payload`);
const elasticQuery = require(`${APPROOT}/routes/models/payload/payload.model`);
const searchEngine = require(`${APPROOT}/middleware/elasticsearch`);
const elasticsearch = new searchEngine('SE');
const ser_index_config = require(`${APPROOT}/config/service_index_config`);
const ResponseModel = require(`${APPROOT}/routes/models/response/index`);

var hangul = require('../../util/hangul');
var editdistance = require('../../util/editdistance');
var speller = {};

// Process Execute Query
module.exports = {
  setOpenQuerylog: async (indexNm, keyword, searchResult) => {
    try {
      const logSet = Payload.setLog4OpenQueryLog2(indexNm, keyword, searchResult);
      const logOption = Util.makeURL4QueryLog(logSet);
      // return request(logOption);
      //console.log(logOption);
      return logOption;
    } catch (err) {
      throw err;
    }
  },
  getGatewayServiceResult: async (req) => {
    try {
      const reqParams = deepcopy(req);
      let gatewayService = req.gatewayService;
      let queryArr = [];
      const setParams = Payload.setReqParams4Gateway(reqParams);

      // [ 연관검색어 + 추천검색어 ]    
      if (gatewayService === "related") {     //연관검색일때 먼저 recommend
        indexName = ser_index_config[gatewayService].index;
        indexNameRec = '.openquery-recommend';
        let indexList = [indexNameRec, indexName];

        for (let i = 0; i < indexList.length; i++) {
          let queryObj = {};
          if (i === 0) { // Recommend

            const synonym = await elasticQuery.getSynonym(setParams);
            const synonyQuery = await elasticsearch.singleSearch('.openquery-kobrick', synonym);
            const synonymResultKeyword = await ResponseModel.getSynonymResult(setParams, synonyQuery); // 연관 + 추천일때

            // 키워드만 가져오기 위한 response;
            setParams.keyword = synonymResultKeyword;
            
            const recQuery = await elasticQuery.getGatewayServiceQuery(setParams, i);
            queryObj[indexNameRec] = recQuery;
            //console.log(recQuery);
            console.log(`Recommend : IndexName [${indexNameRec}] --- Query ::: %j`, recQuery);
          } else if (i === 1) {
            const relQuery = await elasticQuery.getGatewayServiceQuery(setParams, i);
            //          console.log(`Related : IndexName [${indexName}] --- Query ::: %j`, relQuery);
            queryObj[indexName] = relQuery;
          }
          queryArr.push(queryObj);
        }
        const msearchResult = await elasticsearch.multiSearch(queryArr, "");
        return msearchResult;
      }
      // [ 연관검색어 ] 
      //      if(gatewayService === "related") {
      //        indexName = ser_index_config[gatewayService].index;
      //	const searchQuery = await elasticQuery.getGatewayServiceQuery(setParams);
      //      const result = await elasticsearch.singleSearch(indexName, searchQuery);
      //	return result;
      //      }
      else if (gatewayService === "autocomplete") {
        indexName = ser_index_config[gatewayService].index + "_k4";

        const searchQuery = await elasticQuery.getGatewayServiceQuery(setParams);
        console.log(`Autocomplete : IndexName [${indexName}] --- Query ::: %j`, searchQuery);
        const result = await elasticsearch.singleSearch(indexName, searchQuery);

        return result;
      } else if (gatewayService === "popquery") {
        indexName = ser_index_config[gatewayService].index;
        const searchQuery = await elasticQuery.getGatewayServiceQuery(setParams);
        // console.log(`popquery : IndexName [${indexName}] --- Query ::: %j`, searchQuery);
        const result = await elasticsearch.singleSearch(indexName, searchQuery);
        return result;
      }
    } catch (err) {
      throw err;
    }
  },
  getSpellerCheck: async (req, res) => {
    try {
      const reqParams = deepcopy(req);

      const setParams = Payload.setReqParams4Gateway(reqParams);
      const serviceURL = Util.makeURL4Service(setParams);

      let result = await request(serviceURL);
      result = JSON.parse(result);
      return result;

      // let query = setParams.query || undefined;
      // let eng2kor = setParams.eng2kor || 'true';
      // let distance = setParams.distance || 2;
      // distance = distance > 1 ? 2 : 1;
      // let overflow = setParams.overflow || 'true';

      // var correction = '';

      // query = query.trim();

      // var arr = query.split(/[ \t]/);
      // for (var i = 0; i < arr.length; i++) {
      //   var results = speller.correct(setParams.label, arr[i], eng2kor, distance, overflow);
      //   if (results === false) {
      //     logger.error("Not exists label.");
      //     res.status(404).send();
      //     return;
      //   }

      //   if (correction.length > 0) {
      //     correction += ' ';
      //   }
      //   correction += (results.length > 0) ? results[0].value.word : arr[i];
      // }

      // return correction;
    } catch (err) {
      throw err;
    }
  },
  setActionlog: async (req) => {
    try {
      const reqParams = deepcopy(req);
      const setParams = Payload.setParamsActionlog(reqParams);
      const logQuery = await elasticQuery.getActionlogQuery(setParams);
      const indexName = setParams.index;
      const logResult = await elasticsearch.insertDocs(indexName, logQuery);
      // let result = await request(serviceURL);
      // result = JSON.parse(result);
      return logResult;
    } catch (err) {
      throw err;
    }
  },
  setQna: async (req) => {
    try {
      const reqParams = deepcopy(req);
      const setParams = Payload.setParamsQnaReg(reqParams);
      const logQuery = await elasticQuery.getQnaRegQuery(setParams);
      const indexName = setParams.index;
      const logResult = await elasticsearch.insertDocs(indexName, logQuery);
      // let result = await request(serviceURL);
      // result = JSON.parse(result);
      return logResult;
    } catch (err) {
      throw err;
    }
  },
  updateQna: async (req) => {
    try {
      const reqParams = deepcopy(req);
      const setParams = Payload.setParamsQnaUp(reqParams);
      const logQuery = await elasticQuery.getQnaUpQuery(setParams);
      const indexName = setParams.index;
      const docId = setParams.id;
      const logResult = await elasticsearch.updateDocs(indexName, logQuery,docId);
      // let result = await request(serviceURL);
      // result = JSON.parse(result);
      return logResult;
    } catch (err) {
      throw err;
    }
  },
  deleteQna: async (req) => {
    try {
      const reqParams = deepcopy(req);
      let indexName = '.openquery-qna';
      const logResult = await elasticsearch.deleteDocs(indexName, reqParams.docId);
      // let result = await request(serviceURL);
      // result = JSON.parse(result);
      return logResult;
    } catch (err) {
      throw err;
    }
  }
};
