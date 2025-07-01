
import { provideRouter, Routes, withDebugTracing } from '@angular/router';
import { Listview } from './listview/listview';
import { ApplicationConfig } from '@angular/core';
import { Votepage } from './votepage/votepage';
import { Submitproject } from './submitproject/submitproject';
import { Login } from './login/login';
import { Detailproject } from './detailproject/detailproject';
import { FourOfour } from './four-ofour/four-ofour';

export const routes: Routes = [
    {path: '', component: Listview},
    {path: 'vote', component: Votepage},
    {path: 'create', component: Submitproject},
    {path: 'login', component: Login},
    {path: 'detail/:id', component: Detailproject},
    {path: '**', component: FourOfour}
];
