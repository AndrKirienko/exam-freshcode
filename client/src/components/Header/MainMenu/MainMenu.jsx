import React, { Component } from 'react';
import mainMenu from './../../../data/menus/mainMenu.json';
import CONSTANTS from './../../../constants';
import styles from './MainMenu.module.sass';

const { STATIC_IMAGES_PATH } = CONSTANTS;

class MainMenu extends Component {
  mapMainMenu = () => {
    return (
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {mainMenu.menu.map((menuSection, index) => (
            <li key={index} className={styles.menuSection}>
              <span className={styles.menuSectionTitle}>
                {menuSection.title}
              </span>
              <img src={`${STATIC_IMAGES_PATH}menu-down.png`} alt='menu' />
              <ul className={styles.submenuList}>
                {menuSection.items.map((item, idx) => (
                  <li key={idx} className={styles.submenuItem}>
                    <a href={item.link} className={styles.menuLink}>
                      {item.name}
                    </a>
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
