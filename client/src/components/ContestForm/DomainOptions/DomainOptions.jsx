import React, { Component } from 'react';
import styles from './DomainOptions.module.sass';
import domainData from './../../../data/domainData.json';
import checkIcon from './../../../../public/staticImages/icon-check';

class DomainOptions extends Component {
  constructor (props) {
    super(props);
    this.state = {
      activeDomain: domainData[0],
    };
  }

  handleClasses = key => {
    return this.state.activeDomain === key
      ? styles.activeItem
      : styles.optionsItem;
  };

  handleSelectDomain = key => {
    this.setState({ activeDomain: key });
  };

  render () {
    return (
      <div className={styles.containerOptions}>
        <h3 className={styles.optionsTitle}>
          Do you want a matching domain (.com URL) with your name?
        </h3>
        <ul className={styles.containerBtnOptions}>
          {domainData.map((key, index) => (
            <li
              key={index}
              className={this.handleClasses(key)}
              onClick={() => this.handleSelectDomain(key)}
            >
              <span className={styles.checkIcon}>{checkIcon}</span>
              {key.isRecommended && (
                <div className={styles.recommended}>Recommended</div>
              )}
              <h4 className={styles.optionItemTitle}>{key.title}</h4>
              <p className={styles.optionItemDescriptions}>
                {key.descriptions}
              </p>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
export default DomainOptions;
