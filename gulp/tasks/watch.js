module.exports = () => {
  $.gulp.task('watch', () => {
    $.gulp.watch('dev/**/*.pug', $.gulp.series('pug'));
    $.gulp.watch('dev/**/*.scss', $.gulp.series('sass'));
    $.gulp.watch('dev/assets/js/**/*.js', $.gulp.series('scripts'));
  });
}