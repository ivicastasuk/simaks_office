/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [ "./src/**/*.{html,js}" ],
	darkMode: 'selector',
	theme: {
		extend: {
			colors: {
				primary: '#4ABB6B',
				secondary: '#2E4057',
				accent: '#0892A5',
				dark: '#102030',
				light: '#FDFFFC'
			}
		},
	},
	plugins: [
		require("daisyui")
	],
	daisyui: {
		themes: [
			"emerald",
			"dark"
		]
	}
}

