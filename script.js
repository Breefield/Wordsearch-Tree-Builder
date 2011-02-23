// Global so we can pick up in console
var master;

// When jQuery is loaded (mainly for $.each());
// You'll have to convert to for loops instead of foreach loops in C++
$(document).ready(function() {
  // Drop bank, or open file, whatever
  var words = "THAY\n" +
              "EHRJ\n" +
              "FZEO\n" +
              "YHUB\n" +
              "IJGH\n" +
              "NHIB";
  // Split at \n's
  words = words.split("\n");
  // In Javascript every string is an array of character, useful for getting dimensions
  // like so. Or for accessing indexes in this program
  var dimensions = {y: words.length, x: words[0].length};

  // So this is our master tree
  master = {};
  // These are the directions we want to recursivly look for paths in
  // You could quick-convert this into a pathfinding algorithm pretty easily
  var directions = new Array([1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, -1], [-1, 1]);
  
  // So, basically we want to traverse through the wordsearch, look at every letter, and find "paths" to the edge
  // in the directions we defined above. Which are every direction but right to left, or [-1, 0] (if that makes sense...)
  
  // For every line in the wordsearch
  $.each(words, function(i, line) {
    // For every character in the line
    $.each(line, function(j, letter) {
      // Search in every direction
      $.each(directions, function(k, direction) { 
        // This is the initial call to the recursive direction traverser, 
        // we'll revisit when we get to the function itself
        
        var pointer = {x: i, y: j};
        // We sent the hash to append this all to, and the inition pointer (that of the current letter we're looking at)
        compileString(master, pointer, 
          function(current_pointer) { 
            // This is the mutation function, 
            // javascript has the awesome ability to let you send functions as arguments
            // So we just send a function that mutates the "pointer" in the direction of the current direction
            // Hopefully that makes sense
            return {x: current_pointer.x + direction[0], y: current_pointer.y + + direction[1]}; 
          }); 
      });
    });
  });
  
  /** function compileString
   * This function is recursive, it heads in the direction of the mutation function we pass,
   * That is, until it hits an edge
   *
   * s - hash
   * c - pointer (should be named p)
   * f - function that mutates c every level of recursion
   */
  function compileString(main_hash, pointer, mutation_function) {
    // Have we hit an edge? If so, return the hash
    if(pointer.x >= dimensions.x || pointer.y >= dimensions.y || pointer.x < 0 || pointer.y < 0) return main_hash;
    
    // Does the pointer we're looking at already exist in the main hash? If it doesn't, initialize a new hash
    // The only reason we check before initializing is so that the tree is efficient, and we don't overwrite older "paths"
    // with newer ones. If we were to do that, only the end of the wordsearch would be in the tree, older paths would be killed.
    var letter = words[pointer.y][pointer.x];
    if(main_hash[letter] == undefined) main_hash[letter] = {};
    
    // Call this function again, while mutating the pointer 1 step, also pass the newly initialized 
    // (or previously) initialized hash level into the function again
    // This ultimatly returns itself. I'm not going to explain recursion, so go read
    // http://en.wikipedia.org/wiki/Recursion
    return compileString(main_hash[letter], mutation_function(pointer), mutation_function);
  }
});