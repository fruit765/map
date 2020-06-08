var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');

gulp.task('sass', function() {
	return gulp.src('./scss/**/*.scss')
	.pipe(sass().on('error', sass.logError))
	.pipe(autoprefixer({
        overrideBrowserslist:['last 2 versions'],
        cascade:false
	}))
	.pipe(cleanCSS({
		level: 1,
		compatibility: 'ie8'
	}))
	.pipe(gulp.dest('./css'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', gulp.series('sass', function() {
	browserSync.init({
		proxy: '192.168.4.235',
		notify: false,
		port: 8080
    });
		gulp.watch('./scss/**/*.scss', gulp.series('sass'));
		gulp.watch('./**/*.html').on('change', function(){
			browserSync.reload();
		});
}));