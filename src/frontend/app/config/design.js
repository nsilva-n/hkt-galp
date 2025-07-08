// Design system configuration
// This file centralizes all design tokens for easy customization

const design = {
  // Border radius values
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
    button: '999px', // Main button border radius
    input: '8px', // Single-line inputs
    textarea: '12px', // Multi-line inputs
    checkbox: '4px',
  },

  card: {
    padding: {
      sm: '1rem',     // 16px
      md: '1.5rem',   // 24px
      lg: '2rem',     // 32px
    },
    background: '#ffffff',
    borderRadius: '16px',
    shadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    border: '1px solid #ff5a00',
  },


  // Colors (matching existing Tailwind config)
  colors: {
    primary: '#be2e00', // Main button color
    secondary: '#7a1b15', // Dark red
    background: '#ffffff',
    foreground: '#000000',

    // Button variants
    button: {
      primary: {
        bg: '#be2e00',
        text: '#ffffff',
        hover: '#a82900',
      },
      secondary: {
        bg: '#7a1b15',
        text: '#ffffff',
        hover: '#6a1712',
      },
      outline: {
        border: '#be2e00',
        text: '#be2e00',
        hover: '#be2e0020',
      },
      white: {
        bg: '#ffffff',
        text: '#000000',
        hover: '#f5f5f5',
      },
    },
  },

  // Spacing
  spacing: {
    button: {
      sm: {
        px: '0.75rem', // 12px
        py: '0.375rem', // 6px
      },
      md: {
        px: '1rem', // 16px
        py: '0.5rem', // 8px
      },
      lg: {
        px: '1.5rem', // 24px
        py: '0.75rem', // 12px
      },
    },
  },

  // Typography
  fontFamily: {
    primary: 'Ping L, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
  },
  fontSize: {
    button: {
      sm: '0.875rem', // 14px
      md: '1rem', // 16px
      lg: '1.125rem', // 18px
    },
  },

  // Transitions
  transition: {
    default: 'all 0.2s ease',
    fast: 'all 0.1s ease',
    slow: 'all 0.3s ease',
  },

  // Box shadows
  shadow: {
    button: '0 2px 4px rgba(0, 0, 0, 0.1)',
    buttonHover: '0 4px 8px rgba(0, 0, 0, 0.15)',
  },
};

module.exports = design;