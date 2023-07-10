const APPROOT = require('app-root-path');
const Util = require(`${APPROOT}/util/util`);
const moment = require('moment');

// Count 함수
const setCount = (searchResult) => {
  let totalCnt = 0;
  totalCnt = searchResult.hits.total.value;

  return totalCnt;
}

module.exports = {
  // [ allData 확인 ]
  allData: async (paramSet, searchResult) => {
    //console.log(JSON.stringify(searchResult))
    let obj = {
      main:[]
    }
    let result = searchResult.searchResult.responses;
    //console.log(JSON.stringify(result));
    for (let i = 0; i < result.length; i++) {
      let currCate = searchResult.categoryList[i];
      // 카테고리별 검색결과
      let data = result[i];
      let cateCnt = setCount(data);
      let mainObj={}
      mainObj['category'] = currCate;
      mainObj['totalCount'] = cateCnt;
      mainObj['docs'] = [];
      let hits = data.hits.hits;
      if (hits.length > 0){
        for(let j = 0; j<hits.length; j++){
          let tmpObj = {}
          tmpObj.fileSize = hits[j]._source.fileSize_l;
          tmpObj.givenName = hits[j]._source.givenName_k;
          tmpObj.file_modified = hits[j]._source.file_modified_dt;
          tmpObj.file_created = hits[j]._source.file_create_dt;
          tmpObj.alink = hits[j]._source.alink_k;
          tmpObj.docName = hits[j]._source.docName_k;
          tmpObj.crypted = hits[j]._source.crypted_k;
          tmpObj.updatedAt = hits[j]._source.updatedAt_dt;
          tmpObj.type = hits[j]._source.type_k;
          tmpObj.createAt = hits[j]._source.createAt_dt;
          tmpObj.category = hits[j]._source.category_k;
          tmpObj.originExists = hits[j]._source.originExists_k;
          tmpObj.filepath = hits[j]._source.filepath_k;
          tmpObj.deleted = hits[j]._source.deleted_k;
          tmpObj.secureId = hits[j]._source.secureId_k;
          tmpObj.streamdocsId = hits[j]._source.streamdocsId_k;
          tmpObj.hasPassword = hits[j]._source.hasPassword_k;
          tmpObj.contents = hits[j]._source.synap_contents_psk.substring(0,1000)+'(계속...)';
          tmpObj.title = hits[j]._source.title_kskn;
          tmpObj.info = hits[j]._source.info_psk;
          tmpObj.filename = hits[j]._source.filename_k;
          tmpObj.revision = hits[j]._source.revision_dt;
          tmpObj.thumbnail_path = hits[j]._source.thumbnailpath_k;
          tmpObj.id = hits[j]._id;
          tmpObj.docCnt = hits[j]._source.docCnt_i;
          tmpObj.checked = hits[j]._source.checked_k;
          mainObj['docs'].push(tmpObj);
        }
      }
      obj.main.push(mainObj);
    }
    //console.log(obj);
    return obj;
  },
  pageData: async (paramSet, searchResult) => {
    //console.log(JSON.stringify(searchResult))
    let obj = {
      totalCount: 0,
      docs:[]
    }
    let result = searchResult.responses[0];
    let totalCount = result.hits.total.value;
    let hits = result.hits.hits;
    
    if(totalCount > 0){
      for(let i=0; i<hits.length; i++){
        let tmpObj = {};
        let hfield;
        let hfieldArr = [];
        tmpObj.page_contents = hits[i]._source.page_contents_psk;
        tmpObj.file_create = hits[i]._source.file_create_dt;
        tmpObj.file_modified = hits[i]._source.file_modified_dt;
        tmpObj.filepath = hits[i]._source.filepath_k;
        tmpObj.category = hits[i]._source.category_k;
        tmpObj.page = hits[i]._source.page_i;
        tmpObj.total_page = hits[i]._source.total_page_i;
        tmpObj.alink = hits[i]._source.alink_k; 
        tmpObj.createdAt = hits[i]._source.createdAt_dt;
        tmpObj.crypted = hits[i]._source.crypted_k;
        tmpObj.deleted = hits[i]._source.deleted_k;
        tmpObj.docName = hits[i]._source.docName_k;
        tmpObj.fileSize = hits[i]._source.fileSize_l;
        tmpObj.givenName = hits[i]._source.givenName_k;
        tmpObj.hasPassword = hits[i]._source.hasPassword_k;
        tmpObj.originExists = hits[i]._source.originExists_k;
        tmpObj.secureId = hits[i]._source.secureId_k;
        tmpObj.streamdocsId = hits[i]._source.streamdocsId_k;
        tmpObj.type = hits[i]._source.type_k;
        tmpObj.updatedAt = hits[i]._source.updatedAt_dt;
        tmpObj.thumbnail_path = hits[i]._source.thumbnail_path_k;
        tmpObj.filename = hits[i]._source.filename_k;
        tmpObj.title = hits[i]._source.title_kskn;
        tmpObj.revision = hits[i]._source.revision_dt;
        tmpObj.id = hits[i]._id;

        let highlightObjList = [];
        let highlightField = "";
        if (hits[i].hasOwnProperty("highlight")) {
          let highlightObj = hits[i].highlight;
          let highlightArr = ["page_contents_psk.standard","page_contents_psk.kobrick"];
          highlightArr.map(high => {
              if (Object.keys(highlightObj).includes(high)) highlightObjList = highlightObj[high];
          })
        }
        for(let i = 0; i<highlightObjList.length; i++){
          if(highlightField.length < highlightObjList[i].length){
            highlightField = highlightObjList[i]
          }
        }
        tmpObj.highlight = highlightField;
        obj.docs.push(tmpObj);
        
      }
    }
    //console.log(JSON.stringify(result));
    //console.log(obj);
    obj.totalCount = totalCount;
    return obj;
  },
  vocaData: async (paramSet, searchResult) => {
    //console.log(JSON.stringify(searchResult))
    let obj = {
      totalCount: 0,
      docs:[]
    }
    let result = searchResult.responses[0];
    let totalCount = result.hits.total.value;
    let hits = result.hits.hits;
    if(totalCount > 0){
      for(let i=0; i<hits.length; i++){
        let tmpObj = {};
        let hTermfield, hTermEngfield, hAbbrfield, hInfofield;
        let hTermfieldArr = [], hTermEngfieldArr= [], hAbbrfieldArr = [], hInfofieldArr = [];
        
        tmpObj.term = hits[i]._source.vocabulary.term;
        tmpObj.term_eng = hits[i]._source.vocabulary.term_eng;
        tmpObj.abbr = hits[i]._source.vocabulary.abbr;
        tmpObj.info = hits[i]._source.vocabulary.info;
        tmpObj.timestamp = hits[i]._source.vocabulary.timestamp;
        tmpObj.id = hits[i]._id;
        if (hits[i].hasOwnProperty("highlight")) {
          let highlightObj = hits[i].highlight;
          let highlightTermArr = ["vocabulary.term.keyword", "vocabulary.term.kobrick","vocabulary.term.autocomplete"];
          let highlightTermEngArr = ["vocabulary.term_eng.keyword", "vocabulary.term_eng.kobrick","vocabulary.term_eng.autocomplete"];
          let highlightAbbrArr = ["vocabulary.abbr.keyword", "vocabulary.abbr.kobrick","vocabulary.abbr.autocomplete"];
          let highlightInfoArr = ["vocabulary.info.kobrick", "vocabulary.info.standard"];
          
          highlightTermArr.map(high => {
            if (Object.keys(highlightObj).includes(high)) hTermfield = highlightObj[high][0];
            if (hTermfield !== undefined) hTermfieldArr.push(hTermfield);
          })
          highlightTermEngArr.map(high => {
            if (Object.keys(highlightObj).includes(high)) hTermEngfield = highlightObj[high][0];
            if (hTermEngfield !== undefined) hTermEngfieldArr.push(hTermEngfield);
          })
          highlightAbbrArr.map(high => {
            if (Object.keys(highlightObj).includes(high)) hAbbrfield = highlightObj[high][0];
            if (hAbbrfield !== undefined) hAbbrfieldArr.push(hAbbrfield);
          })
          highlightInfoArr.map(high => {
            if (Object.keys(highlightObj).includes(high)) hInfofield = highlightObj[high][0];
            if (hInfofield !== undefined) hInfofieldArr.push(hInfofield);
          })
        }
        let highlight = {}
        highlight['term'] = hTermfieldArr[0];
        highlight['term_eng'] = hTermEngfieldArr[0];
        highlight['abbr'] = hAbbrfieldArr[0];
        highlight['info'] = hInfofieldArr[0];
        tmpObj.highlight = highlight;
        obj.docs.push(tmpObj);
        
      }
    }
    //console.log(JSON.stringify(result));
    //console.log(obj);
    obj.totalCount = totalCount;
    return obj;
  },
  vocaTermData: async (paramSet, searchResult) => {
    //console.log(JSON.stringify(searchResult))
    let obj = {}
    let result = searchResult.responses[0];
    let totalCount = result.hits.total.value;
    let hits = result.hits.hits;
    if(totalCount > 0){
      for(let i=0; i<hits.length; i++){
        let tmpObj = {};
        tmpObj.term = hits[i]._source.vocabulary.term;
        tmpObj.term_eng = hits[i]._source.vocabulary.term_eng;
        tmpObj.abbr = hits[i]._source.vocabulary.abbr;
        tmpObj.info = hits[i]._source.vocabulary.info;
        tmpObj.timestamp = hits[i]._source.vocabulary.timestamp;
        tmpObj.id = hits[i]._id;
        //console.log(tmpObj);
        obj = tmpObj;
      }
    }
    //console.log(JSON.stringify(result));
    //console.log(obj);
    return obj;
  },
  docData: async (paramSet, searchResult) => {
    let obj = {}
    let result = searchResult.responses[0];
    let totalCount = result.hits.total.value;
    let hits = result.hits.hits;
    if(totalCount > 0){
      for(let i=0; i<hits.length; i++){
        let tmpObj = {};
        tmpObj.page_contents = hits[i]._source.page_contents_psk;
        tmpObj.file_create = hits[i]._source.file_create_dt;
        tmpObj.file_modified = hits[i]._source.file_modified_dt;
        tmpObj.filepath = hits[i]._source.filepath_k;
        tmpObj.category = hits[i]._source.category_k;
        tmpObj.page = hits[i]._source.page_i;
        tmpObj.total_page = hits[i]._source.total_page_i;
        tmpObj.alink = hits[i]._source.alink_k; 
        tmpObj.createdAt = hits[i]._source.createdAt_dt;
        tmpObj.crypted = hits[i]._source.crypted_k;
        tmpObj.deleted = hits[i]._source.deleted_k;
        tmpObj.docName = hits[i]._source.docName_k;
        tmpObj.fileSize = hits[i]._source.fileSize_l;
        tmpObj.givenName = hits[i]._source.givenName_k;
        tmpObj.hasPassword = hits[i]._source.hasPassword_k;
        tmpObj.originExists = hits[i]._source.originExists_k;
        tmpObj.secureId = hits[i]._source.secureId_k;
        tmpObj.streamdocsId = hits[i]._source.streamdocsId_k;
        tmpObj.type = hits[i]._source.type_k;
        tmpObj.updatedAt = hits[i]._source.updatedAt_dt;
        tmpObj.thumbnail_path = hits[i]._source.thumbnail_path_k;
        tmpObj.filename = hits[i]._source.filename_k;
        tmpObj.title = hits[i]._source.title_kskn;
        tmpObj.revision = hits[i]._source.revision_dt;
        tmpObj.checked = hits[j]._source.checked_k;
        tmpObj.id = hits[i]._id;
        obj = tmpObj;
        
      }
    }
    //console.log(JSON.stringify(result));
    //console.log(obj);
    return obj;
  },
  faqData: async (paramSet, searchResult) => {
    //console.log(JSON.stringify(searchResult))
    let obj = {
      totalCount: 0,
      docs:[]
    }
    let result = searchResult.responses[0];
    let totalCount = result.hits.total.value;
    let hits = result.hits.hits;
    if(totalCount > 0){
      for(let i=0; i<hits.length; i++){
        let tmpObj = {};
        let hTitlefield, hContentfield;
        let hTitlefieldArr = [], hContentfieldArr= [];
        
        tmpObj.title = hits[i]._source.title;
        tmpObj.content = hits[i]._source.content;
        tmpObj.category = hits[i]._source.category;
        tmpObj.timestamp = hits[i]._source.timestamp;
        
        let datetime = new Date(tmpObj.timestamp);
        var year = datetime.getFullYear().toString(); //년도 뒤에 두자리
        var month = ("0" + (datetime.getMonth() + 1)).slice(-2); //월 2자리 (01, 02 ... 12)
        var day = ("0" + datetime.getDate()).slice(-2); //일 2자리 (01, 02 ... 31)
        var hour = ("0" + datetime.getHours()).slice(-2); //시 2자리 (00, 01 ... 23)
        var minute = ("0" + datetime.getMinutes()).slice(-2); //분 2자리 (00, 01 ... 59)
        var second = ("0" + datetime.getSeconds()).slice(-2); //초 2자리 (00, 01 ... 59)
        var returnDate = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
        tmpObj.timestamp = returnDate;

        tmpObj.id = hits[i]._id;
        if (hits[i].hasOwnProperty("highlight")) {
          let highlightObj = hits[i].highlight;
          let highlightTitleArr = ["title.keyword", "title.kobrick","title.standard"];
          let highlightContentArr = ["content.kobrick", "content.standard"];
        
          highlightTitleArr.map(high => {
            if (Object.keys(highlightObj).includes(high)) hTitlefield = highlightObj[high][0];
            if (hTitlefield !== undefined) hTitlefieldArr.push(hTitlefield);
          })
          highlightContentArr.map(high => {
            if (Object.keys(highlightObj).includes(high)) hContentfield = highlightObj[high][0];
            if (hContentfield !== undefined) hContentfieldArr.push(hContentfield);
          })
        }
        let highlight = {}
        highlight['title'] = hTitlefieldArr[0];
        highlight['content'] = hContentfieldArr[0];
        tmpObj.highlight = highlight;
        obj.docs.push(tmpObj);
        
      }
    }
    //console.log(JSON.stringify(result));
    //console.log(obj);
    obj.totalCount = totalCount;
    return obj;
  },
  faqDocData: async (paramSet, searchResult) => {
    //console.log(JSON.stringify(searchResult))
    let obj = {}
    let result = searchResult.responses[0];
    let totalCount = result.hits.total.value;
    let hits = result.hits.hits;
    if(totalCount > 0){
      for(let i=0; i<hits.length; i++){
        let tmpObj = {};
        tmpObj.title = hits[i]._source.title;
        tmpObj.content = hits[i]._source.content;
        tmpObj.category = hits[i]._source.category;
        tmpObj.timestamp = hits[i]._source.timestamp;
        tmpObj.id = hits[i]._id;
        let datetime = new Date(tmpObj.timestamp);
        var year = datetime.getFullYear().toString(); //년도 뒤에 두자리
        var month = ("0" + (datetime.getMonth() + 1)).slice(-2); //월 2자리 (01, 02 ... 12)
        var day = ("0" + datetime.getDate()).slice(-2); //일 2자리 (01, 02 ... 31)
        var hour = ("0" + datetime.getHours()).slice(-2); //시 2자리 (00, 01 ... 23)
        var minute = ("0" + datetime.getMinutes()).slice(-2); //분 2자리 (00, 01 ... 59)
        var second = ("0" + datetime.getSeconds()).slice(-2); //초 2자리 (00, 01 ... 59)
        var returnDate = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
        tmpObj.timestamp = returnDate;

        obj = tmpObj;
        
      }
    }
    //console.log(JSON.stringify(result));
    //console.log(obj);
    return obj;
  },
  qnaData: async (paramSet, searchResult) => {
    //console.log(JSON.stringify(searchResult))
    let obj = {
      totalCount: 0,
      docs:[]
    }
    let result = searchResult.responses[0];
    let totalCount = result.hits.total.value;
    let hits = result.hits.hits;
    if(totalCount > 0){
      for(let i=0; i<hits.length; i++){
        let tmpObj = {};
        let hTitlefield, hqContentfield, haContentfield;
        let hTitlefieldArr = [], hqContentfieldArr= [],haContentfieldArr= [];
        
        tmpObj.title = hits[i]._source.q_title;
        tmpObj.content = hits[i]._source.q_content;
        tmpObj.answer = hits[i]._source.a_content;
        tmpObj.timestamp = hits[i]._source.q_timestamp;
        tmpObj.answer_timestamp = hits[i]._source.a_timestamp;
        tmpObj.isAnswered = hits[i]._source.is_answered;
        tmpObj.userId = hits[i]._source.q_id;
        tmpObj.dep = hits[i]._source.q_attach;
        tmpObj.position = hits[i]._source.q_position;
        tmpObj.phone = hits[i]._source.q_phone;
        tmpObj.id = hits[i]._id;

        let datetime = new Date(tmpObj.timestamp);
        var year = datetime.getFullYear().toString(); //년도 뒤에 두자리
        var month = ("0" + (datetime.getMonth() + 1)).slice(-2); //월 2자리 (01, 02 ... 12)
        var day = ("0" + datetime.getDate()).slice(-2); //일 2자리 (01, 02 ... 31)
        var hour = ("0" + datetime.getHours()).slice(-2); //시 2자리 (00, 01 ... 23)
        var minute = ("0" + datetime.getMinutes()).slice(-2); //분 2자리 (00, 01 ... 59)
        var second = ("0" + datetime.getSeconds()).slice(-2); //초 2자리 (00, 01 ... 59)
        var returnDate = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
        tmpObj.timestamp = returnDate;

        if (hits[i].hasOwnProperty("highlight")) {
          let highlightObj = hits[i].highlight;
          let highlightTitleArr = ["q_title.keyword", "q_title.kobrick","q_title.standard"];
          let highlightqContentArr = ["q_content.kobrick"];
          let highlightaContentArr = ["a_content.kobrick"];
          
        
          highlightTitleArr.map(high => {
            if (Object.keys(highlightObj).includes(high)) hTitlefield = highlightObj[high][0];
            if (hTitlefield !== undefined) hTitlefieldArr.push(hTitlefield);
          })
          highlightqContentArr.map(high => {
            if (Object.keys(highlightObj).includes(high)) hqContentfield = highlightObj[high][0];
            if (hqContentfield !== undefined) hqContentfieldArr.push(hqContentfield);
          })
          highlightaContentArr.map(high => {
            if (Object.keys(highlightObj).includes(high)) haContentfield = highlightObj[high][0];
            if (haContentfield !== undefined) haContentfieldArr.push(haContentfield);
          })
        }
        let highlight = {}
        highlight['title'] = hTitlefieldArr[0];
        highlight['content'] = hqContentfieldArr[0];
        highlight['answer'] = haContentfieldArr[0];
        tmpObj.highlight = highlight;
        obj.docs.push(tmpObj);
        
      }
    }
    //console.log(JSON.stringify(result));
    //console.log(obj);
    obj.totalCount = totalCount;
    return obj;
  },
  qnaDocData: async (paramSet, searchResult) => {
    //console.log(JSON.stringify(searchResult))
    let obj = {}
    let result = searchResult.responses[0];
    let totalCount = result.hits.total.value;
    let hits = result.hits.hits;
    if(totalCount > 0){
      for(let i=0; i<hits.length; i++){
        let tmpObj = {};
        tmpObj.title = hits[i]._source.q_title;
        tmpObj.content = hits[i]._source.q_content;
        tmpObj.answer = hits[i]._source.a_content;
        tmpObj.timestamp = hits[i]._source.q_timestamp;
        tmpObj.answer_timestamp = hits[i]._source.a_timestamp;
        tmpObj.isAnswered = hits[i]._source.is_answered;
        tmpObj.userId = hits[i]._source.q_id;
        tmpObj.dep = hits[i]._source.q_attach;
        tmpObj.position = hits[i]._source.q_position;
        tmpObj.phone = hits[i]._source.q_phone;
        tmpObj.id = hits[i]._id;

        let datetime = new Date(tmpObj.timestamp);
        var year = datetime.getFullYear().toString(); //년도 뒤에 두자리
        var month = ("0" + (datetime.getMonth() + 1)).slice(-2); //월 2자리 (01, 02 ... 12)
        var day = ("0" + datetime.getDate()).slice(-2); //일 2자리 (01, 02 ... 31)
        var hour = ("0" + datetime.getHours()).slice(-2); //시 2자리 (00, 01 ... 23)
        var minute = ("0" + datetime.getMinutes()).slice(-2); //분 2자리 (00, 01 ... 59)
        var second = ("0" + datetime.getSeconds()).slice(-2); //초 2자리 (00, 01 ... 59)
        var returnDate = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
        tmpObj.timestamp = returnDate;

        obj = tmpObj;
        
      }
    }
    //console.log(JSON.stringify(result));
    //console.log(obj);
    return obj;
  },
  myClickData: async (paramSet, searchResult) => {
    //console.log(JSON.stringify(searchResult))
    let obj = {}
    obj['totalCount'] = searchResult[0].total;
    obj['docs'] = [];

    //console.log(searchResult);
    for(let i = 0; i<searchResult.length; i++){
      let tmp = {}
      tmp.ssoId = searchResult[i].log.ssoId_k;
      tmp.dep = searchResult[i].log.dep_k;
      tmp.keyword = searchResult[i].log.keyword_k;
      tmp.action = searchResult[i].log.action_k;
      tmp.timestamp = searchResult[i].log.timestamp_dt;
      tmp.id = searchResult[i].log.docId_k;
      tmp.page_contents = searchResult[i].doc.page_contents_psk;
      tmp.file_create = searchResult[i].doc.file_create_dt;
      tmp.file_modified = searchResult[i].doc.file_modified_dt;
      tmp.filepath = searchResult[i].doc.filepath_k;
      tmp.category = searchResult[i].doc.category_k;
      tmp.page = searchResult[i].doc.page_i;
      tmp.total_page = searchResult[i].doc.total_page_i;
      tmp.alink = searchResult[i].doc.alink_k;
      tmp.createdAt = searchResult[i].doc.createdAt_dt;
      tmp.crypted = searchResult[i].doc.crypted_k;
      tmp.deleted = searchResult[i].doc.deleted_k;
      tmp.docName = searchResult[i].doc.docName_k;
      tmp.fileSize = searchResult[i].doc.fileSize_l;
      tmp.givenName = searchResult[i].doc.givenName_k;
      tmp.hasPassword = searchResult[i].doc.hasPassword_k;
      tmp.originExists = searchResult[i].doc.originExists_k;
      tmp.secureId = searchResult[i].doc.secureId_k;
      tmp.streamdocsId = searchResult[i].doc.streamdocsId_k;
      tmp.type = searchResult[i].doc.type_k;
      tmp.updatedAt = searchResult[i].doc.updatedAt_dt;
      tmp.thumbnail_path = searchResult[i].doc.thumbnail_path_k;
      tmp.filename = searchResult[i].doc.filename_k;
      tmp.title = searchResult[i].doc.title_kskn;
      tmp.revision = searchResult[i].doc.revision_dt;
      if(searchResult[i].doc.synap_contents_psk != undefined){
        tmp.contents = searchResult[i].doc.synap_contents_psk.substring(0,500)+'(계속...)';
      }
      

      obj['docs'].push(tmp);
    }
    return obj;
  },
  popContentsData: async (paramSet, searchResult) => {
    //console.log(JSON.stringify(searchResult))
    let obj = {}
    obj['topFive'] = []
    obj['page'] = {};
    obj['page']['totalCount'] = 0;
    obj['page']['docs'] = [];
    
    let popMainResult = searchResult.popMainResult.responses[0].hits;
    //console.log(popMainResult)
    let popMainHits =popMainResult.hits
    for(let i = 0; i<popMainHits.length; i++){
      let tmpObj = {}
      tmpObj.fileSize = popMainHits[i]._source.fileSize_l;
      tmpObj.givenName = popMainHits[i]._source.givenName_k;
      tmpObj.file_modified = popMainHits[i]._source.file_modified_dt;
      tmpObj.file_created = popMainHits[i]._source.file_create_dt;
      tmpObj.alink = popMainHits[i]._source.alink_k;
      tmpObj.docName = popMainHits[i]._source.docName_k;
      tmpObj.crypted = popMainHits[i]._source.crypted_k;
      tmpObj.updatedAt = popMainHits[i]._source.updatedAt_dt;
      tmpObj.type = popMainHits[i]._source.type_k;
      tmpObj.createAt = popMainHits[i]._source.createAt_dt;
      tmpObj.category = popMainHits[i]._source.category_k;
      tmpObj.originExists = popMainHits[i]._source.originExists_k;
      tmpObj.filepath = popMainHits[i]._source.filepath_k;
      tmpObj.deleted = popMainHits[i]._source.deleted_k;
      tmpObj.secureId = popMainHits[i]._source.secureId_k;
      tmpObj.streamdocsId = popMainHits[i]._source.streamdocsId_k;
      tmpObj.hasPassword = popMainHits[i]._source.hasPassword_k;
      tmpObj.contents = popMainHits[i]._source.synap_contents_psk.substring(0, 1000) + '(계속...)';
      tmpObj.title = popMainHits[i]._source.title_kskn;
      tmpObj.info = popMainHits[i]._source.info_psk;
      tmpObj.filename = popMainHits[i]._source.filename_k;
      tmpObj.revision = popMainHits[i]._source.revision_dt;
      tmpObj.thumbnail_path = popMainHits[i]._source.thumbnailpath_k;
      tmpObj.id = popMainHits[i]._id;
      tmpObj.docCnt = popMainHits[i]._source.docCnt_i;
      tmpObj.targetIndex = popMainHits[i]._source.targetIndex_k;
      tmpObj.checked = popMainHits[i]._source.checked_k;
      obj['topFive'].push(tmpObj);
    }


    let popPageResult = searchResult.popPageResult.responses[0].hits;
    //console.log(popPageResult)
    let popPageHits =popPageResult.hits
    obj['page']['totalCount'] = popPageResult.total.value;
    for(let i = 0; i<popPageHits.length; i++){
      let tmpObj = {};
      tmpObj.page_contents = popPageHits[i]._source.page_contents_psk;
      tmpObj.file_create = popPageHits[i]._source.file_create_dt;
      tmpObj.file_modified = popPageHits[i]._source.file_modified_dt;
      tmpObj.filepath = popPageHits[i]._source.filepath_k;
      tmpObj.category = popPageHits[i]._source.category_k;
      tmpObj.page = popPageHits[i]._source.page_i;
      tmpObj.total_page = popPageHits[i]._source.total_page_i;
      tmpObj.alink = popPageHits[i]._source.alink_k;
      tmpObj.createdAt = popPageHits[i]._source.createdAt_dt;
      tmpObj.crypted = popPageHits[i]._source.crypted_k;
      tmpObj.deleted = popPageHits[i]._source.deleted_k;
      tmpObj.docName = popPageHits[i]._source.docName_k;
      tmpObj.fileSize = popPageHits[i]._source.fileSize_l;
      tmpObj.givenName = popPageHits[i]._source.givenName_k;
      tmpObj.hasPassword = popPageHits[i]._source.hasPassword_k;
      tmpObj.originExists = popPageHits[i]._source.originExists_k;
      tmpObj.secureId = popPageHits[i]._source.secureId_k;
      tmpObj.streamdocsId = popPageHits[i]._source.streamdocsId_k;
      tmpObj.type = popPageHits[i]._source.type_k;
      tmpObj.updatedAt = popPageHits[i]._source.updatedAt_dt;
      tmpObj.thumbnail_path = popPageHits[i]._source.thumbnail_path_k;
      tmpObj.filename = popPageHits[i]._source.filename_k;
      tmpObj.title = popPageHits[i]._source.title_kskn;
      tmpObj.revision = popPageHits[i]._source.revision_dt;
      tmpObj.id = popPageHits[i]._id;
      tmpObj.docCnt = popPageHits[i]._source.docCnt_i;
      tmpObj.targetIndex = popPageHits[i]._source.targetIndex_k;

      let hTitlefield, hInfofield;
      let hTitlefieldArr = [], hInfofieldArr = [];
        
      if (popPageHits[i].hasOwnProperty("highlight")) {
        let highlightObj = popPageHits[i].highlight;
        let highlightTitleArr = ["title_kskn.keyword","title_kskn.kobrick","title_kskn.standard"];
        let highlightInfoArr = ["page_contents_psk.kobrick","page_contents_psk.standard"];
        
        highlightTitleArr.map(high => {
          if (Object.keys(highlightObj).includes(high)) hTitlefield = highlightObj[high][0];
          if (hTitlefield !== undefined) hTitlefieldArr.push(hTitlefield);
        })
        highlightInfoArr.map(high => {
          if (Object.keys(highlightObj).includes(high)) hInfofield = highlightObj[high][0];
          if (hInfofield !== undefined) hInfofieldArr.push(hInfofield);
        })
      }
      let highlight = {}
      highlight['title'] = hTitlefieldArr[0];
      highlight['content'] = hInfofieldArr[0];
      tmpObj.highlight = highlight;
      obj['page']['docs'].push(tmpObj);

    }
    return obj;
  },
  simidocsData: async (paramSet, searchResult) => {
    //console.log(JSON.stringify(searchResult))
    let obj = {
      docs:[]
    }
    for (let i = 0; i < searchResult.length; i++) {
      let tmpTotal = searchResult[i].hits.total.value;
      if(tmpTotal > 0){
        let tmpHits = searchResult[i].hits.hits[0]
        let tmpObj = {};
        tmpObj.page_contents = tmpHits._source.page_contents_psk;
        tmpObj.file_create = tmpHits._source.file_create_dt;
        tmpObj.file_modified = tmpHits._source.file_modified_dt;
        tmpObj.filepath = tmpHits._source.filepath_k;
        tmpObj.category = tmpHits._source.category_k;
        tmpObj.page = tmpHits._source.page_i;
        tmpObj.total_page = tmpHits._source.total_page_i;
        tmpObj.alink = tmpHits._source.alink_k;
        tmpObj.createdAt = tmpHits._source.createdAt_dt;
        tmpObj.crypted = tmpHits._source.crypted_k;
        tmpObj.deleted = tmpHits._source.deleted_k;
        tmpObj.docName = tmpHits._source.docName_k;
        tmpObj.fileSize = tmpHits._source.fileSize_l;
        tmpObj.givenName = tmpHits._source.givenName_k;
        tmpObj.hasPassword = tmpHits._source.hasPassword_k;
        tmpObj.originExists = tmpHits._source.originExists_k;
        tmpObj.secureId = tmpHits._source.secureId_k;
        tmpObj.streamdocsId = tmpHits._source.streamdocsId_k;
        tmpObj.type = tmpHits._source.type_k;
        tmpObj.updatedAt = tmpHits._source.updatedAt_dt;
        tmpObj.thumbnail_path = tmpHits._source.thumbnail_path_k;
        tmpObj.filename = tmpHits._source.filename_k;
        tmpObj.title = tmpHits._source.title_kskn;
        tmpObj.revision = tmpHits._source.revision_dt;
        tmpObj.id = tmpHits._id;
        obj.docs.push(tmpObj);
      }
      


    }
    
    //console.log(JSON.stringify(result));
    //console.log(obj);
    return obj;
  }
};



