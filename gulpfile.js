'use strict';

/* require needed modules */
var gulp = require('gulp'),
		watch = require('gulp-watch'),
		prefixer = require('gulp-autoprefixer'),
		uglify = require('gulp-uglify'),
		stylus = require('gulp-stylus'),
		sourcemaps = require('gulp-sourcemaps'),
		rigger = require('gulp-rigger'),
		cssmin = require('gulp-minify-css'),
		imagemin = require('gulp-imagemin'),
		pngquant = require('imagemin-pngquant'),
		rimraf = require('rimraf'),
		browserSync = require("browser-sync"),
		reload = browserSync.reload;

/* Set all path */
var path = {
		/* builds path */
		build: {
				html: '',
				js: 'dist/js/',
				css: 'dist/css/',
				img: 'assets/img/'
		},
		/* source path */
		src: {
				html: 'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
				js: 'src/js/luna-menu.min.js',//В стилях и скриптах нам понадобятся только main файлы
				style: 'src/style/main.styl',
				img: 'src/img/**/*.*'
		},
		/* watching for this files */
		watch: {
				html: 'src/**/*.html',
				js: 'src/js/**/*.js',
				style: 'src/style/**/*.styl',
				img: 'src/img/**/*.*',
		},
		clean: './build'
};

/* our Dev server */
var config = {
		server: {
				baseDir: "./"
		},
		tunnel: true,
		host: 'localhost',
		port: 8081,
		logPrefix: "Frontend_Devil"
};

/* Supported broser for prefixer */
var SupportedBrowsers = {
	browsers: [
		'last 25 versions'
	]
}


/* Build html */
gulp.task('html:build', function () {
		/* Выберем файлы по нужному пути */
		gulp.src(path.src.html)
				/* go by rigger */
				.pipe(rigger())
				/* flush to builds */
				.pipe(gulp.dest(path.build.html))
				/* reload devserver */
				.pipe(reload({stream: true}));
});

/* Build JS */
gulp.task('js:build', function () {
		gulp.src(path.src.js) //Найдем наш main файл
				.pipe(rigger()) //Прогоним через rigger
				.pipe(sourcemaps.init()) //Инициализируем sourcemap
				.pipe(uglify()) //Сожмем наш js
				.pipe(sourcemaps.write()) //Пропишем карты
				.pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
				.pipe(reload({stream: true})); //И перезагрузим сервер
});

/* Build styles */
gulp.task('style:build', function () {
		gulp.src(path.src.style) //Выберем наш main.scss
				.pipe(sourcemaps.init()) //То же самое что и с js
				.pipe(stylus()) //Скомпилируем
				.pipe(prefixer(SupportedBrowsers)) //Добавим вендорные префиксы
				.pipe(cssmin()) //Сожмем
				.pipe(sourcemaps.write())
				.pipe(gulp.dest(path.build.css)) //И в build
				.pipe(reload({stream: true}));
});

/* Images build */
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


/* Common task */
gulp.task('build', [
		'html:build',
		'js:build',
		'style:build',
		'image:build'
]);

/* Watching for file */
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
});

/* server */
gulp.task('webserver', function () {
		browserSync(config);
});

/* clean build */
gulp.task('clean', function (cb) {
		rimraf(path.clean, cb);
});

/* Set default tasks for command Gulp */
gulp.task('default', ['build', 'webserver', 'watch']);
