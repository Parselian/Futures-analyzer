module.exports = () => {
  $.gulp.task('pug', () => {
    return $.gulp.src('dev/pages/**/*.pug') /* take .pug filed */
      .pipe($.gp.pug({
        pretty: true,
        basedir: 'dev/'/* disabling markup minification */
      }))
      .pipe($.gulp.dest('build')) /* return compiled .html files */
      .on('end', $.browserSync.reload);
  });
}