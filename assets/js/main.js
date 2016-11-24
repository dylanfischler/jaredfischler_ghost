window.Blog = (function(){
  var Blog = function() {
    
    
  };

  Blog.prototype.initPostGrid = function() {
    var self = this;
    self.postTemplate = Handlebars.compile(document.getElementById("home-post-template").innerHTML);
    self.posts = [];

    axios.get(ghost.url.api('posts', {include: "tags", limit: "all"})).then(function(response) {
      self.posts = response.data.posts;
      // renderPostsWithTag();
      self.renderPosts();
    }).catch(function(error) {
      console.error("Couldn't GET posts", error);
    });
  }

  Blog.prototype.initPost = function() {
    var subdescEl = $("#subdesc");
    if(subdescEl.length) {
      var subdesc = subdescEl.html();
      subdescEl.remove();
    }
    $(".post-subtitle").html(subdesc);
  }

  Blog.prototype.initIso = function(gridSelector, gridItemSelector) {
    var grid = document.querySelector(gridSelector);
    this.postGrid = new Isotope(grid, {
      itemSelector: gridItemSelector,
      layoutMode: 'fitRows',
      hiddenStyle: {
        opacity: 0
      },
      visibleStyle: {
        opacity: 1
      }
    });
  };

  Blog.prototype.filterPosts = function(tagSlug) {
    this.postGrid.arrange({
      filter: function(el) {
        if(tagSlug === 'all') return true;
        else return $(el).hasClass('tag-' + tagSlug);
      }
    });

    $(".tag-link").removeClass("active")
    $(".tag-link.slug-" + tagSlug).addClass("active");
  }

  Blog.prototype.renderPosts = function() {
    var self = this;

    this.posts.forEach(function(post) {
      var renderedPost = self.postTemplate(post);
      var el = $.parseHTML(renderedPost);

      // attach tag classes
      post.tags.forEach(function(tag) {
        $(el).addClass("tag-" + tag.slug);
      });

      $("#post-loop").append(el);
      $(el).addClass("displayed");
    });

    this.initIso('#post-loop', '.home-post');
  }

  return Blog;
})();




// var postTemplate = Handlebars.compile(document.getElementById("home-post-template").innerHTML);

// window.posts = [];

// function renderPostsWithTag(tagSlug) {
//   // filter for posts matching tag sluf
//   var filtered = [];
//   if(!tagSlug) {
//     filtered = window.posts;
//     tagSlug = "all";
//   }
//   else {
//     filtered = window.posts.filter(function(post) {
//       var hasTag = post.tags.find(function(tag){
//         return tag.slug === tagSlug
//       });
//       return hasTag !== undefined;
//     });
//   }

//   $(".tag-link").removeClass("active")
//   $(".tag-link.slug-" + tagSlug).addClass("active");
//   // render post set
//   renderPostSet(filtered);
// }

// function renderPostSet(postSet) {
//   var postDict = {};
//   var childDict = {};
  
//   postSet.forEach(function(post) { postDict[post.slug] = post; });

//   // remove any DOM posts not in set
//   $("#post-loop").children().each(function() {
//     var child = this;
//     var slug = child.getAttribute("id").replace("home-post-","");
//     childDict[slug] = child;
//     if(!postDict[slug]){
//       $(child).removeClass("displayed");
//       setTimeout(function() { child.remove() }, 200);
//       // $(child).fadeOut(function() {
//       // child.remove();
//       // });
//     } else $(child).addClass("displayed");
//   });

//   // add new posts not in DOM
//   postSet.forEach(function(post) {
//     if(!childDict[post.slug]) {
//       var renderedPost = postTemplate(post);
//       var el = $.parseHTML(renderedPost);
//       $("#post-loop").append(el);
//       $(el).addClass("displayed");
//     }
//   });
// }

// function renderPosts() {
//   window.posts.forEach(function(post) {
//     var renderedPost = postTemplate(post);
//     var el = $.parseHTML(renderedPost);

//     // attach tag classes
//     post.tags.forEach(function(tag) {
//       $(el).addClass("tag-" + tag.slug);
//     });

//     $("#post-loop").append(el);
//     $(el).addClass("displayed");
//   });

//   // var grid = $('#post-loop').isotope({
//   //   // options
//   //   itemSelector: '.home-post',
//   //   layoutMode: 'fitRows'
//   // });
//   // debugger;
//   initIso('#post-loop', '.home-post');
// }

// function initIso(gridSelector, gridItemSelector) {
//   var grid = document.querySelector(gridSelector);
//   // var elem = document.querySelector('.grid');
//   window.postGrid = new Isotope(grid, {
//     // options
//     itemSelector: gridItemSelector,
//     layoutMode: 'fitRows',
//     // transitionDuration: '0.8s',
//     hiddenStyle: {
//       opacity: 0
//     },
//     visibleStyle: {
//       opacity: 1
//     }
//   });

//   // element argument can be a selector string
//   //   for an individual element
//   // var iso = new Isotope( '.grid', {
//   //   // options
//   // });
// }

// function filterPosts(tagSlug) {
//   // window.postGrid.isotope({ filter: filter });
//   window.postGrid.arrange({
//     // item element provided as argument
//     filter: function(el) {
//       if(tagSlug === 'all') return true;
//       else return $(el).hasClass('tag-' + tagSlug);
//       // var number = itemElem.querySelector('.number').innerText;
//       // return parseInt( number, 10 ) > 50;
//     }
//   });

//   $(".tag-link").removeClass("active")
//   $(".tag-link.slug-" + tagSlug).addClass("active");
// }

// axios.get(ghost.url.api('posts', {include: "tags", limit: "all"})).then(function(response) {
//   window.posts = response.data.posts;
//   // renderPostsWithTag();
//   renderPosts();
// }).catch(function(error) {
//   console.error("Couldn't GET posts", error);
// });