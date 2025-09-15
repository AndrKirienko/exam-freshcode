import React, { Component } from 'react';
import mainFooter from './../../data/footers/mainFooter.json';
import styles from './Footer.module.sass';

class Footer extends Component {
  topFooterItemsRender = item => (
    <div key={item.title} className={styles.footerSection}>
      <h4 className={styles.footerTitle}>{item.title}</h4>
      {item.items.map((i, index) => (
        <a key={index} href={i.link} className={styles.footerLink}>
          {i.name}
        </a>
      ))}
    </div>
  );

  topFooterRender () {
    return mainFooter.FooterItems.map(item => this.topFooterItemsRender(item));
  }

  render () {
    return (
      <div className={styles.footerContainer}>
        <div className={styles.footerTop}>
          <div className={styles.footerItemsWrapper}>
            {this.topFooterRender()}
          </div>
        </div>
      </div>
    );
  }
}

export default Footer;
