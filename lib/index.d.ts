declare const write: unique symbol;
declare const remove: unique symbol;
declare const cacheMap: unique symbol;
declare type Fn<V> = () => V;
interface CacheOptions {
    namespace?: string;
    size?: number;
    callback?: Fn<any>;
    storage?: Storage;
}
interface CustomMap<Value = any> {
    [index: string]: Value;
}
/** Abstract Cache
 * @param {object} options = {
 *	 namespace {string} Cache key namespace
 *   size {number} Cache size
 *   callback {function} Globle callback function when the key does not exist
 * }
 */
declare class Cache {
    #private;
    [cacheMap]: Map<string, any>;
    constructor(options: CacheOptions);
    /**
     * Get cache key namespace
     * @return {string} The key namespace
     */
    generateKey<K>(key: K): string;
    /**
     * Counts the number of items in cache unit
     * @return {number}
     */
    size(): number;
    /**
     * Has key in cache
     * @param {array|string|number} key
     * @return {boolean}
     */
    has<K>(key: K): boolean;
    /**
     * Clear all in cache
     */
    clear(): void;
    /**
     * Read all data
     * @param {mixed} defaultValue
     * @return {object}
     */
    readAll(defaultValue?: CustomMap): CustomMap;
    /**
     * Read value of key in cache
     * @param {array|string|number} key
     * @param {function} callback Callback function when the key does not exist
     * @return {mixed}
     */
    read<K>(key: K, callback?: Fn<any>): any;
    /**
     * Write in cache
     * @param {array||string||number} key
     * @param {mixed} value
     * @return The key
     */
    [write]<K>(key: K, value: any): void;
    /**
     * Remove key of cache
     * @param {array||string||number} key
     */
    [remove]<K>(key: K): void;
}
/**
 * MemoryCache Cache
 * @param {object} options = {
 *   size {number} Cache size
 *   callback {function} Globle callback function when the key does not exist
 * }
 */
declare class MemoryCache extends Cache {
    constructor(options: CacheOptions);
    write<K>(key: K, value: any): void;
    remove<K>(key: K): void;
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
declare class StorageCache extends Cache {
    #private;
    constructor(options: CacheOptions);
    private init;
    private get;
    private set;
    write<K>(key: K, value: any): void;
    remove<K>(key: K): void;
}
/**
 * SessionStorage Cache
 */
declare class SessionStorageCache extends StorageCache {
    constructor(options: CacheOptions);
}
/**
 * LocalStorage Cache
 */
declare class LocalStorageCache extends StorageCache {
    constructor(options: CacheOptions);
}
export { MemoryCache, SessionStorageCache, LocalStorageCache };
