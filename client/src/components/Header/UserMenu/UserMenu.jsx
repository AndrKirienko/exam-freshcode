import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import withRouter from '../../../hocs/withRouter';
import CountNotification from '../../Events/CountNotification/CountNotification';
import { TimerContext } from '../../Events/EventsList/TimerProvider';
import CONSTANTS from './../../../constants';
import userMenu from './../../../data/menus/userMenu.json';
import styles from './UserMenu.module.sass';
import { checkAuth } from '../../../store/slices/authSlice';

const {
  MODERATOR,
  CUSTOMER,
  AUTH_MODE: { LOGOUT },
} = CONSTANTS;

class UserMenu extends Component {
  static contextType = TimerContext;
  logOut = () => {
    const { clearAllData } = this.context;
    this.props.localStorage.clear();
    this.props.clearUserStore();
    clearAllData();
    this.props.logoutRequest({
      data: this.props.userStore.data,
      navigate: this.props.navigate,
    });
  };
  handleAction = action => {
    if (typeof this[action] === 'function') {
      this[action]();
    } else {
      console.error(`Function "${action}" is not defined.`);
    }
  };

  mapUserMenu = () => {
    const { role } = this.props.userStore.data;
    return userMenu.menuItems.map((item, index) => {
      if (item.type === 'link') {
        if (item.text === 'Offers' && role !== MODERATOR) {
          return null;
        }
        if (item.text === 'View Dashboard' && role === MODERATOR) {
          return null;
        }
        if (item.text === 'Events' && role !== CUSTOMER) {
          return null;
        }

        return (
          <li key={index}>
            <Link to={item.to}>
              <span className={styles.menuText}>
                {item.text}
                {item.text === 'Events' && <CountNotification />}
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

const mapStateToProps = state => {
  const { userStore } = state;
  return { userStore };
};
const mapDispatchToProps = dispatch => ({
  logoutRequest: ({ data, navigate }) =>
    dispatch(checkAuth({ data, navigate, authMode: LOGOUT })),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(UserMenu));
