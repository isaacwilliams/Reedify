(function() {
  var AppRouter, ChangesPopupView, EditStreamPopupView, FeedItem, FeedItemList, FeedList, LoginPopupView, ManageFeedsPopupView, Navigation, PopupView, ReedifyApp, UserData, Wrangler, app,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  FeedList = (function() {
    function FeedList() {}

    FeedList.prototype.loadFeeds = function(forceReload, success) {
      var _this = this;
      this.feeds = JSON.parse(localStorage.getItem("reedify.userFeeds"));
      if (!this.feeds || forceReload) {
        return app.wrangler.query('subscriptions/list', {}, function(data) {
          _this.feeds = data.feeds;
          localStorage.setItem("reedify.userFeeds", JSON.stringify(_this.feeds));
          if (success) {
            return success();
          }
        });
      } else {
        if (success) {
          return success();
        }
      }
    };

    FeedList.prototype.getFeed = function(id) {
      var _feed, _i, _len, _ref;
      _ref = this.feeds;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        _feed = _ref[_i];
        if (id === _feed.feed_id) {
          return _feed;
        }
      }
      return null;
    };

    FeedList.prototype.removeFeed = function(id) {
      var feedCount, i, _feed;
      feedCount = this.feeds.length - 1;
      i = 0;
      while (i < feedCount) {
        _feed = this.feeds[i];
        if (_feed && _feed.feed_id === id) {
          this.feeds.splice(i, 1);
          i = feedCount;
        }
        i++;
      }
      localStorage.setItem("reedify.userFeeds", JSON.stringify(this.feeds));
      return null;
    };

    FeedList.prototype.getSiteURLForFeedId = function(id) {
      var _feed, _i, _len, _ref;
      if (this.feeds) {
        _ref = this.feeds;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          _feed = _ref[_i];
          if (id === _feed.feed_id) {
            return _feed.feed_url;
          }
        }
      }
      return null;
    };

    FeedList.prototype.getSelectedFeedList = function(selectedFeeds) {
      var feed, feedList, _i, _len;
      feedList = JSON.parse(JSON.stringify(this.feeds));
      for (_i = 0, _len = feedList.length; _i < _len; _i++) {
        feed = feedList[_i];
        if (selectedFeeds.indexOf(feed.feed_id) !== -1) {
          feed.selected = true;
        } else {
          feed.selected = false;
        }
      }
      return feedList;
    };

    return FeedList;

  })();

  PopupView = (function() {
    PopupView.prototype.template = null;

    PopupView.prototype.animationShow = 'popup-show';

    PopupView.prototype.animationHide = 'popup-hide';

    function PopupView() {
      this.$el = $(this.template(this));
    }

    PopupView.prototype.showPopup = function(callback) {
      $('body').addClass('noscroll');
      return this.$el.animate(this.animationShow, {
        duration: 250,
        easing: 'ease-in-out',
        complete: function() {
          if (callback) {
            return callback();
          }
        }
      });
    };

    PopupView.prototype.hidePopup = function(callback) {
      var _this = this;
      $('body').removeClass('noscroll');
      return this.$el.animate(this.animationHide, {
        duration: 250,
        easing: 'ease-in-out',
        complete: function() {
          _this.$el.remove();
          if (callback) {
            return callback();
          }
        }
      });
    };

    return PopupView;

  })();

  LoginPopupView = (function(_super) {
    __extends(LoginPopupView, _super);

    LoginPopupView.prototype.template = window.reedify.templates.user_login;

    LoginPopupView.prototype.animationShow = 'login-popup-show';

    function LoginPopupView() {
      var loginPopup;
      this.$el = $(this.template({
        version: app.version
      }));
      loginPopup = this;
      this.$el.find('form').on('submit', function(e) {
        var email, password;
        email = loginPopup.$el.find('input[name="email"]').val();
        password = loginPopup.$el.find('input[name="password"]').val();
        loginPopup.$el.addClass('loading');
        app.user.login(email, password, function(data) {
          return loginPopup.hidePopup();
        }, function(data) {
          if (data != null ? data.error : void 0) {
            loginPopup.$el.find('.error').html(data.error);
          }
          return loginPopup.$el.removeClass('loading');
        });
        return false;
      });
    }

    return LoginPopupView;

  })(PopupView);

  ChangesPopupView = (function(_super) {
    __extends(ChangesPopupView, _super);

    ChangesPopupView.prototype.template = window.reedify.templates.popup_about;

    ChangesPopupView.prototype.animationShow = 'login-popup-show';

    function ChangesPopupView() {
      var _this = this;
      this.$el = $(this.template(this));
      $.ajax({
        url: '/assets/readme.html',
        success: function(data) {
          _this.$el.find('div.content div.about-content').html(data);
          return _this.showPopup();
        }
      });
    }

    return ChangesPopupView;

  })(PopupView);

  ManageFeedsPopupView = (function(_super) {
    __extends(ManageFeedsPopupView, _super);

    ManageFeedsPopupView.prototype.template = window.reedify.templates.popup_feed_edit;

    function ManageFeedsPopupView() {
      var $el, managePopup;
      managePopup = this;
      this.$el = $el = $(this.template(window.app.feedList));
      this.showPopup();
      this.$el.find('a.close-button').on('click', function(e) {
        e.preventDefault();
        return managePopup.hidePopup();
      });
      this.$el.find('a.feed-unsubscribe').on('click', function(e) {
        var $listItem, feedId;
        e.preventDefault();
        feedId = parseInt($(this).attr('rel'));
        $listItem = $el.find("#feed-" + feedId);
        $listItem.css({
          'opacity': 0.5
        });
        return app.wrangler.query('subscriptions/remove_feed', {
          feed_id: feedId
        }, function(data) {
          return $listItem.remove();
        }, app.feedList.removeFeed(feedId), function(data) {
          return $listItem.css({
            'opacity': 1.0
          });
        });
      });
    }

    return ManageFeedsPopupView;

  })(PopupView);

  EditStreamPopupView = (function(_super) {
    __extends(EditStreamPopupView, _super);

    EditStreamPopupView.prototype.template = window.reedify.templates.popup_stream_edit;

    function EditStreamPopupView(streamId) {
      var $el, editStream, filterCache, selectedFeedIds, selectedFeeds, streamPopup, _feed, _i, _j, _len, _len1, _ref, _ref1, _stream,
        _this = this;
      editStream = {};
      if (streamId) {
        _ref = window.app.nav.streams.streams;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          _stream = _ref[_i];
          if (_stream.stream_id === streamId) {
            editStream = _stream;
          }
        }
      }
      if (editStream.feeds) {
        selectedFeedIds = [];
        _ref1 = editStream.feeds;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          _feed = _ref1[_j];
          selectedFeedIds.push(_feed.feed_id);
        }
        selectedFeeds = window.app.feedList.getSelectedFeedList(selectedFeedIds);
        editStream.feeds = selectedFeeds;
      } else {
        editStream.feeds = window.app.feedList.feeds;
      }
      this.all_feeds = editStream.all_feeds;
      this.feeds = editStream.feeds;
      this.only_unread = editStream.only_unread;
      this.stream_id = editStream.stream_id;
      this.title = editStream.title;
      this.search_term = editStream.search_term;
      streamPopup = this;
      this.$el = $el = $(this.template(this));
      this.showPopup();
      if (!this.stream_id || this.all_feeds) {
        this.$el.find('input[name="all_feeds"]').attr('checked', true);
        this.$el.find('div.include-only').addClass('hide');
      }
      this.$el.find('input[name="all_feeds"]').on('change', function(e) {
        if ($(this)[0].checked) {
          return $el.find('div.include-only').addClass('hide');
        } else {
          return $el.find('div.include-only').removeClass('hide');
        }
      });
      this.$el.find('a.cancel').on('click', function(e) {
        e.preventDefault();
        return _this.hidePopup();
      });
      this.$el.find('a.destroy-feed').on('click', function(e) {
        var options;
        e.preventDefault();
        $el.addClass('loading');
        options = {
          stream_id: streamPopup.stream_id
        };
        return app.wrangler.query('streams/destroy', options, function(data) {
          window.app.nav.loadStreams(true);
          return streamPopup.hidePopup();
        }, function(data) {
          return console.log(data);
        });
      });
      filterCache = [];
      this.$el.find('li.list-feed-item').each(function(i) {
        return filterCache.push({
          string: $(this).text().toLowerCase(),
          dom: $(this)
        });
      });
      this.$el.find('div.filter input.filter').on('keyup click search', function(e) {
        var item, searchTerm, _k, _len2, _results;
        searchTerm = $(this).val().toLowerCase();
        _results = [];
        for (_k = 0, _len2 = filterCache.length; _k < _len2; _k++) {
          item = filterCache[_k];
          if (item.string.indexOf(searchTerm) !== -1) {
            _results.push(item.dom.removeClass('hide'));
          } else {
            _results.push(item.dom.addClass('hide'));
          }
        }
        return _results;
      });
      this.$el.find('div.filter a.filter-select-all').on('click', function(e) {
        e.preventDefault();
        return $el.find('input.feed-checkbox').attr('checked', true);
      });
      this.$el.find('div.filter a.filter-select-none').on('click', function(e) {
        e.preventDefault();
        return $el.find('input.feed-checkbox').removeAttr('checked');
      });
      this.$el.find('form').on('submit', function(e) {
        var data, feedId, feedsSelected, options, queryURL, _data, _k, _len2;
        e.preventDefault();
        $el.addClass('loading');
        data = $(this).serializeArray();
        console.log(options);
        options = {};
        feedsSelected = [];
        for (_k = 0, _len2 = data.length; _k < _len2; _k++) {
          _data = data[_k];
          if (_data.value === 'on') {
            _data.value = 'true';
          }
          if (_data.name.indexOf('feed_') === -1) {
            options[_data.name] = _data.value;
          } else {
            feedId = _data.name.replace('feed_', '');
            console.log(feedId);
            feedsSelected.push(feedId);
          }
        }
        if (!options.only_unread) {
          options.only_unread = 'false';
        }
        if (!options.all_feeds) {
          options.all_feeds = 'false';
        }
        options.feed_ids = feedsSelected.join(',');
        console.log("SAVE STREAM", data, options);
        queryURL = 'streams/update';
        if (options.stream_id === "" || options.stream_id === null) {
          queryURL = 'streams/create';
        }
        app.wrangler.query(queryURL, options, function(data) {
          window.app.nav.loadStreams(true);
          $el.removeClass('loading');
          return streamPopup.hidePopup();
        }, function(data) {
          console.log(data);
          window.app.nav.loadStreams(true);
          $el.removeClass('loading');
          return streamPopup.hidePopup();
        });
        return false;
      });
    }

    return EditStreamPopupView;

  })(PopupView);

  UserData = (function() {
    UserData.prototype.accessToken = null;

    UserData.prototype.template = window.reedify.templates.user_login;

    function UserData() {
      if (Cookies.get('reedify.accessToken')) {
        this.accessToken = Cookies.get('reedify.accessToken');
      }
    }

    UserData.prototype.setAccessToken = function(accessToken) {
      this.accessToken = accessToken;
      return Cookies.set('reedify.accessToken', accessToken, {
        expires: 60 * 60 * 24 * 30
      });
    };

    UserData.prototype.showLogin = function() {
      var loginPopup;
      loginPopup = new LoginPopupView();
      $('body').append(loginPopup.$el);
      return loginPopup.showPopup();
    };

    UserData.prototype.login = function(email, password, success, error) {
      return app.wrangler.query('users/authorize', {
        email: email,
        password: password
      }, function(data) {
        if (!data.error) {
          app.user.setAccessToken(data.access_token);
          app.router.redirect('/');
          return success(data);
        } else {
          return error(data);
        }
      }, function(data) {
        return error(data);
      });
    };

    UserData.prototype.logout = function() {
      console.log("LOG OUT");
      Cookies.expire('reedify.accessToken');
      localStorage.setItem("reedify.userStreams", null);
      return localStorage.setItem("reedify.userFeeds", null);
    };

    return UserData;

  })();

  Wrangler = (function() {
    Wrangler.prototype.apiProxy = '/wrangle.php';

    function Wrangler() {}

    Wrangler.prototype.query = function(apiURL, options, success, error) {
      var query,
        _this = this;
      options.url = apiURL;
      if (app.user.accessToken) {
        options.access_token = app.user.accessToken;
      }
      console.log("Wrangling: ", apiURL, options);
      query = $.ajax({
        url: this.apiProxy,
        data: options,
        dataType: 'json',
        success: function(data) {
          if (data && !data.error) {
            console.log("Wrangling success:", data);
            if (success) {
              return success(data);
            }
          } else {
            console.log("Wrangling error:", data);
            if (error) {
              return error(data);
            }
          }
        },
        error: function(data) {
          console.log("Wrangling error:", data);
          return error(data);
        }
      });
      return query;
    };

    return Wrangler;

  })();

  app = window.app;

  FeedItem = (function() {
    FeedItem.prototype.template = window.reedify.templates.feed_item;

    FeedItem.prototype.readChanged = false;

    function FeedItem(data, feed) {
      this.feed = feed;
      $.extend(this, data);
      if (data.end) {
        this.template = window.reedify.templates.feed_item_end;
      }
    }

    FeedItem.prototype.select = function() {
      if (!this.readChanged) {
        this.setRead(true);
      }
      return this.$el.addClass('current');
    };

    FeedItem.prototype.setRead = function(read) {
      this.read = read;
      if (this.read) {
        this.$el.removeClass('unread');
      }
      if (!this.read) {
        this.$el.addClass('unread');
      }
      this.readChanged = true;
      return this.updateData();
    };

    FeedItem.prototype.setStarred = function(starred) {
      console.log("SET STAR", this);
      this.starred = starred;
      if (!this.starred) {
        this.$el.removeClass('starred').removeClass('setManual');
      }
      if (this.starred) {
        this.$el.addClass('starred').addClass('setManual');
      }
      return this.updateData();
    };

    FeedItem.prototype.updateData = function() {
      var option;
      option = {
        feed_item_id: this.feed_item_id,
        read: this.read,
        read_later: this.read_later,
        starred: this.starred
      };
      return app.wrangler.query('feed_items/update', option, function(data) {}, function(data) {});
    };

    FeedItem.prototype.render = function() {
      var body, _ref,
        _this = this;
      if (((_ref = this.body) != null ? _ref.indexOf('script') : void 0) !== -1) {
        body = $(this.body);
        body.find('script').remove();
        this.body = body.html();
      }
      if (!this.$el) {
        this.$el = $(this.template(this));
      } else {
        this.$el.html($(this.template(this)).html());
      }
      this.$el.on('click', function(e) {
        return _this.feed.selectItem(_this);
      });
      this.$el.find('.read-status').on('click', function(e) {
        e.stopPropagation();
        return _this.setRead(!_this.read);
      });
      this.$el.find('.star-status').on('click', function(e) {
        e.stopPropagation();
        return _this.setStarred(!_this.starred);
      });
      return this.$el;
    };

    return FeedItem;

  })();

  FeedItemList = (function() {
    FeedItemList.prototype.el = "#feed";

    FeedItemList.prototype.template = window.reedify.templates.feed_item_list;

    FeedItemList.prototype.read = "false";

    FeedItemList.prototype.starred = null;

    FeedItemList.prototype.feed_id = null;

    FeedItemList.prototype.stream_id = null;

    FeedItemList.prototype.offset = 0;

    FeedItemList.prototype.limit = 10;

    FeedItemList.prototype.currentItemId = -1;

    FeedItemList.prototype.currentItem = null;

    FeedItemList.prototype.feedItems = null;

    FeedItemList.prototype.loading = false;

    FeedItemList.prototype.endOfList = false;

    function FeedItemList() {
      this.feedItems = [];
      this.$el = $(this.el);
    }

    FeedItemList.prototype.clear = function() {
      this.$el.html('');
      if (this.current_requst) {
        this.current_requst.abort();
      }
      this.loading = false;
      this.endOfList = false;
      this.feedItems = [];
      this.currentItem = null;
      this.currentItemId = -1;
      this.limit = 10;
      this.offset = 0;
      this.read = 'false';
      this.starred = null;
      this.feed_id = null;
      this.stream_id = null;
      this.$el = $(this.el);
      return this.$el.html(this.template({}));
    };

    FeedItemList.prototype.render = function() {
      var $itemList, feedTtem, _i, _len, _ref, _results;
      $itemList = this.$el.find('div.item-list');
      _ref = this.feedItems;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        feedTtem = _ref[_i];
        if (!feedTtem.$el) {
          _results.push($itemList.append(feedTtem.render()));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    FeedItemList.prototype.navigateNext = function() {
      this.currentItemId++;
      if (this.currentItemId >= this.feedItems.length - 1) {
        this.currentItemId = this.feedItems.length - 1;
      }
      return this.selectItem(this.feedItems[this.currentItemId]);
    };

    FeedItemList.prototype.navigatePrev = function() {
      this.currentItemId--;
      if (this.currentItemId <= 0) {
        this.currentItemId = 0;
      }
      return this.selectItem(this.feedItems[this.currentItemId]);
    };

    FeedItemList.prototype.selectItem = function(item) {
      this.currentItem = item;
      this.currentItemId = this.feedItems.indexOf(item);
      this.$el.find('div.item-list div.item').removeClass('current');
      item.select();
      return item;
    };

    FeedItemList.prototype.setLoading = function(loading) {
      this.current_request = null;
      this.loading = loading;
      if (this.loading) {
        this.$el.addClass('loading');
      }
      if (!this.loading) {
        return this.$el.removeClass('loading');
      }
    };

    FeedItemList.prototype.getFeedItems = function(success, error) {
      var options, queryURL,
        _this = this;
      options = {};
      if (this.read) {
        options.read = this.read;
      }
      if (this.starred) {
        options.starred = this.starred;
      }
      if (this.feed_id) {
        options.feed_id = this.feed_id;
      }
      if (this.offset) {
        options.offset = this.offset;
      }
      if (this.limit) {
        options.limit = this.limit;
      }
      if (this.stream_id) {
        options.stream_id = this.stream_id;
      }
      if (this.feed_id) {
        options.feed_id = this.feed_id;
      }
      this.setLoading(true);
      queryURL = 'feed_items/list';
      if (this.stream_id) {
        queryURL = 'streams/stream_items';
      }
      return this.current_request = app.wrangler.query(queryURL, options, function(data) {
        var feedItem, feed_item, _i, _len, _ref;
        _this.setLoading(false);
        console.log(data, data.count);
        _ref = data.feed_items;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          feed_item = _ref[_i];
          feedItem = new FeedItem(feed_item, _this);
          feedItem.site_url = window.app.feedList.getSiteURLForFeedId(feedItem.feed_id);
          _this.feedItems.push(feedItem);
        }
        if (data.count === 0) {
          feedItem = new FeedItem({
            end: true
          }, _this);
          _this.feedItems.push(feedItem);
          _this.endOfList = true;
        }
        return _this.render();
      }, function(data) {
        return _this.setLoading(false);
      });
    };

    FeedItemList.prototype.getMoreFeedItems = function(success, error) {
      if (!this.loading && !this.endOfList) {
        this.offset += this.limit;
        return this.getFeedItems(success, error);
      }
    };

    return FeedItemList;

  })();

  Navigation = (function() {
    Navigation.prototype.template = window.reedify.templates.nav;

    Navigation.prototype.templateStreams = window.reedify.templates.nav_streams;

    function Navigation() {}

    Navigation.prototype.render = function() {
      if (!this.$el) {
        this.$el = $(this.template({
          feeds: app.feedList.feeds
        }));
        $('body').append(this.$el);
      } else {
        this.$el.html = $(this.template({
          feeds: app.feedList.feeds
        })).html();
      }
      return this.initNavControls();
    };

    Navigation.prototype.initNavControls = function() {
      var nav,
        _this = this;
      nav = this;
      this.$el.find('a.manage-feeds').on('click', function(e) {
        e.preventDefault();
        return _this.manageFeeds();
      });
      this.$el.find('input[name="url"]').on('focus', function(e) {
        return app.disableControls();
      });
      this.$el.find('input[name="url"]').on('blur', function(e) {
        return app.initControls();
      });
      return this.$el.find('form.add-feed').on('submit', function(e) {
        var url;
        e.preventDefault();
        url = _this.$el.find('form.add-feed input[name="url"]').val();
        return _this.addFeed(url);
      });
    };

    Navigation.prototype.showFeedControl = function() {
      return this.$el.find('nav.feeds').show();
    };

    Navigation.prototype.manageFeeds = function() {
      var manangeFeeds;
      manangeFeeds = new ManageFeedsPopupView();
      return $('body').append(manangeFeeds.$el);
    };

    Navigation.prototype.addFeed = function(feedURL) {
      var errorDiv, form, input, successDiv;
      form = this.$el.find('form.add-feed');
      input = form.find('input[name="url"]');
      errorDiv = form.find('div.error');
      successDiv = form.find('div.success');
      form.addClass('loading');
      successDiv.hide();
      errorDiv.hide();
      input.removeClass('error');
      return app.wrangler.query('subscriptions/add_feed_and_wait', {
        feed_url: feedURL,
        choose_first: true
      }, function(data) {
        var hideSuccess, title;
        title = data.feed.title;
        successDiv.show();
        successDiv.text("Subscribed to " + title);
        hideSuccess = function() {
          return successDiv.hide();
        };
        setTimeout(hideSuccess, 2500);
        input.val("");
        form.removeClass('loading');
        return app.feedList.loadFeeds(true);
      }, function(data) {
        var hideError;
        errorDiv.text(data.error);
        errorDiv.show();
        input.addClass('error');
        form.removeClass('loading');
        hideError = function() {
          errorDiv.hide();
          return input.removeClass('error');
        };
        return setTimeout(hideError, 2500);
      });
    };

    Navigation.prototype.loadStreams = function(forceReload, success) {
      var _this = this;
      this.streams = JSON.parse(localStorage.getItem("reedify.userStreams"));
      if (!this.streams || forceReload) {
        return app.wrangler.query('streams/list', {}, function(data) {
          _this.streams = data;
          localStorage.setItem("reedify.userStreams", JSON.stringify(_this.streams));
          _this.buildStreams(_this.streams);
          if (success) {
            return success();
          }
        });
      } else {
        if (success) {
          success();
        }
        return this.buildStreams(this.streams);
      }
    };

    Navigation.prototype.buildStreams = function(streams) {
      var _nav;
      console.log("BUILD STREAMS");
      this.$el.find('nav.streams ul.streams').html(this.templateStreams(streams));
      _nav = this;
      this.$el.find('a.edit-stream').off('click');
      return this.$el.find('a.edit-stream').on('click', function(e) {
        var streamId;
        e.preventDefault();
        streamId = parseInt($(this).attr('rel'));
        return _nav.editStream(streamId);
      });
    };

    Navigation.prototype.editStream = function(streamId) {
      var editStreamPopup;
      app.disableControls();
      editStreamPopup = new EditStreamPopupView(streamId);
      return $('body').append(editStreamPopup.$el);
    };

    Navigation.prototype.selectNav = function(el) {
      var navItem;
      console.log("SELECTED NAV", el);
      this.$el.find('a').removeClass('selected');
      navItem = this.$el.find(el);
      if (!navItem.hasClass('feed')) {
        this.$el.find('li.expand').removeClass('expand');
      }
      navItem.addClass('selected');
      if (navItem.parent().find("ul.feeds").length !== 0) {
        return navItem.parent().addClass('expand');
      }
    };

    return Navigation;

  })();

  AppRouter = (function() {
    AppRouter.prototype.urlBase = '';

    function AppRouter() {
      var controller;
      controller = this;
      this.routes = [];
      this.createRoute('/', function() {
        if (controller.userCheckAuth()) {
          return controller.createFeedUnread();
        }
      });
      this.createRoute('/starred', function() {
        if (controller.userCheckAuth()) {
          return controller.createFeedStarred();
        }
      });
      this.createRoute('/all', function() {
        if (controller.userCheckAuth()) {
          return controller.createFeedAll();
        }
      });
      this.createRoute('/feed/:feed_id', function(feed_id) {
        if (controller.userCheckAuth()) {
          return controller.createFeedBlog(parseInt(feed_id));
        }
      });
      this.createRoute('/stream/:stream_id', function(stream_id) {
        if (controller.userCheckAuth()) {
          return controller.createFeedStream(parseInt(stream_id));
        }
      });
      this.createRoute('/logout', function() {
        return controller.userLogout();
      });
      this.createRoute('/login', function() {
        return controller.userLogin();
      });
      this.createRoute('/about', function() {
        return controller.showAbout();
      });
    }

    AppRouter.prototype.start = function() {
      var controller;
      this.matchRoute(window.location.pathname);
      controller = this;
      return $('a.reedControl').on('click', function(e) {
        var goURL;
        e.preventDefault();
        goURL = $(this).attr('href');
        history.pushState(null, null, goURL);
        return controller.matchRoute(goURL);
      });
    };

    AppRouter.prototype.createRoute = function(path, callback) {
      var route;
      path = path.replace(/:([\w\d]+)/g, "([^\/]+)");
      path = path.replace(/\*([\w\d]+)/g, "(.*)");
      route = {
        path: new RegExp("^" + path + "$", "gi"),
        callback: callback
      };
      return this.routes.push(route);
    };

    AppRouter.prototype.matchRoute = function(path) {
      var match, route, _i, _len, _ref, _results;
      path = path.replace(this.urlBase, '');
      _ref = this.routes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        route = _ref[_i];
        match = route.path.exec(path);
        if (match) {
          if (match.length === 1) {
            route.callback();
          }
          if (match.length === 2) {
            _results.push(route.callback(match[1]));
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    AppRouter.prototype.redirect = function(path) {
      history.pushState(null, null, path);
      return this.matchRoute(path);
      /*
      		console.log window.location.pathname
      		if window.location.pathname != @urlBase + path
      			window.location.pathname = @urlBase + path
      */

    };

    AppRouter.prototype.getNav = function() {
      return window.app.nav;
    };

    AppRouter.prototype.getFeed = function() {
      return window.app.feed;
    };

    AppRouter.prototype.setFeed = function(feed) {
      window.app.feed = feed;
      return window.app.feed;
    };

    AppRouter.prototype.createFeed = function() {
      var feed;
      if (!window.app.nav) {
        window.app.createNavigation();
      }
      feed = this.getFeed();
      feed.clear();
      return feed;
    };

    AppRouter.prototype.createFeedUnread = function() {
      var feed;
      feed = this.createFeed();
      feed.render();
      feed.getFeedItems();
      return this.getNav().selectNav('.unread');
    };

    AppRouter.prototype.createFeedStarred = function() {
      var feed;
      feed = this.createFeed();
      feed.starred = "true";
      feed.read = null;
      feed.render();
      feed.getFeedItems();
      return this.getNav().selectNav('.starred');
    };

    AppRouter.prototype.createFeedAll = function() {
      var feed;
      feed = this.createFeed();
      feed.starred = null;
      feed.read = null;
      feed.render();
      feed.getFeedItems();
      return this.getNav().selectNav('.all');
    };

    AppRouter.prototype.createFeedStream = function(streamId) {
      var feed;
      feed = this.createFeed();
      feed.starred = null;
      feed.read = null;
      feed.stream_id = streamId;
      feed.render();
      feed.getFeedItems();
      return this.getNav().selectNav(".stream_" + streamId);
    };

    AppRouter.prototype.createFeedBlog = function(feedId) {
      var feed;
      feed = this.createFeed();
      feed.starred = null;
      feed.read = null;
      feed.feed_id = feedId;
      feed.render();
      feed.getFeedItems();
      return this.getNav().selectNav(".feed_" + feedId);
    };

    AppRouter.prototype.showAbout = function() {
      var changesPopup;
      changesPopup = new ChangesPopupView();
      return $('body').append(changesPopup.$el);
    };

    AppRouter.prototype.userCheckAuth = function() {
      if (app.user.accessToken) {
        return true;
      }
      this.redirect("/login");
      return false;
    };

    AppRouter.prototype.userLogout = function() {
      app.user.logout();
      return window.location.pathname = "";
    };

    AppRouter.prototype.userLogin = function() {
      return app.user.showLogin();
    };

    return AppRouter;

  })();

  ReedifyApp = (function() {
    ReedifyApp.prototype.version = "Reedify 0.8.2";

    function ReedifyApp() {}

    ReedifyApp.prototype.init = function() {
      this.registerHandlebarsHelpers();
      this.user = new UserData();
      this.wrangler = new Wrangler();
      this.router = new AppRouter();
      return this.router.start();
    };

    ReedifyApp.prototype.createNavigation = function() {
      var feedLoaded, navLoaded,
        _this = this;
      console.log("CREATE APP");
      this.nav = new Navigation();
      this.feed = new FeedItemList();
      this.feedList = new FeedList();
      this.nav.render();
      navLoaded = false;
      feedLoaded = false;
      this.nav.loadStreams(false, function() {
        navLoaded = true;
        console.log("loaded:", navLoaded, feedLoaded);
        if (navLoaded && feedLoaded) {
          return _this.initFeed();
        }
      });
      return this.feedList.loadFeeds(false, function() {
        feedLoaded = true;
        _this.nav.showFeedControl();
        console.log("loaded:", navLoaded, feedLoaded);
        if (navLoaded && feedLoaded) {
          return _this.initFeed();
        }
      });
    };

    ReedifyApp.prototype.initFeed = function() {
      console.log('INIT FEED');
      return this.initControls();
    };

    ReedifyApp.prototype.initControls = function() {
      var $feedContainer, $feedList;
      $feedContainer = $("#feed-container");
      $feedList = $("#feed");
      $(window).on('scroll', function(e) {
        var feed, scrollBottom;
        scrollBottom = $feedList.height() - $(window).scrollTop();
        if (scrollBottom < 2500) {
          feed = window.app.feed;
          return feed.getMoreFeedItems();
        }
      });
      return $(window).on('keypress', function(e) {
        var feed, item, keyVal, newWindow;
        keyVal = String.fromCharCode(e.keyCode);
        feed = window.app.feed;
        console.log("KEY", keyVal, feed);
        switch (keyVal) {
          case 'j':
            item = feed.navigateNext();
            return $.scrollTo(item.$el.offset().top - 16);
          case 'k':
            item = feed.navigatePrev();
            return $.scrollTo(item.$el.offset().top - 16);
          case 'm':
            return feed.currentItem.setRead(!feed.currentItem.read);
          case 'l':
            return feed.currentItem.setStarred(!feed.currentItem.starred);
          case 'o':
            newWindow = window.open(feed.currentItem.url, '_blank');
            return window.focus();
        }
      });
    };

    ReedifyApp.prototype.disableControls = function() {
      $(window).off('scroll');
      return $(window).off('keypress');
    };

    ReedifyApp.prototype.registerHandlebarsHelpers = function() {
      window.Handlebars.registerHelper('date', function(unixTime) {
        var date;
        date = moment(new Date(unixTime * 1000));
        return date.format('MMMM Do YYYY, h:mm:ss a');
      });
      return window.Handlebars.registerHelper('date_friendly', function(unixTime) {
        var date;
        date = moment(new Date(unixTime * 1000));
        return date.fromNow();
      });
    };

    return ReedifyApp;

  })();

  $(function() {
    document.addEventListener("touchstart", function() {
      return true;
    });
    app = window.app = new ReedifyApp();
    return app.init();
  });

}).call(this);
