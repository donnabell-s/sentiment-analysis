import { Component } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';

Chart.register(...registerables);

@Component({
  selector: 'app-results-graphs',
  imports: [BaseChartDirective, CommonModule],
  templateUrl: './results-graphs.component.html',
  styleUrl: './results-graphs.component.css'
})

export class ResultsGraphsComponent {
  results: any = null;
  errorMessage: string | null = null;

  // Horizontal Bar Chart Configuration
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    indexAxis: 'y',
    plugins: {
      legend: {
        display: false // This hides the legend (including the label)
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.parsed.x}%`; // Shows just the percentage in tooltip
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: ' '
        }
      },
      y: {
        type: 'category', // Explicitly set scale type
        ticks: {
          autoSkip: false
        }
      }
    }
  };

  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: ['Positive', 'Negative', 'Neutral'],
    datasets: [{
      // label: 'Sentiment Scores (%)',
      data: [],
      backgroundColor: [
        '#FCBC03',  // (Positive)
        '#4385F5',  // (Negative)
        '#34A853'   // (Neutral)
      ],
      borderColor: [
        '#FCBC03',
        '#4385F5',
        '#34A853'
      ],
      borderWidth: 1
    }]
  };

  // Pie Chart Configuration
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.label}: ${context.raw}%`;
          }
        }
      }
    }
  };

  public pieChartType: ChartType = 'pie';
  public pieChartData: ChartData<'pie'> = {
    labels: ['Positive', 'Negative', 'Neutral'],
    datasets: [{
      data: [],
      backgroundColor: [
        '#FCBC03', 
        '#4385F5', 
        '#34A853' 
      ],
      hoverBackgroundColor: [
        '#EDB000',
        '#3778E8',  
        '#2DA64D'   
      ],
      borderWidth: 1
    }]
  };

  constructor() {
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

      if (this.results?.scores) {
        const values = [
          this.results.scores.positive,
          this.results.scores.negative,
          this.results.scores.neutral
        ];
        
        this.barChartData.datasets[0].data = values;
        this.pieChartData.datasets[0].data = values;
      }
    } catch (e) {
      this.errorMessage = 'Error parsing analysis results';
      console.error(e);
    }
  }
}