import { Character } from '../types';
import path from 'path';

const BAND = 'MyGO!!!!!';
const DIR = path.join(__dirname, '../assets/mygo');

const CHAR_DATA = [
    // {
    //     id: 'mygo-tomori',
    //     name: '高松灯',
    //     images: [
    //         path.join(DIR, 'tomori_1.jpg'),
    //         path.join(DIR, 'tomori_2.jpg'),
    //         path.join(DIR, 'tomori_3.jpg'),
    //         path.join(DIR, 'tomori_4.jpg'),
    //         path.join(DIR, 'tomori_5.jpg'),
    //     ]
    // },
    {
        id: 'mygo-anon',
        name: '千早爱音',
        images: [
            path.join(DIR, 'anon_1.jpg'),
            path.join(DIR, 'anon_2.jpg'),
            path.join(DIR, 'anon_3.jpg'),
            path.join(DIR, 'anon_4.jpg'),
        ]
    },
    {
        id: 'mygo-soyo',
        name: '长崎素世',
        images: [
            path.join(DIR, 'soyo_1.jpg'),
            path.join(DIR, 'soyo_2.jpg')
        ]
    },
    {
        id: 'mygo-rana',
        name: '要乐奈',
        images: [
            path.join(DIR, 'rana_1.jpg')
        ]
    }
];

export const MYGO_CHARACTERS: Character[] = CHAR_DATA.map(c => ({ ...c, band: BAND }));
