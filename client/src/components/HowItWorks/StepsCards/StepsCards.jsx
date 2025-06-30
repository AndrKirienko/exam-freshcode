import React, { Component } from 'react';
import stepsCardsData from './../../../data/howItWorksData/stepsCardsData';
import styles from './StepsCards.module.sass';

class StepsCards extends Component {
  render () {
    return (
      <div className={styles.stepsCardsContainer}>
        {stepsCardsData.map((key, index) => (
          <article className={styles.stepCard} key={index}>
            <h3 className={styles.stepCardTitle}>{key.title}</h3>
            <p className={styles.stepCardDescription}>{key.description}</p>
            <img className={styles.stepCardIcon} src={key.icon} />
          </article>
        ))}
      </div>
    );
  }
}

export default StepsCards;
