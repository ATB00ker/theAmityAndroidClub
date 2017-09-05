var pageCounter = 1;
// Importing Json from the server
$.ajax({
    url: '/storedPosts',
    contentType:"x-application/json",
      complete: function(data) {
      console.log(data);
    }
});
$.getJSON('/storedPosts').done(function(data){
    console.log('Guko:' + data.id);
});
