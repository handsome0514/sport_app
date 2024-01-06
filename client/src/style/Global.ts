import { createGlobalStyle } from 'styled-components'
export const GlobalStyle = createGlobalStyle`
        * {
            padding: 0;
            margin: 0;
            box-sizing: border-box;
            letter-spacing: .5px;
            font-family: resolve;
        }
        html {
            -webkit-overflow-scrolling: none;
        }
        a {
            text-decoration: none;
            color: white;
        }
        ::-webkit-scrollbar {
            width: 0;
            height: 0;
        }
            
        ::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 8px;            
        }
            
        ::-webkit-scrollbar-thumb {
            background-color: darkgrey;
            outline: none;
            border-radius: 8px;
        }
        input {
            outline: none;
        }
        @keyframes breath-animation {
            0% { transform:scale(1) ; opacity:1; }
            50% { transform:scale(0.98) ; opacity: 0.75 }
            100% { transform:scale(1) ; 100px; opacity: 1; }
           }
        `

