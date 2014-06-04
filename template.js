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
    init.prompt('author_name'),
    init.prompt('identifier', function(value, props, done) {
      done(null, 'pa.' + props.author_name + '.' + props.name)
    }),
    init.prompt('version'),
    init.prompt('forum'),
    init.prompt('licenses', 'Apache-2.0'),
    init.prompt('build'),
    init.prompt('pa_root', process.env.HOME + '/Library/Application Support/Uber Entertainment/Planetary Annihilation/data/streams/stable/PA.app/Contents/Resources/'),
  ], function(err, props) {
    // Files to copy (and process).
    var build = 'ui/main/shared/js/build.js'
    var files = init.filesToCopy(props);
    files[build] = props.pa_root + build

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

var unitFiles = function(grunt, props) {
  var specs = grunt.file.expand({cwd: props.pa_root}, [
    'pa/ammo/**/*.json',
    'pa/tools/**/*.json',
    'pa/units/**/*.json'
  ])
  specs.forEach(function(relpath) {
    var spec = grunt.file.readJSON(props.pa_root + relpath)
    processSpec(spec)
    grunt.file.write(relpath, JSON.stringify(spec, null, 2))
  })
}

var processSpec = function(spec) {
  //if (spec.max_health) {
    //spec.max_health *= 2
  //}
}
