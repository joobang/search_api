const getData = require('./searchDataInfo');
const getServiceData = require('./serviceDataInfo');
const getAggData = require('./aggsDataInfo');

module.exports = {
  getAllData: getData.allData,
  getPageDocs : getData.pageData,
  getDocuments : getData.docData,
  getVocaData : getData.vocaData,
  getVocaTermData : getData.vocaTermData,
  getFaqData : getData.faqData,
  getQnaData : getData.qnaData,
  getFaqDocData : getData.faqDocData,
  getQnaDocData : getData.qnaDocData,
  getMyclick : getData.myClickData,
  getPopContents : getData.popContentsData,
  getSimidocs : getData.simidocsData,
  //[aggs]
  //  getAggsSubData : getAggData.aggsData,
  getAggsData: getAggData.aggsData,
  getWordcloud: getAggData.wordCloud,
  getMykeyword: getAggData.myKeyword,
  //  getInterAggsData : getAggData.interiorAggsData,

  //[부가서비스]
  getAutoData: getServiceData.autoData,
  getRelatedData: getServiceData.relatedData,
  getPopData: getServiceData.popData,

  // 동의어 처리
  getSynonymResult: getServiceData.synonymResult

};
