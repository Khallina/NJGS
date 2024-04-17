import React from 'react'
import ReactDOM from 'react-dom'
import MyApp from './MyApp'
import './index.css'
import { CookiesProvider } from 'react-cookie'

ReactDOM.render(<CookiesProvider><MyApp /></CookiesProvider>, document.getElementById('root'))
