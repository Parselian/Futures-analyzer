module.exports = () => {
  $.gulp.task('pug', () => {
    return $.gulp.src('dev/pages/**/*.pug') /* take .pug filed */
      .pipe($.gp.pug({
        pretty: true, /* disabling markup minification */
        basedir: 'dev'
      }))
      .pipe($.gulp.dest('build')) /* return compiled .html files */
      .on('end', $.browserSync.reload);
  });
}