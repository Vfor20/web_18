// Підключаємо gulp
var gulp = require('gulp');

// Додаткові плагіни Gulp
var sass = require('gulp-sass')(require('sass')); // Конвертує SASS в CSS
var concat = require("gulp-concat"); // Об'єднання файлів - конкатенація
var uglify = require("gulp-uglify"); // Мінімізація JavaScript
var rename = require("gulp-rename"); // Перейменування файлів
var imagemin = require('gulp-imagemin'); // Стиснення зображень
var browserSync = require('browser-sync').create();

// Створюємо тестовий таск
gulp.task('testTask', function(done) {
    console.log('This is a test task!');
    done();
});

// Запуск тасків за замовчуванням
gulp.task('default', gulp.series('testTask'));

// копіювання HTML файлів в папку dist
gulp.task("html", function () {
    return gulp.src("src/*.html")
        .pipe(gulp.dest("dist"));
});

// об'єднання, компіляція Sass в CSS, додавання префіксів і подальша мінімізація коду
gulp.task("sass", function () {
    return gulp.src("src/sass/*.scss")
        .pipe(concat('styles.scss'))
        .pipe(sass().on('error', sass.logError))
        .pipe(rename( 'styles.min.css'))
        .pipe(gulp.dest("dist/css"));
});

// об'єднання і стиснення JS-файлів
gulp.task("scripts", function () {
    return gulp.src("src/js/*.js") //вихідна директорія файлів
        .pipe(concat('scripts.js')) // конкатенація js-файлів в один
        .pipe(uglify()) //стиснення коду
        .pipe(rename({ suffix: '.min' })) //перейменування файлу з приставкою .min
        .pipe(gulp.dest("dist/js")); // директорія продакшена
});

// стискання зображень
gulp.task('imgs', function () {
    return gulp.src("src/images/*.+(jpg|jpeg|png|gif)", {
        encoding: false,
    })
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            interlaced: true
        }))
        .pipe(gulp.dest("dist/images"));
});

gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: "dist/"
        }
    })
});

// відстежування за змінами у файлах
gulp.task("watch", function () {
    gulp.watch("src/*.html", gulp.series("html"));
    gulp.watch("src/js/*.js", gulp.series("scripts"));
    gulp.watch("src/sass/*.scss", gulp.series("sass"));
    gulp.watch("src/images/*.+(jpg|jpeg|png|gif)", gulp.series("imgs"));
});

// Запуск тасків за замовчуванням
gulp.task("default", gulp.parallel("html", "sass", "scripts", "imgs", "watch"));

exports.default = gulp.series(gulp.series("default"));
exports.sass = gulp.series(gulp.series("sass"));
exports.scripts = gulp.series(gulp.series("scripts"));
exports.imgs = gulp.series(gulp.series("imgs"));
exports.watch = gulp.series(gulp.series("watch"));
exports.browserSync = gulp.series(gulp.series("browser-sync"));
