import { Character } from '../types';
import path from 'path';

const BAND = 'Girls Band Cry';
const DIR = path.join(__dirname, '../assets/gbc');

const CHAR_DATA = [
    {
        id: 'gbc-nina',
        name: '井芹仁菜',
        images: [
            path.join(DIR, 'nina_1.jpg'),
            path.join(DIR, 'nina_2.jpg'),
            path.join(DIR, 'nina_3.jpg'),
        ]
    },
    {
        id: 'gbc-mmk',
        name: '河原木桃香',
        images: [
            path.join(DIR, 'mmk_1.jpg'),
            path.join(DIR, 'mmk_2.jpg'),
        ]
    },
    {
        id: 'gbc-486',
        name: '安和昴',
        images: [
            path.join(DIR, '486_1.jpg'),
            path.join(DIR, '486_2.jpg'),
            path.join(DIR, '486_3.jpg'),
            path.join(DIR, '486_4.jpg'),
            path.join(DIR, '486_5.jpg'),
        ]
    },
    {
        id: 'gbc-rupa',
        name: 'Rupa',
        images: [
            path.join(DIR, 'rupa_1.jpg'),
        ]
    },
    {
        id: 'gbc-tomo',
        name: '海老冢智',
        images: [
            path.join(DIR, 'tomo_1.jpg'),
        ]
    }
];

export const GBC_CHARACTERS: Character[] = CHAR_DATA.map(c => ({ ...c, band: BAND }));
