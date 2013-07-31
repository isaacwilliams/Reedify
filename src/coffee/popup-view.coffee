class PopupView
	template:null
	animationShow:'popup-show'
	animationHide:'popup-hide'
	
	constructor:()->
		@$el = $ @template( this )
	
	showPopup:(callback)->

		$('body').addClass 'noscroll'
		
		@$el.animate @animationShow,
			duration:250
			easing:'ease-in-out'
			complete:()-> 
				if callback then callback()
	
	hidePopup:(callback)->

		$('body').removeClass 'noscroll'
		
		@$el.animate @animationHide,
			duration:250
			easing:'ease-in-out'
			complete:()=> 
				@$el.remove()
				if callback then callback()

class LoginPopupView extends PopupView
	template:window.reedify.templates.user_login
	animationShow:'login-popup-show'
	
	constructor:()->
		@$el = $ @template( { version:app.version } )
		
		loginPopup = @
				
		@$el.find('form').on 'submit', (e)->
			
			email = loginPopup.$el.find( 'input[name="email"]' ).val()
			password = loginPopup.$el.find( 'input[name="password"]' ).val()
			
			loginPopup.$el.addClass 'loading'
			
			app.user.login email, password,
				( data ) -> 
					loginPopup.hidePopup()
					
				( data ) ->
					if data?.error
						loginPopup.$el.find('.error').html data.error
					loginPopup.$el.removeClass 'loading'
					
			return false
		
	
class ChangesPopupView extends PopupView
	template:window.reedify.templates.popup_about
	animationShow:'login-popup-show'
	constructor:()->
		
		@$el = $ @template( this )
		
		$.ajax
			url:'/assets/readme.html'
			success:(data)=>
				@$el.find('div.content div.about-content').html data
				@showPopup()

class ManageFeedsPopupView extends PopupView
	template:window.reedify.templates.popup_feed_edit
	constructor:()->
		
		managePopup = @
		@$el = $el = $ @template( window.app.feedList )		
		@showPopup()
		
		@$el.find('a.close-button').on 'click', (e)->
			e.preventDefault()
			managePopup.hidePopup()
				
		@$el.find( 'a.feed-unsubscribe' ).on 'click', (e)->
			e.preventDefault()
			feedId = parseInt $(this).attr 'rel'
			
			$listItem = $el.find("#feed-#{feedId}")
			$listItem.css {'opacity':0.5}
			
			app.wrangler.query 'subscriptions/remove_feed', { feed_id:feedId },
				 ( data )-> 
				 	$listItem.remove()
					app.feedList.removeFeed feedId
				 ( data )-> $listItem.css {'opacity':1.0}
		
		

class EditStreamPopupView extends PopupView
	template:window.reedify.templates.popup_stream_edit
	constructor:( streamId )->
		
		editStream = {}
		if streamId
			for _stream in window.app.nav.streams.streams
				if _stream.stream_id is streamId then editStream = _stream
		if editStream.feeds
			selectedFeedIds = []
			selectedFeedIds.push _feed.feed_id for _feed in editStream.feeds			
			selectedFeeds = window.app.feedList.getSelectedFeedList selectedFeedIds
			editStream.feeds = selectedFeeds
		else
			editStream.feeds = window.app.feedList.feeds
		
		@all_feeds = editStream.all_feeds
		@feeds = editStream.feeds
		@only_unread = editStream.only_unread
		@stream_id = editStream.stream_id
		@title = editStream.title
		@search_term = editStream.search_term
		
		streamPopup = @
		@$el = $el = $ @template( this )
		@showPopup()
		
		if !@stream_id or @all_feeds
			@$el.find('input[name="all_feeds"]').attr 'checked', true
			@$el.find('div.include-only').addClass( 'hide' )
		
		# toggle all feeds		
		@$el.find('input[name="all_feeds"]').on 'change', (e)->
			if $(this)[0].checked
				$el.find('div.include-only').addClass 'hide'
			else
				$el.find('div.include-only').removeClass 'hide'
		
		# cancel button
		@$el.find('a.cancel').on 'click', (e)=>
			e.preventDefault()
			@hidePopup()
		
		# destroy feed
		@$el.find('a.destroy-feed').on 'click', (e)->
			e.preventDefault()
			$el.addClass 'loading'
			
			options = 
				stream_id : streamPopup.stream_id
				
			app.wrangler.query 'streams/destroy', options,
				(data)->
					window.app.nav.loadStreams( true )
					streamPopup.hidePopup()
					
				(data)->
					console.log data
		
		# filter
		filterCache = []		
		@$el.find( 'li.list-feed-item' ).each (i)->
			filterCache.push
				string:$(this).text().toLowerCase()
				dom:$(this)
				
		@$el.find('div.filter input.filter').on 'keyup click search', (e)->
			searchTerm = $(this).val().toLowerCase()
			
			for	item in filterCache
				if item.string.indexOf( searchTerm ) != -1
					item.dom.removeClass 'hide'
				else
					item.dom.addClass 'hide'
					
		@$el.find('div.filter a.filter-select-all').on 'click', (e)->
			e.preventDefault()
			$el.find('input.feed-checkbox').attr 'checked', true
		
		@$el.find('div.filter a.filter-select-none').on 'click', (e)->
			e.preventDefault()
			$el.find('input.feed-checkbox').removeAttr 'checked'
		
		# submit form
		@$el.find('form').on 'submit', (e)->
			
			e.preventDefault()
			$el.addClass 'loading'
			
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
					window.app.nav.loadStreams( true )
					$el.removeClass 'loading'
					streamPopup.hidePopup()
					
				(data)->
					console.log data
					window.app.nav.loadStreams( true )
					$el.removeClass 'loading'
					streamPopup.hidePopup()
					
			
			return false
		
		
		
		