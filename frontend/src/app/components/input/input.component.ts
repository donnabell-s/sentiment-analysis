import { Component } from '@angular/core';
import { AnalysisService } from '../../services/analysis.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-input',
  imports: [FormsModule,RouterModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css'
  
})
export class InputComponent {
  text = '';

  constructor(private analysisService: AnalysisService, private router: Router){}

  onSubmit(): void {
    this.analysisService.sentimentAnalysis(this.text).subscribe(
      (response) => {
        console.log('transfered text', response);
        // Stringify the response object before storing
        localStorage.setItem('json_results', JSON.stringify(response));
        this.router.navigate(['/results']);
      },
      (error) => {
        console.error('error with service', error);
      }
    );
  }
}
