import { MemoryCache } from '../src/index'

describe('MemoryCache ~', () => {
  const callback = () => 'default'
  const cache = new MemoryCache({ size: 10, callback })

  test('Write',() => {
    cache.write('test', '123')
    cache.write([21, "fr"], { test: 123 })
    expect(cache.size()).toBe(2)
    expect(cache.has('test')).toBe(true)
    expect(cache.has('21_fr')).toBe(true)
  })

  test('Read', () => {
    expect(cache.read('test')).toEqual('123')
    expect(cache.read('no_existence')).toEqual('default')
    expect(cache.read('no_existence_1', () => 200)).toEqual(200)
    expect(cache.read([21, "fr"])).toStrictEqual({ test: 123 })
    expect(cache.readAll()).toMatchObject({ test: '123' })
  })

  test('Remove', () => {
    cache.remove('test')
    expect(cache.size()).toBe(3)
    cache.clear()
    expect(cache.size()).toBe(0)
    expect(cache.readAll()).toStrictEqual({})
    expect(cache.readAll({ test: 12 })).toStrictEqual({ test: 12 })
  })

  test('Over size',() => {
    for (let i = 1; i < 15; i++) {
      cache.write(`test${i}`, i)
    }
    expect(cache.size()).toBe(10)
    expect(cache.read('test1')).toEqual('default')
  })
})
