import { Character } from '../types';
import path from 'path';

const BAND = 'Bocchi the Rock!';
const DIR = path.join(__dirname, '../assets/bocchi');

const CHAR_DATA: Omit<Character, 'band'>[] = [
    {
        id: 'bocchi-nijika',
        name: '伊地知虹夏',
        images: [
            path.join(DIR, 'nijika_1.jpg')
        ]
    },
];

export const BOCCHI_CHARACTERS: Character[] = CHAR_DATA.map(c => ({ ...c, band: BAND }));
