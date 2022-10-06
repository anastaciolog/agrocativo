module.exports = {
	roots: ['src'],
	transform: {
		'^.+\\.ts$': 'ts-jest'
	},
	testRegex: '\\.test\\.ts',
	moduleFileExtensions: [ 
		'ts',
		'tsx',
		'js',
		'jsx',
		'json',
		'node'
	  ]
}