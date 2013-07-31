class UserData
	accessToken:null
	template:window.reedify.templates.user_login
	
	constructor: () ->
		if Cookies.get( 'reedify.accessToken' )
			@accessToken = Cookies.get( 'reedify.accessToken' )
	
	setAccessToken:( accessToken )->
		@accessToken = accessToken
		Cookies.set( 'reedify.accessToken', accessToken, { expires:60*60*24*30 } )
	
	showLogin:()->
		loginPopup = new LoginPopupView()
		$('body').append loginPopup.$el
		
		loginPopup.showPopup()
		
	login:( email, password, success, error )->
		app.wrangler.query 'users/authorize', { email:email, password:password }, 
			(data)->				
				if not data.error
					app.user.setAccessToken data.access_token
					app.router.redirect '/'
					success data
				else
					error data
			(data)-> error( data )
			
	logout:()->
		console.log "LOG OUT"
		Cookies.expire 'reedify.accessToken'
		localStorage.setItem( "reedify.userStreams", null )
		localStorage.setItem( "reedify.userFeeds", null )
		
		