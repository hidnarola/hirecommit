import { Component, OnInit } from '@angular/core';
import { environment } from '../.../../../../../environments/environment'
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  employerURL: String;
  candidateURL: String;
  mainURL: String;
  constructor() {
    this.employerURL = environment.employerURL;
    this.candidateURL = environment.candidateURL;
    this.mainURL = environment.mainURL;
  }

  ngOnInit() {
  }

}
