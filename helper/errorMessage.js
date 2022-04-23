let _name = 'Error bez opisu(`Simon nie przewidzał)';

exports.getErrorMessage = function() {
  return _name;
};

exports.setErrorMessage = function(name) {
  _name = name;
};