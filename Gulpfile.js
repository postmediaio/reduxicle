/**
 * The build scripts for reduxicle
 * Loosly based off https://github.com/kimamula/monorepo-ts-react/blob/master/gulpfile.js
 */
const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const ts = require('gulp-typescript');
const del = require('del');
const argv = require('yargs').argv;
const merge = require('merge2');
const log = require('fancy-log');

const packagesLoc = './packages';
const tsProjects = createTSProjects();

/**
 * Creates a TS project for each package in the packages directory
 * Need to do this because otherwise you get this error:
 * `A project cannot be used in two compilations at the same time. Create multiple projects with createProject instead.`
 *
 * Should also create the TS projects once per task invocation so we benefit
 * from incremental compilation
 */
function createTSProjects() {
  const projects = {};
  const packages = getAllPackageDirNames();
  packages.forEach((packageName) => {
    projects[packageName] = ts.createProject('./tsconfig.json');
  });
  return projects;
}

gulp.task('build', function() {
  const packages = getRequestedPackages();
  log.info("Building packages:", packages.join(', '))
  return build(packages);
});

gulp.task('build:watch', function() {
  // todo: could probably make this faster by doing part of this outside the task
  // maybe call ts.createProject for each package? (with same config)
  const packages = getRequestedPackages();

  return build(packages).end(() => {
    gulp.watch('packages/reduxicle-*/src/**/*.ts?(x)', (change) => {
      // todo: only show end of path
      log.info("Rebuilding because of changed file: ", change.path);

      // todo: could make this faster by only building the package that changed
      // instead of all packages, but right now there's only a few packages anyway
      return build(packages);
    });
  });
});

gulp.task('clean', function(cb) {
  const buildFolders = getRequestedPackages().map((packageName) => {
    return path.join(packagesLoc, packageName, 'lib');
  });

  return del(buildFolders);
});

function build(packages) {
  const buildStreams = packages.map((packageName) => {
    return tsc(packageName);
  });

  return merge(buildStreams);
}

function tsc(packageName) {
  let hasErrors = false;
  const packageDir = path.join(packagesLoc, packageName);
  return gulp
    .src([
      path.join(packageDir, 'src/**/*.ts?(x)'), // All ts files in the src dir
      '!' + path.join(packageDir, 'src/**/*.test.ts?(x)'), // Exclude test files
      '!' + path.join(packageDir, 'src/**/__tests__'), // Exclude test folders
    ])
    .pipe(tsProjects[packageName]())
    .on('error', function() {
      hasErrors = true;
    })
    .pipe(gulp.dest(path.join(packageDir, 'lib')))
    .on('end', function(bla) {
      if (hasErrors) {
        log.error(packageName + ': failed to build')
        process.exit(1);
      } else {
        log.info(packageName + ': build succeeded');
      }
    });
}

function getRequestedPackages() {
  let packageDirNames = [];
  const allPackageDirNames = getAllPackageDirNames();
  if (argv.package) {
    if (allPackageDirNames.indexOf(argv.package) < 0) {
      throw new Error('No such package dir: ' + argv.package);
    }
    packageDirNames = [argv.package];
  } else {
    packageDirNames = allPackageDirNames;
  }

  return packageDirNames;
}

function getAllPackageDirNames() {
  return fs.readdirSync(packagesLoc)
    .filter(function(dir) {
      const packageName = path.basename(dir);
      if (packageName.indexOf('reduxicle-') !== 0) {
        return false;
      }

      return fs.existsSync(path.join(packagesLoc, packageName, 'package.json'));
    })
    .map(function(dir) {
      return path.basename(dir);
    });
}