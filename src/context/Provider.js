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
  },
};
class Provider extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.getStarWarsAPI = this.getStarWarsAPI.bind(this); // chamada da API que vamos trabalhar
    this.changeInputsByName = this.changeInputsByName.bind(this); // valores digitados nos inputs
    this.filterByName = this.filterByName.bind(this); // filtro por nome pedido no req 2
    this.changeSelectColumn = this.changeSelectColumn.bind(this);
    this.changeSelectComparison = this.changeSelectComparison.bind(this);
    this.changeSelectValue = this.changeSelectValue.bind(this);
    this.handleFilterByNumericValues = this.handleFilterByNumericValues.bind(this);
  }

  componentDidMount() {
    this.getStarWarsAPI();
  }

  handleFilterByNumericValues() { // req 3, criar um filtro de valores numericos
    const {
      filters: { filterByNumericsCurrency }, data } = this.state;
    const { column, comparison, value } = filterByNumericsCurrency;
    this.setState((state) => ({
      filters: { ...state.filters,
        filterByNumericValues: [
          ...state.filters.filterByNumericValues,
          filterByNumericsCurrency,
        ],
      },
    }));
    const filteredData = data.filter((curr) => { // filtros pedidos no req 3
      if (comparison === 'maior que') {
        return Number(curr[column]) > Number(value);
      }
      if (comparison === 'menor que') {
        return Number(curr[column]) < Number(value);
      }
      if (comparison === 'igual a') return curr[column] === value;
      return true;
    });
    this.setState({ data: filteredData }); // data, que é um array vazio vai receber os valores correspondentes aos filtros
  }

  getStarWarsAPI() {
    const { isFetching } = this.state;
    if (isFetching) return;
    this.setState({ isFetching: true });
    fetchStarWars()
      .then((response) => {
        const { results } = response;
        results.forEach((starwars) => delete starwars.residents); // pedido no teste, remover a chave residents
        this.setState({ isFetching: false, data: results,
        });
        // this.sortPlanets(); // funçao que organiza os planetas em ordem ascendente ou descendente, linha 171
      }, (error) => {
        this.setState({
          isFetching: false, error: error.message,
        });
      });
  }

  changeInputsByName({ target }) { // guardando os valores digitados no input de name, pesquisa por nome, req 2
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
    this.filterByName(value); // linha 133
  }

  changeSelectColumn({ target }) { // filtro por coluna, population, orbital_period, diameter, rotation_period, surface_water
    const { value } = target; // objeto contido em filters na linha 10
    this.setState((state) => ({
      filters: {
        ...state.filters,
        filterByNumericsCurrency: {
          ...state.filters.filterByNumericsCurrency,
          column: value, // atribuindo a coluna escolhida
        },
      },
    }));
  }

  changeSelectComparison({ target }) {
    const { value } = target;
    this.setState((state) => ({
      filters: {
        ...state.filters,
        filterByNumericsCurrency: {
          ...state.filters.filterByNumericsCurrency,
          comparison: value, // atribuindo o valor numerico digitado
        },
      },
    }));
  }

  changeSelectValue({ target }) { // guardando valor numerico digitado no input
    const { value } = target;
    this.setState((state) => ({
      filters: {
        ...state.filters,
        filterByNumericsCurrency: {
          ...state.filters.filterByNumericsCurrency,
          value,
        },
      },
    }));
  }

  filterByName(name) { // compoe o filtro por name na funçao changeinputsname, linha 80
    const { data } = this.state;
    const filteredData = data.filter((curr) => curr.name.includes(name));
    // https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
    this.setState({ data: filteredData });
    if (name === '') {
      this.getStarWarsAPI(); // caso nada digitado, retornar os valores da API inicial
    }
  }

  render() {
    const contextValue = {
      ...this.state,
      getStarWarsAPI: this.getStarWarsAPI,
      changeInputsByName: this.changeInputsByName,
      changeSelectColumn: this.changeSelectColumn,
      changeSelectComparison: this.changeSelectComparison,
      changeSelectValue: this.changeSelectValue,
      handleFilterByNumericValues: this.handleFilterByNumericValues,
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
