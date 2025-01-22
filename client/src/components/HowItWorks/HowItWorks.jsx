import React, { Component } from 'react';
import styles from './HowItWorks.module.sass';

class HowItWorks extends Component {
  render () {
    return (
      <section className={styles.atomSection}>
        <div className={styles.atomContainer}>
          <div className={styles.atomContent}>
            <span className={styles.atomTagline}>
              World's #1 Naming Platform
            </span>
            <h1 className={styles.atomTitle}>How Does Atom Work?</h1>
            <p className={styles.atomDescription}>
              Atom helps you come up with a great name for your business by
              combining the power of crowdsourcing with sophisticated technology
              and Agency-level validation services.
            </p>
          </div>
          <iframe
            src='https://iframe.mediadelivery.net/embed/239474/327efcdd-b1a2-4891-b274-974787ae8362?autoplay=false&loop=false&muted=false&preload=true&responsive=true'
            allow='accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture'
            allowFullScreen
            className={styles.atomVideo}
            title='How Does Atom Work?'
          ></iframe>
        </div>
      </section>
    );
  }
}

export default HowItWorks;
