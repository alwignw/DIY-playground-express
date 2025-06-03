import Memcached from 'memcached'


const memcached = new Memcached('localhost:11211', {
    retries: 10,
    retry: 10000,
    remove: true
  });


export {memcached}