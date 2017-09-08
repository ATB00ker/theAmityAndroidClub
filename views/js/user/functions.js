/**************************
* Materialize Initiate
***************************/
$(".button-collapse").sideNav();
$('.dropdown-button').dropdown('open');
/**************************
* Deleted Posts
***************************/
function deletePosts(data) {
    $.post("/deletePosts", {id: data}, function(response, status){
        var adminPostsContainer = $('#adminPostsJavaSript');
        adminPostsContainer.empty();
        for(var values in response){
            var html = '<div class="row"><div class="col l1"></div><div class="col s12 l10"><div class="card"><div class="card-content"><div class="row titleLine"><div class="col s10 text-center card-title">'+response[values].postTitle+'</div><div class="col s2 right-align"><a class="dropdown-button btn" id='+"'button_"+response[values].id+"'"+' onclick="enableSettingsMenu('+"'#button_"+response[values].id+"'"+');" data-activates='+"'"+response[values].id+"'"+'><i class="fa fa-cogs" aria-hidden="true"></i></a><ul class="dropdown-content" id='+"'"+response[values].id+"'"+'><li class="materializedBtn" onclick="editPosts('+"'"+response[values].id+"'"+')">Edit</li><li class="divider"></li>';
            html += '<li class="materializedBtn" onclick="deletePosts(' +"'"+response[values].id+"'"+ ')">Delete</li></ul></div></div><p>'+ response[values].postContent+'</p><p class="right-align adminName">'+response[values].adminUsername+'</p><div class="card-action"><a href="'+response[values].postLink+'">'+response[values].postLinkName+'</a></div></div></div></div></div>';
            adminPostsContainer.append(html);
        }
    });
}
function editPosts(data){
    $.post("/getPosts", {id: data}, function(response, status){
        $('[name="title"]').val(response[0].postTitle);
        $('[name="content"]').val(response[0].postContent);
        $('[name="cta"]').val(response[0].postLink);
        $('[name="ctaName"]').val(response[0].postLinkName);
        Materialize.updateTextFields();
        window.scrollTo(0, 0);
        Materialize.toast('Post deleted! Edit & Send new Post!', 4000);
        deletePosts(data);
    });
}
function enableSettingsMenu(id){
    $(id).dropdown();
    $(id).dropdown('open');
}
