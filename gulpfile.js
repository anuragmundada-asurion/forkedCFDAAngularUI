var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');
var mainBowerFiles = require('main-bower-files');
var inject = require('gulp-inject');
var gzip = require('gulp-gzip');
var clone = require('gulp-clone');
var rename = require('gulp-rename');
var series = require('stream-series');
var wiredep = require('wiredep').stream;
var karmaServer = require('karma').Server;

var appFilesBase = "src/main/webapp/scripts/app";

var ie8VendorDep = ['**/jquery.js'];
var ie9VendorDep = ['**/xdomain.js'];
var unneededDepForMondernBrowsers = ie8VendorDep.concat(ie9VendorDep);

var vendorJs;
var ie8VendorJs;
var ie9VendorJs;
var vendorCss;
var appJs;
var appSass;

gulp.task('app-static-files', function () {
    gulp.src('src/main/webapp/assets/**/*.*')
        .pipe(gulp.dest('target/classes/static'));
});

gulp.task('vendor-js-files', ['app-static-files'], function () {
    var bowerSrc = ['**/*.js'];
    unneededDepForMondernBrowsers.forEach(function (src) {
        bowerSrc.push('!' + src);
    });
    vendorJs = gulp.src(mainBowerFiles(bowerSrc), {base: 'src/main/webapp/bower_components'})
        .pipe(concat('lib.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('target/classes/static/vendor/js'));
});

gulp.task('vendor-font-files', ['vendor-js-files'], function () {
    gulp.src(mainBowerFiles('**/*.{otf,eot,svg,ttf,woff,woff2}'))
        .pipe(gulp.dest('target/classes/static/vendor/fonts'));
});

gulp.task('ie9-vendor-js-files', ['vendor-font-files'], function () {
    ie9VendorJs = gulp.src(mainBowerFiles(ie9VendorDep), {base: 'src/main/webapp/bower_components'})
        .pipe(concat('ie9-lib.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('target/classes/static/vendor/js'));
});

gulp.task('ie8-vendor-js-files', ['ie9-vendor-js-files'], function () {
    ie8VendorJs = gulp.src(mainBowerFiles(ie8VendorDep), {base: 'src/main/webapp/bower_components'})
        .pipe(concat('ie8-lib.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('target/classes/static/vendor/js'));
});

gulp.task('vendor-css-files', ['ie8-vendor-js-files'], function () {
    vendorCss = gulp.src(mainBowerFiles('**/*.css'), {base: 'src/main/webapp/bower_components'})
        .pipe(concat('lib.min.css'))
        .pipe(minify())
        .pipe(gulp.dest('target/classes/static/vendor/css'));
});

gulp.task('app-js-files', ['vendor-css-files'], function () {
    //Read App JS files and combine
    appJs = gulp.src([
            appFilesBase + '/*.bootstrap.js',
            appFilesBase + '/*.module.js',
            appFilesBase + '/services/**/*.js',
            appFilesBase + '/**/*.js'
        ], {base: appFilesBase})
        .pipe(concat('app.js'))
        .pipe(gulp.dest('target/classes/static/js'));
});

gulp.task('app-sass-files', ['app-js-files'], function () {
    appSass = gulp.src('src/main/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('target/classes/static/css'));
});

gulp.task('app-html-tpl-files', ['app-sass-files'], function () {
    gulp.src(appFilesBase + "/**/*.tpl.html")
        .pipe(gulp.dest('target/classes/static/partials'));
});

gulp.task('index', ['app-html-tpl-files'], function () {
    var target = gulp.src("src/main/webapp/assets/index.html");
    var sources = gulp.src(['target/classes/static/*.js', 'target/classes/static/*.css'], {read: false});
    return target.pipe(rename("index.html"))
        .pipe(gulp.dest('target/classes/static'))
        .pipe(inject(series(vendorJs), {relative: true, starttag: '<!-- inject:vendor:{{ext}} -->'}))
        .pipe(inject(series(ie8VendorJs), {relative: true, starttag: '<!--[if lt IE 9]>', endtag: '<![endif]-->'}))
        .pipe(inject(series(ie9VendorJs), {
            relative: true,
            starttag: '<!-- ie9-inject --><!--[if lte IE 9]>',
            endtag: '<![endif]-->'
        }))
        .pipe(inject(series(vendorCss, appJs, appSass, sources), {relative: true}))
        .pipe(gulp.dest('target/classes/static'));
});

gulp.task('gzip', ['index'], function () {
    gulp.src('target/classes/static/**/*.{js,css}')
        .pipe(clone())
        .pipe(gzip())
        .pipe(gulp.dest('target/classes/static'));
});

gulp.task('wiredep', ['wiredep:test']);

gulp.task('wiredep:test', function () {
    return gulp.src('src/test/javascript/karma.conf.js')
        .pipe(wiredep({
            exclude: [/angular-scenario/],
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

gulp.task('test', ['wiredep', 'gzip'], function(done) {
    new karmaServer({
        configFile: __dirname + '/src/test/javascript/karma.conf.js',
        singleRun: true
    }, done).start();
});

// Default Task
gulp.task('default', ['test'], function () {
});