require('events').EventEmitter.prototype._maxListeners = 25;

var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var cleanCss = require('gulp-clean-css');
var mainBowerFiles = require('main-bower-files');
var inject = require('gulp-inject');
var rename = require('gulp-rename');
var series = require('stream-series');
var merge = require('merge-stream');
var templateCache = require('gulp-angular-templatecache');
var wiredep = require('wiredep').stream;
var karmaServer = require('karma').Server;
var flatten = require('gulp-flatten');
var cssPrefix = require('gulp-css-prefix');

var appFilesBase = 'src/main/webapp/app';
var assetFilesBase = 'src/main/webapp/assets';
var ie8VendorDep = ['**/jquery.js'];
var ie9VendorDep = ['**/xdomain.js'];
var unneededDepForMondernBrowsers = ie8VendorDep.concat(ie9VendorDep);

var index;

gulp.task('assets', function() {
    gulp.src('src/main/webapp/assets/**/*.*')
        .pipe(gulp.dest('target/classes/static'));
});

gulp.task('index', function() {
    index = gulp.src('src/main/webapp/assets/index.html')
        .pipe(gulp.dest('target/classes/static'));
});

gulp.task('ie', ['index'], function() {
    var ie9VendorJs = gulp.src(mainBowerFiles(ie9VendorDep), {base: 'src/main/webapp/bower_components'})
        .pipe(concat('ie9-lib.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('target/classes/static/js'));

    var ie8VendorJs = gulp.src(mainBowerFiles(ie8VendorDep), {base: 'src/main/webapp/bower_components'})
        .pipe(concat('ie8-lib.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('target/classes/static/js'));

    index.pipe(inject(series(ie8VendorJs), { addRootSlash: true, relative: true, starttag: '<!--[if lt IE 9]>', endtag: '<![endif]-->'}))
        .pipe(inject(series(ie9VendorJs), { addRootSlash: true, relative: true, starttag: '<!--[if IE 9]>', endtag: '<![endif]-->' }))
        .pipe(gulp.dest('target/classes/static'));
});

gulp.task('base', ['index'], function() {

    // var baseCss = gulp.src('src/main/scss/uswds/all.scss')
    //     .pipe(sass().on('error', sass.logError))
    //     .pipe(rename('base.css'))
    //     .pipe(gulp.dest('target/classes/static/css'));

    // index.pipe(inject(baseCss, { name: 'base', addRootSlash: true, relative: true }))
    //     .pipe(gulp.dest('target/classes/static'));
});

gulp.task('vendor', ['index'], function() {
    gulp.src(mainBowerFiles('**/*.{otf,eot,ttf,woff,woff2}'), {base: 'src/main/webapp/bower_components'})
        .pipe(flatten())
        .pipe(gulp.dest('target/classes/static/fonts'));

    var vendorCss = gulp.src(mainBowerFiles('**/*.css'), {base: 'src/main/webapp/bower_components'})
        .pipe(concat('vendor.min.css'))
        .pipe(cleanCss())
        .pipe(gulp.dest('target/classes/static/css'));

    var bowerSrc = ['**/*.js'];
    unneededDepForMondernBrowsers.forEach(function (src) {
        bowerSrc.push('!' + src);
    });
    var vendorJs = gulp.src(mainBowerFiles(bowerSrc), {base: 'src/main/webapp/bower_components'})
        .pipe(concat('lib.min.js'))
        .pipe(gulp.dest('target/classes/static/js'));

    index.pipe(inject(vendorCss, { addRootSlash: true, name: 'vendor', relative: true }))
        .pipe(inject(vendorJs, { addRootSlash: true, name: 'vendor', relative: true }))
        .pipe(gulp.dest('target/classes/static'));
});

gulp.task('plugins', ['index'], function() {
    var pluginsCss = gulp.src(['src/main/webapp/plugins/**/*.css', '!src/main/webapp/plugins/iae-widgets/css/*.css'], {base: './src/main/webapp/plugins'})
        .pipe(concat('plugins.css'))
        .pipe(cleanCss())
        .pipe(gulp.dest('target/classes/static/css'));

    var pluginsJs = gulp.src('src/main/webapp/plugins/**/*.js', {base: './src/main/webapp/plugins'})
        .pipe(concat('plugins.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('target/classes/static/js'));

    index.pipe(inject(pluginsCss, { addRootSlash: true, name: 'plugins', relative: true }))
        .pipe(inject(pluginsJs, { addRootSlash: true, name: 'plugins', relative: true }))
        .pipe(gulp.dest('target/classes/static'));
});

gulp.task('iae', ['index'], function() {
    gulp.src('src/main/webapp/plugins/iae-widgets/fonts/**/*')
        .pipe(gulp.dest('target/classes/static/fonts'));

    gulp.src('src/main/webapp/plugins/iae-widgets/data/*.*')
        .pipe(gulp.dest('target/classes/static/data'));

    gulp.src('src/main/webapp/plugins/iae-widgets/img/*.*')
        .pipe(gulp.dest('target/classes/static/img'));

    var allCss = gulp.src(['src/main/scss/uswds/uswds-theme.scss','src/main/webapp/plugins/iae-widgets/css/iae-all.css'])
        .pipe(sass().on('error', sass.logError))
        .pipe(cssPrefix({parentClass: 'theme-iae'}))
        .pipe(gulp.dest('target/classes/static/css'));

    var ieCss = gulp.src('src/main/webapp/plugins/iae-widgets/css/iae-all-ie-only.css')
        .pipe(cssPrefix({parentClass: 'theme-iae'}))
        .pipe(gulp.dest('target/classes/static/css'));

    index.pipe(inject(ieCss, { addRootSlash: true, relative: true, starttag: '<!--[if lte IE 9]>', endtag: '<![endif]-->'}))
        .pipe(inject(allCss, { addRootSlash: true, name: 'iae', relative: true }))
        .pipe(gulp.dest('target/classes/static'));
});

gulp.task('semantic', ['index'], function(){

  gulp.src(['src/main/semantic/dist/**/*','!src/main/semantic/dist/semantic.css','!src/main/semantic/dist/semantic.js' ])
      .pipe(gulp.dest('target/classes/static/semantic'));

  var sources = gulp.src(['src/main/semantic/dist/semantic.css', 'src/main/semantic/dist/semantic.js'])
      .pipe(gulp.dest('target/classes/static/semantic'));

  index.pipe(inject(sources, { addRootSlash: true, name: 'semantic', relative: true }))
    .pipe(gulp.dest('target/classes/static'));

});

gulp.task('cfda', ['index'], function() {
    var cfdaCss = gulp.src('src/main/scss/main.scss')
        .pipe(sass().on('error', sass.logError))
        // .pipe(cleanCss({processImport: false}))
        .pipe(rename('cfda.min.css'))
        .pipe(gulp.dest('target/classes/static/css'));

    var js = gulp.src([
        appFilesBase + '/*.bootstrap.js',
        appFilesBase + '/*.module.js',
        appFilesBase + '/services/**/*.js',
        appFilesBase + '/**/*.js'
    ], {base: appFilesBase});

    var htmlTemplates = gulp.src(appFilesBase + "/**/*.tpl.html")
        .pipe(templateCache({
            module: 'app'
        }));

    var cfdaJs = merge(js, htmlTemplates)
        .pipe(concat('cfda.js'))
        .pipe(gulp.dest('target/classes/static/js'));

    //index.pipe(inject(cfdaCss, { addRootSlash: true, name: 'cfda', relative: true }))
    index.pipe(inject(cfdaJs, { addRootSlash: true, name: 'cfda', relative: true }))
        .pipe(gulp.dest('target/classes/static'));
});

gulp.task('package', ['assets', 'ie', 'base', 'vendor', 'plugins', 'cfda', 'iae', 'semantic'], function() {
});

gulp.task('test-dependencies', function() {
    gulp.src('src/test/javascript/karma.conf.js')
        .pipe(wiredep({
            ignorePath: /\.\.\/\.\.\//, // remove ../../ from paths of injected javascripts
            devDependencies: true,
            fileTypes: {
                js: {
                    block: /(([\s\t]*)\/\/\s*bower:*(\S*))(\n|\r|.)*?(\/\/\s*endbower)/gi,
                    detect: {
                        js: /'(.*\.js)'/gi
                    },
                    replace: {
                        js: '\'{{filePath}}\','
                    }
                }
            }
        }))
        .pipe(gulp.dest('src/test/javascript'));
});

gulp.task('test', ['test-dependencies'], function(done) {
    new karmaServer({
        configFile: __dirname + '/src/test/javascript/karma.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task('watch', function(){
    gulp.watch([
        appFilesBase + '/*.bootstrap.js',
        appFilesBase + '/*.module.js',
        appFilesBase + '/services/**/*.js',
        appFilesBase + '/**/*.js',
        appFilesBase + '/**/**/*.html',
        assetFilesBase + '/*.html',
        assetFilesBase + '/**/*',
        'src/main/scss/**/*.scss'
    ],{ //slow down CPU Usage
        interval: 500,
        debounceDelay: 500, // default 500
        mode: 'poll'
    }, ['package']);
});

gulp.task('default', ['package'], function () {
});
