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
