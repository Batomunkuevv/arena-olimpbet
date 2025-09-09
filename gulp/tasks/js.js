import webpack from 'webpack-stream';
import mergeStreams from 'merge-stream';

export const js = () => {
    const webpackConfig = {
        mode: app.isBuild ? 'production' : 'development',
        entry: app.path.src.js,
        output: {
            filename: 'script.min.js',
        },
        resolve: {
            extensions: ['.js', '.json'],
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                        },
                    },
                }
            ],
        },
        optimization: {
            minimize: app.isBuild,
        },
    }

    const bundle = app.gulp
        .src(app.path.src.js, { sourcemaps: app.isDev })
        .pipe(
            app.plugins.plumber(
                app.plugins.notify.onError({
                    title: "JS",
                    message: "Error: <%= error.message %>",
                })
            )
        )
        .pipe(webpack(webpackConfig))
        .pipe(app.gulp.dest(app.path.build.js))

    const copyLibs = app.gulp
        .src(app.path.src.jsLibs)
        .pipe(app.gulp.dest(app.path.build.js));

    return mergeStreams(bundle, copyLibs);
};