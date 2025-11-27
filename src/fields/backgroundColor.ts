import type { Field } from 'payload';

export type Type = 'orange' | 'red' | 'none' | 'blue';

export const backgroundColor: Field = {
  name: 'backgroundColor',
  type: 'radio',
  label: 'Background Color',
  defaultValue: 'none',
  admin: {
    layout: 'horizontal',
  },
  options: [
    {
      label: 'None',
      value: 'none',
    },
    {
      label: 'Red',
      value: 'red',
    },
    {
      label: 'Blue',
      value: 'blue',
    },
    {
      label: 'Orange',
      value: 'orange',
    },
  ],
};
