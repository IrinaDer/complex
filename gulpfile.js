var requireDir = require('require-dir');
var gulp = require('gulp');
var notify = require('gulp-notify');
var concatCss = require('gulp-concat-css');
var rename = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var jade = require('jade');
var gulpJade = require('gulp-jade');
var pug = require('pug');
var gulpPug = require('gulp-pug');
var autoprefixer = require('gulp-autoprefixer');
var streamqueue = require('streamqueue');
var browserSync = require('browser-sync');
var babel = require('gulp-babel');
$ = require('gulp-load-plugins')();

var project = require('./project.conf');

gulp.task('default', function() {
    return gulp.src('./').pipe(notify('\r\n' +
        'build - compile project\r\n' +
        'unBuild - remove project folder'));
});

gulp.task('unBuild', function() {
    return gulp.src('public', { read: false })
        .pipe(clean());
});

/**
 * Билд всего проекта
 * Build all project
 */
gulp.task('build', ['templates', 'build-css', 'build-font', 'build-bower', 'build-js', 'build-img', 'gDir']);
gulp.task('run', ['templates', 'build-css', 'build-js', 'gDir', 'browser-sync', 'watch'])

gulp.task('templates', function() {
    return gulp.src('./common/template/*.pug')

        .pipe(gulpPug({
            pretty: true
        }))
        .pipe(gulp.dest(project.build))
        .pipe(browserSync.stream());
});

gulp.task('gDir', function() {
    return gulp.src(['./common/template/*.*', '!./common/template/*.pug'])
        .pipe(gulp.dest(project.build))
        .pipe(browserSync.stream());
});
gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: "complex/public"
    });
});
/**
 * Билд common/css проекта
 * Build common/css in project
 */
gulp.task('build-css', function() {
    var buildCss = gulp.src('./common/css/**/*.css')
        .pipe(autoprefixer({
            browsers: ['last 15 versions', 'Explorer > 8'],
            cascade: false
        }))
        .pipe($.concat('assets/css/style.css'))
        .pipe(minifyCSS())
        .pipe(rename('assets/css/main.min.css'))
        .pipe(gulp.dest(project.build + '/'))
    //.pipe(browserSync.stream());

    return function() {
        buildCss;
    };
});

/**
 * Билд common/js проекта
 * Build common/js in project
 */


// gulp.task('babel', function() {
//     gulp.src('./common/js/class/sectionClass.js')
//         .pipe(babel({
//             presets: ["es2015"]
//         }))
//         .pipe(gulp.dest('./common/js/'))
// });



gulp.task('build-js', function() {
    // var buildJs = gulp.src('./common/js/**/*.js')
    /*
     .pipe(concat('main.js'))
     .pipe(uglify())
     .pipe(rename('main.min.js'))
     .pipe(gulp.dest(project.build + '/assets/js/'));

     return function () {
     buildJs;
     };
     */
    gulp.src(['./common/js/**/*.js', './common/js/*.js'])
        .pipe(concat('main.js'))
        //.pipe(uglify())
        .pipe(rename('main.min.js'))
        .pipe(gulp.dest(project.build + '/assets/js/'))
    //.pipe(browserSync.stream());
});






/**
 * Билд common/libs/js проекта
 * Build common/libs/js in project
 */
gulp.task('build-bower', function() {
    var buildBowerJs = gulp.src(project.src.vendorJs)
        .pipe($.concat('vendor.js'))
        .pipe(uglify())
        .pipe(rename('vendor.min.js'))
        .pipe(gulp.dest(project.build + '/assets/libs/js'));

    var buildBowerCss = streamqueue({ objectMode: true },
        gulp.src(project.src.vendorCss)
    )
    //.pipe($.newer(project.build + '/assets/libs/css/vendor.css'))
        .pipe($.concat('vendor.css'))
        .pipe(autoprefixer({
            browsers: ['last 15 versions', 'Explorer > 8'],
            cascade: false
        }))
        //.pipe(concatCss('assets/libs/css/vendor.css', {targetFile: './gg/gg/',inlineImports: false, rebaseUrls: false, includePaths: './erer/'}))
        .pipe(minifyCSS())
        .pipe(rename('vendor.min.css'))
        .pipe(gulp.dest(project.build + '/assets/libs/css'));

    var buildBowerCssRelated = {};
    var settings = project.src.vendorCssRelated;
    for (key in settings) {
        buildBowerCssRelated[key] = gulp.src(settings[key].dir)
            .pipe(gulp.dest(project.build + '/assets/libs/css' + settings[key].place));
    }

    return function() {
        buildBowerJs;
        buildBowerCss;
        buildBowerCssRelated;
    };
});

/**
 * Билд common/img проекта
 * Build common/img in project
 */
gulp.task('build-img', function() {
    var buildImg = gulp.src('./common/img/**/**')
        .pipe(gulp.dest(project.build + '/assets/img/'))
        .pipe(browserSync.stream());
    return function() {
        buildImg;
    };
});

/**
 * Билд common/fonts проекта
 * Build common/fonts in project
 */
/*
 var settings = {
 'opensans':{
 src:'open-sans'
 }
 };*/
var settings = project.src.fonts;
gulp.task('build-font', function() {
    var buildFontCss = {};
    for (key in settings) {
        buildFontCss[key] = gulp.src('./common/fonts/' + settings[key] + '/*.css')
            .pipe($.concat('assets/fonts/' + settings[key] + '/stylesheet.css'))
            .pipe(minifyCSS())
            .pipe(rename('stylesheet.min.css'))
            .pipe(gulp.dest(project.build + '/assets/fonts/' + settings[key] + '/'))
            .pipe(browserSync.stream());
    }

    var buildFont = gulp.src('./common/fonts/**/**').pipe(gulp.dest(project.build + '/assets/fonts/')).pipe(browserSync.reload({ stream: true }));

    return function() {
        buildFont;
        buildFontCss;
    };

});

gulp.task('watch', function() {
    gulp.watch('common/js/**/*.js', ['build-js']).on('change', browserSync.reload);
    gulp.watch('common/template/**/*', ['templates']).on('change', browserSync.reload);
    gulp.watch('common/fonts/**/*', ['build-font']).on('change', browserSync.reload);
    gulp.watch('common/css/**/*', ['build-css']).on('change', browserSync.reload);
    gulp.watch('common/img/**/*', ['build-img']).on('change', browserSync.reload);
});