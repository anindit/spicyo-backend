module.exports = {
  ifeq: function(conditional, options){
    if (conditional == options.hash.equals) {
      //return options.fn(this);
      return 1;
    } else {
        return 0;
    }
  },
  bar: function(b){
    return b;
  }
}