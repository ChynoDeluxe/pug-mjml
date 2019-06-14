'use strict';

const gulp = require( 'gulp' );
const browserSync = require( 'browser-sync' ).create();
const pug = require( 'gulp-pug' );
const rename = require( 'gulp-rename' );

const mjmlEngine = require( 'mjml' ).default;
const mjml = require( './_config/mjml.js' );

const browserReload = browserSync.reload;

const dir = {
  root: "./",
  compiled: {
    mjml: "./compiled/mjml/",
    html: "./compiled/html/"
  },
  src: {
    root: "./src/",
    pug: "./src/**/*.pug",
    emails: "./src/emails/*.pug"
  }
};

const serve = done => {
  browserSync.init( { server: dir.compiled.html, open: false } );
  done();
}

const compilePug = done => {
  return gulp.src( dir.src.emails )
    .pipe( pug( { pretty: true } ) )
    .pipe( rename( { extname: ".mjml" } ) )
    .pipe( gulp.dest( dir.compiled.mjml ) );
}

const compileMJML = done => {
  return gulp.src( dir.compiled.mjml + "*.mjml" )
    .pipe( mjml( mjmlEngine, { beautify: true } ) )
    .pipe( gulp.dest( dir.compiled.html ) );
}

const watch = done => {
  gulp.watch( dir.src.pug, compilePug );
  gulp.watch( dir.compiled.mjml + "*.mjml", compileMJML );
  gulp.watch( dir.compiled.html + "*.html" ).on( "change", browserReload );
}

exports.default = gulp.parallel( serve, watch );