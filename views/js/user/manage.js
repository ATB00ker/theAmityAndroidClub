/**************************
* Altering Administrator's details
***************************/
$(document).ready(function(){
    $.post("/newAdminDetailsTable", function(response, status){
        for (values in response){
            var html = '<tr><td>'+response[values].name+'</td><td>'+response[values].username+'</td><td><a onclick="allowNewAdmin('+response[values].id+')" class="waves-effect waves-light btn">Allow</a></td><td><a onclick="deleteAdminAccount('+response[values].id+')" class="waves-effect waves-light btn red">Delete</a></td></tr>';
            $("#newAdminDetailsTable").append(html);
        }
    });
    $.post("/knownAdminDetailsTable", function(response, status){
        for (values in response){
            var html = '<tr id="adminEntry_'+response[values].id+'"><td>'+response[values].name+'</td><td>'+response[values].username+'</td>';
            if(response[values].adminLevel == 1)
                html += '<td><i class="icon_disable fa fa-minus-square" aria-hidden="true"></i> 1 <i onclick="changeAdminPrivilege('+response[values].id+', 2)" class="fa fa-plus-square" aria-hidden="true"></i></td>';
            if(response[values].adminLevel == 2)
                html += '<td><i onclick="changeAdminPrivilege('+response[values].id+', 1)" class="fa fa-minus-square" aria-hidden="true"></i> 2 <i class="icon_disable fa fa-plus-square" aria-hidden="true"></i></td>';
            html +='<td><a onclick="deleteAdminAccount('+response[values].id+')" class="waves-effect waves-light btn red">Delete</a></td></tr>';
            $("#knownAdminDetailsTable").append(html);
        }
    });
});
function allowNewAdmin(data){
    $.post("/allowNewAdmin", {id: data});
    location.reload();
}
function deleteAdminAccount(data){
    $.post("/deleteAdminAccount", {id: data});
    location.reload();
}
function changeAdminPrivilege(id, adminLevel){
    $.post("/changeAdminPrivilege",{id, adminLevel}, function(response, status){
        var knownAdminDetailsTable = $("#knownAdminDetailsTable");
        $("#adminEntry_"+id).remove();
        for (values in response){
            var html = '<tr id="adminEntry_'+response[values].id+'"><td>'+response[values].name+'</td><td>'+response[values].username+'</td>';
            if(response[values].adminLevel == 1)
                html += '<td><i class="icon_disable fa fa-minus-square" aria-hidden="true"></i> 1 <i onclick="changeAdminPrivilege('+response[values].id+', 2)" class="fa fa-plus-square" aria-hidden="true"></i></td>';
            if(response[values].adminLevel == 2)
                html += '<td><i onclick="changeAdminPrivilege('+response[values].id+', 1)" class="fa fa-minus-square" aria-hidden="true"></i> 2 <i class="icon_disable fa fa-plus-square" aria-hidden="true"></i></td>';
            html +='<td><a onclick="deleteAdminAccount('+response[values].id+')" class="waves-effect waves-light btn red">Delete</a></td></tr>';
            knownAdminDetailsTable.append(html);
        }
    });
}
