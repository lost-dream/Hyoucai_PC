import request from '@/assets/js/requestHYC'

// 信息披露中心-运营数据
export function getOperationalData() {
  return request({
    url: 'info/operationalData',
    method: 'get'
  })
}
