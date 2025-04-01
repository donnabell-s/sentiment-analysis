import { Routes } from '@angular/router';
import { InputComponent } from './components/input/input.component';
import { ResultsComponent } from './components/results/results.component';
import { ResultsGraphsComponent } from './components/results-graphs/results-graphs.component';

export const routes: Routes = [
    { path: 'input', component: InputComponent },
    { path: 'results', component: ResultsComponent },
    { path: 'results', component: ResultsGraphsComponent },
    { path: '', redirectTo: '/input', pathMatch: 'full' },
    { path: '**', redirectTo: '/input' }
];
