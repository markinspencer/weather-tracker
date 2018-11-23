import * as R from 'ramda';
import hh from 'hyperscript-helpers';
import { h } from 'virtual-dom';
import { cityInputAction, addCityAction, deleteCityAction } from './update';

const { div, h1, p, pre, form, label, input, button, ul, li, i } = hh(h);

const renderCityForm = (dispatch, model) =>
  div(
    form(
      {
        onsubmit: e => {
          e.preventDefault();
          dispatch(addCityAction());
        }
      },
      [
        label({ className: 'f6 b db mb2' }, 'Location'),
        input({
          type: 'text',
          className: 'pa2 mr2 w-60',
          value: model.city,
          oninput: e => dispatch(cityInputAction(e.target.value))
        }),
        button(
          {
            type: 'submit',
            className: 'white bg-blue b--blue ba dim f3 pv2 ph3 pointer'
          },
          'Add'
        )
      ]
    )
  );

const renderCityDetail = (className, labelText, data) =>
  div({ className }, [div({ className: 'f7 b' }, labelText), div(data)]);

const renderCityItem = (dispatch, city) => {
  const { location, temp, low, high, id } = city;

  return li({ className: 'pa3 bb b--light-silver flex justify-between relative' }, [
    renderCityDetail('w-60 tl', 'Location', location),
    renderCityDetail('w-10 tc', 'Temp', temp),
    renderCityDetail('w-10 tc', 'High', high),
    renderCityDetail('w-10 tc mr2', 'Low', low),
    i(
      {
        className: 'relative top--1 right--1 mt1 mr1 fa fa-remove pointer black-40 dim',
        onclick: () => dispatch(deleteCityAction(id))
      },
      ''
    )
  ]);
};

const renderCityList = (dispatch, cities) => {
  const listItems = R.map(city => renderCityItem(dispatch, city), cities);
  return ul({ className: 'list pl0 ml0 ba b--light-silver br' }, listItems);
};

const view = (dispatch, model) => {
  const { cities } = model;
  return div({ className: 'mw6 center' }, [
    h1({ className: 'f2 pv2 bb' }, 'Weather'),
    renderCityForm(dispatch, model),
    cities.length === 0
      ? p(
          { className: 'f5 gray' },
          'No location information to display, add a location to get started...'
        )
      : renderCityList(dispatch, cities),
    pre(JSON.stringify(model, null, 2))
  ]);
};

export default view;
