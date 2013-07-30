# ==================================================================
# Cakefile - compile, concatenate, minify coffee + js
# ==================================================================

fs            = require 'fs'
{exec, spawn} = require 'child_process'

coffeeDir = 'src/coffee/'
coffeeCompile = 'lib/feeder.js'
coffeeFiles = [ 
	'feedList.coffee',
	'user.coffee',
	'wrangler.coffee',
	'feed.coffee',
	'navigation.coffee',
	'router.coffee',
	'app.coffee'
]

templateDir = 'src/templates/'
templateCompile = 'lib/template.js'
templateFiles = [
	'feed_item.handlebars',
	'feed_item_list.handlebars',
	'feed_item_end.handlebars',
	'nav.handlebars',
	'nav_streams.handlebars',
	'popup_stream_edit.handlebars',
	'popup_feed_edit.handlebars',
	'user_login.handlebars',
	'popup_about.handlebars'
]

sassDir = 'src/sass/'
sassCompile = 'style.css'
sassFiles = [
  'style.scss'
]

task 'build', 'Build coffee files from scr/coffee/ to lib/', ()->
	_coffeeFiles = []
	_coffeeFiles.push coffeeDir + file for file in coffeeFiles
	
	args = [ 'coffee', '--join', coffeeCompile, '--compile']
	coffee = exec args.concat(_coffeeFiles).join(' '), (err, stdout, stderr) ->
		return console.error err if err
	console.log "    Coffeescript compiled: #{coffeeFiles} to: #{coffeeCompile}"

task 'template', 'Build Handlebars Templates', ()->
	_templateFiles = []
	_templateFiles.push templateDir + file for file in templateFiles
	spawn 'handlebars', _templateFiles.concat [ '-f', templateCompile ]
	console.log "    Handlebar templates compiled: #{templateFiles} to: #{templateCompile}"

task 'sass', 'Build Handlebars Templates', ()->
	_sassFiles = []
	_sassFiles.push sassDir + file for file in sassFiles
	proc = spawn 'sass', _sassFiles.concat [ sassCompile ]
	proc.stderr.on   'data', (buffer) -> console.log buffer.toString()
	console.log "    Sass files compiled: #{sassFiles} to: #{sassCompile}"
	
task 'watch', 'Watch prod source files and build changes', ()->
    # invoke 'build'
	# invoke 'template'
	# invoke 'sass'
	
	console.log "Watching for changes in ./src"
	
	fs.watch coffeeDir, (event, filename)->
		console.log "#{new Date()} - Change detected in #{coffeeDir}#{filename}..."
		invoke 'build'
	
	fs.watch templateDir, (event, filename)->
		console.log "#{new Date()} - Change detected in #{templateDir}#{filename}..."
		invoke 'template'
		
	fs.watch sassDir, (event, filename)->
		console.log "#{new Date()} - Change detected in #{sassDir}#{filename}..."
		invoke 'sass'

task 'min', 'Build minified version for release', ->
		
	invoke 'build'
	invoke 'template'
	invoke 'sass'
		
	exec "yuicompressor #{coffeeCompile} -o #{coffeeCompile}"
	exec "yuicompressor #{templateCompile} -o #{templateCompile}"
	