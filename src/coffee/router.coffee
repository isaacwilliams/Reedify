class AppRouter
	
	urlBase:''
	
	constructor: () ->
		controller = @
				
		@routes = []
		@createRoute '/', ()->
			if controller.userCheckAuth() then controller.createFeedUnread()
		@createRoute '/starred', ()-> 
			if controller.userCheckAuth() then controller.createFeedStarred()
		@createRoute '/all', ()-> 
			if controller.userCheckAuth() then controller.createFeedAll()
		@createRoute '/feed/:feed_id', ( feed_id )->
			if controller.userCheckAuth() then controller.createFeedBlog parseInt(feed_id)
		@createRoute '/stream/:stream_id', ( stream_id )->
			if controller.userCheckAuth() then controller.createFeedStream parseInt(stream_id)			
		@createRoute '/logout', ()->
			controller.userLogout()			
		@createRoute '/login', ()->
			controller.userLogin()			
		@createRoute '/about', ()->
			controller.showAbout()
			
		
	start:()->		
		@matchRoute( window.location.pathname )
				
		controller = @
		$('a.reedControl').on 'click', ( e )-> 
			e.preventDefault()			
			goURL = $(this).attr('href')
			history.pushState null, null, goURL 
			controller.matchRoute goURL
	
	createRoute:( path, callback )->
		
		path = path.replace /:([\w\d]+)/g, "([^\/]+)"
		path = path.replace /\*([\w\d]+)/g, "(.*)"
		
		route = 
			path:new RegExp( "^" + path + "$", "gi" )
			callback:callback
		
		@routes.push route
			
	matchRoute:( path )->
		
		path = path.replace @urlBase, ''
		
		for	route in @routes
			match = route.path.exec( path )
			if match
				if match.length == 1 then route.callback()
				if match.length == 2 then route.callback( match[1] )
	
	redirect:( path )->
		history.pushState null, null, path
		@matchRoute( path )
		
		###
		console.log window.location.pathname
		if window.location.pathname != @urlBase + path
			window.location.pathname = @urlBase + path
		###
		
	getNav:()-> 
		return window.app.nav
	getFeed:()-> return window.app.feed
	setFeed:(feed)->
		window.app.feed = feed
		return window.app.feed
	
	createFeed:()->
		if not window.app.nav then window.app.createNavigation()
		feed = @getFeed()
		feed.clear()
		return feed
		
	createFeedUnread:()->		
		feed = @createFeed()
		
		feed.render()
		feed.getFeedItems()
		
		@getNav().selectNav '.unread'	
		
	createFeedStarred:()->		
		feed = @createFeed()

		feed.starred = "true"
		feed.read = null
		
		feed.render()
		feed.getFeedItems()
		
		@getNav().selectNav '.starred'
		
		
	createFeedAll:()->		
		feed = @createFeed()
		
		feed.starred = null
		feed.read = null
		
		feed.render()
		feed.getFeedItems()

		@getNav().selectNav '.all'

		
	createFeedStream:( streamId )->
		
		feed = @createFeed()
		
		feed.starred = null
		feed.read = null
		feed.stream_id = streamId
		
		feed.render()
		feed.getFeedItems()
		
		@getNav().selectNav ".stream_#{streamId}"

		
	createFeedBlog:(feedId)->
		
		feed = @createFeed()
		
		feed.starred = null
		feed.read = null
		feed.feed_id = feedId
		
		feed.render()
		feed.getFeedItems()
		
		@getNav().selectNav ".feed_#{feedId}"
	
	showAbout:()->				
		changesPopup = new ChangesPopupView()
		$('body').append changesPopup.$el
		
	userCheckAuth:()->
		if app.user.accessToken then return true
		@redirect "/login"
		return false
	
	userLogout:()->
		app.user.logout()
		window.location.pathname = ""
	
	userLogin:()->
		app.user.showLogin()