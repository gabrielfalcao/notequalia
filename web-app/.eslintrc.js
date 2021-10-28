const path = require("path");

// the GraphQL ESLint plugin hasn't been updated to be aware of GraphQL 15

module.exports = {
	extends: [],

	globals: {
		jsdom: false,
		FEATURES: false,
		vi: true,
	},

	plugins: ["pretty-lights"],

	parserOptions: {
		requireConfigFile: false,
	},

	settings: {
		"import/resolver": {
			node: {},
			webpack: {
				config: path.resolve(__dirname, "webpack.aliases.config.js"),
			},
		},
		react: {
			pragma: "React",
			version: "detect",
		},
	},

	// please add rules A-Z by name/prefix
	rules: {
		camelcase: [
			"error",
			{ properties: "never", ignoreDestructuring: false },
		],
		"import/no-cycle": "off",
		// 'import/no-unused-modules': ['error', { unusedExports: true }],
		"import/no-webpack-loader-syntax": "off",
		"jsx-a11y/label-has-for": [
			"error",
			{
				allowChildren: true,
			},
		],
		"jsx-a11y/label-has-associated-control": [
			"error",
			{
				controlComponents: ["Field", "SearchInput"],
				depth: 3,
			},
		],
		"react/no-danger": "off",
		"react/no-multi-comp": "error",
		"react/prop-types": [
			"error",
			{
				ignore: ["tracking"],
			},
		],
		"react/sort-comp": "error",
		"react/state-in-constructor": ["warn", "never"],
		"react/static-property-placement": "off",
	},

	overrides: [
		{
			files: ["*.test.js", "**/__tests__/**/*.js"],
			rules: {
				"global-require": "off",
				"no-console": "off",
				"react/no-multi-comp": "off",
				"react/prop-types": "off",
				"no-await-in-loop": "off",
				"no-restricted-syntax": "off",
			},
		},
		{
			files: ["src/server/**"],
			rules: {
				"import/no-restricted-paths": "off",
				"no-console": "off",
			},
		},
	],
};
