var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    plumber = require("gulp-plumber"),
    rename = require('gulp-rename'),
    reload = browserSync.reload;

var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'build/',
        js: 'build/assets/js/',
        css: 'build/assets/css/',
        img: 'build/assets/img/',
        icons: 'build/assets/icons/',
        fonts: 'build/assets/fonts/'
    },
    src: { //Пути откуда брать исходники
        html: 'src/**/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'src/assets/js/main.js',//В стилях и скриптах нам понадобятся только main файлы
        style: 'src/assets/styles/scss/gradial.scss',
        simpleStyle: 'src/assets/styles/scss/simple.gradial.scss',
        img: 'src/assets/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        icons: 'src/assets/icons/**/*.*',
        fonts: 'src/assets/fonts/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/**/*.html',
        js: 'src/assets/js/**/*.js',
        style: 'src/assets/styles/scss/**/*.scss',
        img: 'src/assets/img/**/*.*',
        icons: 'src/assets/icons/**/*.*',
        fonts: 'src/assets/fonts/**/*.*'
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "Gradial"
};

gulp.task('html:build', function () {
    gulp.src(path.src.html) //Выберем файлы по нужному пути
        .pipe(rigger()) //Прогоним через rigger
        .pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
        .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
});

gulp.task('js:build', function () {
    gulp.src(path.src.js) //Найдем наш main файл
        .pipe(rigger()) //Прогоним через rigger
        .pipe(sourcemaps.init()) //Инициализируем sourcemap
        .pipe(uglify()) //Сожмем наш js
        .pipe(sourcemaps.write()) //Пропишем карты
        .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
        .pipe(reload({stream: true})); //И перезагрузим сервер
});

gulp.task('style:build', function () {
    gulp.src(path.src.style) //Выберем наш main.scss
        .pipe(sourcemaps.init()) //То же самое что и с js
        .pipe(plumber())
        .pipe(sass()) //Скомпилируем
        .pipe(prefixer({
            browsers: ['last 2 versions', 'ie 11', 'Android >= 4.1', 'Safari >= 8', 'iOS >= 8'],
            cascade: false
        })) //Добавим вендорные префиксы
        .pipe(cssmin()) //Сожмем
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css)) //И в build
        .pipe(reload({stream: true}));
});

gulp.task('style.min:build', function () {
    gulp.src(path.src.style) //Выберем наш main.scss
        .pipe(sourcemaps.init()) //То же самое что и с js
        .pipe(plumber())
        .pipe(sass()) //Скомпилируем
        .pipe(prefixer({
            browsers: ['last 2 versions', 'ie 11', 'Android >= 4.1', 'Safari >= 8', 'iOS >= 8'],
            cascade: false
        })) //Добавим вендорные префиксы
        .pipe(cssmin()) //Сожмем
        .pipe(sourcemaps.write())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('simple.style:build', function () {
    gulp.src(path.src.simpleStyle) //Выберем наш main.scss
        .pipe(sourcemaps.init()) //То же самое что и с js
        .pipe(plumber())
        .pipe(sass()) //Скомпилируем
        .pipe(prefixer({
            browsers: ['last 2 versions', 'ie 11', 'Android >= 4.1', 'Safari >= 8', 'iOS >= 8'],
            cascade: false
        })) //Добавим вендорные префиксы
        .pipe(cssmin()) //Сожмем
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css)) //И в build
        .pipe(reload({stream: true}));
});

gulp.task('simple.style.min:build', function () {
    gulp.src(path.src.simpleStyle) //Выберем наш main.scss
        .pipe(sourcemaps.init()) //То же самое что и с js
        .pipe(plumber())
        .pipe(sass()) //Скомпилируем
        .pipe(prefixer({
            browsers: ['last 2 versions', 'ie 11', 'Android >= 4.1', 'Safari >= 8', 'iOS >= 8'],
            cascade: false
        })) //Добавим вендорные префиксы
        .pipe(cssmin()) //Сожмем
        .pipe(sourcemaps.write())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
    gulp.src(path.src.img) //Выберем наши картинки
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img)) //И бросим в build
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('fonts:dist', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.dist.fonts))
});

gulp.task('icons:build', function() {
    gulp.src(path.src.icons)
        .pipe(gulp.dest(path.build.icons))
});

gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'simple.style:build',
    'simple.style.min:build',
    'style.min:build',
    'fonts:build',
    'image:build',
    'icons:build'
]);

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.icons], function(event, cb) {
        gulp.start('icons:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('build:clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'webserver', 'watch']);