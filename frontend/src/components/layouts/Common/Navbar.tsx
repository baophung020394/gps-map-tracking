import CustomButton from '@components/Button'
import Image from '@components/Image'
import { Box } from '@mui/material'
import { NavLink } from 'react-router-dom'
import AddIcon from '../../../assets/images/navbar/plus28.svg'
import ChannelTalkIcon from '../../../assets/images/navbar/channelb.svg'
import ChannelTalkWIcon from '../../../assets/images/navbar/channelw.svg'
import Home from '../../../assets/images/navbar/logo-only.png'
import MessageIcon from '../../../assets/images/navbar/message28b.svg'
import MessageWIcon from '../../../assets/images/navbar/message28w.svg'
import ProfileIcon from '../../../assets/images/navbar/profile28b.svg'
import ProfileWIcon from '../../../assets/images/navbar/profile28w.svg'
// import MessageMBlueIcon from '../../../assets/images/navbar/mobile/m-message-blue-24.svg'
// import MessageMBlackIcon from '../../../assets/images/navbar/mobile/m-message-b-24.svg'
// import ProfileMBlueIcon from '../../../assets/images/navbar/mobile/m-profile-blue-24.svg'
// import ProfileMBlackIcon from '../../../assets/images/navbar/mobile/m-profile-b-24.svg'
// import ChannelMBlueIcon from '../../../assets/images/navbar/mobile/m-chnl-blue-24.svg'
// import ChannelMBlackIcon from '../../../assets/images/navbar/mobile/m-chnl-b-24.svg'
// import CreateChnlMBlueIcon from '../../../assets/images/navbar/mobile/m-create-chnl-blue-24.svg'
// import CreateChnlMBlackIcon from '../../../assets/images/navbar/mobile/m-create-chnl-b-24.svg'
import '../navbar.scss'

function Navbar() {
  return (
    <Box className='navbar-left'>
      <ul>
        <li className='logo-home'>
          <NavLink to='/channel'>
            <img src={Home} alt='' />
          </NavLink>
        </li>

        <li>
          <NavLink
            to='/channels'
            className={({ isActive, isPending }) => (isPending ? 'pending' : isActive ? 'selected' : '')}
          >
            <span className='svg-no-hover'>
              <Image src={ChannelTalkIcon} alt='' />
            </span>
            <span className='svg-hover'>
              <Image src={ChannelTalkWIcon} alt='' />
            </span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to='/chats'
            className={({ isActive, isPending }) => (isPending ? 'pending' : isActive ? 'selected' : '')}
          >
            <span className='svg-no-hover'>
              <Image src={MessageIcon} alt='' />
            </span>
            <span className='svg-hover'>
              <Image src={MessageWIcon} alt='' />
            </span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to='/profiles'
            className={({ isActive, isPending }) => (isPending ? 'pending' : isActive ? 'selected' : '')}
          >
            <span className='svg-no-hover'>
              <Image src={ProfileIcon} alt='' />
            </span>
            <span className='svg-hover'>
              <Image src={ProfileWIcon} alt='' />
            </span>
          </NavLink>
        </li>

        {/* <li className='messages-menu'>
          {countNewMessages.count > 0 && (
            <span className='messages-number'>{countNewMessages.count > 99 ? '99+' : countNewMessages.count}</span>
          )}
          <NavLink activeClassName='selected' to='/messages'>
            <span>
              <MessageIcon />
            </span>
            <span className='svg-hover'>
              <MessageWIcon />
            </span>
            <span className='m-icon'>
              <MessageMBlackIcon />
            </span>
            <span className='svg-hover m-icon'>
              <MessageMBlueIcon />
            </span>
          </NavLink>
        </li>

        <li className='create-menu'>
          <NavLink activeClassName='selected' to='/messages'>
            <span>
              <MessageIcon />
            </span>
            <span className='svg-hover'>
              <MessageWIcon />
            </span>
            <span className='m-icon'>
              <CreateChnlMBlackIcon />
            </span>
            <span className='svg-hover m-icon'>
              <CreateChnlMBlueIcon />
            </span>
          </NavLink>
        </li>

        <li>
          <NavLink activeClassName='selected' to='/profile'>
            <span>
              <ProfileIcon />
            </span>
            <span className='svg-hover'>
              <ProfileWIcon />
            </span>
            <span className='m-icon'>
              <ProfileMBlackIcon />
            </span>
            <span className='svg-hover m-icon'>
              <ProfileMBlueIcon />
            </span>
          </NavLink>
        </li> */}
      </ul>

      <div className='navbar-left__groups'>
        <CustomButton
          text=''
          width='52px'
          height='52px'
          maxHeight={52}
          maxWidth={52}
          minHeight={52}
          minWidth={52}
          backgroundColor='#2B76FF'
          borderRadius='50%'
          icon={AddIcon}
          className='btn-add'
          onClick={() => {
            console.log('click')
          }}
        />
      </div>
    </Box>
  )
}

export default Navbar
