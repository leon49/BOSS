import fetch from '@/utils/fetch'

export function queryMy() {

  return fetch({
    url: '/agentbiz/queryMy',
    method: 'get'
  })
}

export function updateAgent(alipayAccout,wechartAccount) {
  return fetch({
    url: '/agentbiz/updateAgent?alipayAccout='.concat(alipayAccout).
    concat("&wecharAccount=").concat(wechartAccount),
    method: 'get'
  })
}
