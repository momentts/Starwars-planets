import React, { useContext } from 'react';

import StarWarsContext from '../../context/StartWarsContext';

function Header() {
  const {
    filters,
    changeInputsByName,
    changeSelectColumn,
    changeSelectComparison,
    changeSelectValue,
    handleFilterByNumericValues,
  } = useContext(StarWarsContext);

  const { filterByName: { name } } = filters; // req 2, gerenciamento do estado pedido no requisito.
  const columns = [ // array com opçoes do select de pesquisa por numero de:
    'population',
    'orbital_period',
    'diameter',
    'rotation_period',
    'surface_water',
  ];

  return (
    <div>
      <label htmlFor="name">
        Pesquisar por nome:
        <input
          data-testid="name-filter"
          name="name"
          id="name"
          value={ name } // ligação com o objeto da linha 15
          onChange={ (event) => changeInputsByName(event) } // context > provider, linha 107, req 2
        />
      </label>
      <div>
        Pesquisar por número de:
        <select
          name="column"
          data-testid="column-filter"
          onChange={ changeSelectColumn } // context > provider, linha 121, req 3
          // abrir um dropdown que permita a quem usa selecionar uma das
          // seguintes colunas: population, orbital_period, diameter, rotation_period e surface_water.
        >
          {columns.map((column) => ( // mapeando as opçoes do select, array linha 16
            <option key={ column } value={ column }>
              { column }
            </option>
          ))}
        </select>
        <select
          name="comparison"
          data-testid="comparison-filter"
          onChange={ changeSelectComparison } // context > provider, linha 134, req 3
        >
          <option>selecione</option>
          <option value="maior que">maior que</option>
          <option value="menor que">menor que</option>
          <option value="igual a">igual a</option>
        </select>
        <input
          name="value"
          type="number"
          data-testid="value-filter"
          onChange={ changeSelectValue } // context > provider, linha 147, req 3
        />
        <button
          type="button"
          data-testid="button-filter"
          onClick={ handleFilterByNumericValues } // context > provider, linha 147, req 3
        >
          Pesquisar
        </button>
      </div>
    </div>
  );
}

export default Header;
