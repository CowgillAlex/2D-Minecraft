
import { Project , Trigger, Watcher, Stage, Costume, Sprite, Color, Sound} from "../cdn.js";
import project from "../index.js";
class Utils {
/**
 * 
 * A wrapper for console.[log/warn/error] that adds a timestamp to the start
 * 
 * @param {string} type log/warn/error Default: log
 * @param {string} message Message contents
 * 
 */
 static log(type, message) {
    // Get the current date and time
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = String(now.getFullYear()).slice(-2); // Get last two digits of the year
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    // Format the timestamp
    const timestamp = `[${day}/${month}/${year}] [${hours}:${minutes}:${seconds}]`;
    
    // Determine the log type and log the message with the timestamp
    switch (type) {
      case 'log':
        console.log(`${timestamp}: ${message}`);
        break;
      case 'warn':
        console.warn(`${timestamp}: ${message}`);
        break;
      case 'error':
        console.error(`${timestamp}: ${message}`);
        break;
      default:
        console.log(`${timestamp}: ${message}`);
    }
  }
  static  flattenVertically(arr) {
    // Determine the number of columns
    const numCols = arr[0].length;
    // Create an array to hold the flattened data
    const result = [];

    // Loop over each column
    for (let col = 0; col < numCols; col++) {
        // Loop over each row
        for (let row = 0; row < arr.length; row++) {
            result.push(arr[row][col]);
        }
    }

    return result;
}
static end(){
  throw new Error()
}

}

export default Utils