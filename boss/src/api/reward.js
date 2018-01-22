import fetch from '@/utils/fetch'

export function queryList() {

  return fetch({
    url: '/agentbiz/queryRewardList',
    method: 'get'
  })

}
