import 'colors';

import del from 'del';
import gulp from 'gulp';
import log from 'gulplog';
import babel from 'gulp-babel';
import cache from 'gulp-cached';
import nodemon from 'gulp-nodemon';
import plumber from 'gulp-plumber';
import eslint from 'gulp-eslint';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify-es';

const PATHS = {
  SRC: {
    BASE: 'app/src/**/*.js',
    WATCH: ['app/src/**/*.js', 'app/src/**/**/*.js', '!app/src/tests/**/*.js'],
    WATCH_WITH_TESTS: ['app/src/**/*.js', 'app/src/**/**/*.js'],
  },
  DIST: 'app/dist/',
  TEST: 'app/test/',
  PROD: 'app/build/',
};

const clean = async path => {
  log.info(`Deleting '${path.toString().cyan}'...`);
  return await del([path]);
};

const make = (srcPath, distPath, uglifyActive) => {
  log.info('Building files with babel ...');

  return new Promise(function(resolve, reject) {
    let result = gulp
      .src([srcPath])
      .pipe(cache('making'))
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(babel({}));

    if (uglifyActive) {
      log.info('Uglifying files');
      result = result.pipe(uglify());
    }

    result
      .pipe(sourcemaps.write('.', { sourceRoot: '' }))
      .pipe(gulp.dest(distPath))
      .on('error', reject)
      .on('end', resolve);
  }).then(() => {
    log.info('Building finished');
  });
};

const run = (path, done) => {
  const options = {
    script: path + 'index.js',
    ext: 'js json',
    watch: path,
    legacyWatch: true,
    env: {
      NODE_ENV: 'development',
      NODE_CONFIG_DIR: './' + path + 'config',
    },
    args: ['source.json'],
    done,
  };

  log.info('NodeMonConfig:');
  log.info(`\tscript: ${options.script}`);
  log.info(`\twatch: ${options.watch}`);
  log.info(`\tenv: ${options.env.NODE_ENV}`);
  log.info(`\tlog level: ${options.env.LOG_LEVEL}`);
  log.info(`\tconfig dir: ${options.env.NODE_CONFIG_DIR}`);

  const stream = nodemon(options);

  stream.on('quit', () => {
    log.info('Closing...');
    done();
    process.exit();
  });
};

const watch = (path, task, done) => {
  if (task) gulp.watch(path, task);
  done();
};

const lint = (srcPath, fail) => {
  log.info('EsLint check started');

  let result = gulp
    .src(srcPath)
    .pipe(eslint())
    .pipe(eslint.result(results => console.log(results)));

  if (fail) result = result.pipe(eslint.failAfterError());

  log.info('EsLint check finished');
  return result;
};

const dev_clean = () => clean(PATHS.DIST);
const dev_make = () => make(PATHS.SRC.BASE, PATHS.DIST);
const dev_run = done => run(PATHS.DIST, done);
const dev_watch = done => watch(PATHS.SRC.WATCH, dev_make, done);

const prod_clean = () => clean(PATHS.PROD);
const prod_make = () => make(PATHS.SRC.BASE, PATHS.PROD, true);
const prod_lint = () => lint(PATHS.SRC.BASE, true);

gulp.task('dev-run', gulp.series(dev_clean, dev_make, gulp.parallel(dev_run, dev_watch)));
gulp.task('prod-build', gulp.series(prod_clean, prod_lint, prod_make));
