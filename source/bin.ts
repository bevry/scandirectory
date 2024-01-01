// builtin
import { argv, stdout, exit } from 'process'

// local
import scan, { stringify } from './index.js'

// for each path, readdir
for (const path of argv.slice(2)) {
	scan(path)
		.then((result) => {
			// stdout.write(Object.keys(result).join('\n') + '\n')
			stdout.write(stringify(result, '  ') + '\n')
		})
		.catch((error) => {
			console.error(error)
			exit(1)
		})
}
