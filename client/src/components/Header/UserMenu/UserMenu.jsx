import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import userMenu from './../../../data/menus/userMenu.json';
import styles from './UserMenu.module.sass';

class UserMenu extends Component {
  logOut = () => {
    this.props.localStorage.clear();
    this.props.clearUserStore();
    this.props.navigate('/login', { replace: true });
  };

  handleAction = action => {
    if (typeof this[action] === 'function') {
      this[action]();
    } else {
      console.error(`Function "${action}" is not defined.`);
    }
  };

  mapUserMenu = () => {
    return userMenu.menuItems.map((item, index) => {
      if (item.type === 'link') {
        return (
          <li key={index} className={styles.menuItem}>
            <Link to={item.to}>
              <span className={styles.menuText}>{item.text}</span>
            </Link>
          </li>
        );
      }
      if (item.type === 'action') {
        return (
          <li key={index} className={styles.menuItem}>
            <span
              className={styles.logOut}
              onClick={() => this.handleAction(item.function)}
              style={{ cursor: 'pointer' }}
            >
              {item.text}
            </span>
          </li>
        );
      }
      return null;
    });
  };
  render () {
    return <ul className={styles.userMenuList}>{this.mapUserMenu()}</ul>;
  }
}

export default UserMenu;
