import * as R from 'ramda';

const ACTIONS = {
  CITY_INPUT_VALUE: 'CITY_INPUT_VALUE',
  ADD_CITY: 'ADD_CITY',
  DELETE_CITY: 'DELETE_CITY'
};

export const cityInputAction = city => ({
  type: ACTIONS.CITY_INPUT_VALUE,
  city
});

export const addCityAction = () => ({
  type: ACTIONS.ADD_CITY
});

export const deleteCityAction = id => ({
  type: ACTIONS.DELETE_CITY,
  id
});

const update = (action, model) => {
  switch (action.type) {
    case ACTIONS.CITY_INPUT_VALUE: {
      const { city } = action;
      return { ...model, city };
    }

    case ACTIONS.ADD_CITY: {
      const { city: location, cities, nextId: id } = model;
      const newCity = { id, location, temp: '?', high: '?', low: '?' };
      const nextId = id + 1;

      return {
        nextId,
        city: '',
        cities: [...cities, newCity]
      };
    }

    case ACTIONS.DELETE_CITY: {
      const { id } = action;
      const cities = R.reject(R.propEq('id', id), model.cities);
      return {
        ...model,
        cities
      };
    }

    default: {
      return model;
    }
  }
};

export default update;
