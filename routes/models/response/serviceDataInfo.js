//[부가서비스]
module.exports = {
    // 연관검색어 || 추천검색어
    relatedData: async (paramSet, searchResult) => {

        let response = [];

        // for (let i = 0; i < searchResult.length - 1; i++) {
        //     let resultRec = searchResult[0].hits.hits;
        //     let resultRel = searchResult[1].hits.hits;
        //     console.log(resultRec)
        //     console.log(resultRel)
        //     if (resultRec.length > 0 || resultRel.length > 0) {
        //         let obj = [];
        //         if (resultRec.length === 0) {        // resultRec 없을때는 resultRel -> related
        //             for (cnt of resultRel) {
        //                 obj = cnt._source.related
        //             }
        //             response = obj;
        //         } else if (resultRec.length > 0) {   // 값이 존재할때 -> recommend
        //             for (cnt of resultRec) {
        //                 obj = cnt._source.recommend;
        //             }
        //             response = obj;
        //         }
        //     }
        // }
        let resultRec = searchResult[0].hits.hits;
        let resultRel = searchResult[1].hits.hits;
        // console.log(resultRec)
        // console.log(resultRel)
        let obj = [];
        if (resultRec.length > 0 || resultRel.length > 0) {
            if (resultRec.length > 0) {       // 값이 존재할때 -> recommend
                for (cnt of resultRec) {
                    obj = cnt._source.recommend;
                }
                response = obj;
            } else if (resultRec.length === 0) {   // resultRec 없을때는 resultRel -> related
                for (cnt of resultRel) {
                    obj = cnt._source.related
                }
                response = obj;
            }
        }

        if (obj.length < 10){
            for(cnt of resultRel[0]._source.related){
                if (obj.length < 10) {
                    response.push(cnt);
                }else{
                    break;
                }
            }
        }
        return response;
    },

    synonymResult: async (paramSet, searchResult) => {
        if (searchResult.hits.hits.length === 0) {
            return paramSet.keyword;
        } else {
            return searchResult.hits.hits[0]._source.synonym.term;
        }
    },

    // [ 연관검색어 ]
    //    relatedData : async(paramSet, searchResult) => {
    //	result = searchResult.hits.hits;
    //	let obj = {};
    //	if(result.length > 0){
    //	  for(cnt of result) {
    //	    obj = cnt._source.related;
    //	  }
    //	}
    //	return obj;
    //    },

    //자동완성 datainfo
    autoData: async (paramSet, searchResult) => {
        result = searchResult.hits.hits;
        let response = [];

        if (result.length > 0) {
            for (cnt of result) {
                let hfield;
                let obj = {};
                let hfieldArr = [];

                if (cnt.hasOwnProperty("highlight")) {
                    let highlightObj = cnt.highlight;
                    let highlightArr = ["keyword.keyword","keyword.autocomplete", "keyword.prefix","keyword.autocomplete_middle", "keyword.autocomplete_reverse"];
                    highlightArr.map(high => {
                        if (Object.keys(highlightObj).includes(high)) hfield = highlightObj[high][0];
                        if (hfield !== undefined) hfieldArr.push(hfield);
                    })
                }
                obj.keyword = cnt._source.keyword
                obj.highlight = hfieldArr[0]
                obj.weight = cnt._source.weight
                response.push(obj);
            }
        }
        return response;
    },

    popData: async (paramSet, searchResult) => {

        hits = searchResult.hits.hits;
        // let result =[];
        let result = {
            "timestamp": searchResult.hits.hits[0]._source.timestamp,
            result: []
        }

        if (hits.length > 0) {
            for (let element of JSON.parse(hits[0]._source.popqueryJSON)) {
                let obj = {};

                obj.rank = element.rank;
                obj.query = element.query;
                obj.count = element.count;
                obj.diff = element.diff;
                obj.updown = element.updown;
                result.result.push(obj);
            }
        }
        return result;
    },


}
