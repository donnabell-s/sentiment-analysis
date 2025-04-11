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

      console.log(this.results.scores.compound)

      // if (!this.results.processed_text || this.results.processed_text.trim() === '') {
      //   this.results = null; // Force the "no results" template to show
      //   this.errorMessage = 'The analysis returned empty results. Please try with different text.';
      // }

      if (!this.results.scores || 
        (this.results.scores.compound === 0 || 
        this.results.scores.compound === undefined) &&
        (this.results.scores.positive === 0 || 
        this.results.scores.positive === undefined) &&
        (this.results.scores.negative === 0 || 
        this.results.scores.negative === undefined) &&
        (this.results.scores.neutral === 0 || 
        this.results.scores.neutral === undefined)) {
        
        this.results = null; // Force the "no results" template to show
        this.errorMessage = 'The analysis returned empty results. Please try with different text.';
    }

    console.log(this.results)

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



