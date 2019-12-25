const ghpages = require('gh-pages');

ghpages.publish('dist', function(err) {
  if (err) {
    throw err;
  }

  console.log('build gh-pages finished!')
});
