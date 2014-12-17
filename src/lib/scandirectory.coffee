# Import
pathUtil = require('path')
safefs = require('safefs')
{TaskGroup} = require('taskgroup')
ignorefs = require('ignorefs')

# Internal: Is it a directory?
# Path can also be a stat object
# next(err, isDirectory, fileStat)
isDirectoryUtil = (path,next) ->
	# Check if path is a stat object
	if path?.isDirectory?
		return next(null, path.isDirectory(), path)

	# Otherwise fetch the stat and do the check
	else
		safefs.stat path, (err,stat) ->
			# Error
			return next(err)  if err

			# Success
			return next(null, stat.isDirectory(), stat)

	# Chain
	@

# Public: Scan a direcotry recursively
# See README for usage and options
scandir = (args...) ->
		# Prepare
		list = {}
		tree = {}

		# Support the different argument formats
		opts = {}
		for arg in args
			# Path
			if typeof arg is 'string'
				opts.path = arg

			# Next
			if typeof arg is 'function'
				opts.next = arg

			# Options
			for own key,value of arg
				opts[key] = value

		# Prepare defaults
		opts.recurse ?= true
		opts.readFiles ?= false
		opts.ignorePaths ?= false
		opts.ignoreHiddenFiles ?= false
		opts.ignoreCommonPatterns ?= false
		opts.next ?= (err) ->
			throw err  if err
		next = opts.next

		# Action
		if opts.action?
			opts.fileAction ?= opts.action
			opts.dirAction ?= opts.action

		# Check needed
		if opts.parentPath and !opts.path
			opts.path = opts.parentPath
		if !opts.path
			err = new Error('scandirectory: path is needed')
			return next(err)

		# Cycle
		safefs.readdir opts.path, (err,files) ->
			# Checks
			return next(err)  if err
			return next(null,list,tree)  if files.length is 0

			# Group
			tasks = new TaskGroup(concurrency:0).done (err) ->
				return opts.next(err, list, tree)

			# Cycle
			files.forEach (file) ->  tasks.addTask (complete) ->
				# Prepare
				fileFullPath = pathUtil.join(opts.path,file)
				fileRelativePath =
					if opts.relativePath
						pathUtil.join(opts.relativePath,file)
					else
						file

				# Check
				isIgnoredFile = ignorefs.isIgnoredPath(fileFullPath,{
					ignorePaths: opts.ignorePaths
					ignoreHiddenFiles: opts.ignoreHiddenFiles
					ignoreCommonPatterns: opts.ignoreCommonPatterns
					ignoreCustomPatterns: opts.ignoreCustomPatterns
				})
				return complete()  if isIgnoredFile

				# IsDirectory
				isDirectoryUtil fileFullPath, (err,isDirectory,fileStat) ->
					# Checks
					return complete(err)  if err
					return complete()     if tasks.paused

					# Directory
					if isDirectory
						# Prepare
						handle = (err,skip,subtreeCallback) ->
							# Checks
							return complete(err)  if err
							return complete()     if tasks.paused
							return complete()     if skip

							# Append
							list[fileRelativePath] = 'dir'
							tree[file] = {}

							# No Recurse
							return complete()  unless opts.recurse

							# Recurse
							return scandir(
								# Path
								path: fileFullPath
								relativePath: fileRelativePath

								# Options
								fileAction: opts.fileAction
								dirAction: opts.dirAction
								readFiles: opts.readFiles
								ignorePaths: opts.ignorePaths
								ignoreHiddenFiles: opts.ignoreHiddenFiles
								ignoreCommonPatterns: opts.ignoreCommonPatterns
								ignoreCustomPatterns: opts.ignoreCustomPatterns
								recurse: opts.recurse
								stat: opts.fileStat

								# Completed
								next: (err,_list,_tree) ->
									# Merge in children of the parent directory
									tree[file] = _tree
									for own filePath, fileType of _list
										list[filePath] = fileType

									# Checks
									return complete(err)  if err
									return complete()     if tasks.paused
									return subtreeCallback(complete)  if subtreeCallback
									return complete()
							)

						# Action
						if opts.dirAction
							return opts.dirAction(fileFullPath, fileRelativePath, handle, fileStat)
						else if opts.dirAction is false
							return handle(err,true)
						else
							return handle(err,false)

					# File
					else
						# Prepare
						handle = (err,skip) ->
							# Checks
							return complete(err)  if err
							return complete()     if tasks.paused
							return complete()     if skip

							# Append
							if opts.readFiles
								# Read file
								safefs.readFile fileFullPath, (err,data) ->
									# Check
									return complete(err)  if err

									# Append
									data = data.toString()  unless opts.readFiles is 'binary'
									list[fileRelativePath] = data
									tree[file] = data

									# Done
									return complete()

							else
								# Append
								list[fileRelativePath] = 'file'
								tree[file] = true

								# Done
								return complete()

						# Action
						if opts.fileAction
							return opts.fileAction(fileFullPath, fileRelativePath, handle, fileStat)
						else if opts.fileAction is false
							return handle(err,true)
						else
							return handle(err,false)

			# Run the tasks
			tasks.run()

		# Chain
		@

# Export
module.exports = scandir
module.exports.scandirectory = module.exports.scandir = scandir