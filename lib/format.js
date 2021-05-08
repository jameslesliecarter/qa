const _ = require('underscore');

const photos = (array) => {
  for (var i = 0; i < array.length; i ++) {
    array[i].photos = _.pluck(array[i].photos, 'url');
  }
  return array;
};

module.exports = {
  photos
}