import fs from "fs";
import path from "path";

// * Path(s)
// Directory
const FILEPATH_LOGS = path.join(__dirname, '..', 'logs');
// Touch
const FILEPATH_REGISTER = path.join(__dirname, '..', 'logs', 'registers.json');
const FILEPATH_LOGIN = path.join(__dirname, '..', 'logs', 'logins.json');
const FILEPATH_MAIL = path.join(__dirname, '..', 'logs', 'mails.json');
const FILEPATH_VERIFY = path.join(__dirname, '..', 'logs', 'verifications.json');
// Test
const FILEPATH_TEST = path.join(__dirname, '..', 'logs', 'tests.json');

// Array
const FILEPATH_ARRAY = [FILEPATH_REGISTER, FILEPATH_LOGIN, FILEPATH_MAIL, FILEPATH_VERIFY, FILEPATH_TEST];

// Empty JSON Data
const emptyJSONData = JSON.stringify([], null, 2);

// Created files
const createdFiles = new Array;

const mkdir = (filePath: string): void => {
  try {
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath);
      createdFiles.push((filePath.split("/")).pop());
    }
  } catch (error: any) {
    console.log(`\x1b[31m[DEBUG] Error writing to file:\x1b[0m`, error);
  }
};

const touch = (filePath: string): void => {
  if (!fs.existsSync(filePath)) {
    fs.writeFile(filePath, emptyJSONData, 'utf8', (error: Error) => {
      if (error) {
        console.log(`\x1b[31m[DEBUG] Error writing to file:\x1b[0m`, error);
      }
    });
    createdFiles.push((filePath.split("/")).pop());
  }
};

export const createFiles = (): void => {
  mkdir(FILEPATH_LOGS);
  for (let index = 0; index <= FILEPATH_ARRAY.length - 1; index++) {
    touch(FILEPATH_ARRAY[index]);

  };

  // Log
  createdFiles.length >= 1 && console.log(`\x1b[32m[DEBUG] The required files have been created: ${createdFiles}.\x1b[0m`);
};