const APPROOT = require('app-root-path');
const path = require('path');
const config = require(`${APPROOT}/config/config`);
const logger = require('./logger')(module);
const searchEngine = require(`${APPROOT}/middleware/elasticsearch`);
const elasticsearch = new searchEngine('SE');
var _moment = require('moment');

//Empty check
module.exports.getEmpty = function (value) {
  var rtn = true;
  if (!(typeof value === 'undefined' || value === "" || value === undefined || value === " ") && value) {
    rtn = false;
  }
  return rtn;
}

/* [SET] response send OK */
module.exports.sendResStatusByOk = function (req, body, elaspsed) {

  elaspsed = elaspsed != undefined ? elaspsed : {};
  if (req === undefined);
  else {
    // Control
    let obj = {};
    const ret = {
      code: 200,
      message: 'OK'
    }
    obj.status = ret;
    obj.data = body;
    return obj;
  }
};

/* [SET] response send ERROR */
module.exports.resErr = function (req, err, msg) {
  if (req === undefined);
  else {
    // Control
  }
  return { status: err, reason: msg };
};

module.exports.errHandler = function (req, res, err, api_name) {
  //res.status(500).send(this.resErr(req, 500, err.message));
  let obj = {};
  console.log(err);
  const ret = {
    code: err.status,
    message: err.message
  };
  obj.status = ret;
  return obj;
};

/** [SET] param send ERROR */
module.exports.makeResParamByStatErr = function (req, statusCode, err) {
  const messageObj = [];
  if (err === undefined);
  else {
    err.forEach((item) => {
      messageObj.push(item.msg);
    });
  }
  return { status: statusCode, message: messageObj };
};

module.exports.validateReqParam = function (req, res, fileName, param) {
  return new Promise(function (resolve, reject) {

    const errStatus = { status: false, errMsg: '' };
    for (element in param) {
      req.checkQuery(element, `${element} required`).notEmpty();
    }

    //const err = req.validationErrors();
    req.getValidationResult().then((result) => {
      if (!result.isEmpty()) {
        let erros = result.array().map(function (element) {
          return element.msg;
        });
        logger.error(`validationErrors : ${erros}`, fileName);
        errStatus.status = true;
        errStatus.message = erros;
        //return res.status(400).send(this.resErr(req, 400, erros));
      }
      resolve(errStatus);
    });

  });
}

/* [Request Parameter] Valid Check
 *  @param req : Request Object
 *  @param res : Response Object
 *  @param fileName : Source File Name
 *  @param param : Required Request Paramter Array
 *  */
module.exports.validateReqParams = function (req, res, fileName, param) {
  this.reqParam(`[${req.paramStatus}]Info`, req, fileName);
  //if (req.method === 'POST') req.query = req.body;

  const errStatus = { status: false, errMsg: '' };
  param.forEach((item, idx) => {
    req.checkQuery(item, `${item} required`).notEmpty();
  });

  //const err = req.validationErrors();
  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      let erros = result.array().map(function (element) {
        return element.msg;
      });
      logger.error(`validationErrors : ${erros}`, fileName);
      errStatus.status = true;
      errStatus.errMsg = erros;
      result.status = 400;
      return res.status(400).send(this.resErr(req, 400, erros));
    }
  });
  return errStatus;
};

/** [LOG] Request Parameter */
module.exports.reqParam = function (urlname, req, fileName) {
  logger.info('---------------------------------------', fileName);
  logger.info(`${urlname} / (method:${req.method})`, fileName);
  logger.info('---------------------------------------', fileName);
};

/**
 * gateway 검색어 로깅
 * {*} req
 *  {*} res
 */
module.exports.makeURL4QueryLog = function (openqueryLog) {
  try {
    
    let paramList = openqueryLog;
    // const url = `http://${config.OPENQUERY_GATEWAY}/gateway/_querylog`;
    // const options = {
    //   method: 'POST',
    //   uri: url,
    //   body: paramList,
    //   json: true
    // };
    // return options;
    
    if (
      paramList.index !== undefined &&
      paramList.query !== undefined &&
      paramList.total !== undefined &&
      paramList.took !== undefined) {
      // trim & sort by index name
      var indices = paramList.index.split(',').map(s => s.trim()).sort(function (a, b) {
        return a < b ? -1 : a > b ? 1 : 0;
      }).join(',');

      // convert string to number
      paramList.total = paramList.total * 1;
      paramList.took = paramList.took * 1;

      var now = _moment();
      var index =  '.openquery-querylog-' + now.format('YYYYMMDD');
      var payload = {
        indices: indices,
        timestamp: now.format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        query: paramList.query,
        total: paramList.total,
        took: paramList.took
      };
      const logResult = elasticsearch.insertDocs(index, payload);
      return logResult;
    }
  } catch (err) {
    throw err;
  }
};

/**
 * gateway의 제공하는 Service['autocomplete','recommend','popuqery']별 필수 파라미터 체크.
 *
 * @param req
 * @param res
 * @returns {null}
 */
module.exports.validReq4Service = function (req, res) {
  let isChkSum = null;
  const autoParam = ['keyword', 'label'];
  const popParam = ['label'];
  const recomParam = ['keyword', 'label'];
  const stopParam = ['keyword'];

  switch (req.query.serviceName) {
    case 'autocomplete':
      // 자동완성
      isChkSum = this.validateReqParams(req, res, req.paramStatus, autoParam);
      break;
    case 'popquery':
      // 인기 검색어
      isChkSum = this.validateReqParams(req, res, req.paramStatus, popParam);
      break;
    case 'recommend':
      // 추천 검색어
      isChkSum = this.validateReqParams(req, res, req.paramStatus, recomParam);
      break;
    case 'stopword':
      // 금칙어 
      isChkSum = this.validateReqParams(req, res, req.paramStatus, stopParam);
      break;
  }
  return isChkSum;
};

/**
 * gateway의 Service별 URL 생성
 *
 * @param reqParams
 * @returns {string}
 */
module.exports.makeURL4Service = function (reqParams) {
  let resultURL = `http://${config.OPENQUERY_GATEWAY}/service/${reqParams.gatewayService}`;

  switch (reqParams.gatewayService) {
    //speller
    case 'speller':
      resultURL += `?query=${encodeURI(reqParams.keyword)}&label=${reqParams.label}`;
      break;
  }
  return resultURL;
};

// 검색쿼리 sort
module.exports.getSortList = function (param) {
  let sortObj = {};
  switch (param) {
    case 'eval':
      sortObj.eval_scr_i = "desc";
      break;
    case 'newdate':
      sortObj.aprv_cplt_dttm_dt = 'desc';
      break;
    case "lprice": // 낮은가격순
      sortObj.sel_prc_i = "asc";
      break;
    case "hprice": // 높은가격순
      sortObj.sel_prc_i = "desc";
      break;
    case "ranking":   // 랭킹 순
      sortObj._score = "desc";
      break;
    case "create_dttm_dt":
      sortObj.create_dttm_dt = "desc";
      break;
    case "prd_scr":
      sortObj.prd_scr_i = "desc";
      break;
    case "aprv_cplt_dttm":
      sortObj.aprv_cplt_dttm_dt = "desc";
      break;
  }
  return sortObj;
};


module.exports.getInteSortList = function (param) {
  let sortObj = {};

  switch (param) {
    case "ranking":   // 랭킹 순
      sortObj._score = "desc"
      break;
    case "post_scr":
      sortObj.post_scr_i = "desc";
      break;
    case "post_no":
      sortObj.post_no_i = "desc";
      break;
    case "newdate":
      sortObj.post_no_i = "desc";
      break;
    case "viewcnt":
      sortObj.view_cnt_i = "desc";
      break;
    case "bmarkcnt":
      sortObj.bmark_cnt_i = "desc";
      break;
    case "create_dttm_dt":
      sortObj.create_dttm_dt = "desc";
      break;
    case "seller":    // 셀러명
      sortObj.seller_nm_k = "asc";
      break;
    case "sellerat":    // 사공경력순
      sortObj.seller_at033_k = "desc";
      break;
    case "cnstrcnt":    //시공사례순
      sortObj.cnstr_cnt_i = "desc";
      break;
    case "sellerscr":   //고객평점순
      sortObj.seller_scr_k = "desc";
      break;
  }
  return sortObj;
};

// 자동완성 sort
module.exports.getAutoSortList = function (sort, serviceName) {

  let autoObj = {};
  switch (sort) {
    case '_score':
      autoObj._score = 'desc'
      break;
    case 'weight':
      autoObj.weight = 'desc'
      break;
    case 'keyword.keyword':
      autoObj["keyword.keyword"] = 'asc'
      break;
    case 'timestamp':
      if (serviceName === 'popquery') {
        autoObj.timestamp = "desc"
      } else {
        autoObj.timestamp = 'asc'
      }
      break;
  }
  return autoObj;
}


module.exports.getFilterTermQuery = (reqKey) => {
  let reqKeyStr = "";

  if (reqKey === "ovrss_direct_buy_yn") reqKeyStr = "ovrss_direct_buy_yn_k";
  else if (reqKey === "seller_bjd_cd") reqKeyStr = "seller_bjd_cd_pkn.ngram";
  else if (reqKey === "cnstr_area_bjd_cd") reqKeyStr = "cnstr_area_bjd_cd_pkn.ngram";
  else if (reqKey === "dlv_cst") reqKeyStr = "dlv_cst_i";

  return reqKeyStr;
}


//[speller] 체크 response 
module.exports.sendSpeller = (req, body) => {
  if (req === undefined) {
    ;
  } else {
    // Control
  }
  const ret = {
    code: 200
  };


  if (Array.isArray(body)) {
    const result = [];
    body.map((dataObj) => {
      const data = {};
      Object.keys(dataObj)
        .map((key) => {
          if (Object.prototype.hasOwnProperty.call(dataObj, key)) {
            data[key] = dataObj[key];
          }
        });
      result.push(data);
    });
    ret.result = result;
  } else {
    Object.keys(body)
      .map((key) => {
        if (Object.prototype.hasOwnProperty.call(body, key)) {
          ret[key] = body[key];
        }
      });
  }

  return ret;
};
module.exports.getIds = (id) => {
  let query = {
    query: {
      ids: {
        values: [id]
      }
    }
  }
  return query;
};
module.exports.getMultiMatchAnd = (reqParams, keyword) => {
    let fields = reqParams.fields;
    let query = {
      multi_match:{
        query: keyword,
        fields: fields,
        operator: "and",
        auto_generate_synonyms_phrase_query: "false",
        type: "cross_fields"
      }
    }
    return query;
};
module.exports.getMultiMatchOr = (reqParams, keyword) => {
  let fields = reqParams.fields;
  let query = {
    multi_match:{
      query: keyword,
      fields: fields,
      operator: "or",
      auto_generate_synonyms_phrase_query: "false",
      type: "cross_fields"
    }
  }
  return query;
};
module.exports.getMatchPhrase = (reqParams, keyword) => {
  let fields = reqParams.fields;
  let queryList = [];
  for(let i = 0; i<fields.length; i++){
    let field = fields[i];
    let fieldName = field.substring(0,field.indexOf('^'));
    let boost = field.substring(field.indexOf('^')+1);
    //console.log(fieldName, boost);
    let query = {
      match_phrase:{}
    }
    query['match_phrase'][fieldName] = {};
    query['match_phrase'][fieldName]['query'] = keyword;
    query['match_phrase'][fieldName]['boost'] = parseFloat(boost);
    queryList.push(query);
  }
  return queryList;
};