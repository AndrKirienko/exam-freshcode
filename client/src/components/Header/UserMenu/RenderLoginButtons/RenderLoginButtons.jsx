import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import UserMenu from './../UserMenu';
import styles from './RenderLoginButtons.module.sass';
import CONSTANTS from '../../../../constants';

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
    return <>{this.renderLoginButtons()}</>;
  }
}
export default RenderLoginButtons;
