const fs = require('fs');
const path = require('path');

const srcDistPath = process.argv[2];
const dstDistPath = process.argv[3];
const moveSrc = process.argv.length>=5 && (process.argv[4]=='move');

console.log('Copy all file in ' + srcDistPath + ' to ' + dstDistPath);

function copyFolderRecursiveSync( source, target ) {
  var files = [];

  if ( !fs.existsSync( target ) ) {
      fs.mkdirSync( target );
  }

  //copy
  if ( fs.lstatSync( source ).isDirectory() ) {
      files = fs.readdirSync( source );
      files.forEach( function ( file ) {
          var curSource = path.join( source, file );
          if ( fs.lstatSync( curSource ).isDirectory() ) {
              copyFolderRecursiveSync( curSource, path.join(target, file) );
          } else {
              fs.copyFileSync( curSource, path.join(target, file) );
              if(moveSrc) {
                fs.rmSync( curSource );
              }
          }
      } );
      if(moveSrc) {
        fs.rmdirSync( source );
      }
  }
}

copyFolderRecursiveSync(srcDistPath, dstDistPath);
