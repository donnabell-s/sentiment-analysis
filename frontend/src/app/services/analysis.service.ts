import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {
  private apiUrl = 'http://127.0.0.1:8000/api/analyze/';

  constructor(private http: HttpClient) { }

  sentimentAnalysis(text: string): Observable<any> {
    return this.http.post(this.apiUrl,{ text: text });
  }
}