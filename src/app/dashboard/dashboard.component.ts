import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
    public currentPage: number = 0;
    public isFormOpen: boolean = false;
    public notification = {show : false, message : '', title : ''}
    public currentPageSize : number = 3;

    receivePage (newPage : number){
      this.currentPage = newPage;
      console.log(this.currentPage);
    }

    getPageSize(pageData : number){
      this.currentPageSize = pageData;
    }

    openForm (isOpen : boolean){
      this.isFormOpen = isOpen;
    }

    displayToast (data: {show : boolean, message : string, title : string}){
      this.notification = data;
      console.log(this.notification);
      setTimeout(() => this.hideNotification(), 5000);
    }

    hideNotification() {
      this.notification = { show: false, message: '', title : ''};
    }
}
