import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import servicesCardsData from './../../../data/servicesCardsData';
import styles from './ServicesCards.module.sass';

class ServicesCards extends Component {
  render () {
    return (
      <div className={styles.serviceContainer}>
        {servicesCardsData.map((key, index) => (
          <article className={styles.serviceCard}>
            <div className={styles.serviceContext}>
              <img className={styles.serviceImage} src={key.icon} alt='' />
              <h3 className={styles.serviceCardTitle}>{key.title}</h3>
              <p className={styles.serviceCardDescription}>{key.description}</p>
            </div>
            <div>
              <Link className={styles.serviceCardLink} to={key.link}>
                <span className={styles.serviceCardLinkTitle}>
                  {key.btnTitle}
                </span>
                <img
                  className={styles.serviceLinkIcon}
                  src={key.btnIcon}
                  alt=''
                />
              </Link>
            </div>
          </article>
        ))}
      </div>
    );
  }
}

export default ServicesCards;
