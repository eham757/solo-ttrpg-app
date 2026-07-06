import { Routes } from '@angular/router';
import { Home } from './core/home/home';
import { OraclePage } from './features/oracle/oracle-page';
import { CharacterSheetPage } from './features/character-sheet/character-sheet-page';
import { DicePage } from './features/dice/dice-page';

export const routes: Routes = [
    {
        path: '',
        component: Home,
    },
    {
        path: 'oracle',
        component: OraclePage,
    },
    {
        path: 'characters',
        component: CharacterSheetPage,
    },
    {
        path: 'dice',
        component: DicePage,
    },
    {
        path: '**',
        redirectTo: '',
    },
];
