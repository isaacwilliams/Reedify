this["reedify"] = this["reedify"] || {};
this["reedify"]["templates"] = this["reedify"]["templates"] || {};

this["reedify"]["templates"]["feed_item"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  return "unread";
  }

function program3(depth0,data) {
  
  
  return "starred";
  }

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<div class='author'>";
  if (stack1 = helpers.author) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.author; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</div>";
  return buffer;
  }

  buffer += "<div class='item ";
  stack1 = helpers.unless.call(depth0, depth0.read, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " ";
  stack1 = helpers['if'].call(depth0, depth0.starred, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "' >\n	<header>\n		<div class='status'>\n			<div class='star-status'></div>\n			<div class='read-status'></div>\n		</div>\n		\n		<div class='meta'>\n			\n			<a class='reedControl feed-name' href='/feed/";
  if (stack1 = helpers.feed_id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.feed_id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' rel='";
  if (stack1 = helpers.feed_id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.feed_id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'>\n				<span class='title'>";
  if (stack1 = helpers.feed_name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.feed_name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\n				<img src=\"http://www.google.com/s2/favicons?domain=";
  if (stack1 = helpers.site_url) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.site_url; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" alt=\"\" />\n			</a>\n\n			<div class='time'>\n				<div class='date'>\n					";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.date || depth0.date),stack1 ? stack1.call(depth0, depth0.published_at, options) : helperMissing.call(depth0, "date", depth0.published_at, options)))
    + "\n				</div>\n				<div class='friendly'>\n					";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.date_friendly || depth0.date_friendly),stack1 ? stack1.call(depth0, depth0.published_at, options) : helperMissing.call(depth0, "date_friendly", depth0.published_at, options)))
    + "\n				</div>				\n			</div>\n								\n		</div>\n		\n		<div class='title'>\n			<a href=\"";
  if (stack2 = helpers.url) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.url; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\" target=\"_blank\">";
  if (stack2 = helpers.title) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.title; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</a>\n			";
  stack2 = helpers['if'].call(depth0, depth0.author, {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n		</div>	\n				\n	</header>\n	<div class='content'>";
  if (stack2 = helpers.body) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.body; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</div>	\n</div>";
  return buffer;
  });

this["reedify"]["templates"]["feed_item_end"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class='item end' >\n	<div class='content'>\n		End of the road, bud.\n	</div>\n</div>";
  });

this["reedify"]["templates"]["feed_item_list"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class='item-list'></div>\n<div class='loader' id='feed-loader'>\n	<span>☀</span>\n	Loading...\n</div>";
  });

this["reedify"]["templates"]["nav"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id='nav-container'>\n	\n	<div class='app-title'>\n		<span>Reedify</span>\n	</div>\n	\n	<nav class='types'>\n		<div class='title'>Show:</div>\n		<ul>\n			<li>\n				<a href=\"/\" class='reedControl unread'>Unread</a>\n			</li>\n			<li>\n				<a href=\"/starred\" class='reedControl starred'>Starred</a>\n			</li>\n			<li>\n				<a href=\"/all\" class='reedControl all'>All Items</a>\n			</li>\n		</ul>\n	</nav>\n	<nav class='streams'>\n		<div class='title'>\n			Stream:\n			<a href=\"#\" class='create-stream edit-stream'>+ Create</a>\n		</div>\n		<ul class='streams'>\n	\n		</ul>\n	</nav>		\n	<nav class='feeds' style=\"display:none;\">\n		<ul>\n			<li>\n				<form class='add-feed'>\n					<div class='loader'><span>☀</span>&nbsp;</div>	\n					<input name='url' class='add-feed' type='text' placeholder='Subsribe to feed' />\n					<div class='success'>Subscribed</div>\n					<div class='error'>Failed to subscribe to feed</div>\n				</form>\n			</li>\n			<li><a href='/feeds' class='manage-feeds' >Manage feeds</a></li>\n		</ul>\n	</nav>\n	<nav class='options'>\n\n		<ul>\n			<li><a href='/logout' class='reedControl logout' >Log out</a></li>\n		</ul>\n		\n	</nav>\n	\n</div>	\n	";
  });

this["reedify"]["templates"]["nav_streams"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n	<li>\n		<a href=\"/stream/";
  if (stack1 = helpers.stream_id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.stream_id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" rel='";
  if (stack1 = helpers.stream_id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.stream_id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' class='reedControl stream stream_";
  if (stack1 = helpers.stream_id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.stream_id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'>";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</a>\n		<a href=\"#\" class='edit-stream edit-stream_";
  if (stack1 = helpers.stream_id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.stream_id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' rel='";
  if (stack1 = helpers.stream_id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.stream_id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'>Edit</a>\n		<ul class='feeds'>\n			";
  stack1 = helpers.each.call(depth0, depth0.feeds, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		</ul>\n	</li>\n";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n			<li>\n				<a href=\"/feed/";
  if (stack1 = helpers.feed_id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.feed_id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" rel='";
  if (stack1 = helpers.feed_id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.feed_id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' class='reedControl feed feed-name feed_";
  if (stack1 = helpers.feed_id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.feed_id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'>\n					<img src=\"http://www.google.com/s2/favicons?domain=";
  if (stack1 = helpers.site_url) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.site_url; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" alt=\"\" />\n					<span class='title'>";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\n				</a>\n			</li>\n			";
  return buffer;
  }

  stack1 = helpers.each.call(depth0, depth0.streams, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  });

this["reedify"]["templates"]["popup_about"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id='about' class='popup full'>\n	<div class='content' >\n		<a href='/' class='close-button'>Close</a>\n		<div class='about-content'></div>\n	</div>\n</div>";
  });

this["reedify"]["templates"]["popup_feed_edit"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n			<li class='list-feed-item' id=\"feed-";
  if (stack1 = helpers.feed_id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.feed_id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n				\n				<a href=\"#\" class='feed-unsubscribe' rel='";
  if (stack1 = helpers.feed_id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.feed_id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'>Unsubscribe</a>\n				<a href=\"/feed/";
  if (stack1 = helpers.feed_id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.feed_id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class='reedControl site-name'>";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</a>\n				<a href=\"";
  if (stack1 = helpers.site_url) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.site_url; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" target=\"_blank\" class='site-url'>";
  if (stack1 = helpers.site_url) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.site_url; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</a>\n				\n			</li>\n			";
  return buffer;
  }

  buffer += "<div id='stream-edit' class='popup'>\n	\n	<div class='stream-edit content' >\n		\n		<a href='#' class='close-button'>Close</a>\n		<h1>Manage Feed Subscriptions</h1>\n		\n		<ul class='feed-list'>\n			";
  stack1 = helpers.each.call(depth0, depth0.feeds, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		</ul>\n		\n	</div>\n</div>";
  return buffer;
  });

this["reedify"]["templates"]["popup_stream_edit"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return "\n		<h1>Edit Smart Stream</h1>		\n		";
  }

function program3(depth0,data) {
  
  
  return "\n		<h1>Create Smart Stream</h1>\n		";
  }

function program5(depth0,data) {
  
  var stack1;
  if (stack1 = helpers.stream_id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.stream_id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  return escapeExpression(stack1);
  }

function program7(depth0,data) {
  
  var stack1;
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  return escapeExpression(stack1);
  }

function program9(depth0,data) {
  
  var stack1;
  if (stack1 = helpers.search_term) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.search_term; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  return escapeExpression(stack1);
  }

function program11(depth0,data) {
  
  
  return "checked=\"checked\"";
  }

function program13(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n						<li class='list-feed-item'>\n							<label>\n								\n								<div class='item-pre'>\n									<input name='feed_";
  if (stack1 = helpers.feed_id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.feed_id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' type='checkbox' class='feed-checkbox'\n									";
  stack1 = helpers['if'].call(depth0, depth0.selected, {hash:{},inverse:self.noop,fn:self.program(11, program11, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " />\n								</div>\n								<div class='item-content'>\n									<div class='site-name'>";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</div>\n									<a href=\"";
  if (stack1 = helpers.site_url) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.site_url; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" target=\"_blank\" class='site-url'>";
  if (stack1 = helpers.site_url) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.site_url; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</a>\n								</div>\n								\n								\n							</label>\n						</li>\n						";
  return buffer;
  }

function program15(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "	\n				<a href=\"#\" class='destroy-feed alert right' rel=\"";
  if (stack1 = helpers.stream_id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.stream_id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">Delete</a>	\n				";
  return buffer;
  }

  buffer += "<div id='stream-edit' class='popup'>\n	\n	<div class='stream-edit content' >\n		\n		";
  stack1 = helpers['if'].call(depth0, depth0.stream_id, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		\n		<form action=\"/edit_stream/\">\n			\n			<input type=\"hidden\" name=\"stream_id\" value='";
  stack1 = helpers['if'].call(depth0, depth0.stream_id, {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "' />\n	\n			<div class='group'>\n				<input name='title' type=\"text\" value='";
  stack1 = helpers['if'].call(depth0, depth0.title, {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "' placeholder=\"Title\" class='large' />\n			</div>\n	\n			<div class='group'>\n		\n				<label>\n					<input name='search_term' type=\"text\" value='";
  stack1 = helpers['if'].call(depth0, depth0.search_term, {hash:{},inverse:self.noop,fn:self.program(9, program9, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "' placeholder='Search terms' />	\n				</label>\n	\n				<label>\n					<input name='only_unread' type='checkbox' ";
  stack1 = helpers['if'].call(depth0, depth0.only_unread, {hash:{},inverse:self.noop,fn:self.program(11, program11, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " />\n					Only include unread items\n				</label>\n		\n			</div>\n	\n			<div class='group'>		\n				<label>\n					All Feeds:\n					<input name='all_feeds' type='checkbox' />	\n				</label>\n				\n				<div class='include-only'>\n					<div class='title'>\n						Include only these feeds:\n						\n						<div class='filter'>\n							Filter:\n							<input type='search' class='filter' />						\n						</div>\n						<div class='filter'>\n							Select:\n							<a class='filter-select-all' href=\"#\">All</a> / \n							<a class='filter-select-none' href=\"#\">None</a>							\n						</div>\n						\n					</div>\n					<ul class='feed-list'>\n						";
  stack1 = helpers.each.call(depth0, depth0.feeds, {hash:{},inverse:self.noop,fn:self.program(13, program13, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n					</ul>\n				</div>\n				\n				\n			</div>\n			<div class='group'>\n				<div class='loader'><span>☀</span>&nbsp;</div>\n				<input type='submit' value='Save Changes' />\n				<a class='cancel' href='#'>Cancel</a>\n				";
  stack1 = helpers['if'].call(depth0, depth0.stream_id, {hash:{},inverse:self.noop,fn:self.program(15, program15, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n			</div>\n			\n			\n		</form>\n	\n	</div>\n	\n</div>";
  return buffer;
  });

this["reedify"]["templates"]["user_login"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div id='login-popup' class='popup'>\n	\n	<div class='content' >\n		\n		<form>\n			<div class='title'>\n				<div class='app-title'><span>Reedify</span></div>	\n				<div class='feed-wrangle'></div>\n			</div>\n			\n			<div class='group login'>\n				\n				<p>Log in using Feed Wrangler <img src=\"/assets/feedwrangler-16.png\" width=\"16\" height=\"16\" alt=\"Feed Wrangler Logo\"></p>\n				\n				<input name='email' value='' type='email' placeholder=\"Email\" />\n				<input name='password' value='' type='password' placeholder=\"Password\" />\n				\n				<input type='submit' value='Log in' />	\n				<div class='loader'><span>☀</span>&nbsp;</div>	\n				\n				<div class='error'></div>\n									\n			</div>\n			\n			<div class='group'>\n				<br/></br/>\n				<div class='small'>\n					\n					<p>Reedify is an RSS client for <a href=\"http://feedwrangler.net/\" target=\"_blank\">Feed Wrangler</a>. If you don't have an account, you'll need to sign up. Absolutely no information is stored server-side by Reedify. It's just a dumb front-end client for Feed Wrangler's syncing platform.</p>\n					<p>Written by <a href=\"http://isaacwilliams.net\" target=\"_blank\">Isaac Williams</a>. Questions, bugs, etc: <a href=\"http://twitter.com/isaacwilliams\" target=\"_blank\">@isaacwilliams</a>.</p>\n					<!-- <p>Built with the help of Zepto, Handlebars, Coffeescript &amp; Sass</p> -->\n					\n				</div>		\n				\n				\n			</div>\n			\n			\n		</form>\n		\n	</div>\n	\n	<div class='app-version'>\n		<div>";
  if (stack1 = helpers.version) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.version; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</div>\n		<a href=\"/about\" class=\"reedControl\" >Change log</a>\n	</div>\n	\n</div>";
  return buffer;
  });