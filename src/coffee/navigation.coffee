class Navigation
	template:window.Handlebars.templates.nav
	templateStreams:window.Handlebars.templates.nav_streams
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
		
		$editFeeds = $ window.Handlebars.templates.popup_feed_edit app.feedList
		$('body').append $editFeeds
		$('body').addClass 'noscroll'
		$editFeeds.animate 'popup-show', 
			duration:250
			easing:'ease-in-out'
			
		$editFeeds.find('a.close-button').on 'click', (e)->
			e.preventDefault()
			$('body').removeClass 'noscroll'
			$editFeeds.animate 'popup-hide', 
				duration:250
				easing:'ease-in-out'
				complete:()-> $editFeeds.remove()
				
		$editFeeds.find( 'a.feed-unsubscribe' ).on 'click', (e)->
			e.preventDefault()
			feedId = parseInt $(this).attr 'rel'
			
			$listItem = $editFeeds.find("#feed-#{feedId}")
			$listItem.css {'opacity':0.5}
			
			app.wrangler.query 'subscriptions/remove_feed', { feed_id:feedId },
				 ( data )-> 
				 	$listItem.remove()
					app.feedList.removeFeed feedId
				 ( data )-> $listItem.css {'opacity':1.0}
			
					
			
			
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
		
		nav = @
		
		editStream = {}
		if streamId
			for _stream in @streams.streams
				if _stream.stream_id is streamId then editStream = _stream
		if editStream.feeds
			selectedFeedIds = []
			selectedFeedIds.push _feed.feed_id for _feed in editStream.feeds			
			selectedFeeds = window.app.feedList.getSelectedFeedList selectedFeedIds
			editStream.feeds = selectedFeeds
		else
			editStream.feeds = window.app.feedList.feeds
			
		console.log "EDITING STREAM: ", streamId, editStream
		
		app.disableControls()
		
		$editStream = $ window.Handlebars.templates.popup_stream_edit editStream
		$('body').append $editStream
		$('body').addClass 'noscroll'
		$editStream.animate 'popup-show', 
			duration:250
			easing:'ease-in-out'
				
		$editStream.find('a.cancel').on 'click', (e)->
			e.preventDefault()
			app.initControls()

			$('body').removeClass 'noscroll'
			$editStream.animate 'popup-hide', 
				duration:250
				easing:'ease-in-out'
				complete:()-> $editStream.remove()
		
		$editStream.find('a.destroy-feed').on 'click', (e)->
			e.preventDefault()
			$editStream.addClass 'loading'
			
			options = 
				stream_id : streamId
			
			app.wrangler.query 'streams/destroy', options,
				(data)->
					nav.loadStreams( true )
					app.initControls()

					$('body').removeClass 'noscroll'
					$editStream.animate 'popup-hide', 
						duration:250
						easing:'ease-in-out'
						complete:()-> $editStream.remove()
					
				(data)->
					console.log data
				
		if !streamId or editStream.all_feeds
			$editStream.find('input[name="all_feeds"]').attr 'checked', true
			$editStream.find('div.include-only').addClass( 'hide' )
			
		$editStream.find('input[name="all_feeds"]').on 'change', (e)->
			if $(this)[0].checked
				$editStream.find('div.include-only').addClass 'hide'
			else
				$editStream.find('div.include-only').removeClass 'hide'
			
		filterCache = []		
		$editStream.find( 'li.list-feed-item' ).each (i)->
			filterCache.push
				string:$(this).text().toLowerCase()
				dom:$(this)
				
		$editStream.find('div.filter input.filter').on 'keyup click search', (e)->
			searchTerm = $(this).val().toLowerCase()
			
			for	item in filterCache
				if item.string.indexOf( searchTerm ) != -1
					item.dom.removeClass 'hide'
				else
					item.dom.addClass 'hide'
		
		$editStream.find('div.filter a.filter-select-all').on 'click', (e)->
			e.preventDefault()
			$editStream.find('input.feed-checkbox').attr 'checked', true
		
		$editStream.find('div.filter a.filter-select-none').on 'click', (e)->
			e.preventDefault()
			$editStream.find('input.feed-checkbox').removeAttr 'checked'
		
		$editStream.find('form').on 'submit', (e)->
			e.preventDefault()
			$editStream.addClass 'loading'
			
			data = $(this).serializeArray()
			
			console.log options
			
			options = {}
			feedsSelected = []
			
			for	_data in data
				if _data.value is 'on' then _data.value = 'true'
								
				if _data.name.indexOf('feed_') == -1
					options[ _data.name ] = _data.value
				else
					feedId = _data.name.replace( 'feed_', '' )
					console.log feedId 
					feedsSelected.push feedId
			
			if not options.only_unread then options.only_unread = 'false'
			if not options.all_feeds then options.all_feeds = 'false'
			options.feed_ids = feedsSelected.join(',')
			
			console.log "SAVE STREAM", data, options
			
			queryURL = 'streams/update'
			if options.stream_id == "" || options.stream_id == null then queryURL = 'streams/create'
			
			app.wrangler.query queryURL , options,
				(data)->
					nav.loadStreams( true )
					app.initControls()

					$('body').removeClass 'noscroll'
					$editStream.animate 'popup-hide', 
						duration:250
						easing:'ease-in-out'
						complete:()-> $editStream.remove()
					
				(data)->
					console.log data
					# nav.loadStreams( true )
					# $editStream.remove()
			
			return false
		
	
	selectNav:( el )->
		console.log "SELECTED NAV", el
		@$el.find( 'a' ).removeClass 'selected'
		
		navItem = @$el.find( el )
		if not navItem.hasClass('feed') then @$el.find( 'li.expand' ).removeClass 'expand'
		
		navItem.addClass 'selected'
		if navItem.parent().find( "ul.feeds" ).length != 0 then navItem.parent().addClass 'expand'
		