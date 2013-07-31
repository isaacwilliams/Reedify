class Navigation
	template:window.reedify.templates.nav
	templateStreams:window.reedify.templates.nav_streams
	constructor:()->
		
	render:()->
		
		if not @$el		
			@$el = $ @template { feeds:app.feedList.feeds }
			$('body').append @$el
		else
			@$el.html = $( @template { feeds:app.feedList.feeds } ).html()
		
		@initNavControls()
		
	initNavControls:()->
		
		nav = @
		
		@$el.find('a.manage-feeds').on 'click', (e)=>
			e.preventDefault()
			@manageFeeds()
			
		@$el.find( 'input[name="url"]' ).on 'focus', (e)-> app.disableControls()
		@$el.find( 'input[name="url"]' ).on 'blur', (e)-> app.initControls()
		@$el.find( 'form.add-feed' ).on 'submit', (e)=>		
			e.preventDefault()
		
			url = @$el.find( 'form.add-feed input[name="url"]' ).val()
			
			@addFeed( url )
	
	showFeedControl:()->
		@$el.find('nav.feeds').show()
	
	manageFeeds:()->
		
		manangeFeeds = new ManageFeedsPopupView()
		$('body').append manangeFeeds.$el
		
			
	addFeed:( feedURL )->
				
		form = @$el.find( 'form.add-feed' )
		input = form.find( 'input[name="url"]' )
		errorDiv = form.find( 'div.error' )
		successDiv = form.find( 'div.success' )
		
		form.addClass 'loading'
		
		successDiv.hide()
		errorDiv.hide()
		input.removeClass('error')
		
		app.wrangler.query 'subscriptions/add_feed_and_wait', { feed_url:feedURL, choose_first:true }, 
			(data)->
				title = data.feed.title
				successDiv.show()
				successDiv.text "Subscribed to #{title}"
				
				hideSuccess = ()-> successDiv.hide()
				setTimeout( hideSuccess, 2500 )
				
				input.val("")
				form.removeClass 'loading'
				
				app.feedList.loadFeeds true
				
			(data)-> 
				errorDiv.text( data.error )
				errorDiv.show()
				input.addClass('error')
				form.removeClass 'loading'
				
				hideError = ()-> 
					errorDiv.hide()
					input.removeClass('error')						
				setTimeout( hideError, 2500 )
				
			
		
	loadStreams:( forceReload, success )->
		@streams = JSON.parse localStorage.getItem("reedify.userStreams")
		
		if not @streams or forceReload
			app.wrangler.query 'streams/list', {}, 
				(data)=>
					@streams = data
					localStorage.setItem( "reedify.userStreams", JSON.stringify(@streams) )
					@buildStreams( @streams )
					
					if success then success()
					
		else
			if success then success()
			@buildStreams( @streams )
	
	buildStreams:(streams)->
		console.log "BUILD STREAMS"
		@$el.find('nav.streams ul.streams').html @templateStreams( streams )	
		
		_nav = @
		
		@$el.find('a.edit-stream').off 'click'
		@$el.find('a.edit-stream').on 'click', (e)->			
			e.preventDefault()
			streamId = parseInt $(this).attr( 'rel' )
			_nav.editStream streamId 
			
	editStream:( streamId )->
		app.disableControls()
		editStreamPopup = new EditStreamPopupView( streamId )
		$('body').append editStreamPopup.$el
			
	selectNav:( el )->
		console.log "SELECTED NAV", el
		@$el.find( 'a' ).removeClass 'selected'
		
		navItem = @$el.find( el )
		if not navItem.hasClass('feed') then @$el.find( 'li.expand' ).removeClass 'expand'
		
		navItem.addClass 'selected'
		if navItem.parent().find( "ul.feeds" ).length != 0 then navItem.parent().addClass 'expand'
		