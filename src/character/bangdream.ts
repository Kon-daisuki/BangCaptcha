import { Character } from '../types';
import path from 'path';

const BAND = 'BanG Dream!';
const DIR = path.join(__dirname, '../assets/bangdream');

const CHAR_DATA = [
    {
        id: 'bd-kasumi',
        name: '户山香澄',
        images: [
            path.join(DIR, 'kasumi_1.jpg'),
            path.join(DIR, 'kasumi_2.jpg'),
            path.join(DIR, 'kasumi_3.jpg'),
        ]
    },
    {
        id: 'bd-arisa',
        name: '市谷有咲',
        images: [
            path.join(DIR, 'arisa_1.jpg'),
        ]
    }
];

export const BANGDREAM_CHARACTERS: Character[] = CHAR_DATA.map(c => ({ ...c, band: BAND }));
