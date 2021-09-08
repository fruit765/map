'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');

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
	.pipe(gulp.dest('./css'));
});