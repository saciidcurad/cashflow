import { Business, Currency } from './types';

export const INITIAL_BUSINESS_DATA: Business[] = [];

export const CURRENCIES: { code: Currency; name: string }[] = [
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'USD', name: 'United States Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'GBP', name: 'British Pound Sterling' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'SOS', name: 'Somali Shilling' },
    { code: 'ETB', name: 'Ethiopian Birr' },
];