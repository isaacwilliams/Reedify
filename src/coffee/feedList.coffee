class FeedList
	
	constructor: () ->
	
	loadFeeds:( forceReload, success )->
		
		@feeds = JSON.parse localStorage.getItem("reedify.userFeeds")
		
		if not @feeds or forceReload
			app.wrangler.query 'subscriptions/list', {}, 
				(data)=>
					@feeds = data.feeds
					localStorage.setItem( "reedify.userFeeds", JSON.stringify(@feeds) )
					
					if success then success()
		else
			if success then success() 
			
			
				
	getFeed:(id)->
		for _feed in @feeds
			if id is _feed.feed_id then return _feed			
		return null
		
	removeFeed:(id)->
				
		feedCount = @feeds.length-1
		i = 0
		while i < feedCount
			_feed = @feeds[i]
			if _feed and _feed.feed_id is id 
				@feeds.splice( i, 1 )
				i = feedCount
			i++
		
		localStorage.setItem( "reedify.userFeeds", JSON.stringify(@feeds) )
		
		return null
	
	getSiteURLForFeedId:( id )->
		if @feeds
			for _feed in @feeds
				if id is _feed.feed_id then return _feed.feed_url			
		return null
	
	getSelectedFeedList:( selectedFeeds )->		
		
		feedList = JSON.parse(JSON.stringify(@feeds))
		
		for feed in feedList
			if selectedFeeds.indexOf(feed.feed_id) != -1
				feed.selected = true	
			else
				feed.selected = false
						
		return feedList