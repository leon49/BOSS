import fetch from '@/utils/fetch'

export function queryList() {
  return fetch({
    url: '/cash/queryList',
    method: 'get'
  })

}

export function submitCashToServer(goldCount) {
  return fetch({
    url: '/cash/submitCash?gold='.concat(goldCount),
    method: 'get'
  })
}
