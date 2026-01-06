import { Character } from '../types';
import path from 'path';

const BAND = 'K-ON!';
const DIR = path.join(__dirname, '../assets/kon');

const CHAR_DATA = [
    {
        id: 'kon-yui',
        name: '平泽唯',
        images: [
            path.join(DIR, 'yui_1.jpg')
        ]
    },
    {
        id: 'kon-azusa',
        name: '中野梓',
        images: [
            path.join(DIR, 'azusa_1.jpg')
        ]
    }
];

export const KON_CHARACTERS: Character[] = CHAR_DATA.map(c => ({ ...c, band: BAND }));
