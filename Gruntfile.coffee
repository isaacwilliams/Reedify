module.exports = (grunt)->
	
	grunt.initConfig
		pkg: grunt.file.readJSON('package.json')
		uglify:
			dev:
				options:
					beautify: true
					mangle: false
				files:'lib/reedify.min.js': ['lib/vendor/*.js', 'lib/template.js', 'lib/reedify.js']
				
			release:
				options:
					beautify: false
					mangle: true
				files:'lib/reedify.min.js': ['lib/vendor/*.js', 'lib/template.js', 'lib/reedify.js']		
		coffee:
			build:
				options:
					join:true
				files:
					'lib/reedify.js':[
						'src/coffee/feedList.coffee',
						'src/coffee/popup-view.coffee',
						'src/coffee/user.coffee',
						'src/coffee/wrangler.coffee',
						'src/coffee/feed.coffee',
						'src/coffee/navigation.coffee',
						'src/coffee/router.coffee',
						'src/coffee/app.coffee'
					]
		handlebars:
			compile:
				options:
					wrapped: true
					namespace: "reedify.templates"
					processName:(filename)->
						filename = filename.toLowerCase()
						filename = filename.replace( 'src/templates/', '' )
						filename = filename.replace( '.handlebars', '' )
						return filename
				files:
			        "lib/template.js":["src/templates/*.handlebars"]
					
		sass:
			compile:
				files:
					"lib/style.css":"src/sass/style.scss"

		cssmin:
			minify:
				files: 
					'lib/style.min.css':'lib/style.css'
				
		watch:
			coffee:
				files:'src/coffee/*.coffee'
				tasks:['coffee', 'uglify:dev']
			handlebars:
				files:'src/templates/*.handlebars'
				tasks:['handlebars', 'uglify:dev']
			sass:
				files:'src/sass/*.scss'
				tasks:['sass','cssmin']
			
	
	grunt.loadNpmTasks('grunt-contrib-coffee')
	grunt.loadNpmTasks('grunt-contrib-uglify')	
	grunt.loadNpmTasks('grunt-contrib-handlebars')
	grunt.loadNpmTasks('grunt-contrib-sass')
	grunt.loadNpmTasks('grunt-contrib-watch')
	grunt.loadNpmTasks('grunt-contrib-cssmin')
	
	grunt.registerTask('default', [ 'coffee', 'handlebars', 'uglify:dev', 'sass', 'cssmin'])
	grunt.registerTask('release', [ 'coffee', 'handlebars', 'uglify:release', 'sass', 'cssmin'])
	