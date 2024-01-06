import React, {
  FC, useEffect, useRef, useState
} from 'react'
import Modal from 'react-modal'
import {useNavigate} from 'react-router'
import {useFormik} from 'formik'
import styled from 'styled-components'
import * as Yup from 'yup'

import {useAppDispatch, useAppSelector} from '../../hooks/redux'
import {actionUserRegistration} from '../../redux/reducer/userReducer'
import {Flex} from '../../style/Custom'
import {Button} from '../Button/Button'
import {Input} from '../Input/Input'

const LoginStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
    justify-content: flex-start;
    width: 100%;
  }
`

const Box = styled.div`
  @media only screen and (max-width: 768px) {
    font-size: 12px;
    justify-content: flex-start;
    width: 100%;
    h2 {
      margin-bottom: 30px;
    }
  }
`

const Title = styled.h2`
  color: #383d42;
  font-size: 24px;
  align-self: flex-start;
  margin-bottom: 30px;
`

const LogIn = styled.span`
  cursor: pointer;
  color: #383d42;
  text-align: center;
  font-weight: 300;
  font-size: 16px;
  line-height: 17px;
  text-align: center;
  letter-spacing: 0.06em;
  text-decoration-line: underline;

  &:hover {
    color: #f95050;
  }
`

const CheckboxWrapper = styled.label`
  display: block;
  align-self: flex-start;
  color: #383d42;
  position: relative;
  padding-left: 43px;
  margin-bottom: 17px;
  cursor: pointer;
  font-size: 20px;
  font-weight: 300;

  a {
    color: #383d42;
    text-decoration: underline;
  }

  a:hover {
    color: #f95050;
  }

  &:last-of-type {
    margin-bottom: 25px;
  }
`

const NativeCheckbox = styled.input.attrs({type: 'checkbox'})`
  visibility: hidden;
`

const RealCheckbox = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  height: 21px;
  width: 21px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 3px;
  border: 2px solid #ffffff;

  &::after {
    content: '';
    position: absolute;
    display: none;
    left: 5px;
    bottom: 4px;
    width: 4px;
    height: 9px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }

  ${CheckboxWrapper}:hover & {
    background-color: gray;
  }

  ${CheckboxWrapper} a:hover ~ & {
    background-color: rgba(255, 255, 255, 0.7);
  }

  ${NativeCheckbox}:active ~ & {
    background-color: white;
  }

  ${NativeCheckbox}:checked ~ & {
    background-color: #3e5bed;
  }

  ${NativeCheckbox}:checked ~ &::after {
    display: block;
  }
`

const TermsErro = styled.span`
  display: block;
  font-size: 16px;
  line-height: 17px;
  letter-spacing: 0.06em;
  color: #ce482b;
  padding-top: 10px;
`
const TermsText = styled.div`
  font-size: 20px;
  line-height: 2rem;
  color: #383d42;
  font-weight: normal;
`
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('The email is incorrect')
    .required('Please enter your email'),
  password: Yup.string()
    .required('Please enter your password.')
    .min(8, 'Password is too short - should be 8 chars minimum.')
    .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
  passwordConfirmation: Yup.string().oneOf(
    [Yup.ref('password'), null],
    'Passwords must match',
  ),
  subscribe: Yup.bool(),
  terms: Yup.bool().oneOf(
    [true],
    'You need to accept the Terms and Conditions',
  ),
})

export const Registration: FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const {
    handleSubmit, handleChange, values, errors, touched
  } = useFormik({
    initialValues: {
      password: '',
      passwordConfirmation: '',
      email: '',
      terms: false,
      subscribe: false,
    },
    validationSchema,
    onSubmit(values) {
      try {
        // console.log(values);
        dispatch(
          actionUserRegistration({
            user_email: values.email.toLowerCase(),
            password: values.password,
            subscribe: values.subscribe,
          }),
        )
          .then(() => {
            navigate('/login')
          })
      } catch (err) {
        console.log(err)
      }
    },
  })

  const {isLoading, user_email, user_id} = useAppSelector(({user}) => user)

  const firstLoad = useRef(true)

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '75%',
      background: '#f8f8f8',
      height: '60%',
      overflow: 'scroll',
    },
  }

  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false
      if (user_email && user_id) {
        return navigate('/account')
      }
    }
  }, [])

  if (isLoading) {
    return <h1>Loading...</h1>
  }
  console.log('isLoading', isLoading);

  return (
    <LoginStyled>
      <form onSubmit={handleSubmit}>
        <Box>
          <Title>Register</Title>
          <Input
            type='email'
            name='email'
            label='email'
            placeholder={''}
            value={values.email}
            onChange={handleChange}
            errorString={
              errors.email && touched.email ? errors.email : undefined
            }
          />
          <Input
            type='password'
            name='password'
            label='password'
            placeholder={''}
            value={values.password}
            onChange={handleChange}
            errorString={
              errors.password && touched.password && !errors.email
                ? errors.password
                : undefined
            }
          />
          <Input
            type='password'
            name='passwordConfirmation'
            label='confirm password'
            placeholder={''}
            value={values.passwordConfirmation}
            onChange={handleChange}
            errorString={
              errors.passwordConfirmation &&
              touched.passwordConfirmation &&
              !errors.email &&
              !errors.password
                ? errors.passwordConfirmation
                : undefined
            }
          />
          <Flex flex_direction={'column'}>
            <CheckboxWrapper>
              Subscribe to newsletter and occassional announcements
              <NativeCheckbox
                name='subscribe'
                checked={values.subscribe}
                onChange={handleChange}
              ></NativeCheckbox>
              <RealCheckbox></RealCheckbox>
            </CheckboxWrapper>
            <CheckboxWrapper>
              Accept our{' '}
              <a onClick={() => setIsOpen(true)}>
                privacy policy and terms of use
              </a>
              <TermsErro>
                {errors.terms &&
                touched.terms &&
                !errors.passwordConfirmation &&
                !errors.password &&
                !errors.email
                  ? errors.terms
                  : ''}
              </TermsErro>
              <NativeCheckbox
                name='terms'
                checked={values.terms}
                onChange={handleChange}
              ></NativeCheckbox>
              <RealCheckbox></RealCheckbox>
            </CheckboxWrapper>

            <Button type='submit' style={{marginBottom: 18}}>
              Continue
            </Button>

            <LogIn onClick={() => navigate('/login')}>
              Click here to log in
            </LogIn>
          </Flex>
        </Box>
      </form>
      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        ariaHideApp={false}
        style={customStyles}
      >
        <Title>Terms and Conditions of Use</Title>
        <TermsText>
          <p>Effective starting August 15th, 2023</p>
          <h2><strong>1. General Provisions</strong></h2>
          <p>
            1.1. These terms and conditions (hereinafter the “Terms and Conditions”) govern the use of the software
            and digital services (hereinafter the “Application”) provided by Subsoccer Oy (a limited liability company
            incorporated in Finland with the address Itälahdenkatu 23 A, 00210 Helsinki, Finland, herein referred to
            as “Subsoccer”). The Application provides a solid platform to arrange subsoccer tournaments , where
            organizers and players can meet each other (hereinafter event organizers and players collectively referred
            to as the “User”). The Application may only be used in connection with Subsoccer’s gaming and other
            products that are connected to the Internet.
          </p>
          <p>
            1.2. In order to use the Application, the User must register for the Application by creating an account
            (the “Account”). The User may select to register for the Application either as an organizer (hereinafter
            the “Organizer”) or as a player interested in participating in subsoccer tournaments and games
            (hereinafter the “Player”, registered Organizers and Users collectively referred to as the “Registered
            Users”).
          </p>
          <p>
            1.3. Any User who creates and/or uses an Account certifies that (i) it is entitled to access and use the
            Application according to any applicable laws and/or regulations; (ii) it is at least sixteen years old
            (16); and (iii) the personal information the User inputs as part of the registration process is true,
            accurate and up to date.
          </p>
          <p>
            1.4. By accessing the Application and/or creating an Account, the User acknowledges that it has read and
            understood the Terms and Conditions and agrees to be bound by them. A User who does not agree to be bound
            by the Terms and Conditions shall not use the Application.
          </p>
          <p>
            1.5. Subsoccer reserves the right to make changes to the Terms and Conditions at any time in order to:
            (a) comply with changes in applicable laws, regulations, or directives, including consumer protection
            laws; (b) enhance security, functionality, or performance of the Application; (c) address technical,
            operational, or compatibility requirements related to the Application; (d) respond to evolving industry
            standards or practices.; or (e) adapt the terms to the changes made to the Application (e.g., introduction
            of new
            features or services subject to a fee). Subsoccer will notify the Users of any changes to the Terms and
            Conditions by sending an e-mail to the address linked to the User’s Account. Any User is deemed to have
            accepted such
            changes if the User continues to use the Application after the notification.
          </p>
          <p>
            1.6. Subsoccer and the Application are not supervised by the Finnish National Police Board (hereinafter
            the “NPB) and Subsoccer’s business related to the Application is not subject to gambling games regulation
            in Finland, in particular the Finnish Lotteries Act (1047/2001) (hereinafter the “Lotteries Act”). Users
            shall not use the Application to market services, particularly gambling games services, which might lead
            to a situation where Subsoccer or the services provided by Subsoccer in connection with the Application
            fall within the scope of the Lotteries Act, NPB’s supervision or any other gambling games regulation in any
            jurisdiction. </p>
          <p>
            1.7. The Application and its content are not directed at any person or entity who is a citizen or
            resident of, or located or established in, any jurisdiction where the use of the Application or direct
            participation in subsoccer tournaments or games would be contrary to applicable law or regulation or would
            subject
            Subsoccer to any authorization requirements and/or to any regulatory contorl in such jurisdiction. User
            warrants that the User is not subject to any such legal or regulatory restrictions.
          </p>
          <p>
            1.8. Subsoccer’s processing of personal data related to the Users is governed by the Data Processing
            Addendum. Subsoccer’s Privacy Policy further describes the processing of personal data related to the
            Users.
          </p>
          <p></p>
          <h2><strong>2. Tournament Proposals</strong></h2>
          <p>
            2.1. The Organizer may create tournament proposals (hereinafter the “Tournament Proposal”) and manage the
            Tournament Proposals through the Application, including the schedule and type of the tournament, the
            minimum amount of the players, the rewards, engagement of the tournament sponsor and any other information
            relating to the respective Tournament Proposal.
          </p>
          <p>
            2.2. The Organizer is solely responsible for the creation and management of the Organizer’s Tournament
            Proposals, as well as the practical implementation of the respective tournaments, including but not
            limited to updating, amending and removing of any information contained in the Tournament Proposal, and
            setting the rules of such tournaments and paying any potential rewards awarded in connection with the
            tournament.
          </p>
          <p>
            2.3. Tournament Proposals are accessible to any User, including such Users who are not Registered Users.
            However, in order to enter a tournament, the Player must have a Registered User status.
          </p>
          <p>
            2.4. In a situation where the Organizer wishes to engage a sponsor (the “Sponsor”) for the tournament,
            the Organizer can contact Subsoccer at sponsorship@subsoccer.com. Subsoccer will then endeavour to put
            Sponsor into contact with the Organizer subject to the legitimate interests of Subsoccer. The tournament
            sponsorship shall always be subject to a separate agreement between the Sponsors and the Organizers.
            Organizer shall make expressly Sponsor aware that Subsoccer is not a third-party beneficiary of the
            sponsorship agreement and that any possible disputes must be solved between the Organizer and Sponsor.
          </p>
          <p>
            2.5. Organizer undertakes to make the Sponsor expressly aware of the fact that any sponsorship can be a
            risky affair. Any tournament sponsorship may have both positive and negative impacts to the Sponsor.
            Organizer undertakes to strongly recommend the Sponsors not to rely solely on the Tournament Proposals but
            to obtain relevant and specific professional advice and to undertake a thorough risk assessment before
            committing to
            a sponsorship contract to protect the interests of the Sponsors.
          </p>
          <p></p>
          <h2><strong>3. Intellectual Property</strong></h2>
          <p>
            3.1. Subsoccer owns all title, rights, and interest to the Application including without limitation all
            intellectual property rights to the Application.
          </p>
          <p>
            3.2 Users of the Application are granted a non-exclusive, non-transferable, revocable license to access
            and use the Application strictly in accordance with the Terms and Conditions. The Users may on their own
            responsibility distribute content provided in the Application, provided that such Users cite to the
            Application when distributing such content and comply with these Terms and Conditions. If the content
            contains third-party material or third-party personal information, the User is obliged to ensure that the
            User has the rights
            to distribute the content. User acknowledges that the content can be distributed also through online
            services like Facebook, Instagram and Youtube. User undertakes to comply with the terms of these online
            services. Subsoccer is not responsible for compliance with the terms of third parties.
          </p>
          <p>
            3.3. The User grants Subsoccer a non-exclusive, perpetual, irrevocable, worldwide, sublicensable, and
            royalty-free license to use, distribute, make available, reproduce, transmit, publicly perform, reformat,
            adapt, promote, incorporate the content into other works, and create derivative work of the content,
            regardless of its nature, which the User has made available to Subsoccer in connection with the
            Application. In addition, the User grants Subsoccer a non-exclusive, royalty-free, worldwide, permanent,
            irrevocable
            license to use any feedback and recommendations provided by the User for any purposes. Subsoccer is not
            obligated to use
            such content or feedback or recommendation for any purpose. If Subsoccer publishes content, Subsoccer may
            identify the User as the source of the content and may use User’s trademarks and logos when doing so.
          </p>
          <p>
            3.4. The User represents and warrants that Subsoccer’s exercise of the rights granted in these Terms and
            Conditions will not result in the infringement, violation misappropriation of any copyright, trademark,
            right of publicity, moral right, trade secret, or other proprietary rights of any third party.
          </p>
          <p>
            3.5. The User who thinks that the provision of any content on the Application infringes any copyright or
            other intellectual property right of a third party are obliged to contact Subsoccer at legal@subsoccer.com
            Subsoccer is entitled to remove any content infringing third-party intellectual property rights in
            accordance with the applicable laws.
          </p>
          <p></p>
          <h2><strong>4. Liability, Warranties, and Indemnities</strong></h2>
          <p>
            4.1. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE APPLICATION IS PROVIDED ON AN “AS IS” BASIS.
            SUBSOCCER DOES NOT WARRANT THAT THE FUNCTIONS CONTAINED IN THE APPLICATION OR ACCESS TO THE APPLICATION
            WILL BE UNINTERRUPTED, ERROR-FREE OR THAT DEFECTS CAN BE CORRECTED, NOR MAKE ANY REPRESENTATIONS OR
            WARRANTIES OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
            MERCHANTABILITY, SATISFACTORY QUALITY, FITNESS FOR A PARTICULAR PURPOSE, REASONABLE CARE AND SKILL,
            NON-INFRINGEMENT,
            ACCURACY, RELIABILITY, COMPLETENESS, OR ABOUT RESULTS TO BE OBTAINED FROM USING THE APPLICATION.
          </p>
          <p>
            4.2 TO THE MAXIMUM EXTENT PERMITTED BY LAW, SUBSOCCER SHALL NOT BE HELD LIABLE FOR ANY INDIRECT,
            INCIDENTAL, PUNITIVE, CONSEQUENTIAL OR SPECIAL LOSSES OR DAMAGES OF ANY KIND WHATSOEVER, NOR FOR ANY LOSS
            OF DATA OR LOSS OF PROFIT, ARISING FROM, OR IN CONNECTION WITH THESE TERMS AND CONDITIONS, USE OF OR
            INABILITY TO USE
            THE APPLICATION, OR ANY USE OF OR RELIANCE ON ANY OF THE CONTENT PROVIDED ON THE APPLICATION.
          </p>
          <p>
            4.3 THE USER SHALL DEFEND, INDEMNIFY AND HOLD SUBSOCCER HARMLESS FROM AND AGAINST ANY AND ALL SUITS,
            ACTIONS, CLAIMS, LOSSES, DAMAGES, COSTS, FEES, AND EXPENSES RESULTING FROM THE USERS’ CONTENT PROVIDED TO
            THE APPLICATION AND/OR THE USER’S ACCESS/USE OF THE APPLICATION IN BREACH OF THESE TERMS AND CONDITIONS OR
            APPLICABLE LAWS.
          </p>
          <p></p>
          <h2><strong>5. Acceptable Use</strong></h2>
          <p>
            5.1. When using the Application, the User shall not:</p>
          <p>
            <ol type="A">
              <li>
                submit any defamatory, harassing, offensive, unlawful, abusive or otherwise inappropriate content,
                including without limitation content that would infringe upon the copyrights, trademarks, trade secrets,
                or other intellectual property rights of any person or entity.
              </li>
              <li>
                sublicense, rent, lease, adapt, alter, translate or modify in any manner the Application;
              </li>
              <li>
                decompile, reverse engineer, disassemble, or otherwise attempt to derive or determine the source
                code (or the underlying ideas, algorithms, structure or organization) of the Application. In case the
                User needs information for the purposes of interoperability, it shall send a request by email to
                legal@subsoccer.com prior to undertaking any activities referred to above in this Section 5.1 C;
              </li>
              <li>
                use the Application to conduct or promote any illegal activities;
              </li>
              <li>
                impersonate any person or entity, or otherwise misrepresent its affiliation with a person or
                entity;
              </li>
              <li>
                use any high volume automatic, electronic or manual process to access, search or harvest information
                from the Application (including without limitation robots, spiders or scripts);
              </li>
              <li>
                alter, remove, or obscure any copyright or trademark notice, digital watermarks, proprietary
                legends or other notice included in the Application;
              </li>
              <li>
                intentionally distribute any malware, corrupted files, or other items of a destructive or deceptive
                nature; or
              </li>
              <li>
                remove or in any manner circumvent any technical or other protective measures in the Application.
              </li>
            </ol>
          </p>
          <p></p>
          <h2><strong>6. Support, Updates, and Upgrades</strong></h2>
          <p>
            6.1. In order to obtain support services (hereinafter the “Support”) related to the use and functional
            issues of the Application, the User may contact Subsoccer []. Subsoccer will make reasonable efforts to
            respond to such inquiries for support, but it is not responsible for any outcome nor availability of the
            Support.
          </p>
          <p>
            6.2 The User acknowledges and agrees that Subsoccer is continuously developing the Application and that
            the Application may be subject to changes from time to time. Subsoccer is entitled to make updates,
            upgrades and other changes to the Application for the reasons of improving the Application’s
            functionality, adapting the Application to regulatory requirements, business or technical environment,
            preventing data security risks, or for other similar commercially justifiable reasons.
            Subsoccer will inform the Users in advance by e-mail of any changes to the Application that would
            materially affect the use of the Application in an adverse way.
            The User may always cancel its Account in accordance with Section 7.
          </p>
          <p></p>
          <h2><strong>7. Term, Suspension, and Termination</strong></h2>
          <p>
            7.1. These Terms and Conditions are applicable to any User as long as the User continues to use the
            Application or to maintain any Account, if any.
          </p>
          <p>
            7.2 Subject to Section 7.4., Users may at all times terminate their relationship with Subsoccer governed
            by these Terms and Conditions by ceasing their use of the Application and cancelling their Account, if
            any.
          </p>
          <p>
            7.3 If Subsoccer reasonably suspects that the User breaches these Terms and Conditions, Subsoccer may
            suspend or terminate any Account at any time without notice. Subsoccer disclaims all liability for the
            loss of any content and any other loss, loss of profit or any other damage that might arise in
            connection with the suspension or termination of any Account.
          </p>
          <p>
            7.4 The following provisions of the Terms and Conditions shall survive any termination or expiration of
            these Terms and Conditions: If a User ceases to use the Application and cancels his or her Account, if
            any, the following provisions of the Terms and Conditions shall survive: Intellectual Property and User´s
            Content (Section 3), Liability, Warranties, and Indemnities (Section 4)
            as well as Governing Law and Jurisdiction (Section 8).
          </p>
          <p>
            7.5 Subsoccer may terminate these Terms and Conditions at any time by giving a thirty (30) days’ notice to
            the User by e-mail. In such case, the User shall cease to use the Application and cancel its Account, if
            any.
          </p>
          <p></p>
          <h2><strong>8. Governing law and Resolution of Disputes</strong></h2>
          <p>
            8.1. These Terms and Conditions shall be governed by and construed in accordance with the laws of
            Finland, excluding its choice of law provisions.
          </p>
          <p>
            8.2. Any dispute, controversy or claim arising out of or relating to these Terms and Conditions and the
            use of the Application shall be irrevocably submitted to the exclusive jurisdiction of the district court
            of Helsinki, Finland, unless required otherwise by any mandatory applicable law.
          </p>
          <p>
            8.3 If User is a consumer, the User has always the right to refer the dispute to the Consumer Dispute
            Board (<a href='https://www.kuluttajariita.fi'>https://www.kuluttajariita.fi</a>). Before referring a
            dispute to the Consumer Dispute Board, the User is advised to contact the Finnish Consumer Advisory
            Services first
            (<a href='https://www.kkv.fi/kuluttajaneuvonta'>https://www.kkv.fi/kuluttajaneuvonta</a>). In addition,
            provided User is a consumer and resident in the area of European Union, the User may submit a complaint to
            the European Commission’s Online Conflict Resolution Platform at <a
            href='https://ec.europa.eu/consumers/odr/'>https://ec.europa.eu/consumers/odr/</a>.
          </p>
          <p></p>
          <h2><strong>9. Contact</strong></h2>
          <p>
            If you have questions or suggestions about these Terms and Conditions, please contact Subsoccer using
            the information below: Subsoccer Oy, It&auml;lahdenkatu 23 A, 00210 Helsinki, Finland Email:
            info@subsoccer.com Date of issue: August 15, 2023
          </p>
          <hr/>
        </TermsText>
      </Modal>
    </LoginStyled>
  )
}
