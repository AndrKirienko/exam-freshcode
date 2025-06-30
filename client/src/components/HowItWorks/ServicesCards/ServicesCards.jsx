import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import servicesCardsData from '../../../data/howItWorksData/servicesCardsData';
import styles from './ServicesCards.module.sass';

class ServicesCards extends Component {
  render () {
    return (
      <div className={styles.serviceCardsContainer}>
        {servicesCardsData.map((key, index) => (
          <article className={styles.serviceCard} key={index}>
            <div className={styles.serviceContext}>
              <img className={styles.serviceImage} src={key.icon} />
              <h3 className={styles.serviceCardTitle}>{key.title}</h3>
              <p className={styles.serviceCardDescription}>{key.description}</p>
            </div>
            <div>
              <Link className={styles.serviceCardLink} to={key.link}>
                <span className={styles.serviceCardLinkTitle}>
                  {key.btnTitle}
                </span>
                <img className={styles.serviceLinkIcon} src={key.btnIcon} />
              </Link>
            </div>
          </article>
        ))}
      </div>
    );
  }
}

export default ServicesCards;
