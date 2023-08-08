// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'
import DayJsAdapter from '@date-io/dayjs'


import colors from 'vuetify/lib/util/colors'

export default createVuetify({
    theme: {
        themes: {
            light: {
                dark: true,
                colors: {
                    background: '#1a1a1a',
                    navbar: '#1a1a1a',
                    primary: colors.red.darken1,
                    secondary: colors.red.lighten4,
                },
            },
        },
    },
    date: {
        adapter: DayJsAdapter,
    }
});
