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
				light: '#FDFFFC',
				disabled: '#64748B'
			},
			height: {
				main: "calc(100vh - 32px)",
				view: "calc(100vh - 72px)"
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

