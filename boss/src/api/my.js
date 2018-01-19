import fetch from '@/utils/fetch'

export function queryMy() {

  return fetch({
    url: '/agentbiz/queryMy',
    method: 'get'
  })
}
