import { Character } from '../types';
import path from 'path';

const BAND = 'Ave Mujica';
const DIR = path.join(__dirname, '../assets/mujica');

const CHAR_DATA = [
    {
        id: 'ave-saki',
        name: '丰川祥子',
        images: [
            path.join(DIR, 'saki_1.jpg')
        ]
    },
    {
        id: 'ave-nyamu',
        name: '喵姆亲',
        images: [
            path.join(DIR, 'nyamu_1.jpg')
        ]
    },
    {
        id: 'ave-mutsumi',
        name: '若叶睦',
        images: [
            path.join(DIR, 'mutsumi_1.jpg')
        ]
    }
];

export const MUJICA_CHARACTERS: Character[] = CHAR_DATA.map(c => ({ ...c, band: BAND }));
