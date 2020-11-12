const assert = require('assert');

describe('webpack base test', () => {
    const baseConfig = require('../../lib/webpack.base.config.js');
    it('entry', () => {
        const entry = baseConfig.entry;
        console.log(entry['index'], entry['search']);
        assert.equal(entry['index'].indexOf('/smoke/template/src/index/index.js') > -1, true)
        assert.equal(entry['search'].indexOf('/smoke/template/src/search/index.js') > -1, true)
    })
})