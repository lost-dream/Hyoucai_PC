import request from '@/assets/js/requestHYC'
import qs from 'qs'

function getInvestStatusApi(data) {
  return request({
    url: 'extendApi/userPorjectInvestStatusHidden',
    method: 'post',
    data: qs.stringify(data)
  })
}

function getProjectDetail(data) {
  return request({
    url: 'project/projectDetail',
    method: 'get',
    params: data
  })
}

function getSanBiaoStatusApi(data) {
  return request({
    url: 'userInvest/invQueryConditions',
    method: 'post',
    data: qs.stringify(data)
  })
}

function getDefaultStatusApi(data) {
  return request({
    url: 'collection/defaultInvStatusForShow',
    method: 'post',
    data: qs.stringify(data)
  })
}

function getQSTList(data) {
  return request({
    url: 'collectionProject/list',
    method: 'post',
    data: qs.stringify(data)
  })
}

function getZXTList(data) {
  return request({
    url: 'userInvest/userInvestInfo',
    method: 'post',
    data: qs.stringify(data)
  })
}

function getQSTGainPlan(data) {
  return request({
    url: 'collection/gainPlan',
    method: 'post',
    data: qs.stringify(data)
  })
}

function getQSTInfo(data) {
  return request({
    url: 'collectionProject/inverstInfo',
    method: 'post',
    data: qs.stringify(data)
  })
}

function getTrilateralPdfPathApi(data) {
  return request({
    url: 'protocol/getTrilateralPdfPath',
    method: 'post',
    data: qs.stringify(data)
  })
}

function getPeopleInfoApi(data) {
  return request({
    url: 'jxLoanPeopleInfo/detail',
    method: 'post',
    data: qs.stringify(data)
  })
}

function getZXTDetail(data) {
  return request({
    url: 'userInvest/userInvestInfo',
    method: 'post',
    data: qs.stringify(data)
  })
}

function getZXTGainPlan(data) {
  return request({
    url: 'project/gainPlan',
    method: 'post',
    data: qs.stringify(data)
  })
}

function getAgreementApi(data) {
  return request({
    url: 'extendApi/queryAgreementCatalog',
    method: 'post',
    data: qs.stringify(data)
  })
}

function getInternetInformation(data) {
  return request({
    url: '/auditInfo/internetInformation',
    method: 'post',
    data: qs.stringify(data)
  })
}

function getTrilateralPdfPath(data) {
  return request({
    url: '/protocol/getTrilateralPdfPath',
    method: 'post',
    data: qs.stringify(data)
  })
}

export {
  getInvestStatusApi, // 获取投资状态 projectType => 0: 散标 2:集合标
  getSanBiaoStatusApi, // 获取散标状态
  getDefaultStatusApi, // 我的投资-轻松投-默认展示的投资状态
  getQSTList, // 获取轻松投列表
  getZXTList, // 获取自选投列表
  getQSTGainPlan, // 获取轻松投收益计划
  getQSTInfo, // 获取轻松投项目组成
  getTrilateralPdfPathApi, // 优质计划，获取项目组成三方协议
  getPeopleInfoApi, // 获取借款人详细信息
  getZXTDetail, // 获取自选投详情
  getZXTGainPlan, // 散标收益计划
  getAgreementApi, // 协议目录获取
  getProjectDetail, // 标的详情获取
  getInternetInformation, // 互联网自信报告
  getTrilateralPdfPath // 获取三方协议PDF地址
}
