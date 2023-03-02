/**
 * @author Samuel Hinchliffe <am.hinchliffe.work@gmail.com>
 * @see    [Linkedin] {@link https://www.linkedin.com/in/samuel-hinchliffe-2bb5801a5/}
 *
 * @summary Removes the "use strict" directive from all JavaScript files in a specified directory.
 * The motive here is that the chess script breaks when webpack automatically compiles it in.
 *
 * @requires fs
 * @requires glob
 *
 * @constant {string} distDir - The directory containing the bundle files.
 * @constant {RegExp} useStrictRegex - The regular expression to match the "use strict" directive.
 *
 * @function removeUseStrict
 * @returns {void}
 * Created at: 27/02/2023
 */

// Require the built-in file system module and the glob package
const fs = require('fs');
const glob = require('glob');

// Define the directory containing the bundle files
const distDir = 'dist';

// Define the regular expression to match the "use strict" directive
const useStrictRegex = /^"use strict";\n?/;

// Find all .js files in the dist directory
glob(`${distDir}/*.js`, (err, files) => {
  // If there is an error finding the files, log an error message and return
  if (err) {
    console.error(`Failed to find .js files in ${distDir}:`, err);
    return;
  }

  // For each .js file, remove the "use strict" directive
  files.forEach((file) => {
    // Read the contents of the file
    fs.readFile(file, 'utf8', (error, data) => {
      // If there is an error reading the file, log an error message and return
      if (error) {
        console.error(`Failed to read file ${file}:`, error);
        return;
      }

      // Replace the "use strict" directive with an empty string
      const newData = data.replace(useStrictRegex, '');

      // If the file contents were changed, write the new contents to the file
      if (newData !== data) {
        fs.writeFile(file, newData, 'utf8', (erra) => {
          // If there is an error writing the file, log an error message and return
          if (erra) {
            console.error(`Failed to write file ${file}:`, erra);
            return;
          }

          // Log a message indicating that the "use strict" directive was removed
          console.log(`Removed "use strict" directive from ${file}`);
        });
      }
    });
  });
});
