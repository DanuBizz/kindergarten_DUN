import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BackendService } from 'src/app/shared/backend.service';
import { StoreService } from 'src/app/shared/store.service';
import {MatPaginator, PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss'],
})
export class DataComponent implements OnInit {


  constructor(public storeService: StoreService, public backendService: BackendService) {}

  @Input() currentPage! : number;
  @Output() sendPage = new EventEmitter<number>();
  @Output() sendPageSize = new EventEmitter<number>();
  @Output() showToast = new EventEmitter<{title : string, message : string, show : boolean}>();
  @ViewChild(MatPaginator) paginator! : MatPaginator;


  displayedColumns : string[] = ['name', 'kindergarden', 'address', 'age', 'birthDate', 'abmelden'];

  ngOnInit(): void {
    this.backendService.getChildren(this.currentPage, this.backendService.defaultPageSize);
  }

  getAge(birthDate: string) {
    var today = new Date();
    var birthDateTimestamp = new Date(birthDate);
    var age = today.getFullYear() - birthDateTimestamp.getFullYear();
    var m = today.getMonth() - birthDateTimestamp.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDateTimestamp.getDate())) {
        age--;
    }
    return age;
  }

  selectPage(pageEvent: PageEvent) {
    this.sendPage.emit(this.paginator.pageIndex);
    this.sendPageSize.emit(this.paginator.pageSize);
    this.backendService.getChildren(this.paginator.pageIndex, pageEvent.pageSize);
  }

  removeChild (childId : string) {
    this.backendService.deleteChild(childId, this.currentPage, this.paginator.pageSize);
    const childData = this.storeService.children.find(
      child => child.id === childId
    );
    this.showToast.emit({title : `${childData!.name} abgemeldet!`,
            message : `${childData!.name} wurde vom ${childData?.kindergarden.name} abgemeldet!`,
            show : true});
  }
}


