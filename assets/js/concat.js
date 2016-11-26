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

window.Menu = (function() {
  function Menu() {
    var self = this;
    this.state = false;
    this.elements = [];
    [].push.apply(this.elements, arguments);

    $(".menu-button").click(function(e) {
      e.stopPropagation();
    })

    $("#main-wrap").click(function() {
      if(self.state) self.toggle();
    });
  }

  Menu.prototype.toggle = function() {
    this.state = !this.state;
    if(this.state) {
      this.elements.forEach(function(el) {
        $(el).addClass('open');
      });

      // $(this.wrap).addClass('shift-left');
      // $(this.menu).addClass('shift-left');
      // $(".menu-button").addClass('open');
    } else {
      this.elements.forEach(function(el) {
        $(el).removeClass('open');
      });
      // $(this.wrap).removeClass('shift-left');
      // $(this.menu).removeClass('shift-left');
      // $(".menu-button").removeClass('open');
    }
  }

  return Menu;
})();

// window.toggleMenu = function(toggle) {


//   $("#main-wrap").addClass("shift-left");
// }