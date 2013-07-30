class Wrangler
	apiProxy:'/wrangle.php'	
	
	constructor: () ->		
		
	query:( apiURL, options, success, error )->
				
		options.url = apiURL
		if app.user.accessToken then options.access_token = app.user.accessToken
		
		console.log "Wrangling: ", apiURL, options
		
		query = $.ajax
			url:@apiProxy 
			data:options
			dataType:'json'
			success:( data )=>
				if data and not data.error
					console.log "Wrangling success:", data
					if success then success( data )
				else
					console.log "Wrangling error:", data
					if error then error( data )					
				
			error:( data )=>
				console.log "Wrangling error:", data
				error( data )
			
		return query
				
			