import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const currentStatus = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failed: 'FAILURE',
}

class AllProductsSection extends Component {
  state = {
    status: currentStatus.initial,
    productsList: [],
    activeOptionId: sortbyOptions[0].optionId,
    categoryWiseFilter: '',
    ratingWiseFilter: '',
    searchWiseFilter: '',
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      status: currentStatus.loading,
    })
    const jwtToken = Cookies.get('jwt_token')

    const {
      activeOptionId,
      categoryWiseFilter,
      ratingWiseFilter,
      searchWiseFilter,
    } = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${categoryWiseFilter}&title_search=${searchWiseFilter}&rating=${ratingWiseFilter}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        status: currentStatus.success,
      })
    } else {
      this.setState({status: currentStatus.failed})
    }
  }

  filterByCategory = categoryId => {
    this.setState({categoryWiseFilter: categoryId}, this.getProducts)
  }

  filterByRating = ratingId => {
    this.setState({ratingWiseFilter: ratingId}, this.getProducts)
  }

  filterBySearch = searchInput => {
    this.setState({searchWiseFilter: searchInput}, this.getProducts)
  }

  enterSearchInput = () => {
    this.getProducts()
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  clearAllFilters = () => {
    this.setState(
      {
        ratingWiseFilter: '',
        categoryWiseFilter: '',
        searchWiseFilter: '',
        activeOptionId: sortbyOptions[0].optionId,
      },
      this.getProducts,
    )
  }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state
    const isProductsListEmpty = productsList.length === 0

    if (isProductsListEmpty) {
      return (
        <div className="no-products-found-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
            alt="no products"
            className="no-products-image"
          />
          <h1> No Products Found </h1>
          <p> We could not find any products. Try other filters.</p>
        </div>
      )
    }

    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />

        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="products-failed-section">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
      />
      <h1> Oops! Something Went Wrong</h1>
      <p>
        We are having some trouble processing your request. Please try again.
      </p>
    </div>
  )

  renderProducts = () => {
    const {status} = this.state
    switch (status) {
      case 'SUCCESS':
        return this.renderProductsList()
      case 'LOADING':
        return this.renderLoader()
      case 'FAILURE':
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {ratingWiseFilter, categoryWiseFilter, searchWiseFilter} = this.state
    return (
      <div className="all-products-section">
        {/* TODO: Update the below element */}
        <FiltersGroup
          ratingsList={ratingsList}
          categoryOptions={categoryOptions}
          filterByCategory={this.filterByCategory}
          filterByRating={this.filterByRating}
          clearAllFilters={this.clearAllFilters}
          filterBySearch={this.filterBySearch}
          enterSearchInput={this.enterSearchInput}
          activeRatingId={ratingWiseFilter}
          activeCategoryId={categoryWiseFilter}
          searchInput={searchWiseFilter}
        />

        {this.renderProducts()}
      </div>
    )
  }
}

export default AllProductsSection
