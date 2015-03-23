/**
 *@param {[array]} [array1]  -数组
 *@param {[array]} [array2]  -数组
 *@param {String} [options.show] -compare 如果带有该参数就是去掉相同元素，如果没有则是比较两个数组是否相等。
 *@return [array] -数组
 */
'use strict';

var assert = require('assert');

module.exports = function(array1, array2, options){

  options = options || {};

  // check argument types and return an error if needed
  assert.equal(Array.isArray(array1), true, 'first arguement should be an array');
  assert.equal(Array.isArray(array2), true, 'second arguement should be an array');
  assert.equal(typeof options, 'object', 'third argument should be an object');

  function compareArrayElements(firstArray, secondArray){

    for(var i = 0; i < firstArray.length; i++) {

      if (firstArray[i] !== secondArray[i]) {

        // check if element is itself an array
        if (Array.isArray(firstArray[i]) && Array.isArray(secondArray[i])) {

          if (!compareArrayElements(firstArray[i], secondArray[i])){
            return false;
          }

        } else if (Number.isNaN(firstArray[i]) && Number.isNaN(secondArray[i])) {
          continue;
        } else {

          return false;
        }
      }
    }

    return true;

  }

  function likeness(firstArray, secondArray, mode) {

    var el, arrA, arrB, total, result = [];

    arrA = firstArray;
    arrB = secondArray;

    if (firstArray.length <= secondArray.length) {
      arrA = secondArray;
      arrB = firstArray;
    }
    total  = arrA.length;
    for (var i = 0;i < total;i++) {
      el = arrA[i];

    if (arrB.indexOf(el) === -1 && mode === 'compare') {
        result.push(el);
      }
    }

      return result;
    
  }

  if(options.hasOwnProperty('show')) {

    return likeness(array1, array2, options.show);

  } else if (array1.length !== array2.length) {

    return false;

  } else {

    return compareArrayElements(array1, array2);

  }

};