module.exports = () => {

  $.gulp.task('ftp', () => {
    const conn = $.ftp.create({
      host: $.config.ftp.host,
      user: $.config.ftp.user,
      password: $.config.ftp.pwd
    })

    return $.gulp.src('build/**/*.*', {buffer: false})
      .pipe( conn.newer($.config.ftp.deployPath) )
      .pipe( conn.dest($.config.ftp.deployPath) )
  })
}