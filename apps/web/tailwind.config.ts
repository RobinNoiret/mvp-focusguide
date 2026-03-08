import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			primary: ['var(--font-primary)', 'Inter', 'sans-serif'],
  			secondary: ['var(--font-secondary)', 'Inter', 'sans-serif'],
  		},
  		fontSize: {
  			'heading-1': ['32px', { lineHeight: '40px', fontWeight: '700' }],
  			'heading-2': ['24px', { lineHeight: '32px', fontWeight: '700' }],
  			'heading-3': ['20px', { lineHeight: '28px', fontWeight: '600' }],
  			'body': ['16px', { lineHeight: '24px', fontWeight: '400' }],
  			'body-sm': ['14px', { lineHeight: '20px', fontWeight: '400' }],
  			'caption': ['12px', { lineHeight: '16px', fontWeight: '400' }],
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			chartreuse: '#D9FC00',
  			dark: '#262626',
  			light: '#EDEAE9',
  			'ui-border': '#E5E5E5',
  			'ui-muted': '#A0A0A0',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
