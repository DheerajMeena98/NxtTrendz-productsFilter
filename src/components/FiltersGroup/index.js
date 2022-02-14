import {BsSearch} from 'react-icons/bs'

import './index.css'

const FiltersGroup = props => {
  const {
    ratingsList,
    categoryOptions,
    filterByCategory,
    filterByRating,
    clearAllFilters,
    filterBySearch,
    activeRatingId,
    activeCategoryId,
    searchInput,
    enterSearchInput,
  } = props

  const onSearchProducts = event => {
    filterBySearch(event.target.value)
  }

  const onClearFilters = () => {
    clearAllFilters()
  }

  const onEnterSearchInput = event => {
    if (event.key === 'ENTER') {
      enterSearchInput()
    }
  }

  const renderCategoryOptions = () => (
    <ul className="category-options-container">
      <h1 className="category-heading"> Category </h1>
      {categoryOptions.map(eachCategory => {
        const categoryClassName =
          activeCategoryId === eachCategory.categoryId
            ? `category-name active-category-name`
            : `category-name`
        const onFilterByCategory = () =>
          filterByCategory(eachCategory.categoryId)

        return (
          <li
            className="each-category-list-item"
            onClick={onFilterByCategory}
            key={eachCategory.categoryId}
          >
            {' '}
            <p className={categoryClassName}> {eachCategory.name}</p>
          </li>
        )
      })}
    </ul>
  )

  const renderRatingOptions = () => (
    <ul className="rating-options-container">
      <h1 className="category-heading"> Rating </h1>
      {ratingsList.map(eachRating => {
        const onFilterByRating = () => {
          filterByRating(eachRating.ratingId)
        }

        const ratingClassName =
          activeRatingId === eachRating.ratingId
            ? `and-up active-rating`
            : `and-up`
        return (
          <li
            className="each-rating-list-item"
            key={eachRating.ratingId}
            onClick={onFilterByRating}
          >
            <img
              src={eachRating.imageUrl}
              className="each-rating-image"
              alt={`rating ${eachRating.ratingId}`}
            />
            <p className={ratingClassName}>& up</p>
          </li>
        )
      })}
    </ul>
  )

  return (
    <div className="filters-group-container">
      <div className="input-search-container">
        <input
          value={searchInput}
          type="search"
          placeholder="Search"
          onChange={onSearchProducts}
          onKeyDown={onEnterSearchInput}
          className="search-input-products"
        />
        <BsSearch className="search-icon" />
      </div>

      {renderCategoryOptions()}
      {renderRatingOptions()}

      <button type="button" onClick={onClearFilters}>
        <span className="button_top clear-filters-button"> Clear Filters </span>
      </button>
    </div>
  )
}

export default FiltersGroup
