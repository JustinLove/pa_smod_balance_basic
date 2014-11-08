'use strict';

// Basic template description.
exports.description = 'Create a minimal mod for Planitary Annihilation';

// Template-specific notes to be displayed before question prompts.
//exports.notes = ''

// Template-specific notes to be displayed after question prompts.
exports.after = "For further modding info, check out the forums." +
  "\n\n" +
  "https://forums.uberent.com/threads/pa-modding-reference-guides-applications-tools.48136/" +
  "https://forums.uberent.com/threads/guide-getting-your-mod-on-pamm.55189/";

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = '*';



// The actual init template.
exports.template = function(grunt, init, done) {
  init.process({type: 'grunt'}, [
    // Prompt for these values.
    init.prompt('name'),
    init.prompt('title'),
    init.prompt('description', 'The best PA mod ever.'),
    init.prompt('category', '"change", "me"'),
    init.prompt('author_name'),
    init.prompt('author_identifier', function(value, props, done) {
      done(null, 'pa.' + props.author_name + '.')
    }),
    init.prompt('identifier', function(value, props, done) {
      done(null, props.author_identifier + props.name)
    }),
    init.prompt('version'),
    init.prompt('licenses', 'Apache-2.0'),
    init.prompt('stream', 'stable'),
    init.prompt('resource_root', function(value, props, done) {
      done(null, resourcePath(props.stream))
    }),
    init.prompt('build', function(value, props, done) {
      var versionPath = props.resource_root + '../version.txt'
      done(null, grunt.file.read(versionPath).trim())
    }),
    init.prompt('filename_regexp'),
    init.prompt('include_build', 'Y'),
  ], function(err, props) {
    // Files to copy (and process).
    var files = init.filesToCopy(props);

    if (props.include_build == 'Y') {
      var build = 'ui/main/shared/js/build.js'
      files[build] = props.resource_root + build
    }

    // Add properly-named license files.
    init.addLicenseFiles(files, props.licenses);

    // Actually copy (and process) files.
    init.copyAndProcess(files, props);

    // Generate package.json file.
    //init.writePackageJSON('package.json', props);

    unitFiles(grunt, props)

    // All done!
    done();
  });

};

var localPath = function() {
  // borrowed from PAMM-Atom
  if(process.platform === 'win32') {
    return process.env.LOCALAPPDATA.replace(/\\/g,"/");
  }
  else if(process.platform === 'linux') {
    return process.env.HOME + "/.local"
  }
  else if(process.platform === 'darwin') {
    return process.env.HOME + "/Library/Application Support"
  }
  else {
    // the user can change it anyway
    return process.env.HOME + "/.local"
  }
}

var paPath = function() {
  return localPath() + '/Uber Entertainment/Planetary Annihilation'
}

var resourcePath = function(stream) {
  if(process.platform === 'win32') {
    return paPath() + '/data/streams/' + stream + '/media/' // ????
  }
  else if(process.platform === 'linux') {
    return paPath() + '/' + stream + '/media/' // ????
  }
  else if(process.platform === 'darwin') {
    return paPath() + '/data/streams/' + stream +'/PA.app/Contents/Resources/media/'
  }
  else {
    // the user can change it anyway
    return paPath() + '/data/streams/' + stream + '/media/'
  }
}

var unitFiles = function(grunt, props) {
  var filter = new RegExp(props.filename_regexp, '')
  var specs = grunt.file.expand({cwd: props.resource_root}, [
    'pa/ammo/**/*.json',
    'pa/tools/**/*.json',
    'pa/units/**/*.json'
  ])
  specs.forEach(function(relpath) {
    if (filter.test(relpath)) {
      var spec = grunt.file.readJSON(props.resource_root + relpath)
      processSpec(spec)
      grunt.file.write(relpath, JSON.stringify(spec, null, 2))
    }
  })
}



var processSpec = function(spec) {
  //if (spec.max_health) {
    //spec.max_health *= 2
  //}
}
