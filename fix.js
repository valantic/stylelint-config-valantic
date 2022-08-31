const reset = require('./property-groups/0_reset');
const positioning = require('./property-groups/1_positioning-layout');
const boxModel = require('./property-groups/2_boxModel');
const visual = require('./property-groups/3_visual');
const typography = require('./property-groups/4_typography');
const animation = require('./property-groups/5_animation');
const misc = require('./property-groups/6_misc');

const outsideInOrder = [
  ...reset,
  ...positioning,
  ...boxModel,
  ...visual,
  ...typography,
  ...animation,
  ...misc,
];

module.exports = {
  plugins: 'stylelint-order',
  rules: {
    'order/properties-order': outsideInOrder,
    'order/properties-alphabetical-order': null,
  },
};
