const aggsParam = (result, str) => {
  let paramArr = [];
  for (const param in result) {
    if (str.match("disp_ctgr")) {
      paramArr.push(
        {
          parent_key: result[param].key.split("^")[0],
          key: result[param].key.split("^")[1] + "^" + result[param].key.split("^")[2],
          value: result[param].doc_count
        }
      )
    }
    else {
      paramArr.push(
        {
          key: result[param].key,
          value: result[param].doc_count
        }
      )
    }
  }
  return paramArr;
}

// 카테고리
const commonAggs = (aggsResult, str) => {
  let subresult = aggsResult[0].aggregations[str].buckets;
  let obj = aggsParam(subresult, str);
  return obj;
}

module.exports = {
  aggsData: async (paramSet, aggsResult) => {

    const searchIndex = paramSet.searchIndex;
    let dataObj;

    if (searchIndex === "product") {
      dataObj = {
        attr_aggs: commonAggs(aggsResult, "attr"),
        brand_kr_aggs: commonAggs(aggsResult, "brand_kr"),
        disp_ctgr_1_aggs: commonAggs(aggsResult, "disp_ctgr_1"),
        disp_ctgr_2_aggs: commonAggs(aggsResult, "disp_ctgr_2"),
        disp_ctgr_3_aggs: commonAggs(aggsResult, "disp_ctgr_3"),
        disp_ctgr_4_aggs: commonAggs(aggsResult, "disp_ctgr_4"),
        seller_aggs: commonAggs(aggsResult, "seller"),
        nota_area_aggs: commonAggs(aggsResult, "nota_area"),
        nota_object_aggs: commonAggs(aggsResult, "noto_object")
      }
    }

    else if (!(searchIndex === "evaluation" || searchIndex === "plan" || searchIndex === "partners")) {
      dataObj = {
        attr_aggs: commonAggs(aggsResult, "attr"),
      }
    }
    return dataObj;
  },
  wordCloud: async (paramSet, aggsResult) => {
    const searchIndex = paramSet.searchIndex;
    let dataObj = [];
    //console.log(aggsResult);
    let result = aggsResult.searchResult.responses;
    for(let i =0; i < result.length; i++){
      let currCate = aggsResult.categoryList[i];
      // 카테고리별 검색결과
      let data = result[i];
      let mainObj={}
      mainObj['category'] = currCate;
      mainObj['wordcloud'] = [];
      let buckets = data.aggregations.wordcloud.buckets;
      let reg1 = /^[0-9]/;
      let reg2 = /^제[0-9]/;
      for(let j = 0; j < buckets.length; j++){
        if(!(reg1.test(buckets[j].key) || reg2.test(buckets[j].key) || buckets[j].key.length < 2)){
          if(mainObj['wordcloud'].length < 100){
            mainObj['wordcloud'].push(buckets[j]);
          }else{
            break;
          }
        }
      }
      dataObj.push(mainObj);
    }
    return dataObj;
  },
  myKeyword: async (paramSet, aggsResult) => {
    const searchIndex = paramSet.searchIndex;
    let dataObj = [];
    let result = aggsResult.responses;
    for(let i =0; i < result.length; i++){
      let data = result[i];
      //console.log(data);
      let buckets = data.aggregations.wordcloud.buckets;
      let reg1 = /^[0-9]/;
      let reg2 = /^제[0-9]/;
      for(let j = 0; j < buckets.length; j++){
        if(!(reg1.test(buckets[j].key) || reg2.test(buckets[j].key) || buckets[j].key.length < 2)){
          if(dataObj.length < 100){
            dataObj.push(buckets[j]);
          }else{
            break;
          }
        }
      }
    }
    return dataObj;
  },
};



