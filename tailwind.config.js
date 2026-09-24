import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import lineClamp from '@tailwindcss/line-clamp';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['"Noto Sans"', ...defaultTheme.fontFamily.sans],
                montserrat: ['"Montserrat"', ...defaultTheme.fontFamily.sans],
                spaceGrotesk: ['"Space Grotesk"', ...defaultTheme.fontFamily.sans],
                poppins: ['"Poppins"', ...defaultTheme.fontFamily.sans],
            },
            screens: {
                tablet: { max: '1024px' },
                mobile: { max: '768px' },
            },
        },
    },


    plugins: [
        forms,
        lineClamp,
        require("tailwind-scrollbar"),
    ],
};
