var gulp           = require('gulp');
var concat         = require('gulp-concat');
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

var appFilesBase = "src/main/resources/app";

var vendorJs;
var vendorCss;
var appJs;
var appSass;

gulp.task('vendor-js-files', function () {
    vendorJs = gulp.src(mainBowerFiles('**/*.js'),{ base: 'bower_components' })
        .pipe(concat('lib.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('target/classes/static/vendor/js'));
});

gulp.task('vendor-css-files', function () {
    vendorCss = gulp.src(mainBowerFiles('**/*.css'), {base: 'bower_components'})
        .pipe(concat('lib.min.css'))
        .pipe(minify())
        .pipe(gulp.dest('target/classes/static/vendor/css'));
});

gulp.task('app-js-files', function () {
    //Read App JS files and combine
    appJs = gulp.src([
            appFilesBase + '/*.module.js',
            appFilesBase + '/services/**/*.js',
            appFilesBase + '/**/*.js'
        ], {base: appFilesBase})
        .pipe(concat('app.js'))
        .pipe(gulp.dest('target/classes/static/js'));
});

gulp.task('app-static-files', function() {
    gulp.src('src/main/resources/static/**/*.*')
        .pipe(gulp.dest('target/classes/static'));
    gulp.src('src/main/resources/*.*')
        .pipe(gulp.dest('target/classes'));
})

gulp.task('app-sass-files', function() {
    appSass = gulp.src('src/main/resources/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('target/classes/static/css'));
});

gulp.task('app-html-tpl-files', function() {
    gulp.src(appFilesBase + "/**/*.tpl.html")
        .pipe(gulp.dest('target/classes/static/partials'));
});
gulp.task('index', function () {
    var target = gulp.src("src/main/resources/static/index.html");
    var sources = gulp.src(['target/classes/static/*.js', 'target/classes/static/*.css'], {read: false});
    return target.pipe(rename("index.html"))
        .pipe(gulp.dest('target/classes/static'))
        .pipe(inject(series(vendorJs), { relative: true, starttag: '<!-- inject:vendor:{{ext}} -->'}))
        .pipe(inject(series(vendorCss, appJs, appSass, sources), {relative: true}))
        .pipe(gulp.dest('target/classes/static'));
});

gulp.task('gzip', function() {
    gulp.src('target/classes/static/**/*.{js,css}')
        .pipe(clone())
        .pipe(gzip())
        .pipe(gulp.dest('target/classes/static'));
})

// Default Task
gulp.task('default', function () {
    runSequence('app-static-files', 'vendor-js-files', 'vendor-css-files', 'app-js-files', 'app-sass-files', 'app-html-tpl-files', 'index', 'gzip');
});