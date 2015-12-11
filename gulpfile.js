// get the dependencies
var gulp          = require('gulp'),
    childProcess  = require('child_process'),
    electron      = require('electron-prebuilt'),
    sass          = require('gulp-sass'),
    jetpack       = require('fs-jetpack'),
    usemin        = require('gulp-usemin'),
    uglify        = require('gulp-uglify'),
    projectDir    = jetpack,
    srcDir        = projectDir.cwd('./main'),
    destDir       = projectDir.cwd('./build');

// create the gulp task
gulp.task('run', function () {
    childProcess.spawn(electron, ['.'], { stdio: 'inherit' });
});

gulp.task('sass', function () {
    gulp.src('./main/assets/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./main/assets/css'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./main/assets/sass/**/*.scss', ['sass']);
});

gulp.task('clean', function (callback) {
    return destDir.dirAsync('.', { empty: true });
});

gulp.task('copy', ['clean'], function () {
    return projectDir.copyAsync('./', destDir.path(), {
        overwrite: true,
        matching: [
            './node_modules/**/*',
            './main/lib/jquery/**/*',
            './main/lib/ng-electron/**/*',
            './main/lib/material-design-icons-iconfont/dist/**/*',
            '*.html',
            '*.css',
            'index.js',
            'package.json'
        ]
    });
});

gulp.task('build', ['copy'], function () {
    return gulp.src('./main/index.html')
        .pipe(usemin({
            js: [uglify()],
            app: [uglify()]
        }))
        .pipe(gulp.dest('build/main/'));
});

var release_windows = require('./build.windows');
var os = require('os');
gulp.task('build-electron', ['build'], function () {
    switch (os.platform()) {
        case 'darwin':
            //execute build.osx.js
            break;
        case 'linux':
            //execute build.linux.js
            break;
        case 'win32':
            return release_windows.build();
            break;
    }
});
