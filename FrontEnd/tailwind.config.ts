import plugin from 'tailwindcss/plugin';

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./layout/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		// Luca design language: square corners and no drop shadows anywhere.
		// `rounded-full` is kept for avatars, dots and swatches.
		borderRadius: {
			none: '0px', sm: '0px', DEFAULT: '0px', md: '0px', lg: '0px',
			xl: '0px', '2xl': '0px', '3xl': '0px', full: '9999px',
		},
		boxShadow: {
			sm: 'none', DEFAULT: 'none', md: 'none', lg: 'none', xl: 'none',
			'2xl': 'none', inner: 'none', none: 'none',
		},
		extend: {
			borderColor: {
				border: "#e4e4e0",
			},
			screens: {
				xs: '431px',
				sm: '640px',
				md: '768px',
				lg: '1024px',
				xl: '1280px',
				'2xl': '1536px',
			},
			fontSize: {
				'3xs': '8px',
				'2xs': '10px',
				md: '16px'
			},
			fontFamily: {
				iranSansLight: ['IRANSans-Light', 'sans-serif'],
				// Luca: Persian/Latin display serif for titles, humanist sans for UI
				display: ['var(--font-display)'],
				body: ['var(--font-body)'],
			},
			colors: {
				// Luca neutrals (warm greys) replace Tailwind's cool gray/zinc/slate scales
				gray: { 50: '#f6f6f3', 100: '#eeeeea', 200: '#e4e4e0', 300: '#c9c9c4', 400: '#8a8a85', 500: '#6a6a65', 600: '#5c5c58', 700: '#2a2a28', 800: '#1d1d1b', 900: '#111111', 950: '#111111' },
				zinc: { 50: '#f6f6f3', 100: '#eeeeea', 200: '#e4e4e0', 300: '#c9c9c4', 400: '#8a8a85', 500: '#6a6a65', 600: '#5c5c58', 700: '#2a2a28', 800: '#1d1d1b', 900: '#111111', 950: '#111111' },
				slate: { 50: '#f6f6f3', 100: '#eeeeea', 200: '#e4e4e0', 300: '#c9c9c4', 400: '#8a8a85', 500: '#6a6a65', 600: '#5c5c58', 700: '#2a2a28', 800: '#1d1d1b', 900: '#111111', 950: '#111111' },
				ink: '#111111',
				mute: '#5c5c58',
				line: '#e4e4e0',
				paper: '#f6f6f3',
				placeholder: '#eeeeea',
				tint: 'var(--tint-color)',
				primary: 'var(--primary-color)',
				foreground: 'hsl(var(--primary-color))',
				background: 'hsl(var(--secondary-color))',
				secondary: 'var(--secondary-color)',
				highlight: 'var(--highlight-color)',
				neutral: 'var(--neutral-color)',
				'primary-foreground': 'var(--store-surface-solid)',
				store: {
					surface: 'var(--store-surface-solid)',
					muted: 'var(--store-surface-muted)',
					border: 'var(--store-border)',
					strong: 'var(--store-border-strong)',
					text: 'var(--store-text)',
					subtle: 'var(--store-text-muted)',
				},
				success: 'var(--success-color)',
				error: 'var(--error-color)',
				warning: 'var(--warning-color)',
				info: 'var(--info-color)',
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			keyframes: {

				formIn: {
					'0%': { opacity: '0', transform: 'translateY(14px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				popUpDisappear: {
					'0%': {
						transform: 'translateY(-10%)',
						opacity: '1'
					},
					'100%': {
						transform: 'translateY(0)',
						opacity: '0'
					}
				}
			},
			animation: {

				formIn: 'formIn 600ms cubic-bezier(0.22, 1, 0.36, 1) both',
				popUpDisappear: 'popUpDisappear 300ms forwards'
			}
		}
	},
	plugins: [
		plugin(function ({ addUtilities }) {
			addUtilities({
				'.hidden-show-scrollbar': {
					'scrollbar-width': 'none', /* Firefox */
					'-ms-overflow-style': 'none', /* IE 10+ */
				},
				'.hidden-show-scrollbar::-webkit-scrollbar': {
					display: 'none', /* Chrome, Safari */
				},
				'.hidden-show-scrollbar:hover::-webkit-scrollbar': {
					display: 'block',
				},
			})
		}),
	],
};
