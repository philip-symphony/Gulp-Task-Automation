//------------------------------------------------------------------------------
// Dependencies
//------------------------------------------------------------------------------
var gulp = require('gulp');

var autoprefixer    = require('gulp-autoprefixer'),
    browsersync     = require('browser-sync'),
    cache           = require('gulp-cached'),
    concat          = require('gulp-concat'),
    filter          = require('gulp-filter'),
    imagemin        = require('gulp-imagemin'),
    jshint          = require('gulp-jshint'),
    notify          = require('gulp-notify'),
    plumber         = require('gulp-plumber'),
    rename          = require('gulp-rename'),
    sass            = require('gulp-sass'),
    servestatic     = require('serve-static'),
    sourcemaps      = require('gulp-sourcemaps'),
    uglify          = require('gulp-uglify');

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

// Development URL
var devUrl = 'https://demo.example-site.com';

// Local file paths
var src     = 'src',
    dest    = 'app';

// Supported browsers
var browserSupport = {
    browsers: [
        'last 2 version',
        'safari 5',
        'ie 9',
        'ios 6',
        'android 4'
    ]
};

//------------------------------------------------------------------------------
// BrowserSync task
//------------------------------------------------------------------------------
gulp.task('browsersync', function() {
    browsersync.init({
        notify: false,
        // Proxy dev site
        proxy: devUrl,
        https: true,
        // Inject local files
        rewriteRules: [
            {
                match: new RegExp('https://s3.amazonaws.com/sneakpeeq-sites/example-site/styles/main.css'),
                fn: function() {
                    return 'main.css';
                }
            }
        ],
        files: 'app/css/*.css',
        middleware: servestatic('./app/css')
    });
});

//------------------------------------------------------------------------------
// Error handling
//------------------------------------------------------------------------------
function onError(error) {
    var errorTitle = '[' + error.plugin + ']',
        errorString = error.message;

    if (error.lineNumber) {
        errorString += ' on line ' + error.lineNumber;
    }
    if (error.fileName) {
        errorString += ' in ' + error.fileName;
    }

    notify.onError({
        title:    errorTitle,
        message:  errorString,
        sound:    "Beep"
    })(error);
    this.emit('end');
}

//------------------------------------------------------------------------------
// Styles task
//------------------------------------------------------------------------------
gulp.task('styles', function() {
    return gulp.src(src + '/scss/**/*.scss')
    .pipe(plumber({errorHandler: onError}))

    // Compile
    .pipe(sourcemaps.init())
    .pipe(sass({
        outputStyle: 'compressed'
    }))
    .pipe(sourcemaps.write())

    // Autoprefixer
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(autoprefixer( browserSupport ))
    .pipe(sourcemaps.write())

    // Write css
    .pipe(gulp.dest(dest + '/css'))

    // CSS Injection
    .pipe(filter('**/*.css'))
    .pipe(browsersync.reload({ stream: true }))

    // Notification
    .pipe(notify({ message: 'Styles task complete' }));
});

//------------------------------------------------------------------------------
// Scripts task
//------------------------------------------------------------------------------
gulp.task('scripts', function() {
    return gulp.src(src + '/js/**/*.js')

    // Compile
    .pipe(jshint())

    // Error Handling
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))

    .on('error', function(error) {
        var errorTitle = '[' + error.plugin + ']',
            errorString = error.message;

        notify.onError({
            title:    errorTitle,
            message:  errorString,
            sound:    "Beep"
        })(error);
        this.emit('end');
    })

    // Concat
    .pipe(concat('main.js'))
    .pipe(gulp.dest(dest + '/js'))

    // Minify
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(dest + '/js'))

    // Notification
    .pipe(notify({ message: 'Scripts task complete' }));
});

//------------------------------------------------------------------------------
// Images task
//------------------------------------------------------------------------------
gulp.task('images', function() {
    return gulp.src(src + '/images/**/*')
    .pipe(plumber({errorHandler: onError}))

    // Compress & cache
    .pipe(cache('images'))

    .pipe(imagemin({
        optimizationLevel: 3,
        progressive: true,
        interlaced: true
    }))
    .pipe(gulp.dest(dest + '/images'))

    // Notification
    .pipe(notify({ message: 'Images task complete' }));
});

//------------------------------------------------------------------------------
// Default task
//------------------------------------------------------------------------------
gulp.task('default', ['styles', 'scripts', 'images']);

//------------------------------------------------------------------------------
// Watch task
//------------------------------------------------------------------------------
gulp.task('watch', function() {
    gulp.watch(src + '/scss/**/*.scss', ['styles']);
    gulp.watch(src + '/js/**/*.js', ['scripts']);
    gulp.watch(src + '/images/**/*', ['images']);
});

//------------------------------------------------------------------------------
// Browser Sync task [bsync]
//------------------------------------------------------------------------------
gulp.task('bsync', ['browsersync'], function() {
    gulp.watch(src + '/scss/**/*.scss', ['styles']);
    gulp.watch(src + '/js/**/*.js', ['scripts']);
    gulp.watch(src + '/images/**/*', ['images']);
});
