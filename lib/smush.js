/**
 * Recursively examines object's key value pairs and constructs a single result object with the same keys, and values
 * set to arrays containing all discrete values from searched objects. If value is a nested object, the function will
 * recurse and perform the same operation. If value is an array of objects, the function will recurse for each object.
 *
 * @param obj target to be examined and copied
 * @param result output object containing value arrays and nested objects
 */
module.exports = function smush(obj, result) {
    for (let key in obj) {
        try {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === 'object' && obj[key] !== null) {

                    // if value is an array, for each array value...
                    if (Array.isArray(obj[key])) {
                        obj[key].forEach(value => {

                            // if array value is NOT an object, make sure result array exists and push to result array if
                            // not already contained
                            if (typeof value !== 'object') {
                                if (!result[key])
                                    result[key] = [value];

                                else if (!result[key].includes(value))
                                    result[key].push(value);
                            }

                            // if array value is an object, check array for key parity...
                            else {

                                // if result array doesn't exist, create one with one empty object, and recurse over it
                                if (!result[key]) {
                                    result[key] = [{}];
                                    smush(value, result[key][0]);
                                }

                                // if array doesn't have copy of object, add new empty object and recurse over it
                                else if (!hasObject(value, result[key])) {
                                    result[key].push({});
                                    smush(value, result[key][result[key].length-1]);
                                }

                                // if object copy exists in array, recurse over it
                                else {
                                    smush(value, result[key][getObjectIndex(value, result[key])])
                                }
                            }
                        });
                    }

                    // if value is object, create new object in result if it doesn't already exist and recurse on the
                    // nested target object and nested result object
                    else {
                        if (!result[key])
                            result[key] = {};

                        smush(obj[key], result[key]);
                    }
                } else if (result[key]) {
                    if (!result[key].includes(obj[key])) {
                        result[key].push(obj[key]);
                    }
                } else {
                    result[key] = [obj[key]];
                }
            }
        } catch (e) {
            console.log(key, ' is throwing error: ', e.message)
        }
    }
};

/**
 * returns the index of an array object with matching keys to the input object
 *
 * @param obj being searched for in the array
 * @param array to be searched
 * @returns {number} index of the matching object, or -1 if not found
 */
function getObjectIndex(obj, array) {
    for (let i = 0; i < array.length; i++)
        if (isEqual(obj, array[i]))
            return i;
    return -1;
}

/**
 * checks array if an object with matching keys to the target exists
 *
 * @param obj being searched for in the array
 * @param array to be searched
 * @returns {boolean} whether or not matching object was found
 */
function hasObject(obj, array) {
    for (let i = 0; i < array.length; i++)
        if (isEqual(obj, array[i]))
            return true;
    return false;
}

/**
 * checks two objects and returns true iff they have the same keys
 *
 * @param obj1 to be compared
 * @param obj2 to be compared
 * @returns {boolean} whether or not all keys between both objects match
 */
function isEqual(obj1, obj2) {
    const keys1 = Object.keys(obj1).sort();
    const keys2 = Object.keys(obj2).sort();

    if (keys1.length !== keys2.length)
        return false;

    for (let i = 0; i < keys1.length; i++)
        if (keys1[i] !== keys2[i])
            return false;

    return true;
}
