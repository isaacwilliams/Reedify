app = window.app

class FeedItem
	template:window.reedify.templates.feed_item
	readChanged:false
	
	constructor: ( data, feed ) ->
		@feed = feed
		$.extend this, data
		if data.end then @template = window.reedify.templates.feed_item_end
	
	select:()->
		if not @readChanged then @setRead true
		@$el.addClass 'current'
	
	setRead:( read )->
		@read = read
		if @read then @$el.removeClass 'unread'
		if not @read then @$el.addClass 'unread'
		@readChanged = true
		@updateData()
	
	setStarred:( starred )->
		console.log "SET STAR", this
		@starred = starred
		if not @starred then @$el.removeClass('starred').removeClass('setManual')
		if @starred then @$el.addClass('starred').addClass('setManual')
		@updateData()
		
	updateData:()->
		option = 
			feed_item_id:@feed_item_id
			read:@read
			read_later:@read_later
			starred:@starred			
			
		app.wrangler.query 'feed_items/update', option, 
			(data)->
			(data)->
	
	render:()->
		
		if @body?.indexOf('script') != -1
			body = $( @body )
			body.find('script').remove()
			@body = body.html()
		
		if not @$el
			@$el = $ @template(this)
		else
			@$el.html $( @template(this) ).html()
		
		@$el.on 'click', (e)=> 
			@feed.selectItem this
			
		@$el.find('.read-status').on 'click', (e)=> 
			e.stopPropagation()
			@setRead !@read
		@$el.find('.star-status').on 'click', (e)=> 
			e.stopPropagation()
			@setStarred !@starred
			
		return @$el
	
	
class FeedItemList
	el:"#feed"
	template:window.reedify.templates.feed_item_list
	
	read:"false"
	starred:null
	feed_id:null
	stream_id:null
	offset:0
	limit:10
	currentItemId:-1
	currentItem:null
	
	feedItems:null
	
	loading:false
	endOfList:false
	
	constructor: () ->
		@feedItems = []
		@$el = $( @el )
		
	clear:()->
		@$el.html('')
		if @current_requst then @current_requst.abort()
		@loading = false
		@endOfList = false
		@feedItems = []
		@currentItem = null
		@currentItemId = -1
		@limit		= 10
		@offset 	= 0
		# set defaults
		@read 		= 'false'
		@starred 	= null
		@feed_id 	= null
		@stream_id 	= null
		# render template
		@$el = $( @el )
		@$el.html @template {}
		
	render:()->
		$itemList = @$el.find('div.item-list')
				
		for feedTtem in @feedItems
			if not feedTtem.$el then $itemList.append feedTtem.render()
	
	navigateNext:()->
		@currentItemId++
		if @currentItemId >= @feedItems.length-1 then @currentItemId= @feedItems.length-1
		return @selectItem @feedItems[ @currentItemId ]
		
	navigatePrev:()->
		@currentItemId--
		if @currentItemId <= 0 then @currentItemId= 0
		return @selectItem @feedItems[ @currentItemId ]
			
	selectItem:( item )->
		@currentItem = item
		@currentItemId = @feedItems.indexOf item
		@$el.find('div.item-list div.item').removeClass 'current'
		item.select()
		return item
	
	setLoading:( loading )->
		@current_request = null
		@loading = loading
		if @loading then @$el.addClass 'loading'
		if not @loading then @$el.removeClass 'loading'
	
	getFeedItems:( success, error )->
					
		options = {}
		
		if @read then	 	options.read 		= @read
		if @starred then	options.starred 	= @starred
		if @feed_id then 	options.feed_id 	= @feed_id
		if @offset then 	options.offset 		= @offset
		if @limit then 		options.limit 		= @limit
		if @stream_id then	options.stream_id 	= @stream_id
		if @feed_id then	options.feed_id 	= @feed_id
		
		@setLoading true
		
		queryURL = 'feed_items/list'
		if @stream_id then queryURL = 'streams/stream_items'
		
		@current_request = app.wrangler.query queryURL, options,
			( data )=> #success
				@setLoading false
				
				console.log data, data.count
				
				for feed_item in data.feed_items
					feedItem = new FeedItem feed_item, this
					feedItem.site_url = window.app.feedList.getSiteURLForFeedId( feedItem.feed_id )
					@feedItems.push feedItem
									
				if data.count is 0 
					feedItem = new FeedItem { end:true }, this
					@feedItems.push feedItem
					@endOfList = true
								
				@render()	
			( data )=> #error
				@setLoading false
	
	getMoreFeedItems:( success, error  )->
		if not @loading and not @endOfList
			@offset += @limit
			@getFeedItems success, error 
		