import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './SearchForm.module.sass';
import searchData from './../../../data/howItWorksData/searchData.json';

class SearchForm extends Component {
  render () {
    return (
      <>
        <div></div>
        <ul className={styles.listTag}>
          {searchData.map((key, index) => (
            <li key={index}>
              <Link to={key.link}>
                <span className={styles.listTagItem}>{key.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </>
    );
  }
}

export default SearchForm;
