import { findLastIndex, propEq, slice } from 'ramda'
import stylexs from 'cxs/component'

const { random, floor } = Math

const _l = (logger) => (...x: any[]) => {
  logger('l', ...x)
  return x[0]
}
export const l = _l(console.log)
l.error = _l(console.error)

export const lf = (fn: Function) => (...args: any[]) => {
  return l(fn(...args.map(l)))
}

export const noop = () => {}

export const filterBeforeLastClear = (drawings) =>
  slice(
    findLastIndex(propEq('tool', 'clear'), drawings) + 1,
    Infinity,
    drawings,
  )

export const getDirection = (viewport) =>
  viewport.width >= viewport.height ? 'row' : 'column'

export const makeView = stylexs('div')
export const view = stylexs('div')

export const makeId = () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split(
    '',
  )
  let id = ''
  while (id.length < 12) id += alphabet[floor(random() * alphabet.length)]
  return id
}
