
import { provideRouter, Routes, withDebugTracing } from '@angular/router';
import { Listview } from './listview/listview';
import { ApplicationConfig } from '@angular/core';

export const routes: Routes = [
    {path: '', component: Listview},
];