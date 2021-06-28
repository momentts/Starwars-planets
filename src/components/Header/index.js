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

  const { filterByName: { name } } = filters;
  const columns = [
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
          value={ name }
          onChange={ (event) => changeInputsByName(event) } // provider linha 55, req 2
        />
      </label>
      <div>
        Pesquisar por número de:
        <select
          name="column"
          data-testid="column-filter"
          onChange={ changeSelectColumn }
        >
          {columns.map((column) => (
            <option key={ column } value={ column }>
              { column }
            </option>
          ))}
        </select>
        <select
          name="comparison"
          data-testid="comparison-filter"
          onChange={ changeSelectComparison }
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
          onChange={ changeSelectValue }
        />
        <button
          type="button"
          data-testid="button-filter"
          onClick={ handleFilterByNumericValues }
        >
          Pesquisar
        </button>
      </div>
    </div>
  );
}

export default Header;
