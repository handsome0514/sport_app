import React from 'react'
import Faq from 'react-faq-component'
const data = {
  title: 'FAQ (How it works)',
  rows: [
    {
      title: 'Does service has any costs?',
      content: 'No. This is free to use service.',
    },
    {
      title: 'How do I create a tournament?',
      content:
               'First you need to register and after login, select "Create tournament" and the process guides you forward.',
    },
    {
      title: 'How do I find a tournament?',
      content: 'When creating tournament. Tournament code will be visible on tournament code. Tournament organizer can share this code to allow direct access to tournament page by entered this code on main page.',
    },
    {
      title: 'How do I contact if my question is not answered here?',
      content: <p>You can contact us via email at support@sub.soccer so we can help you further.</p>,
    },
    {
      title: 'How can I delete my account?',
      content: <p>You can contact us via email at support@sub.soccer add Delete Account as subject, and please include your email in the body of your email.
                since your data might include some other users content we request for a consent
      </p>,
    },
  ],
}
const styles = {
  bgColor: 'transparent',

  rowContentColor: 'grey',
  arrowColor: 'red',
}

const config = {
  animate: true,
  // arrowIcon: "V",
  tabFocus: true
}
const Support:React.FC = () => {

  return (<>
    <div>
      <Faq
        data={data}
        styles={styles}
        config={config}
      />
    </div>

    <div style={{marginTop: 30 }}>

    </div>
    <a href='mailto:support@subsoccer.com'><h2 style={{color: 'grey' }}>
                email: support@subsoccer.com
    </h2></a>

  </>)
}
export default Support
