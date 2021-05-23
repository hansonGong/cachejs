## fe-cache

A front-end lightweight caching library. You can use MemoryCache, SessionStorageCache and LocalStorageCache to build a cache system in JS applications.
### Installation

```
// npm
$ npm i --save fe-cache

// yarn
$ yarn add fe-cache

// using
import { MemoryCache } from 'fe-cache'

const options = {
  size: 10,
  callback: () => 'Global default value'
}
const cache = new MemoryCache(options)
// write
cache.write([123, 'test'], 'array')
// read
const val = cache.read([123, 'test'])
// size
if (cache.size()) {
  // clear
  cache.clear()
  console.log(cache.readAll('defalut value'))
}

```

### Browser

```
<script type="text/javascript" src="cache.min.js"></script>
<script>
  var options = {
    namespace: 'main',
    size: 10,
    callback: function() {
      return 'Global default value'
    }
  }
  var cache = new feCache.LocalStorageCache(options)
  cache.write('test', 'string')
  var val = cache.read('cachejs', function() { return 'Local default value' })
  // has
  if (cache.has('test')) {
    console.log(val)
    // remove
    cache.remove('test')
  }
</script>

```

### Options parameter description

| Parameter | Type | Description | Default |
| :-------: | :--: | :---------: | :-----: |
| namespace | String | Key when saving SessionStorage or LocalStorage | "cacheJs" |
| size | Number | Maximum number of cacheJs | 30 |
| callback | Function | Return the global default value when the key does not exist | undefined |

