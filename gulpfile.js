const { src, dest, series } = require("gulp");
const gulpRename = require("gulp-rename");

const copySourceFiles = (target) => {
  return src("src/**/*").pipe(dest(`build/${target}`));
};

const copyChromeManifest = () => {
  return src("manifest-ch.json")
    .pipe(gulpRename("manifest.json"))
    .pipe(dest("build/chrome"));
};

const copyFirefoxManifest = () => {
  return src("manifest-ff.json")
    .pipe(gulpRename("manifest.json"))
    .pipe(dest("build/firefox"));
};

exports.buildChrome = series(
  copyChromeManifest,
  copySourceFiles.bind(null, "chrome")
);

exports.buildFirefox = series(
  copyFirefoxManifest,
  copySourceFiles.bind(null, "firefox")
);
