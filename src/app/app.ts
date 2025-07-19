import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient ,HttpClientModule} from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  symbols: Record<string, string> = {};
  from = 'USD';
  to = 'PKR';
  amount = 1;
  result: number | null = null;
  loading = false;
  history: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any>(`${environment.apiUrl}symbols`).subscribe((res) => {
      this.symbols = res.symbols;
    });

    const stored = localStorage.getItem('conversion_history');
    if (stored) this.history = JSON.parse(stored);
  }

  convert() {
    this.loading = true;

    this.http
      .post<any>(`${environment.apiUrl}convert`, {
        from: this.from,
        to: this.to,
        amount: this.amount,
      })
      .subscribe((res) => {
        this.result = res.result;

      const entry = {
  from: this.from,
  to: this.to,
  amount: this.amount,
  result: res.result,
  date: new Date().toLocaleString(),
};
        this.history.unshift(entry);
        localStorage.setItem(
          'conversion_history',
          JSON.stringify(this.history)
        );
        this.loading = false;
      });
  }
    getFormattedResult(): string {
    return this.result !== null ? this.result.toFixed(2) : '';
  }
  clearHistory() {
  localStorage.removeItem('conversion_history');
  this.history = [];
}

}
