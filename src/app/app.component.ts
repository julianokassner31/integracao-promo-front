import { AfterContentInit, Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterContentInit {
  title = 'integrador-promocao-diaria';
  version: any;

  constructor(private api: ApiService) {}

  ngAfterContentInit(): void {
    this.api.getVersion().subscribe((resp: any) => {
      this.version = resp.versao;
    });
  }

  logout() {
    this.api.post('/logout').subscribe(
      (resp) => {
        window.location.replace(environment.url + '/login');
      },
      (err) => window.location.replace(environment.url + '/login')
    );
  }
}
