class UserData
	accessToken:null
	template:window.Handlebars.templates.user_login
	
	constructor: () ->
		if Cookies.get( 'reedify.accessToken' )
			@accessToken = Cookies.get( 'reedify.accessToken' )
	
	setAccessToken:( accessToken )->
		@accessToken = accessToken
		Cookies.set( 'reedify.accessToken', accessToken, { expires:60*60*24*30 } )
	
	showLogin:()->
		$loginPopup = $ @template { version:app.version }
		$('body').append $loginPopup
				
		$loginPopup.find('div.content').animate 'login-popup-show', 
			duration:500
			easing:'ease-out'
		
		user = @
		
		$loginPopup.find('form').on 'submit', (e)->
			
			email = $loginPopup.find( 'input[name="email"]' ).val()
			password = $loginPopup.find( 'input[name="password"]' ).val()
			
			$loginPopup.addClass 'loading'
			
			user.login email, password,
				( data ) -> 
										
					$loginPopup.animate 'popup-hide', 
						duration:250
						easing:'ease-in-out'
						complete:()-> 
							$loginPopup.remove()
					
				( data ) ->
					if data?.error
						$loginPopup.find('.error').html data.error
					$loginPopup.removeClass 'loading'
					
			return false
		
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