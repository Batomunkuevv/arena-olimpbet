export const css = () =>
    app.gulp
        .src(app.path.src.css, { sourcemaps: app.isDev })
        .pipe(
            app.plugins.plumber(
                app.plugins.notify.onError({
                    title: "CSS",
                    message: "Error: <%= error.message %>",
                })
            )
        )

        .pipe(app.gulp.dest(app.path.build.css))
        .pipe(app.plugins.browserSync.stream());
