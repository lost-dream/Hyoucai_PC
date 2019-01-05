import request from '@/assets/js/requestDJS'
import qs from 'qs'

export function addBankCard(data) {
  return request({
    url: '/cardBindPage/bind',
    method: 'POST',
    headers: { 'Content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(data)
  })
}

export function userBasicInfo (data) {
  return request({
    url: '/UserBasicInfo',
    method: 'POST',
    headers: { 'Content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(data)
  })
}
export function supportBankList (data) {
  return request({
    url: '/SysBankList',
    method: 'POST',
    headers: { 'Content-type': 'application/x-www-form-urlencoded', version: '2.0'},
    data: qs.stringify(data)
  })
}
