type Fn<V> = () => V

interface Options {
  size?: number
  callback?: Fn<any>
}

interface StorageOptions extends Options {
  namespace?: string
  storage: Storage
}

interface CustomMap<Value = any> {
  [index: string]: Value
}

/** Abstract Cache
 * @param {object} options = {
 *	 namespace {string} Cache key namespace
 *   size {number} Cache size
 *   callback {function} Globle callback function when the key does not exist
 * }
 */
class Cache {
  private max: number
  private callback?: Fn<any>
  protected cacheMap: Map<string, number>

  constructor(options: Options) {
    this.max = options.size || 30
    this.callback = options.callback
    this.cacheMap = new Map()
  }

  /**
   * Get cache key namespace
   * @return {string} The key namespace
   */
  generateKey<K>(key: K): string {
    if (!Array.isArray(key)) return `${key}`
    try {
      return key.filter(Boolean).join('_')
    } catch(_) {
      throw new Error("Can't generate key from function argument")
    }
  }

  /**
   * Counts the number of items in cache unit
   * @return {number}
   */
  size(): number {
    return this.cacheMap.size
  }

  /**
   * Has key in cache
   * @param {array|string|number} key
   * @return {boolean}
   */
  has<K>(key: K): boolean {
    const realKey = this.generateKey(key)
    return this.cacheMap.has(realKey)
  }

  /**
   * Clear all in cache
   */
  clear(): void {
    this.cacheMap.clear()
  }

  /**
   * Read all data
   * @param {mixed} defaultValue
   * @return {object}
   */
  readAll<V>(defaultValue?: V): V | CustomMap{
    if (!this.size()) return defaultValue || {}
    const cacheObj = {} as CustomMap
    for (const [k, v] of this.cacheMap) {
      cacheObj[k] = v
    }
    return cacheObj
  }

  /**
   * Read value of key in cache
   * @param {array|string|number} key
   * @param {function} callback Callback function when the key does not exist
   * @return {mixed}
   */

  read<K>(key: K, callback?: Fn<any>): any {
    const realKey = this.generateKey(key)
    if (!this.has(realKey)) {
      if (callback) {
        this._write(realKey, callback())
      } else if (this.callback) {
        this._write(realKey, this.callback())
      }
    }
    return this.cacheMap.get(realKey)
  }

  /**
   * Write in cache
   * @param {array|string|number} key
   * @param {mixed} value
   * @return The key
   */
  protected _write<K>(key: K, value: any): void {
    const realKey = this.generateKey(key)
    if (this.size() >= this.max) {
      const keys = this.cacheMap.keys()
      const firstItem = keys.next().value
      this._remove(firstItem)
    }
    this.cacheMap.set(realKey, value)
  }

  /**
   * Remove key of cache
   * @param {array|string|number} key
   */
  protected _remove<K>(key: K): void {
    const realKey = this.generateKey(key)
    this.cacheMap.delete(realKey)
  }
}

/**
 * MemoryCache Cache
 * @param {object} options = {
 *   size {number} Cache size
 *   callback {function} Globle callback function when the key does not exist
 * }
 */
class MemoryCache extends Cache {
  constructor(options = {}) {
    super(options)
  }

  write<K>(key: K, value: any): void {
    this._write(key, value)
  }

  remove<K>(key: K): void {
    this._remove(key)
  }
}

/**
 * StorageCache Cache
 * @param {object} options = {
 *	 namespace {string} Cache key namespace
 *   size {number} Cache size
 *   callback {function} Globle callback function when the key does not exist
 *   storage {function} storage prototype
 * }
 */
class StorageCache extends Cache {
  #storage: Storage
  #storageKey: string

  constructor(options: StorageOptions) {
    super(options)
    this.#storage = options.storage
    this.#storageKey = `${options.namespace || 'cacheJs'}`
    this.init()
  }

  private init(): void {
    const data = this.get()
    if (!data) return
    Object.keys(data).forEach((key: string) => this.cacheMap.set(key, data[key]))
  }

  private get(): CustomMap | null {
    const data = this.#storage.getItem(this.#storageKey)
    return data ? JSON.parse(data) : null
  }

  private set(value: CustomMap): void {
    const strVal = JSON.stringify(value)
    this.#storage.setItem(this.#storageKey, strVal)
  }

  write<K>(key: K, value: any): void {
    this._write(key, value)
    this.set(this.readAll())
  }

  remove<K>(key: K): void {
    this._remove(key)
    this.set(this.readAll())
  }
}

/**
 * SessionStorage Cache
 */
class SessionStorageCache extends StorageCache {
  constructor(options = {} as StorageOptions) {
    options.storage = window.sessionStorage
    super(options)
  }
}

/**
 * LocalStorage Cache
 */
class LocalStorageCache extends StorageCache {
  constructor(options = {} as StorageOptions) {
    options.storage = window.localStorage
    super(options)
  }
}

export { MemoryCache, SessionStorageCache, LocalStorageCache }
