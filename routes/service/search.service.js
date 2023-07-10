const APPROOT = require('app-root-path');
const deepcopy = require('deepcopy');
const { main } = require('../controller/search/search.controller');
const Util = require(`${APPROOT}/util/util`);
const Payload = require(`${APPROOT}/routes/models/payload/payload`);
const elasticQuery = require(`${APPROOT}/routes/models/payload/payload.model`);
const searchEngine = require(`${APPROOT}/middleware/elasticsearch`);
const elasticsearch = new searchEngine('SE');
const Gateway = require(`${APPROOT}/routes/service/gateway.service.js`);
const Search = require(`${APPROOT}/routes/service/search.service.js`);
const index_config = require(`${APPROOT}/config/es_index_conf`);

// Process Execute Query
module.exports = {
  getMainData: async (req) => {
    try {
      let reqParams = deepcopy(req);
      let searchIndex = reqParams.searchIndex;
      let index = index_config[searchIndex].index[0];
      let queryArr = [];
      let setParams = Payload.setReqParamsk4(reqParams);
      let categoryList = index_config[searchIndex].category;
      let indexString;
      // const countQuery = await elasticQuery.getCategoryCntQuery(reqParams);
      // let cateCntResult = await elasticsearch.singleSearch(index_config[reqParams.searchIndex].index[0], countQuery);
      // let buckets = cateCntResult.aggregations.category.buckets;

      if (Util.getEmpty(reqParams.category) || reqParams.category === "all" ){
        for(let i = 0; i<categoryList.length; i++){
          let queryObj = {};
          setParams.category = categoryList[i]
          const searchQuery = await elasticQuery.getMainQuery(setParams);
          console.log(`Main Page Query ::: %j`, searchQuery);
          queryObj[setParams.searchIndex] = searchQuery;
          queryArr.push(queryObj);
        }
      }else{
        let queryObj = {};
        setParams.category = reqParams.category
        const searchQuery = await elasticQuery.getMainQuery(setParams);
        console.log(`Main Page Query ::: %j`, searchQuery);
        queryObj[index] = searchQuery;
        queryArr.push(queryObj);
      }
      const msearchResult = await elasticsearch.multiSearch(queryArr, "");
      return {categoryList:categoryList,searchResult:msearchResult}

    } catch (err) {
      throw err;
    }
  },
  getPageMain: async (req) => {
    try {
      let reqParams = deepcopy(req);
      let index = index_config[reqParams.searchIndex].index[0];
      let fields;
      let categoryList = index_config[reqParams.searchIndex].category;
      if(Util.getEmpty(reqParams.field) || reqParams.field === "all"){
        fields = index_config[reqParams.searchIndex].field.all;
      }else if(reqParams.field === "title"){
        fields = index_config[reqParams.searchIndex].field.titleField;
      }else if(reqParams.field === "info"){
        fields = index_config[reqParams.searchIndex].field.infoField;
      }
      let highlight = index_config[reqParams.searchIndex].field.highlightField;
      if(!Util.getEmpty(reqParams.categoryList)){
        if(reqParams.categoryList.length < categoryList.length){
          for(let category of categoryList ){
            //console.log(category, reqParams.categoryList);
            if(reqParams.categoryList.indexOf(category) < 0){
              reqParams.categoryList.push(category);
            }
          }
          categoryList = reqParams.categoryList;
        }else{
          categoryList = reqParams.categoryList;
        }
      }
      //console.log(categoryList);
      let queryArr = [];
      reqParams.fields = fields;
      reqParams.highlight = highlight;
      reqParams.searchIndex = index;
      let setParams = Payload.setParamsPageMain(reqParams);
      //console.log(categoryList);
      if (Util.getEmpty(reqParams.category) || reqParams.category === "all" ){
        for(let i = 0; i<categoryList.length; i++){
          let queryObj = {};
          setParams.category = categoryList[i]
          const searchQuery = await elasticQuery.getPageMainQuery(setParams);
          console.log(`Search Main Query ::: %j`, searchQuery);
          queryObj[index] = searchQuery;
          queryArr.push(queryObj);
        }
      }else{
        let queryObj = {};
        setParams.category = reqParams.category
        const searchQuery = await elasticQuery.getPageMainQuery(setParams);
        console.log(`Search Main Query ::: %j`, searchQuery);
        queryObj[index] = searchQuery;
        queryArr.push(queryObj);
      }
      
      const msearchResult = await elasticsearch.multiSearch(queryArr, "");
      //console.log(JSON.stringify(msearchResult));
      if (!Util.getEmpty(setParams.keyword)) indexString = setParams.keyword;
      else if (Util.getEmpty(setParams.keyword)) indexString = "";

      if (indexString !== "") {
        Gateway.setOpenQuerylog(index + "", indexString, msearchResult)
      }
      
      return {categoryList:categoryList,searchResult:msearchResult};

    } catch (err) {
      throw err;
    }
  },
  getPageDocs: async (req) => {
    try {
      let reqParams = deepcopy(req);
      let index = index_config[reqParams.searchIndex].index[0];
      let fields = index_config[reqParams.searchIndex].field.searchField;
      let highlight = index_config[reqParams.searchIndex].field.highlightField;
      let categoryList = index_config[reqParams.searchIndex].category;
      let queryArr = [];
      reqParams.fields = fields;
      reqParams.highlight = highlight;
      reqParams.searchIndex = index;
      let setParams = Payload.setParamsPageDocs(reqParams);
      //console.log(setParams)
      if (!Util.getEmpty(reqParams.streamDocsId)){
        let queryObj = {};
        const searchQuery = await elasticQuery.getPageDocsQuery(setParams);
        console.log(`Search Docs Query ::: %j`, searchQuery);
        queryObj[index] = searchQuery;
        queryArr.push(queryObj);
      }
      
      const msearchResult = await elasticsearch.multiSearch(queryArr, "");
      //console.log(JSON.stringify(msearchResult));
      return msearchResult;

    } catch (err) {
      throw err;
    }
  },
  getVocabulary: async (req) => {
    try {
      let reqParams = deepcopy(req);
      let index = index_config[reqParams.searchIndex].index[0];
      let fields;
      if(Util.getEmpty(reqParams.field) || reqParams.field === "all"){
        fields = index_config[reqParams.searchIndex].field.all;
      }else if(reqParams.field === "term"){
        fields = index_config[reqParams.searchIndex].field.termsField;
      }else if(reqParams.field === "info"){
        fields = index_config[reqParams.searchIndex].field.infoField;
      }
      let highlight = index_config[reqParams.searchIndex].field.highlightField;
      let filterField = index_config[reqParams.searchIndex].field.filterField;
      let sortField = index_config[reqParams.searchIndex].field.sortField;
      let queryArr = [];
      reqParams.fields = fields;
      reqParams.highlight = highlight;
      reqParams.filterField = filterField;
      reqParams.searchIndex = index;
      reqParams.sortField = sortField;
      let setParams = Payload.setParamsVoca(reqParams);
      //console.log(setParams)
      
      let queryObj = {};
      const searchQuery = await elasticQuery.getVocaQuery(setParams);
      console.log(`Search Voca Query ::: %j`, searchQuery);
      queryObj[index] = searchQuery;
      queryArr.push(queryObj);
            
      const msearchResult = await elasticsearch.multiSearch(queryArr, "");
      //console.log(JSON.stringify(msearchResult));
      return msearchResult;

    } catch (err) {
      throw err;
    }
  },
  getVocaTerm: async (req) => {
    try {
      let reqParams = deepcopy(req);
      let index = index_config[reqParams.searchIndex].index[0];
      let queryArr = [];
      let queryObj = {};
      const searchQuery = await elasticQuery.getIdsQuery(reqParams);
      //console.log(`Search Voca Term Query ::: %j`, searchQuery);
      queryObj[index] = searchQuery;
      queryArr.push(queryObj);
            
      const msearchResult = await elasticsearch.multiSearch(queryArr, "");
      //console.log(JSON.stringify(msearchResult));
      return msearchResult;

    } catch (err) {
      throw err;
    }
  },
  getDocuments: async (req) => {
    try {
      let reqParams = deepcopy(req);
      let index = index_config[reqParams.searchIndex].index[0];
      let queryArr = [];
      let queryObj = {};
      const searchQuery = await elasticQuery.getIdsQuery(reqParams);
      //console.log(`Search Voca Term Query ::: %j`, searchQuery);
      queryObj[index] = searchQuery;
      queryArr.push(queryObj);
            
      const msearchResult = await elasticsearch.multiSearch(queryArr, "");
      //console.log(JSON.stringify(msearchResult));
      return msearchResult;

    } catch (err) {
      throw err;
    }
  },
  getWordcloud: async (req) => {
    try {
      let reqParams = deepcopy(req);
      let index = index_config[reqParams.searchIndex].index[0];
      let fields = index_config[reqParams.searchIndex].field.searchField;
      let highlight = index_config[reqParams.searchIndex].field.highlightField;
      let categoryList = index_config[reqParams.searchIndex].category;
      let queryArr = [];
      reqParams.fields = fields;
      reqParams.highlight = highlight;
      reqParams.searchIndex = index;
      let setParams = Payload.setParamsPageMain(reqParams);

      if (Util.getEmpty(reqParams.category) || reqParams.category === "all" ){
        for(let i = 0; i<categoryList.length; i++){
          let queryObj = {};
          setParams.category = categoryList[i]
          const searchQuery = await elasticQuery.getWordcloudQuery(setParams);
          //console.log(`Search wordcloud Query ::: %j`, searchQuery);
          queryObj[index] = searchQuery;
          queryArr.push(queryObj);
        }
      }else{
        let queryObj = {};
        setParams.category = reqParams.category
        const searchQuery = await elasticQuery.getWordcloudQuery(setParams);
        //console.log(`Search Main Query ::: %j`, searchQuery);
        queryObj[index] = searchQuery;
        queryArr.push(queryObj);
      }
      
      const msearchResult = await elasticsearch.multiSearch(queryArr, "");
      //console.log(JSON.stringify(msearchResult));
            
      return {categoryList:categoryList,searchResult:msearchResult};

    } catch (err) {
      throw err;
    }
  },
  getFaq: async (req) => {
    try {
      let reqParams = deepcopy(req);
      let index = index_config[reqParams.searchIndex].index[0];
      let fields;
      if(Util.getEmpty(reqParams.field) || reqParams.field === "all"){
        fields = index_config[reqParams.searchIndex].field.all;
      }else if(reqParams.field === "title"){
        fields = index_config[reqParams.searchIndex].field.titleField;
      }else if(reqParams.field === "content"){
        fields = index_config[reqParams.searchIndex].field.contentField;
      }
      let highlight = index_config[reqParams.searchIndex].field.highlightField;
      let sortField = index_config[reqParams.searchIndex].field.sortField;
      let queryArr = [];
      reqParams.fields = fields;
      reqParams.highlight = highlight;
      reqParams.searchIndex = index;
      reqParams.sortField = sortField;
      let setParams = Payload.setParamsFaq(reqParams);
      //console.log(setParams)
      
      let queryObj = {};
      const searchQuery = await elasticQuery.getFaqQuery(setParams);
      console.log(`Search Faq Query ::: %j`, searchQuery);
      queryObj[index] = searchQuery;
      queryArr.push(queryObj);
            
      const msearchResult = await elasticsearch.multiSearch(queryArr, "");
      //console.log(JSON.stringify(msearchResult));
      return msearchResult;

    } catch (err) {
      throw err;
    }
  },
  getQna: async (req) => {
    try {
      let reqParams = deepcopy(req);
      let index = index_config[reqParams.searchIndex].index[0];
      let fields;
      if(Util.getEmpty(reqParams.field) || reqParams.field === "all"){
        fields = index_config[reqParams.searchIndex].field.all;
      }else if(reqParams.field === "title"){
        fields = index_config[reqParams.searchIndex].field.titleField;
      }else if(reqParams.field === "content"){
        fields = index_config[reqParams.searchIndex].field.contentField;
      }else if(reqParams.field === "q_content"){
        fields = index_config[reqParams.searchIndex].field.qContentField;
      }else if(reqParams.field === "a_content"){
        fields = index_config[reqParams.searchIndex].field.aContentField;
      }
      let highlight = index_config[reqParams.searchIndex].field.highlightField;
      let sortField = index_config[reqParams.searchIndex].field.sortField;
      let queryArr = [];
      reqParams.fields = fields;
      reqParams.highlight = highlight;
      reqParams.searchIndex = index;
      reqParams.sortField = sortField;
      let setParams = Payload.setParamsQna(reqParams);
      //console.log(setParams)
      
      let queryObj = {};
      const searchQuery = await elasticQuery.getQnaQuery(setParams);
      console.log(`Search Qna Query ::: %j`, searchQuery);
      queryObj[index] = searchQuery;
      queryArr.push(queryObj);
            
      const msearchResult = await elasticsearch.multiSearch(queryArr, "");
      //console.log(JSON.stringify(msearchResult));
      return msearchResult;

    } catch (err) {
      throw err;
    }
  },
  getMykeyword: async (req) => {
    try {
      let reqParams = deepcopy(req);
      reqParams.action = 'search';
      let index = index_config[reqParams.searchIndex].index[0];
      let queryArr = [];
      let actionField = index_config[reqParams.searchIndex][reqParams.action].field.actionField[0];
      let idField = index_config[reqParams.searchIndex][reqParams.action].field.idField[0];
      let aggsField = index_config[reqParams.searchIndex][reqParams.action].field.aggsField[0];
      reqParams.actionField = actionField;
      reqParams.idField = idField;
      reqParams.aggsField = aggsField;
      reqParams.searchIndex = index;
      
      let setParams = Payload.setParamsMykwd(reqParams);

      let queryObj = {};
      const searchQuery = await elasticQuery.getMykeywordQuery(setParams);
      //console.log(`Search Main Query ::: %j`, searchQuery);
      queryObj[setParams.index] = searchQuery;
      queryArr.push(queryObj);
      //console.log(JSON.stringify(queryArr));
      const msearchResult = await elasticsearch.multiSearch(queryArr, "");
      //console.log(JSON.stringify(msearchResult));
            
      return msearchResult;

    } catch (err) {
      throw err;
    }
  },
  getMyclick: async (req) => {
    try {
      let reqParams = deepcopy(req);
      reqParams.action = 'click';
      let index = index_config[reqParams.searchIndex].index[0];
      let queryArr = [];
      let actionField = index_config[reqParams.searchIndex][reqParams.action].field.actionField[0];
      let idField = index_config[reqParams.searchIndex][reqParams.action].field.idField[0];
      let sortField = index_config[reqParams.searchIndex][reqParams.action].field.sortField[0];
      let categoryField = index_config[reqParams.searchIndex][reqParams.action].field.categoryField[0];
      reqParams.actionField = actionField;
      reqParams.categoryField = categoryField;
      reqParams.idField = idField;
      reqParams.sortField = sortField;
      reqParams.searchIndex = index;
      let setParams = Payload.setParamsMyclick(reqParams);

      let queryObj = {};
      const searchQuery = await elasticQuery.getMyclickQuery(setParams);
      console.log(`Search myclick Query ::: %j`, searchQuery);
      queryObj[setParams.index] = searchQuery;
      queryArr.push(queryObj);
      //console.log(JSON.stringify(queryArr));
      const msearchResult = await elasticsearch.multiSearch(queryArr, "");
      //console.log(JSON.stringify(msearchResult))

      return msearchResult;

    } catch (err) {
      throw err;
    }
  },
  getCategoryBoost: async (req) => {
    try {
      let reqParams = deepcopy(req);
      let index = 'category';
      let queryArr = [];
      let termField = index_config[index].field.termField[0];
      reqParams.termField = termField;
      reqParams.searchIndex = index;
      let setParams = Payload.setParamsCategory(reqParams);

      let queryObj = {};
      const searchQuery = await elasticQuery.getCategoryQuery(setParams);
      //console.log(`Search Main Query ::: %j`, searchQuery);
      queryObj[index] = searchQuery;
      queryArr.push(queryObj);
      //console.log(JSON.stringify(queryArr));
      const msearchResult = await elasticsearch.multiSearch(queryArr, "");
      //console.log(JSON.stringify(msearchResult))

      return msearchResult;

    } catch (err) {
      throw err;
    }
  },
  getPopData: async (req) => {
    try {
      let reqParams = deepcopy(req);
      let searchIndex = reqParams.searchIndex;
      let index = index_config[searchIndex].index[0];

      let popMainqueryArr = [];
      let streamParams = Payload.setReqParamsk4(reqParams);
      let popMainqueryObj = {};
      const popMainQuery = await elasticQuery.getPopMainQuery(streamParams);
      popMainqueryObj[index] = popMainQuery;
      popMainqueryArr.push(popMainqueryObj);
      const popMainResult = await elasticsearch.multiSearch(popMainqueryArr, "");

      let popPagequeryArr = [];
      let fields;
      let highlight = index_config[reqParams.searchIndex].field.highlightField;
      if(Util.getEmpty(reqParams.field) || reqParams.field === "all"){
        fields = index_config[reqParams.searchIndex].field.all;
      }else if(reqParams.field === "title"){
        fields = index_config[reqParams.searchIndex].field.titleField;
      }else if(reqParams.field === "info"){
        fields = index_config[reqParams.searchIndex].field.infoField;
      }
      reqParams.fields = fields;
      reqParams.highlight = highlight;
      let pageParams = Payload.setParamPopPage(reqParams);
      let popPagequeryObj = {};
      const popPageQuery = await elasticQuery.getPopPageQuery(pageParams);
      popPagequeryObj[index] = popPageQuery;
      console.log(`Search popContents Query ::: %j`, popPageQuery);
      popPagequeryArr.push(popPagequeryObj);
      const popPageResult = await elasticsearch.multiSearch(popPagequeryArr, "");


      return {popMainResult:popMainResult,popPageResult:popPageResult}

    } catch (err) {
      throw err;
    }
  },
  getSimidocs: async (req, result) => {
    try {
      //console.log(result);
      let searchResult = [];
      let reqParams = deepcopy(req);
      //console.log(reqParams)
      let index = index_config[reqParams.searchIndex].index[0];
      
      let response = result.responses[0];
      let total = response.hits.total.value;
      let hits = response.hits.hits;
      let simidocList = []
      if(total > 0){
        simidocList = hits[0]._source.similarityDocs_k;
        simidocList.shift();
      }
      
      //console.log(simidocList);
      
      for(let i = 0; i<simidocList.length; i++){
        reqParams.id = simidocList[i];
        const searchQuery = await elasticQuery.getIdsQuery(reqParams);
        const singleResult = await elasticsearch.singleSearch(index, searchQuery);
        searchResult.push(singleResult);
      }
      return searchResult;
    } catch (err) {
      throw err;
    }
  }


  // getAggsData: async (req) => {
  //   try {
  //     let reqParams = deepcopy(req);
  //     let index = index_config[reqParams.searchIndex].index;
  //     let queryArr = [];
  //     let setParams = Payload.setReqParams4ttukttak(reqParams);

  //     setParams.type = "count";

  //     for (let i = 0; i < index.length; i++) {
  //       let queryObj = {};

  //       setParams.searchIndex === index[i];
  //       if (setParams.searchIndex === "evaluation") setParams.sort = "create_dttm_dt";
  //       if (index[i] === "photo" || index[i] === "house" || index[i] === "curator" || index[i] === "partners" || index[i] === "expert") {
  //         setParams.searchIndex = "interior:" + index[i];
  //         if (Util.getEmpty(reqParams.sort)) {
  //           if (index[i] === "partners") setParams.sort = "sellerscr,seller";
  //           else setParams.sort = "post_scr,post_no";
  //         }
  //         else setParams.sort = reqParams.sort;
  //       }

  //       const countQuery = await elasticQuery.getMainQuery(setParams);
  //       console.log(`Aggregation [${[index[i]]}] --- Query ::: %j`, countQuery);
  //       queryObj[index[i]] = countQuery;
  //       queryArr.push(queryObj);
  //     }

  //     const msearchResult = await elasticsearch.multiSearch(queryArr, "");
  //     return msearchResult;

  //   } catch (err) {
  //     throw err;
  //   }
  // }
};

