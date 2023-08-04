import { useState } from 'react';
import PropTypes from 'prop-types';
import css from './Searchbar.module.css';

export default function SearchBar({ onSubmit }) {
  const [inputValue, setInputValue] = useState('');

  const handleChange = event => {
    setInputValue(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    const searchQuery = inputValue.trim();
    onSubmit(searchQuery);
    setInputValue('');
  };

  return (
    <header className={css.searchBar}>
      <form className={css.searchForm} onSubmit={handleSubmit}>
        <input
          className={css.searchFormInput}
          name="searchName"
          type="text"
          id="search"
          value={inputValue}
          onChange={handleChange}
        />
        <button type="submit" className={css.searchFormButton}>
          Search
        </button>
      </form>
    </header>
  );
}

SearchBar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
