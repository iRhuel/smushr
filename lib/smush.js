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
        if (obj.hasOwnProperty(key)) {
            try {
                if (!result[key]) result[key] = [];

                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    if (Array.isArray(obj[key])) {
                        obj[key].forEach(value => {

                            // if array value is NOT an object, make sure result array exists and push to result array if
                            // not already contained
                            if (typeof value !== 'object') {
                                if (!result[key].includes(value))
                                    result[key].push(value);
                            } else {
                                const index = getObjectIndex(value, result[key]);

                                // if result array doesn't exist, create one with one empty object, and recurse over it
                                if (index < 0) {
                                    const temp = {};
                                    result[key].push(temp);
                                    smush(value, temp);
                                } else smush(value, result[key][index]);
                            }
                        });
                    }

                    // if value is object, create new object in result if it doesn't already exist and recurse on the
                    // nested target object and nested result object
                    else {
                        const index = getObjectIndex(obj[key], result[key])

                        if (index < 0) {
                            const temp = {};
                            result[key].push(temp);
                            smush(obj[key], temp);
                        } else smush(obj[key], result[key][index]);
                    }
                } else if (!result[key].includes(obj[key])) result[key].push(obj[key]);
            } catch (err) {
                console.log(err.message);
            }
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
 * checks two objects and returns true iff they have the same keys
 *
 * @param obj1 to be compared
 * @param obj2 to be compared
 * @returns {boolean} whether or not all keys between both objects match
 */
function isEqual(obj1, obj2) {
    const keys1 = Object.keys(obj1).sort();
    const keys2 = Object.keys(obj2).sort();
    let flag1 = true;
    let flag2 = true;

    for (let i = 0; i < keys1.length; i++)
        if (!keys2.includes(keys1[i])) {
            flag1 = false;
            break;
        }

    for (let i = 0; i < keys2.length; i++)
        if (!keys1.includes(keys2[i])) {
            flag2 = false;
            break;
        }

    return flag1 || flag2;
}
