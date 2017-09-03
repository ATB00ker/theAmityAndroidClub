/**************************
* Materialize Initiate
***************************/
$(".button-collapse").sideNav();

/**************************
* Posts Area
**************************/
var adminPostsContainer = $('#adminPosts');
var adminPosts = [];

adminPosts[0] = {title: "Sample Post", content: "I am simple post! I contain the information! Please Improve me if you can work on me. :)", cta: "#", ctaText: "Hello! I am a link!"};
adminPosts[1] = {title: "Install Android Studio", content: "Android studio is required in the next class! Find the software in the link below! :)", cta: "https://developer.android.com/studio/index.html", ctaText: "Download" };
adminPosts[2] = {title: "Install an IDE", content: "IDE is a workspace where you code! If you have a favorite workspace, you are otherwise, most java developers use Netbeans, try it out!", cta: "https://netbeans.org/downloads/", ctaText: "Download" };


for (var x in adminPosts){
    var html = '<div class="row"><div class="col l1"></div><div class="col s12 l10"><div class="card"><div class="card-content"><span class="text-center card-title">'+adminPosts[x].title+'</span><p>'+adminPosts[x].content+'</p></div><div class="card-action"><a href="'+adminPosts[x].cta+'">'+adminPosts[x].ctaText+'</a></div></div></div></div>';
    adminPostsContainer.append(html);
}
