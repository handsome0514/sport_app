import LoggedInBg from '../assets/img/logged_in_bg.png'
import notLoggedInBg from '../assets/img/not_logged_in_bg.png'

export const generateBackground: (loggedIn: boolean | undefined) => string = (
  loggedIn,
) => {
  if (loggedIn) {
    return `url(${LoggedInBg}) left top repeat`
  }
  return `url(${notLoggedInBg}) left top repeat`
}
