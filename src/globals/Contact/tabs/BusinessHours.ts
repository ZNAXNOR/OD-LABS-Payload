import type { Tab } from 'payload'

export const BusinessHoursTab: Tab = {
  label: 'Business Hours',
  description: 'Configure business hours and availability',
  fields: [
    {
      name: 'businessHours',
      type: 'group',      
      admin: {
        description: 'Configure when your business is open',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Display Business Hours',
          defaultValue: true,
          admin: {
            description: 'Show business hours on the website',
          },
        },
        {
          name: 'timezone',
          type: 'select',
          dbName: 'timezone', // Keep semantic meaning
          options: [
            { label: 'Eastern Time (ET)', value: 'America/New_York' },
            { label: 'Central Time (CT)', value: 'America/Chicago' },
            { label: 'Mountain Time (MT)', value: 'America/Denver' },
            { label: 'Pacific Time (PT)', value: 'America/Los_Angeles' },
            { label: 'UTC', value: 'UTC' },
            { label: 'GMT', value: 'Europe/London' },
            { label: 'CET', value: 'Europe/Paris' },
          ],
          defaultValue: 'America/New_York',
          admin: {
            condition: (_, siblingData) => siblingData.enabled,
            description: 'Business timezone',
          },
        },
        {
          name: 'schedule',
          type: 'array',
          dbName: 'schedule', // Keep semantic meaning
          label: 'Weekly Schedule',
          minRows: 7,
          maxRows: 7,
          admin: {
            condition: (_, siblingData) => siblingData.enabled,
            description: 'Configure hours for each day of the week',
          },
          fields: [
            {
              name: 'day',
              type: 'select',
              dbName: 'day', // Keep short names
              required: true,
              options: [
                { label: 'Monday', value: 'monday' },
                { label: 'Tuesday', value: 'tuesday' },
                { label: 'Wednesday', value: 'wednesday' },
                { label: 'Thursday', value: 'thursday' },
                { label: 'Friday', value: 'friday' },
                { label: 'Saturday', value: 'saturday' },
                { label: 'Sunday', value: 'sunday' },
              ],
              admin: {
                description: 'Day of the week',
              },
            },
            {
              name: 'isOpen',
              type: 'checkbox',
              label: 'Open',
              defaultValue: true,
              admin: {
                description: 'Is the business open on this day?',
              },
            },
            {
              type: 'row',
              admin: {
                condition: (_, siblingData) => siblingData.isOpen,
              },
              fields: [
                {
                  name: 'openTime',
                  type: 'text',
                  admin: {
                    width: '50%',
                    description: 'Opening time (e.g., "9:00 AM")',
                  },
                  validate: (value: any, { siblingData }: any) => {
                    if (siblingData?.isOpen && !value) {
                      return 'Opening time is required when open'
                    }
                    if (value && !/^(1[0-2]|0?[1-9]):[0-5][0-9]\s?(AM|PM)$/i.test(value)) {
                      return 'Please use format "9:00 AM" or "5:30 PM"'
                    }
                    return true
                  },
                },
                {
                  name: 'closeTime',
                  type: 'text',
                  admin: {
                    width: '50%',
                    description: 'Closing time (e.g., "5:00 PM")',
                  },
                  validate: (value: any, { siblingData }: any) => {
                    if (siblingData?.isOpen && !value) {
                      return 'Closing time is required when open'
                    }
                    if (value && !/^(1[0-2]|0?[1-9]):[0-5][0-9]\s?(AM|PM)$/i.test(value)) {
                      return 'Please use format "9:00 AM" or "5:30 PM"'
                    }
                    return true
                  },
                },
              ],
            },
            {
              name: 'note',
              type: 'text',
              admin: {
                description: 'Optional note for this day (e.g., "Appointment only")',
              },
            },
          ],
        },
        {
          name: 'specialHours',
          type: 'array',
          dbName: 'special_hours', // Snake case conversion
          label: 'Special Hours',
          maxRows: 10,
          admin: {
            condition: (_, siblingData) => siblingData.enabled,
            description: 'Special hours for holidays or events (max 10)',
          },
          fields: [
            {
              name: 'date',
              type: 'date',
              required: true,
              admin: {
                description: 'Date for special hours',
              },
            },
            {
              name: 'label',
              type: 'text',
              required: true,
              admin: {
                description: 'Label for this special day (e.g., "Christmas Day")',
              },
            },
            {
              name: 'isClosed',
              type: 'checkbox',
              label: 'Closed',
              admin: {
                description: 'Is the business closed on this day?',
              },
            },
            {
              type: 'row',
              admin: {
                condition: (_, siblingData) => !siblingData.isClosed,
              },
              fields: [
                {
                  name: 'openTime',
                  type: 'text',
                  admin: {
                    width: '50%',
                    description: 'Special opening time',
                  },
                },
                {
                  name: 'closeTime',
                  type: 'text',
                  admin: {
                    width: '50%',
                    description: 'Special closing time',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
