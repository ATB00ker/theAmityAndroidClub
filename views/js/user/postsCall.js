/**************************
* Posts Area
**************************/
// Importing Json from the server
$.ajax({
    url: '/storedPosts',
    contentType:"x-application/json",
      complete: function(data) {
      console.log(data);
    }
});
