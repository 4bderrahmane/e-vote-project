import 'i18next';
import common from '../../public/locales/en/common.json';
import auth from '../../public/locales/en/auth.json';
import nav from '../../public/locales/en/nav.json';

declare module 'i18next' {
    interface CustomTypeOptions {
        defaultNS: 'common';
        resources: {
            common: typeof common;
            auth: typeof auth;
            nav: typeof nav;
        };
    }
}