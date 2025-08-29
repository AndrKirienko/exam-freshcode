import React, { Component } from 'react';
import { connect } from 'react-redux';
import CONSTANTS from '../../constants';
import withRouter from '../../hocs/withRouter';
import { clearUserStore, getUser } from '../../store/slices/userSlice';
import Logo from '../Logo/Logo';
import styles from './Header.module.sass';
import MainMenu from './MainMenu/MainMenu';

import RenderLoginButtons from './UserMenu/RenderLoginButtons/RenderLoginButtons';

const {
  CONTACTS: { TEL },
} = CONSTANTS;

class Header extends Component {
  componentDidMount () {
    if (!this.props.data) {
      this.props.getUser();
    }
  }

  startContests = () => {
    this.props.navigate('/startContest');
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
          <a href='#' className={styles.infoLink}>
            Read Announcement
          </a>
        </div>
        <div className={styles.loginSignnUpHeaders}>
          <div className={styles.loginSignUpHearersContainer}>
            <a href={`tel:${TEL}`} className={styles.numberContainer}>
              <img
                src={`${CONSTANTS.STATIC_IMAGES_PATH}phone.png`}
                alt='phone'
              />
              <span className={styles.tel}>{TEL}</span>
            </a>
            <RenderLoginButtons
              localStorage={localStorage}
              data={this.props.data}
              clearUserStore={this.props.clearUserStore}
              navigate={this.props.navigate}
            />
          </div>
        </div>
        <div className={styles.navMenu}>
          <div className={styles.navContainer}>
            <Logo className={styles.logo} alt='blue_logo'></Logo>
            <div className={styles.leftNav}>
              <MainMenu />
            </div>
            {this.props.data && this.props.data.role === CONSTANTS.CUSTOMER && (
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
