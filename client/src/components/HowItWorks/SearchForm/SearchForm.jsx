import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './SearchForm.module.sass';
import searchData from './../../../data/howItWorksData/searchData.json';
import searchIcon from '../../../../public/staticImages/howItWorksImg/search_icon/search_icon';

class SearchForm extends Component {
  render () {
    return (
      <>
        <form className={styles.searchContainer} action='#' method='GET'>
          <div className={styles.icon}>{searchIcon}</div>
          <input
            name='search'
            type='text'
            placeholder='Search Over 200,000 + Premium Names'
            required
            className={styles.searchInput}
          />
          <button className={styles.searchBtn} type='submit'>
            {searchIcon}
          </button>
        </form>
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
