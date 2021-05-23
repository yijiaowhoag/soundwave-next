const colors = {
  darkest: 'rgba(9, 12, 11, 1)',
  darkGreen: 'rgba(14, 22, 18, 1)',
  darkGreen30: 'rgba(14, 22, 18, 0.3)',
  green: 'rgba(37, 53, 37, 1)',
  lightGreen: 'rgba(63, 119, 89, 1)',
  lightGreen30: 'rgba(63, 119, 89, 0.3)',
  lightGreen10: 'rgba(63, 119, 89, 0.1)',
  light: 'rgba(161, 133, 130, 1)',
  purple: 'rgba(49, 27, 120, 1)',
  purple30: 'rgba(49, 27, 120, 0.3)',
  violet30: 'rgba(198, 74, 168, 0.3)',
  spotifyGreen: '#1db954',
  error: '#ff0033',
  disabled: '#a9a9a9',
};

const animations = {
  bezier: 'cubic-bezier(0.15, 0.15, 0, 1)',
  bezierLazy: 'cubic-bezier(0.34, 0.14, 0, 1)',
  power4EaseIn: 'cubic-bezier(.75,0,.75,.2)',
  power4EaseOut: 'cubic-bezier(.2,.75,.25,1)',
  power2EaseIn: 'cubic-bezier(.75,0,.9,.65)',
  power2EaseOut: 'cubic-bezier(.1,.35,.25,1)',
};

const theme = {
  colors,
  animations,
  shadow: {
    darkest: 'rgba(9, 12, 11, 1)',
    dark: 'rgba(14, 22, 18, 0.7)',
  },
  columns: (val: number) => `${(val / 12) * 100}vw`,
};

export default theme;
