const glob = require('glob-all');

describe('test generated css and js files', () => {
    it('should generate css and js files', (done) => {
        const files = glob.sync([
            './dist/index_*.js',
            './dist/index_*.css',
            './dist/search_*.js',
            './dist/search_*.js',
        ]);

        if (files.length > 0) {
            done()
        } else {
            throw new Error('no css js files generated');
        }
    })
})