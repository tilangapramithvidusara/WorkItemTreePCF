/* eslint-disable no-undef */
const https = require("https");
const fs = require("fs");
const parse = require("csv-parse/lib/sync");

// https://stackoverflow.com/questions/33713084/download-link-for-google-spreadsheets-csv-export-with-multiple-sheets

const basePath = "./WorkItemTree/src/__generated__/translations/";
fs.rmdirSync(basePath, { recursive: true });
fs.mkdirSync(basePath);

download(
  "main",
  "https://docs.google.com/spreadsheets/d/1_EX0DrBQ6UvqY3x0szgFSnQqvfsLOv00WvcF3gOjjlQ/export?format=csv"
);

download(
  "enum",
  "https://docs.google.com/spreadsheets/d/1_EX0DrBQ6UvqY3x0szgFSnQqvfsLOv00WvcF3gOjjlQ/export?format=csv&gid=246451314"
);

function download(namespace, url) {
  https.get(url, function (response) {
    https.get(response.headers.location, function (response) {
      var csv = "";
      response.on("data", function (chunk) {
        csv += chunk;
      });
      response.on("end", function () {
        var translations = {};

        var lines = parse(csv, { delimeter: "," });
        var header = lines[0];
        for (var i = 1; i < lines.length; i++) {
          var line = lines[i];
          var key = line[0];

          for (var k = 2; k < line.length; k++) {
            var language = header[k];
            var translation = line[k];

            translations[language] = translations[language] ?? {};
            translations[language][key] = translation;

            if (translation.length === 0) {
              console.error(`MISSING TRANSLATION:\t${language}\t${key}`);
            }
          }
        }

        for (const language in translations) {
          const path = `${basePath}${namespace}/`;
          if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
          }
          fs.writeFile(`${path}${language}.json`, JSON.stringify(translations[language], null, 2), function (err) {
            if (err) {
              return console.error(err);
            }
          });
        }
      });
    });
  });
}
