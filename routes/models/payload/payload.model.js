// Basic Template Elasticsearch Query
const APPROOT = require('app-root-path');
const esQryMaker = require('elastic-builder');
const Util = require(`${APPROOT}/util/util`);
const index_config = require(`${APPROOT}/config/es_index_conf`);
const ser_index_config = require(`${APPROOT}/config/service_index_config`);
const moment = require('moment');


module.exports = {
  getMainQuery: async (reqParams, i) => {
    //config 및 설정값 get
    let size = reqParams.size;
    let from = (reqParams.from == 0) ? 0 : size * reqParams.from
    let category = reqParams.category;
    let query = {
      query: {
        bool: {
          must: [
            
          ],
          must_not: [
            
          ],
          should: [
            
          ],
          filter: [
            {
              term: {
                category_k: category
              }
            },
            {
              term: {
                targetIndex_k: "streamdocs"
              }
            }
          ]
        }
      },track_total_hits: true
      ,size: size
      ,from: from
      ,sort:[
        {
          "docCnt_i" : {
            "order":"desc"
          }
        }
      ]
    }
    


    return query;
  },
  getPageMainQuery: async (reqParams) => {
    let config = index_config["stream"];
    let keywordStr = reqParams.keyword;
    let andKeyword = "";
    let orKeyword = "";
    let notKeyword = "";
    let size = reqParams.size;
    let from = (reqParams.from == 0) ? 0 : size * reqParams.from
    
    let category = reqParams.category;
    let match = reqParams.match;
    let query = {
      track_total_hits: true,
      query : {
        bool: {
          must: [
            {
              bool:{
                should:[]
              }
            }
          ],
          must_not: [],
          filter: [
            {
              term: {
                "category_k" : category
              }
            }
          ]
        }
      },
      size: size,
      from: from,
      sort: []
      // _source: {
      //   exclude: "synap_contents_psk"
      // }
    }
      // keywrod 체크- | ! - 검사 
    if (!Util.getEmpty(keywordStr)) {
      let keywordSplit = keywordStr.split(" ");
      // | ! - 검사
      const validate = /[|!-]/;
      //console.log(keywordSplit)
      keywordSplit.forEach(value => {
        //console.log(value)
        if (value.charAt(0).match(validate)) {
          if (value.charAt(0) === "|") orKeyword += value.replace(validate, "") + " ";
          else if (value.charAt(0) === "-" || value.charAt(0) === "!") notKeyword = value.replace(validate, "");
        } else {
          if(!Util.getEmpty(andKeyword)){
            andKeyword += " "+value;
          }else{
            andKeyword += value
          }
        }
      })
    }

    // 쿼리생성
    if (!Util.getEmpty(andKeyword)) {
      //and
      let totalKeyword = "";
      totalKeyword = andKeyword;
      let andQuery;
      if(match === 'default'){
        andQuery = Util.getMultiMatchAnd(reqParams, totalKeyword);
        query.query.bool.must[0].bool.should.push(andQuery);
      }else if(match === 'exact'){
        andQuery = Util.getMatchPhrase(reqParams, totalKeyword);
        andQuery.forEach( (andQ) => {
          query.query.bool.must[0].bool.should.push(andQ);
        })
      }
      
    }
    //orkeyword
    if (!Util.getEmpty(orKeyword)) {
      let orQuery = Util.getMultiMatchOr(reqParams, orKeyword);
      query.query.bool.must[0].bool.should.push(orQuery);
    }
    // not keyword
    if (!Util.getEmpty(notKeyword)) {
      let notQuery = Util.getMultiMatchOr(reqParams, notKeyword);
      query.query.bool.must_not.push(notQuery);
    }

    if(reqParams.sort.length > 0){
      if(reqParams.sort === 'desc'){
        let sortTmp = {}
        sortTmp[config.field.sortField] = { "order" : "desc" };
        query.sort.push(sortTmp);
      }else if(reqParams.sort === 'asc'){
        let sortTmp = {}
        sortTmp[config.field.sortField] = { "order" : "asc" };
        query.sort.push(sortTmp);
      }else{
        query.sort.push("_score");
      }
    }

    if(reqParams.from_date.length > 0){
      let rangeTmp = {"range":{}};
      rangeTmp.range[config.field.sortField] = {
        "gte" : reqParams.from_date,
        "lte" : reqParams.to_date
      }
      query.query.bool.filter.push(rangeTmp);
    }
    //console.log(JSON.stringify(query));
    return query;
    
  },
  getPageDocsQuery: async (reqParams) => {
    let config = index_config["page"];
    let keywordStr = reqParams.keyword;
    let filterKeyword = reqParams.filterKeyword;
    let andKeyword = "";
    let orKeyword = "";
    let notKeyword = "";
    let size = reqParams.size;
    let match = reqParams.match;
    let from = (reqParams.from == 0) ? 0 : size * reqParams.from
    let highlightField = reqParams.highlightField
    let streamDocsId = reqParams.streamDocsId;

    let query = {
      track_total_hits: true,
      query : {
        bool: {
          must: [
            {
              bool:{
                should:[]
              }
            }
          ],
          must_not: [],
          filter: [
            {
              term: {
                "streamdocsId_k" : streamDocsId
              }
            }
          ]
        }
      },
      size: size,
      from: from,
      highlight: {
        pre_tags: "¶HS¶",
        post_tags: "¶HE¶",
        fields: highlightField,
        number_of_fragments:5,
        fragment_size:300
      },
      sort: []
      // _source: {
      //   exclude: "synap_contents_psk"
      // }
    }
      // keywrod 체크- | ! - 검사 
    if (!Util.getEmpty(keywordStr)) {
      let keywordSplit = keywordStr.split(" ");
      // | ! - 검사
      const validate = /[|!-]/;
      //console.log(keywordSplit)
      keywordSplit.forEach(value => {
        //console.log(value)
        if (value.charAt(0).match(validate)) {
          if (value.charAt(0) === "|") orKeyword += value.replace(validate, "") + " ";
          else if (value.charAt(0) === "-" || value.charAt(0) === "!") notKeyword = value.replace(validate, "");
        } else {
          if(!Util.getEmpty(andKeyword)){
            andKeyword += " "+value;
          }else{
            andKeyword += value
          }
        }
      })
    }

    // 쿼리생성
    if (!Util.getEmpty(andKeyword)) {
      //and
      let totalKeyword = "";
      totalKeyword = andKeyword;
      let andQuery;
      if(match === 'default'){
        andQuery = Util.getMultiMatchAnd(reqParams, totalKeyword);
        query.query.bool.must[0].bool.should.push(andQuery);
      }else if(match === 'exact'){
        andQuery = Util.getMatchPhrase(reqParams, totalKeyword);
        andQuery.forEach( (andQ) => {
          query.query.bool.must[0].bool.should.push(andQ);
        })
      }
    }
    //orkeyword
    if (!Util.getEmpty(orKeyword)) {
      let orQuery = Util.getMultiMatchOr(reqParams, orKeyword);
      query.query.bool.must[0].bool.should.push(orQuery);
    }
    // not keyword
    if (!Util.getEmpty(notKeyword)) {
      let notQuery = Util.getMultiMatchOr(reqParams, notKeyword);
      query.query.bool.must_not.push(notQuery);
    }

    if(reqParams.sort.length > 0){
      if(reqParams.sort === 'page'){
        let sortTmp = {}
        sortTmp[config.field.sortField] = { "order" : "asc" };
        query.sort.push(sortTmp);
      }else{
        query.sort.push("_score");
      }
    }

    //console.log(JSON.stringify(query));
    return query;
    
  },
  getWordcloudQuery: async (reqParams) => {
    let config = index_config["stream"];
    let keywordStr = reqParams.keyword;
    let category = reqParams.category;
    let match = reqParams.match;
    let andKeyword = "";
    let orKeyword = "";
    let notKeyword = "";

    let query = {
      track_total_hits: true,
      query : {
        bool: {
          must: [
            {
              bool:{
                should:[]
              }
            }
          ],
          must_not: [],
          filter: [
            {
              term: {
                "category_k" : category
              }
            }
          ]
        }
      },
      size: 0,
      aggs:{
        wordcloud:{
          terms:{
            field: "topicKeyword_k",
            size: 10000 
          }
        }
      }
    }
      // keywrod 체크- | ! - 검사 
    if (!Util.getEmpty(keywordStr)) {
      let keywordSplit = keywordStr.split(" ");
      // | ! - 검사
      const validate = /[|!-]/;
      //console.log(keywordSplit)
      keywordSplit.forEach(value => {
        //console.log(value)
        if (value.charAt(0).match(validate)) {
          if (value.charAt(0) === "|") orKeyword += value.replace(validate, "") + " ";
          else if (value.charAt(0) === "-" || value.charAt(0) === "!") notKeyword = value.replace(validate, "");
        } else {
          if(!Util.getEmpty(andKeyword)){
            andKeyword += " "+value;
          }else{
            andKeyword += value
          }
        }
      })
    }

    // 쿼리생성
    if (!Util.getEmpty(andKeyword)) {
      //and
      let totalKeyword = "";
      totalKeyword = andKeyword;
      let andQuery;
      if(match === 'default'){
        andQuery = Util.getMultiMatchAnd(reqParams, totalKeyword);
      }else if(match === 'exact'){
        andQuery = Util.getMatchPhrase(reqParams, totalKeyword);
      }
      query.query.bool.must[0].bool.should.push(andQuery);
    }
    //orkeyword
    if (!Util.getEmpty(orKeyword)) {
      let orQuery = Util.getMultiMatchOr(reqParams, orKeyword);
      query.query.bool.must[0].bool.should.push(orQuery);
    }
    // not keyword
    if (!Util.getEmpty(notKeyword)) {
      let notQuery = Util.getMultiMatchOr(reqParams, notKeyword);
      query.query.bool.must_not.push(notQuery);
    }

    //console.log(JSON.stringify(query));
    if(reqParams.from_date.length > 0){
      let rangeTmp = {"range":{}};
      rangeTmp.range[config.field.sortField] = {
        "gte" : reqParams.from_date,
        "lte" : reqParams.to_date
      }
      query.query.bool.filter.push(rangeTmp);
    }
    return query;
    
  },
  getVocaQuery: async (reqParams) => {
    let keywordStr = reqParams.keyword;
    let filterKeyword = reqParams.filterKeyword;
    let andKeyword = "";
    let orKeyword = "";
    let notKeyword = "";
    let size = reqParams.size;
    let from = (reqParams.from == 0) ? 0 : size * reqParams.from
    let highlightField = reqParams.highlightField;
    let filterField = reqParams.filterField;
    let sortField = reqParams.sortField;
    let query = {
      track_total_hits: true,
      query : {
        bool: {
          must: [
            {
              bool:{
                should:[]
              }
            }
          ],
          must_not: [],
          filter: [
          ]
        }
      },
      size: size,
      from: from,
      highlight: {
        fields: highlightField,
        pre_tags: "¶HS¶",
        post_tags: "¶HE¶",
      },
      sort : [
        "_score",
        sortField
      ]
    }
      // keywrod 체크- | ! - 검사 
    if (!Util.getEmpty(keywordStr)) {
      let keywordSplit = keywordStr.split(" ");
      // | ! - 검사
      const validate = /[|!-]/;
      //console.log(keywordSplit)
      keywordSplit.forEach(value => {
        //console.log(value)
        if (value.charAt(0).match(validate)) {
          if (value.charAt(0) === "|") orKeyword += value.replace(validate, "") + " ";
          else if (value.charAt(0) === "-" || value.charAt(0) === "!") notKeyword = value.replace(validate, "");
        } else {
          if(!Util.getEmpty(andKeyword)){
            andKeyword += " "+value;
          }else{
            andKeyword += value
          }
        }
      })
    }

    // 쿼리생성
    if (!Util.getEmpty(andKeyword)) {
      //and
      let totalKeyword = "";
      totalKeyword = andKeyword;
      let andQuery = Util.getMultiMatchAnd(reqParams, totalKeyword);
      query.query.bool.must[0].bool.should.push(andQuery);
    }
    //orkeyword
    if (!Util.getEmpty(orKeyword)) {
      let orQuery = Util.getMultiMatchOr(reqParams, orKeyword);
      query.query.bool.must[0].bool.should.push(orQuery);
    }
    // not keyword
    if (!Util.getEmpty(notKeyword)) {
      let notQuery = Util.getMultiMatchOr(reqParams, notKeyword);
      query.query.bool.must_not.push(notQuery);
    }

    if (!Util.getEmpty(filterKeyword)) {
      let jaQuery = {
        multi_match :{
          query : filterKeyword,
          fields : filterField
        }
      }
      query.query.bool.must.push(jaQuery);
    }
    //console.log(JSON.stringify(query));
    return query;
    
  },
  getFaqQuery: async (reqParams) => {
    let keywordStr = reqParams.keyword;
    let category = reqParams.category;
    let andKeyword = "";
    let orKeyword = "";
    let notKeyword = "";
    let size = reqParams.size;
    let from = (reqParams.from == 0) ? 0 : size * reqParams.from
    let highlightField = reqParams.highlightField;
    let sortField = reqParams.sortField;
    let query = {
      track_total_hits: true,
      query : {
        bool: {
          must: [
            {
              bool:{
                should:[]
              }
            }
          ],
          must_not: [],
          filter: [
          ]
        }
      },
      size: size,
      from: from,
      highlight: {
        fields: highlightField,
        pre_tags: "¶HS¶",
        post_tags: "¶HE¶",
      },
      sort : [
        "_score"
      ]
    }
      // keywrod 체크- | ! - 검사 
    if (!Util.getEmpty(keywordStr)) {
      let keywordSplit = keywordStr.split(" ");
      // | ! - 검사
      const validate = /[|!-]/;
      //console.log(keywordSplit)
      keywordSplit.forEach(value => {
        //console.log(value)
        if (value.charAt(0).match(validate)) {
          if (value.charAt(0) === "|") orKeyword += value.replace(validate, "") + " ";
          else if (value.charAt(0) === "-" || value.charAt(0) === "!") notKeyword = value.replace(validate, "");
        } else {
          if(!Util.getEmpty(andKeyword)){
            andKeyword += " "+value;
          }else{
            andKeyword += value
          }
        }
      })
    }

    // 쿼리생성
    if (!Util.getEmpty(andKeyword)) {
      //and
      let totalKeyword = "";
      totalKeyword = andKeyword;
      let andQuery = Util.getMultiMatchAnd(reqParams, totalKeyword);
      query.query.bool.must[0].bool.should.push(andQuery);
    }
    //orkeyword
    if (!Util.getEmpty(orKeyword)) {
      let orQuery = Util.getMultiMatchOr(reqParams, orKeyword);
      query.query.bool.must[0].bool.should.push(orQuery);
    }
    // not keyword
    if (!Util.getEmpty(notKeyword)) {
      let notQuery = Util.getMultiMatchOr(reqParams, notKeyword);
      query.query.bool.must_not.push(notQuery);
    }

    if(Util.getEmpty(keywordStr)){
      query.sort.push({
        "category": {
          "order": "asc"
        }
      });
      query.sort.push(sortField);
    }else{
      query.sort.push(sortField);
    }
    
    if(!(Util.getEmpty(category) || category === "all")){
      let filterQuery = {
        "term" : {
          "category" : category
        }
      }
      query.query.bool.filter.push(filterQuery);
    }
    
    //console.log(JSON.stringify(query));
    return query;
    
  },
  getQnaQuery: async (reqParams) => {
    let keywordStr = reqParams.keyword;
    let andKeyword = "";
    let orKeyword = "";
    let notKeyword = "";
    let size = reqParams.size;
    let from = (reqParams.from == 0) ? 0 : size * reqParams.from
    let highlightField = reqParams.highlightField;
    let sortField = reqParams.sortField;
    let userId = reqParams.userId;
    let query = {
      track_total_hits: true,
      query : {
        bool: {
          must: [
            {
              bool:{
                should:[]
              }
            }
          ],
          must_not: [],
          filter: [
          ]
        }
      },
      size: size,
      from: from,
      highlight: {
        fields: highlightField,
        pre_tags: "¶HS¶",
        post_tags: "¶HE¶",
      },
      sort : [
        {
          "is_answered": {
            "order": "asc"
          }
        }
      ]
    }
      // keywrod 체크- | ! - 검사 
    if (!Util.getEmpty(keywordStr)) {
      let keywordSplit = keywordStr.split(" ");
      // | ! - 검사
      const validate = /[|!-]/;
      //console.log(keywordSplit)
      keywordSplit.forEach(value => {
        //console.log(value)
        if (value.charAt(0).match(validate)) {
          if (value.charAt(0) === "|") orKeyword += value.replace(validate, "") + " ";
          else if (value.charAt(0) === "-" || value.charAt(0) === "!") notKeyword = value.replace(validate, "");
        } else {
          if(!Util.getEmpty(andKeyword)){
            andKeyword += " "+value;
          }else{
            andKeyword += value
          }
        }
      })
    }

    // 쿼리생성
    if (!Util.getEmpty(andKeyword)) {
      //and
      let totalKeyword = "";
      totalKeyword = andKeyword;
      let andQuery = Util.getMultiMatchAnd(reqParams, totalKeyword);
      query.query.bool.must[0].bool.should.push(andQuery);
    }
    //orkeyword
    if (!Util.getEmpty(orKeyword)) {
      let orQuery = Util.getMultiMatchOr(reqParams, orKeyword);
      query.query.bool.must[0].bool.should.push(orQuery);
    }
    // not keyword
    if (!Util.getEmpty(notKeyword)) {
      let notQuery = Util.getMultiMatchOr(reqParams, notKeyword);
      query.query.bool.must_not.push(notQuery);
    }

    if(!Util.getEmpty(userId)){
      let filterQuery = {
        "term" : {
          "q_id" : userId
        }
      }
      query.query.bool.filter.push(filterQuery);
    }

    if(reqParams.sort.length > 0){
      if(reqParams.sort === 'desc'){
        let sortTmp = {}
        sortTmp[sortField] = { "order" : "desc" };
        query.sort.push(sortTmp);
      }else if(reqParams.sort === 'asc'){
        let sortTmp = {}
        sortTmp[sortField] = { "order" : "asc" };
        query.sort.push(sortTmp);
      }else{
        query.sort.push("_score");
        let sortTmp = {}
        sortTmp[sortField] = { "order" : "desc" };
        query.sort.push(sortTmp);
      }
    }

    console.log(JSON.stringify(query));
    return query;
    
  },
  getIdsQuery: async (reqParams) => {
    let query = Util.getIds(reqParams.id);
    //console.log(JSON.stringify(query));
    return query;
  },
  getMykeywordQuery: async (reqParams) => {
    let userId = reqParams.userId;
    let actionField = reqParams.actionField;
    let idField = reqParams.idField;
    let aggsField = reqParams.aggsField;
    let action = reqParams.action;
    let query = {
      track_total_hits: true,
      query : {
        bool: {
          must: [
            
          ],
          must_not: [],
          filter: [
            
          ]
        }
      },
      size: 0,
      aggs:{
        wordcloud:{
          terms:{
            field: aggsField,
            size: 100
          }
        }
      }
    }
    
    let filterTmp = {};
    filterTmp['term'] = {};
    filterTmp['term'][idField] = userId;
    query.query.bool.filter.push(filterTmp);
    filterTmp = {}
    filterTmp['term'] = {};
    filterTmp['term'][actionField] = action;
    query.query.bool.filter.push(filterTmp);

    return query;
    
  },
  getMyclickQuery: async (reqParams) => {
    let userId = reqParams.userId;
    let actionField = reqParams.actionField;
    let idField = reqParams.idField;
    let sortField = reqParams.sortField;
    let action = reqParams.action;
    let categoryField = reqParams.categoryField;
    let query = {
      track_total_hits: true,
      query : {
        bool: {
          must: [
            
          ],
          must_not: [],
          filter: [
            
          ]
        }
      },
      size: reqParams.size,
      from: reqParams.from,
      sort:[]
    }
    
    let filterTmp = {};
    filterTmp['term'] = {};
    filterTmp['term'][idField] = userId;
    query.query.bool.filter.push(filterTmp);
    filterTmp = {}
    filterTmp['term'] = {};
    filterTmp['term'][actionField] = action;
    query.query.bool.filter.push(filterTmp);
    //console.log(reqParams.sort)
    if(!Util.getEmpty(reqParams.sort)){
      let sortQuery = {};
      
      if(reqParams.sort === 'desc') {
        sortQuery[sortField] = {};
        sortQuery[sortField]['order'] = 'desc';
      }
      else if(reqParams.sort === 'asc') {
        sortQuery[sortField] = {};
        sortQuery[sortField]['order'] = 'asc';
      }
      else if(reqParams.sort === 'category') {
        sortQuery[categoryField] = {};
        sortQuery[categoryField]['order'] = 'asc';
      }
      query.sort.push(sortQuery);
    }
    //console.log(JSON.stringify(query));
    return query;
    
  },
  getCategoryQuery: async (reqParams) => {
    let keyword = reqParams.keyword;
    let termField = reqParams.termField;
    let query = {
      track_total_hits: true,
      query : {
        term:{}
      }
    }
    
    query.query.term[termField] = {}
    query.query.term[termField]['value'] = keyword;
    
    return query;
    
  },
  getTestQuery: async (reqParams, i) => {

    let keywordStr = reqParams.keyword;
    let andKeyword = "";
    let orKeyword = "";
    let notKeyword = "";
    let reKeyword = "";

    //config 및 설정값 get
    let from = reqParams.from;
    let size = reqParams.size;
    const config = index_config['all'];
    let fields = config.field.searchField || [];
    let termsField = config.field.termsField || [];
    let filterQuery = [];   // 필터쿼리
    let aggsListField = config.field.aggsList || [];


    let esQuery = esQryMaker.boolQuery();

    // count Query 
    if (reqParams.type === "count") size = 0;

    // keywrod 체크- | ! - 검사 
    if (!Util.getEmpty(keywordStr)) {
      let keywordSplit = keywordStr.split(" ");
      // | ! - 검사
      const validate = /[|!-]/;
      keywordSplit.forEach(value => {
        if (value.charAt(0).match(validate)) {
          if (value.charAt(0) === "|") orKeyword += value.replace(validate, "") + " ";
          else if (value.charAt(0) === "-" || value.charAt(0) === "!") notKeyword = value.replace(validate, "");
        } else {
          andKeyword += value + " ";
        }
      })
    }

    if (!Util.getEmpty(reqParams.rekeyword)) {
      let rekeywordSplit = reqParams.rekeyword.split(",");
      rekeywordSplit.forEach(value => {
        reKeyword += value + " ";
      })
    }

    // 필수 쿼리 
    if (reqParams.searchIndex === "product" || reqParams.searchIndex.match("interior")) esQuery.filter(esQryMaker.termQuery('index_yn_k', 'Y'));


    // 쿼리생성
    if (!Util.getEmpty(andKeyword) || !Util.getEmpty(reKeyword)) {
      //and
      let totalKeyword = "";
      if (!Util.getEmpty(reKeyword)) totalKeyword = andKeyword + reKeyword;
      else totalKeyword = andKeyword;

      let matchQuery = esQryMaker
        .boolQuery()
        .should(
          esQryMaker
            .multiMatchQuery(fields, totalKeyword.trim())
            .operator('and')
            .type("cross_fields")
        )

      //orkeyword
      if (!Util.getEmpty(orKeyword)) {
        matchQuery = matchQuery
          .should(
            esQryMaker
              .multiMatchQuery(fields, orKeyword)
              .operator('or')
              .type('cross_fields')
          )
      }

      if (reqParams.searchIndex === "product") {
        esQuery = esQuery.must(esQryMaker
          .functionScoreQuery()
          .query(matchQuery)
          .function(esQryMaker.fieldValueFactorFunction().factor(7).field("_score").missing(0).modifier("ln2p"))
          .function(esQryMaker.fieldValueFactorFunction().factor(3).field("prd_scr_i").missing(0).modifier("ln2p"))
          .scoreMode('sum')
          .boostMode('multiply')
        );
      }
      else esQuery = esQuery.must(matchQuery);


      // not keyword
      if (!Util.getEmpty(notKeyword)) {
        esQuery
          .mustNot(
            esQryMaker
              .multiMatchQuery(fields, notKeyword)
              .operator('or')
              .type('cross_fields')
          )
      }
    }
    
  
    //es query build
    let query = esQryMaker
      .requestBodySearch()
      .query(esQuery)
      .size(size)
      .from(from)
      .trackTotalHits(true);


    


    //auto_generate_synonyms_phrase_query
    let queryBody = query._body.query._body.bool;

    if (reqParams.searchIndex === "product") {
      if (!Util.getEmpty(queryBody.must)) {
        let queryMust = queryBody.must[0]._body.function_score.query._body.bool.should[0]._body.multi_match;
        queryMust.auto_generate_synonyms_phrase_query = 'false';
      }
    } else {
      if (!Util.getEmpty(queryBody.must)) {
        let queryMust = queryBody.must[0]._body.bool.should[0]._body.multi_match;
        queryMust.auto_generate_synonyms_phrase_query = 'false';
      }
    }
    console.log("query bulider : "+JSON.stringify(query));
    //return 검색 쿼리
    return query.toJSON();
  },getGatewayServiceQuery: async (reqParams, i) => {

    let gatewayService = reqParams.gatewayService;
    
    let esQuery = esQryMaker.boolQuery();
    let size;

    if (gatewayService === "related") {
      let label = reqParams.label.trim();
      let keyword = reqParams.keyword.trim();
      let relist = { keyword: keyword, label: label }
      for (let i in relist) {
        esQuery = esQuery.must(esQryMaker.matchQuery(i, relist[i]))
      }
    } else if (gatewayService === "autocomplete") {
      let fields = ser_index_config[gatewayService].field.searchField;
      let mustQuery = [esQryMaker.multiMatchQuery(fields, reqParams.keyword.trim())]
      esQuery = esQuery.must(mustQuery);
      esQuery.mustNot(esQryMaker.termQuery('weight', '1'))
    } else if (gatewayService === "popquery") {
      size = 1;
      esQuery = esQryMaker.termQuery('label', reqParams.label);
    }

    const query = esQryMaker
      .requestBodySearch()
      .query(esQuery)

    // autocomplete 하이라이트 필드
    if (!Util.getEmpty(ser_index_config[gatewayService].field)) {
      let highLightFields = ser_index_config[gatewayService].field.highlightField;
      if (highLightFields.length > 0) {
        let highlightQuery = esQryMaker.highlight().fields(highLightFields);
        query.highlight(highlightQuery);
      }
    }

    // autocomplete, recommend -> sort
    if (!Util.getEmpty(reqParams.sort)) {
      let sortParam = reqParams.sort.split(",");
      sortParam.forEach(sort => {
        let sortStr = Util.getAutoSortList(sort, gatewayService);
        let sortField = Object.keys(sortStr);
        let sortQuery = esQryMaker.sort(Object.keys(sortStr), sortStr[sortField]);
        if ((gatewayService === "related" && i === 0) || gatewayService === "autocomplete" || gatewayService === "popquery") query.sort(sortQuery)
      })
    }
    if (!Util.getEmpty(size)) {
      query.size(size);
    }
    return query.toJSON();
  },

  getSynonym: async (reqParams) => {

    let keyword = reqParams.keyword.trim();

    let esQuery = {
      "query": {
        "bool": {
          "must": [
            {
              "match": {
                "type": "synonym"
              }
            },
            {
              "multi_match": {
                "query": keyword,
                "fields": ["synonym.term.keyword",
                  "synonym.synonyms.keyword"]
              }
            }
          ]
        }
      }
    }
    return esQuery;
  },
  getCategoryCntQuery: async (reqParams) => {
    let query = {
      "size": 0, 
      "aggs": {
        "category": {
          "terms": {
            "field": "category_k",
            "size": 10
          }
        }
      }
    }
    return query;
  },
  getActionlogQuery: async (reqParams) => {
    let streamdocsId;
    //console.log(reqParams.docId.indexOf('_'));
    if(reqParams.docId.indexOf('_') > 0){
      streamdocsId = reqParams.docId.split('_')[0];
    }else{
      streamdocsId = reqParams.docId;
    }
    
    let query = {
      ssoId_k : reqParams.ssoId,
      dep_k : reqParams.dep,
      keyword_k : reqParams.keyword,
      category_k : reqParams.category,
      action_k : reqParams.action,
      timestamp_dt : reqParams.timestamp,
      targetIndex_k: reqParams.targetIndex,
      docId_k : reqParams.docId,
      streamdocsId_k : streamdocsId,
      title_k : reqParams.title
    }
    return query;
  },
  getQnaRegQuery: async (reqParams) => {
        
    let query = {
      q_id: reqParams.q_id,
      q_attach: reqParams.q_attach,
      q_content: reqParams.q_content,
      q_title: reqParams.q_title,
      q_position: reqParams.q_position,
      q_phone : reqParams.q_phone,
      is_answered: reqParams.is_answered,
      q_timestamp: reqParams.q_timestamp
    }

    return query;
  },
  getQnaUpQuery: async (reqParams) => {
        
    let query = {
      q_attach: reqParams.q_attach,
      q_content: reqParams.q_content,
      q_title: reqParams.q_title,
      q_position: reqParams.q_position,
      q_phone : reqParams.q_phone,
      is_answered: reqParams.is_answered,
      q_timestamp: reqParams.q_timestamp
    }

    return query;
  },
  getPopMainQuery: async (reqParams, i) => {
    //config 및 설정값 get
    let query = {
      query: {
        bool: {
          must: [
            
          ],
          must_not: [
            
          ],
          should: [
            
          ],
          filter: [
            {
              term: {
                targetIndex_k: "streamdocs"
              }
            }
          ]
        }
      },track_total_hits: true
      ,size: 5
      ,from: 0
      ,sort:[
        {
          "docCnt_i" : {
            "order":"desc"
          }
        }
      ]
    }
    


    return query;
  },
  getPopPageQuery: async (reqParams) => {
    let config = index_config["popcontents"];
    let keywordStr = reqParams.keyword;
    let andKeyword = "";
    let orKeyword = "";
    let notKeyword = "";
    let highlightField = reqParams.highlightField;
    let size = reqParams.size;
    let from = (reqParams.from == 0) ? 0 : size * reqParams.from
    let sort = reqParams.sort;
    let query = {
      track_total_hits: true,
      query : {
        bool: {
          must: [
            {
              bool:{
                should:[]
              }
            }
          ],
          must_not: [],
          filter: [
            {
              "term": {
                "targetIndex_k": "pagedocs"
              }
            }
          ]
        }
      },
      size: size,
      from: from,
      highlight: {
        pre_tags: "¶HS¶",
        post_tags: "¶HE¶",
        fields: highlightField,
        number_of_fragments:5,
        fragment_size:150,
        type:"fvh"
      },
      sort: []
      // _source: {
      //   exclude: "synap_contents_psk"
      // }
    }
      // keywrod 체크- | ! - 검사 
    if (!Util.getEmpty(keywordStr)) {
      let keywordSplit = keywordStr.split(" ");
      // | ! - 검사
      const validate = /[|!-]/;
      //console.log(keywordSplit)
      keywordSplit.forEach(value => {
        //console.log(value)
        if (value.charAt(0).match(validate)) {
          if (value.charAt(0) === "|") orKeyword += value.replace(validate, "") + " ";
          else if (value.charAt(0) === "-" || value.charAt(0) === "!") notKeyword = value.replace(validate, "");
        } else {
          if(!Util.getEmpty(andKeyword)){
            andKeyword += " "+value;
          }else{
            andKeyword += value
          }
        }
      })
    }

    // 쿼리생성
    if (!Util.getEmpty(andKeyword)) {
      //and
      let totalKeyword = "";
      totalKeyword = andKeyword;
      let andQuery;
      andQuery = Util.getMultiMatchAnd(reqParams, totalKeyword);
      query.query.bool.must[0].bool.should.push(andQuery);
    }
    //orkeyword
    if (!Util.getEmpty(orKeyword)) {
      let orQuery = Util.getMultiMatchOr(reqParams, orKeyword);
      query.query.bool.must[0].bool.should.push(orQuery);
    }
    // not keyword
    if (!Util.getEmpty(notKeyword)) {
      let notQuery = Util.getMultiMatchOr(reqParams, notKeyword);
      query.query.bool.must_not.push(notQuery);
    }

    if(reqParams.sort.length > 0){
      if(reqParams.sort === 'category'){
        let sortTmp = {}
        sortTmp['category_k'] = { "order" : "asc" };
        query.sort.push(sortTmp);
      }else{
        let sortTmp = {}
        sortTmp['docCnt_i'] = { "order" : "desc" };
        query.sort.push(sortTmp);
      }
    }

    //console.log(JSON.stringify(query));
    return query;
    
  }

};


