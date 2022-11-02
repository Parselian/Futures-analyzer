module.exports = () => {
  $.gulp.task('css-transfer', () => {
    return $.gulp.src('./dev/assets/css/*.css')
      .pipe($.gulp.dest('./build/assets/css/'));
  });
};