import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import userMenu from './../../../data/menus/userMenu.json';
import styles from './UserMenu.module.sass';
import CountNotification from '../../Events/CountNotification/CountNotification';
import { TimerContext } from '../../Events/EventsList/TimerProvider';

class UserMenu extends Component {
  static contextType = TimerContext;
  logOut = () => {
    const { clearAllData } = this.context;
    this.props.localStorage.clear();
    this.props.clearUserStore();
    clearAllData();
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
          <li key={index}>
            <Link to={item.to}>
              <span className={styles.menuText}>
                {item.text} {item.text === 'Events' && <CountNotification />}
              </span>
            </Link>
          </li>
        );
      }
      if (item.type === 'action') {
        return (
          <li key={index}>
            <span
              className={styles.logOut}
              onClick={() => this.handleAction(item.function)}
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
