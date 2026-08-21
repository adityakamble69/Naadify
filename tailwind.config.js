/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		screens: {
			xs: '400px',
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
			'2xl': '1536px'
		},
		extend: {
			fontFamily: {
				mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
				body: ['"Sora"', 'ui-sans-serif', 'system-ui', 'sans-serif']
			},
			colors: {
				base: '#070A12',
				sky: {
					DEFAULT: '#1959C9',
					deep: '#0E3A8F'
				},
				crt: {
					DEFAULT: '#3FA0FF',
					glow: '#6FC3FF'
				},
				meadow: {
					DEFAULT: '#3E7A2E',
					deep: '#26501C'
				},
				sand: '#E7D2A8',
				bark: '#8A5A32',
				accent: {
					DEFAULT: '#3FA0FF',
					glow: 'rgba(63,160,255,0.45)'
				}
			},
			backdropBlur: {
				xs: '4px'
			},
			boxShadow: {
				glass: '0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)',
				'glass-lg': '0 16px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
			},
			borderRadius: {
				'2.5xl': '20px',
				'3xl': '28px'
			},
			keyframes: {
				pulseGlow: {
					'0%, 100%': { opacity: '0.55' },
					'50%': { opacity: '1' }
				},
				fadeScaleIn: {
					'0%': { opacity: '0', transform: 'scale(0.96) translateY(8px)' },
					'100%': { opacity: '1', transform: 'scale(1) translateY(0)' }
				}
			},
			animation: {
				pulseGlow: 'pulseGlow 2.2s ease-in-out infinite',
				fadeScaleIn: 'fadeScaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards'
			}
		}
	},
	plugins: []
};
