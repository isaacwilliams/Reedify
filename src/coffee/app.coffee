
class ReedifyApp
	version:"Reedify 0.8.2"
	
	constructor: ()->
		
	init:()->		
		@registerHandlebarsHelpers()
		
		@user = new UserData()
		@wrangler = new Wrangler()
		@router = new AppRouter()
		@router.start()
		
	createNavigation: ()->
		
		console.log "CREATE APP"
		
		@nav = new Navigation()
		@feed = new FeedItemList()
		@feedList = new FeedList()
		
		@nav.render()
		
		navLoaded = false
		feedLoaded = false
		
		@nav.loadStreams false, ()=>
			navLoaded = true
			console.log "loaded:", navLoaded, feedLoaded
			if navLoaded and feedLoaded then @initFeed()
			
		@feedList.loadFeeds false, ()=>
			feedLoaded = true
			@nav.showFeedControl()
			console.log "loaded:", navLoaded, feedLoaded
			if navLoaded and feedLoaded then @initFeed()
		
	
	initFeed:()->
		console.log 'INIT FEED'		
		@initControls()
	
	initControls:()->
		
		$feedContainer = $("#feed-container")
		$feedList = $("#feed")
	
		$(window).on 'scroll', (e)->
			scrollBottom = $feedList.height() - $(window).scrollTop()
			if scrollBottom < 2500
				feed = window.app.feed
				feed.getMoreFeedItems()
	
		$(window).on 'keypress', (e)->
			keyVal = String.fromCharCode(e.keyCode)
			feed = window.app.feed
			console.log "KEY", keyVal, feed
			switch keyVal
				when 'j' 
					item = feed.navigateNext()
					$.scrollTo item.$el.offset().top - 16
				when 'k' 
					item = feed.navigatePrev()
					$.scrollTo item.$el.offset().top - 16
				when 'm'
					feed.currentItem.setRead !feed.currentItem.read
				when 'l'
					feed.currentItem.setStarred !feed.currentItem.starred
				when 'o'
					newWindow = window.open feed.currentItem.url, '_blank'
					window.focus()
					
	disableControls:()->
		$(window).off 'scroll'
		$(window).off 'keypress'		
					
	registerHandlebarsHelpers:()->
		
		window.Handlebars.registerHelper 'date', (unixTime)->
			date = moment( new Date unixTime * 1000 )		
			return date.format('MMMM Do YYYY, h:mm:ss a')
		window.Handlebars.registerHelper 'date_friendly', (unixTime)->
			date = moment( new Date unixTime * 1000 )		
			return date.fromNow()
		
		
$ ->	
	document.addEventListener "touchstart", ()-> 
		true
	
	app = window.app = new ReedifyApp()
	app.init()
	
	
	
	
	