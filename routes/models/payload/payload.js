//const APPROOT = require('app-root-path');
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');
const setReqParamsk4 = (req) => {
  
  const reqParams = {
    searchIndex: req.searchIndex,
    size: req.size || 10,
    from: req.from || 0,            
    category: req.category || '',
  }

  return reqParams;
};

const setParamsPageMain = (req) => {
  const reqParams = {
    searchIndex: req.searchIndex || '',        
    keyword: req.keyword || '',      	          // keyword
    sort: req.sort || '',
    size: req.size || 2,
    from: req.from || 0,
    sort: req.sort || 'score',
    match: req.match || 'default',
    from_date: req.from_date || '',
    to_date: req.to_date || '',
    fields: req.fields,
    highlightField: req.highlight
  }

  
  return reqParams;
};
const setParamsPageDocs = (req) => {
  const reqParams = {
    searchIndex: req.searchIndex || '',        
    keyword: req.keyword || '',      	          // keyword
    sort: req.sort || 'score',
    match: req.match || 'default',
    size: req.size || 3,
    from: req.from || 0,
    fields: req.fields,
    streamDocsId: req.streamDocsId,
    highlightField: req.highlight
  }

  
  return reqParams;
};
const setParamsVoca = (req) => {
  const reqParams = {
    searchIndex: req.searchIndex || '',       
    keyword: req.keyword || '',
    filterKeyword : req.filterKeyword || '',
    filterField : req.filterField,     
    size: req.size || 10,
    from: req.from || 0,
    fields: req.fields,
    highlightField: req.highlight,
    sortField: req.sortField
  }

  
  return reqParams;
};

const setParamsFaq = (req) => {
  const reqParams = {
    searchIndex: req.searchIndex || '',
    category: req.category || 'all',       
    keyword: req.keyword || '',   
    size: req.size || 10,
    from: req.from || 0,
    fields: req.fields,
    highlightField: req.highlight,
    sortField: req.sortField
  }

  
  return reqParams;
};

const setParamsQna = (req) => {
  const reqParams = {
    searchIndex: req.searchIndex || '',  
    keyword: req.keyword || '',   
    size: req.size || 10,
    from: req.from || 0,
    fields: req.fields,
    highlightField: req.highlight,
    sortField: req.sortField,
    sort: req.sort || '',
    userId: req.userId
  }

  
  return reqParams;
};
// const setReqParamsk4 = (req) => {
//   const reqParams = {

//     searchIndex: req.searchIndex || '',        // 검색 8개 인덱스, all 
//     keyword: req.keyword || '',      	          // keyword
//     brand_kr_nm_ksk: req.brand_nm || '',       // 브랜드이름
//     brand_cd_k: req.brand_cd || '',             // 브랜드코드
//     min_prc: req.min_prc || '0',                // 가격이상
//     max_prc: req.max_prc || '999999999',                // 가격이하
//     'attr.search_attr_k': req.attr_cd || '',                // 속성코드
//     tag_psk: req.tag || '',                    // 태그 
//     'opt.search_opt_k': req.opt || '',                        // 옵션 
//     'ctgr_1.disp_ctgr_no_1_k': req.disp_ctgr_1 || '',        // 카테고리 대
//     'ctgr_2.disp_ctgr_no_2_k': req.disp_ctgr_2 || '',        // 카테고리 중 
//     'ctgr_3.disp_ctgr_no_3_k': req.disp_ctgr_3 || '',        // 카테고리 소
//     'ctgr_4.disp_ctgr_no_4_k': req.disp_ctgr_4 || '',        // 카테고리 세
//     seller_no_k: req.seller || '',             // seller 
//     'nota_area.nota_area_no_i': req.nota_area || '',            // nota_area 
//     //    nota_object: req.nota_object || '',        // nota_object 
//     'nota_object.nota_object_no_i': req.nota_object || '',
//     deal_prd_yn: req.deal_prd_yn || '',         // 딜 속성 코드
//     deal_typ_cd_k: req.deal_typ_cd || '',         // 딜상품유형
//     seller_bjd_cd: req.seller_bjd_cd || '',     // 셀러 법정동 코드
//     eval_scr_i: req.eval_scr || '',            // 후기평점
//     start_date: req.start_date || '',          // 검색 시작일
//     end_date: req.end_date || '',              // 검색 종료일
//     disp_parent_field_p: req.ctgr_parent || '',       // 상위 카테고리 번호
//     disp_ctgr_field_p: req.ctgr || '',          // category 검색 disp_ctgr_1~4
//     dlv_kind_cd_k: req.dlv_kind_cd || '',             // 베송비 구분코드
//     dlv_mthd_cd_k: req.dlv_mthd_cd || '',
//     dlv_tmplt_no_k: req.dlv_tmplt_no || '',
//     dlv_pay_typ_cd_k: req.dlv_pay_typ_cd || '',
//     disp_chnl_typ_cd_k: req.disp_chnl_typ_cd || '',
//     prd_no_i: req.prd_no || '',
//     prd_typ_cd_k: req.prd_typ_cd || '',
//     ovrss_direct_buy_yn: req.ovrss_direct_buy_yn || '',
//     dlv_cst: req.dlv_cst || '',
//     prd_stat_cd_k: req.prd_stat_cd || '',
//     prd_sel_cd_k: req.prd_sel_cd || '',


//     except_cont_creator_no: req.except_cont_creator_no || '', // 인터리어 작성자
//     except_eval_creator_no: req.except_eval_creator_no || '', // 상품평 작성자 
//     except_part_creator_no: req.except_part_creator_no || '',  // 파트너스 작성자

//     cnstr_area_bjd_cd: req.cnstr_area_bjd_cd || '',   // 시공장소 법정동 코드 - 인테리어
//     'attr_apace.search_attr_space_k': req.attr_space || '',          // 공간 속성 - 인테리어
//     'attr_space_dtl.search_attr_space_dtl_k': req.attr_space_dtl || '',  // 공간 속성 상세 - 인테리어
//     start_scr: req.start_scr || '',             // 평점 점수 시작 - 인테리어
//     end_scr: req.end_scr || '',                 // 평점점수 끝 - 인테리어
//     seller_at033_k: req.seller_at033 || '',     // 시공 경력 - 인테리어

//     sort: req.sort || '',
//     size: req.size || 30,
//     from: req.from || 0,
//     type: req.type || '',                // search, agg 구분 
//   }

//   return reqParams;
// };

//[query loooggg]
const setLog4OpenQueryLog = (indexNm, keyword, searchResult) => {
  const openqueryLog = {
    index: indexNm,
    query: keyword,
    total: searchResult.hits.total.value,
    took: searchResult.took,
  };
  console.log(openqueryLog);
  return openqueryLog;
};
const setLog4OpenQueryLog2 = (indexNm, keyword, searchResult) => {
  let total = 0;
  if(searchResult.responses.length > 1){
    total = searchResult.responses.reduce((acc, cur, i) => {
      //console.log(acc, cur);
      return acc + cur.hits.total.value;
    },0)
  }else{
    total = searchResult.responses[0].hits.total.value
  }


  const openqueryLog = {
    index: indexNm,
    query: keyword,
    total: total,
    took: searchResult.responses[0].took,
  };
  console.log(openqueryLog);
  return openqueryLog;
};
//[gateway]
const setReqParams4Gateway = (req) => {
  let result = {};
  let gatewayService = req.gatewayService;
  result.sort = req.sort;
  switch (gatewayService) {
    case 'autocomplete':
      result['gatewayService'] = gatewayService;
      result['keyword'] = req.keyword;
      break;
    case 'related':
    case 'speller':
      result['gatewayService'] = gatewayService;
      result['label'] = req.label;
    case 'recommend':
      // 자동완성, 연관검색어
      result['gatewayService'] = gatewayService;
      result['keyword'] = req.keyword;
      result['label'] = req.label;
      break;
    case 'popquery':
      result['gatewayService'] = gatewayService;
      result['label'] = req.label;
      break;
  }
  return result;
};
const setParamsSearchlog = (req) => {
  let today = new Date();
  let year = today.getFullYear();
  let month = ('0' + (today.getMonth() + 1)).slice(-2);
  let day = ('0' + today.getDate()).slice(-2);
  let monthString = year+month;

  let hours = ('0' + today.getHours()).slice(-2);
  let minutes = ('0' + today.getMinutes()).slice(-2);
  let seconds = ('0' + today.getSeconds()).slice(-2);
  let dateString = year + '-' + month  + '-' + day;
  let timeString = hours + ':' + minutes + ':' + seconds;
  let timestamp = dateString + ' ' + timeString;

  const reqParams = {
    index: req.gatewayService+'_'+monthString,       
    keyword: req.keyword,
    timestamp: timestamp,
    userId: req.userId,
    dep: req.dep,
    category: req.category,
    searchField: req.searchField
  }

  //console.log(reqParams);
  return reqParams;
};
const setParamsActionlog = (req) => {
  let today = new Date();
  let year = today.getFullYear();
  let month = ('0' + (today.getMonth() + 1)).slice(-2);
  let day = ('0' + today.getDate()).slice(-2);
  let monthString = year+month;

  let hours = ('0' + today.getHours()).slice(-2);
  let minutes = ('0' + today.getMinutes()).slice(-2);
  let seconds = ('0' + today.getSeconds()).slice(-2);
  let dateString = year + '-' + month  + '-' + day;
  let timeString = hours + ':' + minutes + ':' + seconds;
  let timestamp = dateString + ' ' + timeString;

  const reqParams = {
    index: req.gatewayService+'_'+monthString,       
    keyword: req.keyword,
    timestamp: timestamp,
    ssoId: req.ssoId,
    dep: req.dep,
    category: req.category,
    action: req.action,
    targetIndex: req.targetIndex,
    docId : req.docId,
    title: req.title
  }

  //console.log(reqParams);
  return reqParams;
};

const setParamsQnaReg = (req) => {
  let today = new Date();
  let year = today.getFullYear();
  let month = ('0' + (today.getMonth() + 1)).slice(-2);
  let day = ('0' + today.getDate()).slice(-2);
  let monthString = year+month;

  let hours = ('0' + today.getHours()).slice(-2);
  let minutes = ('0' + today.getMinutes()).slice(-2);
  let seconds = ('0' + today.getSeconds()).slice(-2);
  let dateString = year + '-' + month  + '-' + day;
  let timeString = hours + ':' + minutes + ':' + seconds;
  let timestamp = dateString + ' ' + timeString;

  const reqParams = {
    index: '.openquery-qna',
    q_id: req.ssoId,
    q_attach: req.dep,
    q_content: req.content,
    q_title: req.title,
    q_position: req.position,
    q_phone : req.phone,
    is_answered: req.isAnswer,
    q_timestamp: timestamp,
  }

  //console.log(reqParams);
  return reqParams;
};

const setParamsQnaUp = (req) => {
  let today = new Date();
  let year = today.getFullYear();
  let month = ('0' + (today.getMonth() + 1)).slice(-2);
  let day = ('0' + today.getDate()).slice(-2);
  let monthString = year+month;

  let hours = ('0' + today.getHours()).slice(-2);
  let minutes = ('0' + today.getMinutes()).slice(-2);
  let seconds = ('0' + today.getSeconds()).slice(-2);
  let dateString = year + '-' + month  + '-' + day;
  let timeString = hours + ':' + minutes + ':' + seconds;
  let timestamp = dateString + ' ' + timeString;

  const reqParams = {
    index: '.openquery-qna',
    id : req.docId,
    q_attach: req.dep,
    q_content: req.content,
    q_title: req.title,
    q_position: req.position,
    q_phone : req.phone,
    is_answered: req.isAnswer,
    q_timestamp: timestamp,
  }

  //console.log(reqParams);
  return reqParams;
};



const setParamsMykwd = (req) => {
  let today = new Date();
  let oneday = new Date();
  let twoday = new Date();
  oneday.setMonth(today.getMonth()-1);
  twoday.setMonth(today.getMonth()-2);
  
  let year = today.getFullYear();
  let oneYear = oneday.getFullYear();
  let twoYear = twoday.getFullYear();
  
  let currmonth = ('0' + (today.getMonth() + 1)).slice(-2);
  let onemonth = ('0' + (oneday.getMonth() + 1)).slice(-2);
  let twomonth = ('0' + (twoday.getMonth() + 1)).slice(-2);
  let monthString = year+currmonth;
  let onemonthString = oneYear+onemonth;
  let twomonthString = twoYear+twomonth;
  let indexList = [];
  indexList.push(req.searchIndex+'_'+monthString);
  indexList.push(req.searchIndex+'_'+onemonthString);
  indexList.push(req.searchIndex+'_'+twomonthString);
    
  const reqParams = {
    index: indexList.join(','),
    userId: req.userId,
    actionField: req.actionField,
    idField: req.idField,
    aggsField: req.aggsField,
    action : req.action
  }

  //console.log(reqParams);
  return reqParams;
};

const setParamsMyclick = (req) => {
  let today = new Date();
  let oneday = new Date();
  let twoday = new Date();
  oneday.setMonth(today.getMonth()-1);
  twoday.setMonth(today.getMonth()-2);
  
  let year = today.getFullYear();
  let oneYear = oneday.getFullYear();
  let twoYear = twoday.getFullYear();
  
  let currmonth = ('0' + (today.getMonth() + 1)).slice(-2);
  let onemonth = ('0' + (oneday.getMonth() + 1)).slice(-2);
  let twomonth = ('0' + (twoday.getMonth() + 1)).slice(-2);
  let monthString = year+currmonth;
  let onemonthString = oneYear+onemonth;
  let twomonthString = twoYear+twomonth;
  let indexList = [];
  indexList.push(req.searchIndex+'_'+monthString);
  indexList.push(req.searchIndex+'_'+onemonthString);
  indexList.push(req.searchIndex+'_'+twomonthString);
    
  const reqParams = {
    index: indexList.join(','),
    userId: req.userId,
    actionField: req.actionField,
    idField: req.idField,
    sortField: req.sortField,
    action : req.action,
    categoryField: req.categoryField,
    size: req.size || 10,
    from: req.from || 0,
    sort: req.sort || ''
  }

  //console.log(reqParams);
  return reqParams;
};

const setParamsCategory = (req) => {
  const reqParams = {
    searchIndex: req.searchIndex || '',        
    keyword: req.keyword || '',
    termField : req.termField || ''
  }

  return reqParams;
};

const setParamPopPage = (req) => {
  const reqParams = {
    searchIndex: req.searchIndex || '',        
    keyword: req.keyword || '',      	          // keyword
    sort: req.sort || 'count',
    size: req.size || 10,
    from: req.from || 0,
    fields: req.fields,
    highlightField: req.highlight
  }

  
  return reqParams;
};

module.exports = {
  setReqParamsk4: setReqParamsk4,
  setLog4OpenQueryLog: setLog4OpenQueryLog,
  setLog4OpenQueryLog2: setLog4OpenQueryLog2,
  setReqParams4Gateway: setReqParams4Gateway,
  setParamsPageMain: setParamsPageMain,
  setParamsPageDocs: setParamsPageDocs,
  setParamsVoca : setParamsVoca,
  setParamsFaq: setParamsFaq,
  setParamsQna: setParamsQna,
  setParamsSearchlog: setParamsSearchlog,
  setParamsActionlog: setParamsActionlog,
  setParamsMykwd: setParamsMykwd,
  setParamsMyclick: setParamsMyclick,
  setParamsCategory: setParamsCategory,
  setParamsQnaReg: setParamsQnaReg,
  setParamsQnaUp: setParamsQnaUp,
  setParamPopPage: setParamPopPage
};


