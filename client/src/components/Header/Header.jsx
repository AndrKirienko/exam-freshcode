import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from './Header.module.sass';
import CONSTANTS from '../../constants';
import { clearUserStore } from '../../store/slices/userSlice';
import { getUser } from '../../store/slices/userSlice';
import withRouter from '../../hocs/withRouter';
import Logo from '../Logo';
import menuContents from './menu.json';

const {
  CONTACTS: { TEL },
} = CONSTANTS;

class Header extends React.Component {
  componentDidMount () {
    if (!this.props.data) {
      this.props.getUser();
    }
  }

  logOut = () => {
    localStorage.clear();
    this.props.clearUserStore();
    this.props.navigate('/login', { replace: true });
  };

  startContests = () => {
    this.props.navigate('/startContest');
  };

  mapMenuContents = () => {
    return (
      <>
        <ul>
          {menuContents.menu.map((menuSection, index) => (
            <li key={index} className={styles.menuList}>
              <span>{menuSection.title}</span>
              <img
                src={`${CONSTANTS.STATIC_IMAGES_PATH}menu-down.png`}
                alt='menu'
              />
              <ul>
                {menuSection.items.map((item, idx) => (
                  <li key={idx}>
                    <a href={item.link}>{item.name}</a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </>
    );
  };

  renderLoginButtons = () => {
    if (this.props.data) {
      return (
        <>
          <div className={styles.userInfo}>
            <img
              src={
                this.props.data.avatar === 'anon.png'
                  ? CONSTANTS.ANONYM_IMAGE_PATH
                  : `${CONSTANTS.publicURL}${this.props.data.avatar}`
              }
              alt='user'
            />
            <span>{`Hi, ${this.props.data.displayName}`}</span>
            <img
              src={`${CONSTANTS.STATIC_IMAGES_PATH}menu-down.png`}
              alt='menu'
            />
            <ul>
              <li>
                <Link to='/dashboard' style={{ textDecoration: 'none' }}>
                  <span>View Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to='/account' style={{ textDecoration: 'none' }}>
                  <span>My Account</span>
                </Link>
              </li>
              <li>
                <Link
                  to='http:/www.google.com'
                  style={{ textDecoration: 'none' }}
                >
                  <span>Messages</span>
                </Link>
              </li>
              <li>
                <Link
                  to='http:/www.google.com'
                  style={{ textDecoration: 'none' }}
                >
                  <span>Affiliate Dashboard</span>
                </Link>
              </li>
              <li>
                <span className={styles.logOut} onClick={this.logOut}>
                  Logout
                </span>
              </li>
            </ul>
          </div>
          <img
            src={`${CONSTANTS.STATIC_IMAGES_PATH}email.png`}
            className={styles.emailIcon}
            alt='email'
          />
        </>
      );
    }
    return (
      <>
        <Link to='/login' style={{ textDecoration: 'none' }}>
          <span className={styles.btn}>LOGIN</span>
        </Link>
        <Link to='/registration' style={{ textDecoration: 'none' }}>
          <span className={styles.btn}>SIGN UP</span>
        </Link>
      </>
    );
  };

  render () {
    if (this.props.isFetching) {
      return null;
    }
    return (
      <div className={styles.headerContainer}>
        <div className={styles.fixedHeader}>
          <span className={styles.info}>
            Squadhelp recognized as one of the Most Innovative Companies by Inc
            Magazine.
          </span>
          <a href='http://www.google.com'>Read Announcement</a>
        </div>
        <div className={styles.loginSignnUpHeaders}>
          <a href={`tel:${TEL}`} className={styles.numberContainer}>
            <img src={`${CONSTANTS.STATIC_IMAGES_PATH}phone.png`} alt='phone' />
            <span>{TEL}</span>
          </a>
          <div className={styles.userButtonsContainer}>
            {this.renderLoginButtons()}
          </div>
        </div>
        <div className={styles.navContainer}>
          <Logo className={styles.logo} alt='blue_logo'></Logo>
          <div className={styles.leftNav}>
            <div className={styles.nav}>
              {this.mapMenuContents(menuContents)}
            </div>
            {this.props.data && this.props.data.role !== CONSTANTS.CREATOR && (
              <div
                className={styles.startContestBtn}
                onClick={this.startContests}
              >
                START CONTEST
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => state.userStore;
const mapDispatchToProps = dispatch => ({
  getUser: () => dispatch(getUser()),
  clearUserStore: () => dispatch(clearUserStore()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
