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
    this.getStarWarsAPI(); // assim que renderizar a tabela !
  }

  getStarWarsAPI() {
    const { isFetching } = this.state;
    if (isFetching) return;
    this.setState({ isFetching: true });
    fetchStarWars()
      .then((response) => {
        const { results } = response;
        // a requisição (mock) retorna 14 chaves em cada planeta,
        // mas a chave `residents` não deve ser exibida totalizando 13 colunas.
        results.forEach((starwars) => delete starwars.residents);
        this.setState({ isFetching: false, data: results, // mudança do estado do fet e do data
        });
        // this.sortPlanets();
      }, (error) => {
        this.setState({
          isFetching: false, error: error.message, // em caso de erro da API
        });
      });
  }

  filterByName(name) { // Filtre a tabela através de um texto, inserido num campo de texto, 
    // exibindo somente os planetas cujos nomes incluam o texto digitado
    const { data } = this.state;
    const filteredData = data.filter((curr) => curr.name.includes(name));
    this.setState({ data: filteredData });
    if (name === '') {
      this.getStarWarsAPI();
    }
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
