'use client'

import { createTheme } from '@mui/material'

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'dark',
    // primary: { main: '#D51C29' },
  },
  typography: {
    fontFamily: 'var(--font-roboto)',
  },
})

export default theme
