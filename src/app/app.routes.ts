
import { provideRouter, Routes, withDebugTracing } from '@angular/router';
import { Listview } from './listview/listview';
import { ApplicationConfig } from '@angular/core';
import { Votepage } from './votepage/votepage';
import { Submitproject } from './submitproject/submitproject';

export const routes: Routes = [
    {
        path: '',
        component: Listview

    },
    {
        path: 'vote',
        component: Votepage
    },
    {
        path: 'create', component: Submitproject
    }
];