const detectIndent = require('detect-indent')

/*
	Usage:

	trim`
		text here, allows ${templating}
	`

	Have an array in a template that goes beyond the normal indentation

	trim`
		You can escape them with |
		${[1,2,3].map(n => '|\t' + n).join('\n')}
		This will ignore the original indentation
	`
*/

function trim(s, ...keys) {
	var startIndent
	if (!Array.isArray(s)) s = [s]
	
	return s
		.map((s, i) => s + (keys[i] === undefined ? '' : keys[i]))
		.join('')
		.replace(/\r\n/g, '\n') // dumb windows newlines
		.replace(/^  /gm, '\t') // fuck 4 spaced indentation
		.trim()
		.split('\n')
		.map(l => {
			var indent = detectIndent(l).amount
			if (!startIndent) startIndent = indent

			if (l.trimLeft().startsWith('|')) {
				return l.trimLeft().replace(/^\|/g, '')
			}

			return l.replace(/^\t*/g, '\t'.repeat(Math.max(0, indent - startIndent)))
		})
		.join('\n')
}

module.exports = trim