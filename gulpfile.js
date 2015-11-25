var gulp           = require('gulp');
var concat         = require('gulp-concat');
var concatVendor   = require('gulp-concat-vendor');
var sass           = require('gulp-sass');
var uglify         = require('gulp-uglify');
var minify         = require('gulp-minify-css')
var mainBowerFiles = require('main-bower-files');
var inject         = require('gulp-inject');
var runSequence    = require('gulp-run-sequence');
var gzip           = require('gulp-gzip');
var clone          = require('gulp-clone');
var rename         = require('gulp-rename');
var series         = require('stream-series');
var intercept      = require('gulp-intercept');
var gulpNgConfig   = require('gulp-ng-config');

var appFilesBase = "src/main/resources/app";

var vendorJs;
var vendorCss;
var appJs;
var appCss;
var appSass;
var appSettings;

gulp.task('vendor-js-files', function () {
    vendorJs = gulp.src(mainBowerFiles('**/*.js'),{ base: 'bower_components' })
        .pipe(concat('lib.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('target/classes/static/vendor/js'));

    vendorJs.pipe(clone())
        .pipe(gzip())
        .pipe(gulp.dest('target/classes/static/vendor/js'));
});

gulp.task('vendor-css-files', function () {
    vendorCss = gulp.src(mainBowerFiles('**/*.css'), {base: 'bower_components'})
        .pipe(concat('lib.min.css'))
        .pipe(minify())
        .pipe(gulp.dest('target/classes/static/vendor/css'));

    vendorCss.pipe(clone())
        .pipe(clone())
        .pipe(gzip())
        .pipe(gulp.dest('target/classes/static/vendor/css'));
});

gulp.task('app-js-files', function () {
    appJs = gulp.src([
            appFilesBase + '/*.module.js',
            appFilesBase + '/services/**/*.js',
            appFilesBase + '/**/*.js'
        ], {base: appFilesBase})
        .pipe(concatVendor('app.js'))
        .pipe(gulp.dest('target/classes/static/js'));

    appJs.pipe(clone())
        .pipe(gzip())
        .pipe(gulp.dest('target/classes/static/js'));
});

gulp.task('app-css-files', function() {
    appCss = gulp.src('src/main/resources/static/css/**/*.css')
        .pipe(gulp.dest('target/classes/static/css'));
})

gulp.task('app-sass-files', function() {
    appSass = gulp.src('src/main/resources/static/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('target/classes/static/css'));
});

gulp.task('app-html-tpl-files', function() {
    gulp.src(appFilesBase + "/**/*.tpl.html")
        .pipe(gulp.dest('target/classes/static/partials'));
});
gulp.task('app-img-files', function() {
    gulp.src('src/main/resources/static/img/**/*.*')
        .pipe(gulp.dest('target/classes/static/img'));
});
gulp.task('app-settings', function() {
    appSettings = gulp.src('src/main/resources/application.properties')
        .pipe(intercept(function(file){
            console.log(file.path);
            var jsonObj = {},
                variables = file.contents.toString().split('\r\n'),
                varName = 0,
                varVal = 1;

            variables.forEach(function(variable) {
                var parts = variable.split('='),
                    name = parts[varName];
                jsonObj[name] = parts[varVal];
            })
            file.contents = new Buffer(JSON.stringify(jsonObj));
            return file;
        }))
        .pipe(gulpNgConfig('app.settings'))
        .pipe(gulp.dest('target/classes/static/js'));
});
gulp.task('index', function () {
    var target = gulp.src("src/main/resources/static/index.html");
    var sources = gulp.src(['target/classes/static/*.js', 'target/classes/static/*.css'], {read: false});
    return target.pipe(rename("index.html"))
        .pipe(gulp.dest('target/classes/static'))
        .pipe(inject(series(vendorJs, vendorCss, appSettings, appJs, appCss, appSass, sources), {relative: true}))
        .pipe(gulp.dest('target/classes/static'));
});

gulp.task('copyFonts', function() {
    gulp.src('src/main/resources/static/fonts/*.{ttf,woff,woff2,eof,svg}')
        .pipe(gulp.dest('target/classes/static/fonts'));
});

// Default Task
gulp.task('default', function () {
    runSequence('vendor-js-files', 'vendor-css-files', 'app-js-files', 'app-css-files', 'app-sass-files', 'app-html-tpl-files', 'app-img-files', 'app-settings', 'index', 'copyFonts');
});