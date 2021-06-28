import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fetchStarWars from '../services/api';
import StarWarsContext from './StartWarsContext';

const initialState = {
  error: null,
  isFetching: false,
  data: [],
  filters: {
    filterByName: { name: '' },
    filterByNumericValues: [],
    filterByNumericsCurrency: {
      column: 'population',
      comparison: 'maior que',
      value: '0',
    },
    order: { column: 'name', sort: 'ASC' },
  },
};
class Provider extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.getStarWarsAPI = this.getStarWarsAPI.bind(this);
    this.changeInputsByName = this.changeInputsByName.bind(this);
    this.filterByName = this.filterByName.bind(this);
  }

  componentDidMount() {
    this.getStarWarsAPI();
  }

  handleRemoveFilter() {
    const { filters: { filterByNumericValues }, filters } = this.state;
    if (filterByNumericValues.length) {
      const previousFilters = filterByNumericValues.pop();
      this.setState(
        {
          filters: {
            ...filters, filterByNumericValues: previousFilters,
          },
        },
      );
    }
    this.getStarWarsAPI();
  }

  getStarWarsAPI() {
    const { isFetching } = this.state;
    if (isFetching) return;
    this.setState({ isFetching: true });
    fetchStarWars()
      .then((response) => {
        const { results } = response;
        results.forEach((starwars) => delete starwars.residents);
        this.setState({ isFetching: false, data: results,
        });
        // this.sortPlanets();
      }, (error) => {
        this.setState({
          isFetching: false, error: error.message,
        });
      });
  }

  getValue(currency, nexting) {
    const cur = currency.match(/^[0-9]+$/) ? Number(currency) : currency;
    const nex = nexting.match(/^[0-9]+$/) ? Number(nexting) : nexting;
    return {
      cur,
      nex,
    };
  }

  changeInputsByName({ target }) {
    const { name, value } = target;
    this.setState((state) => ({
      ...state,
      filters: {
        ...state.filters,
        filterByName: {
          [name]: value,
        },
      },
    }));
    this.filterByName(value);
  }

  filterByName(name) {
    const { data } = this.state;
    const filteredData = data.filter((curr) => curr.name.includes(name));
    this.setState({ data: filteredData });
    if (name === '') {
      this.getStarWarsAPI();
    }
  }

  render() {
    const contextValue = {
      ...this.state,
      getStarWarsAPI: this.getStarWarsAPI,
      changeInputsByName: this.changeInputsByName,
    };
    const { children } = this.props;
    return (
      <StarWarsContext.Provider value={ contextValue }>
        {children}
      </StarWarsContext.Provider>
    );
  }
}
Provider.propTypes = {
  children: PropTypes.node.isRequired,
};
export default Provider;
