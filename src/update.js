import * as R from 'ramda';

const ACTIONS = {
  CITY_INPUT_VALUE: 'CITY_INPUT_VALUE',
  ADD_CITY: 'ADD_CITY',
  DELETE_CITY: 'DELETE_CITY',
  HTTP_SUCCESS: 'HTTP_SUCCESS'
};

const APPID = 'f649c361ddab9302d6550f868cd7932b';

const weatherUrl = city =>
  `http://api.openweathermap.org/data/2.5/weather?q=${encodeURI(city)}&units=metric&APPID=${APPID}`;

export const cityInputAction = city => ({
  type: ACTIONS.CITY_INPUT_VALUE,
  city
});

export const addCityAction = {
  type: ACTIONS.ADD_CITY
};

export const deleteCityAction = id => ({
  type: ACTIONS.DELETE_CITY,
  id
});

const httpSuccessAction = R.curry((id, response) => ({
  type: ACTIONS.HTTP_SUCCESS,
  id,
  response
}));

const update = (action, model) => {
  switch (action.type) {
    case ACTIONS.CITY_INPUT_VALUE: {
      const { city } = action;

      return { ...model, city };
    }

    case ACTIONS.ADD_CITY: {
      const { city, cities, nextId } = model;

      const newCity = {
        id: nextId,
        name: city,
        temp: '?',
        high: '?',
        low: '?'
      };

      const updatedCities = R.prepend(newCity, cities);

      return [
        {
          city: '',
          cities: updatedCities,
          nextId: nextId + 1
        },
        {
          request: {
            url: weatherUrl(city)
          },
          successAction: httpSuccessAction(nextId)
        }
      ];
    }

    case ACTIONS.DELETE_CITY: {
      const { id } = action;
      const cities = R.reject(R.propEq('id', id), model.cities);

      return {
        ...model,
        cities
      };
    }

    case ACTIONS.HTTP_SUCCESS: {
      const { id, response } = action;
      const { cities } = model;
      const { temp, temp_max: high, temp_min: low } = R.pathOr({}, ['data', 'main'], response);

      const updatedCities = R.map(city => {
        if (city.id === id)
          return { ...city, temp: Math.round(temp), high: Math.round(high), low: Math.round(low) };

        return city;
      }, cities);

      return { ...model, cities: updatedCities };
    }

    default: {
      return model;
    }
  }
};

export default update;
