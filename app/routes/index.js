import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { readOnly } from '@ember/object/computed';

export default Route.extend({
  config: service(),
  test: readOnly('config.test'),

  beforeModel() {
    this.get('test');
  },
});

// Elements required to leak memory:
// 1. A computed property that reads from
// 2. an injected service
// 3. that is a proxy
// 4. to `getOwner(this).factoryFor('config:environment').class`
// 5. in a FastBoot server
//
// ad 1. doing `this.get('config.test')` directly does not leak memory
// ad 2. creating proxy directly in Route's init() method does not leak memory
//   (i.e. `this.set('config', ObjectProxy.create({ content: getOwner(this).factoryFor('config:environment').class }));`)
// ad 3. replacing ObjectProxy with EmberObject (and then reading from 'config.content.test') does not leak memory
// ad 4. setting proxy content to a direct config import (i.e. `import env from '../config/environment'; this.set('content', env);`) does not leak memory
// ad 5. it seems that the app instance (or some part of it) is leaked, so unless new instances are created - there's no "leak"
