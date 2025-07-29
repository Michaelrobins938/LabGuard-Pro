/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Primary Colors - EXACT hex codes
        'primary-blue': '#1e40af',
        'primary-blue-light': '#3b82f6',
        'primary-blue-dark': '#1e3a8a',
        'primary-green': '#059669',
        'primary-green-light': '#10b981',
        'primary-green-dark': '#047857',

        // Neutral Colors - EXACT hex codes
        'gray-50': '#f9fafb',
        'gray-100': '#f3f4f6',
        'gray-200': '#e5e7eb',
        'gray-300': '#d1d5db',
        'gray-400': '#9ca3af',
        'gray-500': '#6b7280',
        'gray-600': '#4b5563',
        'gray-700': '#374151',
        'gray-800': '#1f2937',
        'gray-900': '#111827',

        // Accent Colors - EXACT hex codes
        'success-green': '#22c55e',
        'warning-yellow': '#f59e0b',
        'error-red': '#ef4444',
        'info-blue': '#3b82f6',
      },
      fontFamily: {
        'inter': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        'xs': '0.75rem',    /* 12px */
        'sm': '0.875rem',   /* 14px */
        'base': '1rem',     /* 16px */
        'lg': '1.125rem',   /* 18px */
        'xl': '1.25rem',    /* 20px */
        '2xl': '1.5rem',    /* 24px */
        '3xl': '1.875rem',  /* 30px */
        '4xl': '2.25rem',   /* 36px */
        '5xl': '3rem',      /* 48px */
        '6xl': '3.75rem',   /* 60px */
      },
      fontWeight: {
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
      },
      spacing: {
        '1': '0.25rem',   /* 4px */
        '2': '0.5rem',    /* 8px */
        '3': '0.75rem',   /* 12px */
        '4': '1rem',      /* 16px */
        '5': '1.25rem',   /* 20px */
        '6': '1.5rem',    /* 24px */
        '8': '2rem',      /* 32px */
        '10': '2.5rem',   /* 40px */
        '12': '3rem',     /* 48px */
        '16': '4rem',     /* 64px */
        '20': '5rem',     /* 80px */
        '24': '6rem',     /* 96px */
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'enterprise': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'enterprise-lg': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)',
      },
      transitionDuration: {
        'enterprise': '0.2s',
        'enterprise-slow': '0.3s',
      },
      transitionTimingFunction: {
        'enterprise': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} 