import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import mainMenu from './../../../data/menus/mainMenu.json';
import CONSTANTS from './../../../constants';
import styles from './MainMenu.module.sass';

const { STATIC_IMAGES_PATH } = CONSTANTS;

class MainMenu extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  toggleMenu = () => {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen,
    }));
  };

  mapMainMenu = () => {
    return (
      <nav className={styles.nav}>
        <div className={styles.burgerIcon} onClick={this.toggleMenu}>
          <div
            className={`${styles.line} ${this.state.isOpen ? styles.open : ''}`}
          ></div>
          <div
            className={`${styles.line} ${this.state.isOpen ? styles.open : ''}`}
          ></div>
          <div
            className={`${styles.line} ${this.state.isOpen ? styles.open : ''}`}
          ></div>
        </div>
        <ul
          className={`${styles.navList} ${
            this.state.isOpen ? styles.active : ''
          }`}
        >
          {mainMenu.menu.map((menuSection, index) => (
            <li key={index} className={styles.menuSection}>
              <span className={styles.menuSectionTitle}>
                {menuSection.title}
              </span>
              <img src={`${STATIC_IMAGES_PATH}menu-down.png`} alt='menu' />
              <ul className={styles.submenuList}>
                {menuSection.items.map((item, idx) => (
                  <li key={idx} onClick={this.toggleMenu}>
                    <Link to={item.link} className={styles.submenuItem}>
                      <span className={styles.menuLink}>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>
    );
  };

  render () {
    return <>{this.mapMainMenu()}</>;
  }
}

export default MainMenu;
