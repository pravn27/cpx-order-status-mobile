import Config from './config' 

/**
 *   Globals
 */
const ERROR_LOGS_FILE_NAME = Config.ERROR_LOGS_FILE_NAME || 'cpx-error.logs';



/**
 * Utils
 */
const readFile = (fileEntry) => {
    return new Promise((resolve, reject) => {
        fileEntry.file(function (file) {
            var reader = new FileReader();
            reader.readAsText(file);
            reader.onloadend = function() { resolve(this.result); };
        }, reject);
    });
}


const writeFile = (fileEntry, text, isAppend) => {
    if (!text) {
        return Promise.reject(new Error('No text specified. You need to pass a string as second argument.'));
    }

    return new Promise((resolve, reject) => {
        // Create a FileWriter object for our FileEntry.
        fileEntry.createWriter(function (fileWriter) {
            if (isAppend) {
                fileWriter.seek(fileWriter.length);
            }
            fileWriter.onwriteend = resolve;
            fileWriter.write(text);
        }, reject);
    });
}


const getTemporaryFileEntry = (dirEntry, fileName) => {
    return new Promise((resolve, reject) => {
        // Creates a new file or returns the file if it already exists.
        dirEntry.getFile(fileName, {create: true, exclusive: false}, resolve,  reject);
    });
}

const getTemporaryDirEntry = () => {
    return new Promise((resolve, reject) => {
        window.requestFileSystem(window.TEMPORARY, 0, resolve, reject);
    });
}




/***************************
 *  Exported functions
 */
export const readErrorLogsFile = () => {
    if (typeof window.parent.ripple === "function") { return Promise.resolve(`Will read the content of '${ERROR_LOGS_FILE_NAME}' file on device.`); }    
    return getTemporaryDirEntry()
           .then( (fs) => getTemporaryFileEntry(fs.root, ERROR_LOGS_FILE_NAME) )
           .then( (fileEntry) => readFile(fileEntry) )
}

export const appendLineToErrorLogsFile = (textMsg) => {
    if (typeof window.parent.ripple === "function") { return Promise.resolve( console.log(`Will save the string '${textMsg}' as a new line on device.`) ) }
    return getTemporaryDirEntry()
           .then( (fs) => getTemporaryFileEntry(fs.root, ERROR_LOGS_FILE_NAME) )
           .then( (fileEntry) => writeFile(fileEntry, `${textMsg}\n`, true) )
}