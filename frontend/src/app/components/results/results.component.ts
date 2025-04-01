import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ResultsGraphsComponent } from '../results-graphs/results-graphs.component';

@Component({
  selector: 'app-results',
  imports: [CommonModule,FormsModule, ResultsGraphsComponent],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css'
})
export class ResultsComponent {
  results: any = null;
  errorMessage: string | null = null;

  constructor(private router: Router) {
    this.loadResults();
  }

  loadResults() {
    const storedResults = localStorage.getItem('json_results');
    
    if (!storedResults) {
      this.errorMessage = 'No analysis results found. Please analyze some text first.';
      return;
    }

    try {
      this.results = JSON.parse(storedResults);

      // Check if processed_text is empty or null
      if (!this.results.processed_text || this.results.processed_text.trim() === '') {
        this.results = null; // Force the "no results" template to show
        this.errorMessage = 'The analysis returned empty results. Please try with different text.';
      }

    } catch (e) {
      console.error('Error parsing stored results:', e);
      this.errorMessage = 'Failed to load analysis results. Please try again.';
      this.results = null;
    }
  }

  newAnalysis():void{
    this.router.navigate(['/input']);
  }
}






  // getScoresArray() {
  //   if (!this.results?.scores) return [];
  //   return [
  //     { name: 'Positive', value: this.results.scores.positive, unit: '%' },
  //     { name: 'Negative', value: this.results.scores.negative, unit: '%' },
  //     { name: 'Neutral', value: this.results.scores.neutral, unit: '%' },
  //     { name: 'Compound', value: this.results.scores.compound, unit: '' }
  //   ];
  // }