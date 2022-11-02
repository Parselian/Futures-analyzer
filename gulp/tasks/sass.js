module.exports = () => {
  $.gulp.task('sass', () => {
    return $.gulp.src('dev/**/*.scss') /* take .scss file */
      .pipe($.gp.plumber())
      .pipe($.gp.concat('temp.scss'))
      .pipe($.gp.sourcemaps.init()) /* initialize sourcemaps */
      .pipe($.sass()) /* compiling scss into css */
      .pipe($.gp.autoprefixer({
        overrideBrowserslist: ['last 5 versions']
      }))
      .pipe($.gp.concat('main.css'))
      .on("error", $.gp.notify.onError({
        message: "Error: <%= error.message %>",
        title: "Style error"
      }))
      .pipe($.gp.csso()) /* optimize compiled css file */
      .pipe($.gp.sourcemaps.write()) /* create sourcemaps */
      .pipe($.gp.plumber.stop())
      .pipe($.gulp.dest('build/assets/css/')) /* return .css file */
      .pipe($.browserSync.reload({
        'stream': true
      }));
  });
}