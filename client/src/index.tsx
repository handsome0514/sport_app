import { createRoot } from 'react-dom/client'
//Redux
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import './assets/fonts/fonts.css'
import { App } from './App'
import { store } from './redux'
import { GlobalStyle } from './style/Global'
const container = document.getElementById('root')
if (container) {
  const root = createRoot(container) // createRoot(container!) if you use TypeScript

  root.render(
    <Provider store={store}>
      <GlobalStyle />
      {/* <GlobalFonts /> */}
      <BrowserRouter>
        <head>
          <meta
            httpEquiv='Content-Security-Policy'
            content='upgrade-insecure-requests'
          />
          
        </head>
        <App />
      </BrowserRouter>
    </Provider>,
  )
}
