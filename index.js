'use strict';

var path = require('path');
var fs   = require('fs');

function EmberCLIBootstrap(project) {
  this.project = project;
  this.name    = 'Ember CLI Bootstrap';
}

function unwatchedTree(dir) {
  return {
    read:    function() { return dir; },
    cleanup: function() { }
  };
}

EmberCLIBootstrap.prototype.treeFor = function treeFor(name) {
  var treePath = path.join('node_modules/ember-cli-bootstrap', name);

  if (fs.existsSync(treePath)) {
    return unwatchedTree(treePath);
  }
};

EmberCLIBootstrap.prototype.included = function included(app) {
  
  var rootPath            = 'vendor/bootstrap/dist/',
      javascriptsPath     = 'vendor/ember-addons.bs_for_ember/dist/js/',
      env                 = app.env,
      envModifier         = env !== 'production' ? '.max' : '.min', // set modifier for unminified or minified js files.
      fullJavascriptsPath = path.join('node_modules/ember-cli-bootstrap', javascriptsPath),
      jsFiles             = fs.readdirSync(fullJavascriptsPath);

  
  // Import css from bootstrap
  app.import(rootPath + 'css/bootstrap-theme.css');
  app.import(rootPath + 'css/bootstrap.css');
  
    // Import fonts from bootstrap
  app.import(rootPath + 'fonts/glyphicons-halflings-regular.woff');
  app.import(rootPath + 'fonts/glyphicons-halflings-regular.eot');
  app.import(rootPath + 'fonts/glyphicons-halflings-regular.svg');
  app.import(rootPath + 'fonts/glyphicons-halflings-regular.ttf');

  // Import bootstrap_for_ember bs-core before other components
  app.import(javascriptsPath + 'bs-core' + envModifier + '.js');

  // Import remaining bootstrap_for_ember components
  jsFiles.forEach(function(file) {
    var fileName = file.split('.')[0];
    if (fileName !== 'bs-core') {
      app.import(javascriptsPath + fileName + envModifier + '.js');
    }
  })
};

module.exports = EmberCLIBootstrap;
