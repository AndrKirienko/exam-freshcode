import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CONSTANTS from '../../../../constants';
import CountNotification from '../../../Events/CountNotification/CountNotification';
import UserMenu from './../UserMenu';
import styles from './RenderLoginButtons.module.sass';

class RenderLoginButtons extends Component {
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
              className={styles.userAvatar}
            />
            <span
              className={styles.userName}
            >{`Hi, ${this.props.data.displayName}`}</span>
            <img
              src={`${CONSTANTS.STATIC_IMAGES_PATH}menu-down.png`}
              alt='menu'
              className={styles.menuIcon}
            />
            <CountNotification />
            <nav className={styles.userMenu}>
              <UserMenu
                localStorage={this.props.localStorage}
                clearUserStore={this.props.clearUserStore}
                navigate={this.props.navigate}
              />
            </nav>
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
        <Link to='/login'>
          <span className={styles.authBtn}>LOGIN</span>
        </Link>
        <Link to='/registration'>
          <span className={styles.authBtn}>SIGN UP</span>
        </Link>
      </>
    );
  };
  render () {
    return (
      <div className={styles.userButtonsContainer}>
        {this.renderLoginButtons()}
      </div>
    );
  }
}
export default RenderLoginButtons;
