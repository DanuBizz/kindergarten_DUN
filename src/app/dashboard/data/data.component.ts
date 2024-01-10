import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {BackendService} from 'src/app/shared/backend.service';
import {StoreService} from 'src/app/shared/store.service';
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {ChildResponse} from "../../shared/interfaces/Child";
import {Kindergarden} from "../../shared/interfaces/Kindergarden";
import {map} from "rxjs";

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss'],
})
export class DataComponent implements OnInit, AfterViewInit {


  constructor(public storeService: StoreService, public backendService: BackendService, private _liveAnnouncer: LiveAnnouncer) {}

  @Input() currentPage! : number;
  @Output() sendPage = new EventEmitter<number>();
  @Output() sendPageSize = new EventEmitter<number>();
  @Output() showToast = new EventEmitter<{title : string, message : string, show : boolean}>();
  @ViewChild(MatPaginator) paginator! : MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns : string[] = ['name', 'kindergardenId', 'address', 'age', 'birthDate','signUp', 'abmelden'];
  datasource = new MatTableDataSource<ChildResponse>(this.storeService.children);
  selectedKindergarden: Kindergarden | null = null;
  filteredData: ChildResponse[] = [];
  deletingChildId: string | null = null;
  ngOnInit(): void {
    this.backendService.getChildren(this.currentPage, this.backendService.defaultPageSize)
      .subscribe(data => {
        this.storeService.children = data;
        this.datasource.data = this.storeService.children;
      });
  }
  ngAfterViewInit() {
    this.datasource.sort = this.sort;
    console.log(this.datasource.data);
  }
  selectKindergarten(kindergarden: Kindergarden | null): void {
    this.selectedKindergarden = kindergarden;
    this.filterData();
  }

  filterData(): void {
    if (this.selectedKindergarden) {
      this.backendService.getAllChildren().pipe(
        map(allChildren => allChildren.filter(child => child.kindergardenId === this.selectedKindergarden!.id))
      ).subscribe(filteredChildren => {
        this.filteredData = filteredChildren;
        this.paginator.length = this.filteredData.length;

        this.paginator.pageIndex = 0;

        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        const endIndex = startIndex + this.paginator.pageSize;
        this.datasource.data = this.filteredData.slice(startIndex, endIndex);
      });
    } else {
      this.filteredData = this.storeService.children;
      this.paginator.length = this.storeService.childrenTotalCount;

      this.paginator.pageIndex = 0;


      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      const endIndex = startIndex + this.paginator.pageSize;
      this.datasource.data = this.filteredData.slice(startIndex, endIndex);
    }
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
    if (this.selectedKindergarden) {
      const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
      const endIndex = startIndex + pageEvent.pageSize;
      this.datasource.data = this.filteredData.slice(startIndex, endIndex);
    } else {
      this.sendPage.emit(pageEvent.pageIndex);
      this.sendPageSize.emit(pageEvent.pageSize);
      this.backendService.getChildren(pageEvent.pageIndex, pageEvent.pageSize)
        .subscribe(data => {
          this.storeService.children = data;
          this.datasource.data = this.storeService.children;
          this.paginator.pageIndex = pageEvent.pageIndex;
        });
    }
  }

  removeChild(childId: string) {
    if (!childId) {
      console.error('Child ID is undefined or null.');
      return;
    }
    this.deletingChildId = childId;
    this.backendService.deleteChild(childId, this.currentPage, this.paginator.pageSize)
      .subscribe(() => {
        this.backendService.getChildren(this.paginator.pageIndex, this.paginator.pageSize)
          .subscribe(data => {
            this.storeService.children = data;
            console.log('Updated data:', data);
            if (this.selectedKindergarden) {
              this.filterData();
            } else {
              this.datasource.data = this.storeService.children;
              this.paginator.length = this.storeService.childrenTotalCount;
              this.deletingChildId = null;
            }
          });
      });
    const childData = this.storeService.children.find(child => child.id === childId);
    this.showToast.emit({
      title: `${childData!.name} deleted!`,
      message: `${childData!.name} deleted from ${childData?.kindergarden.name}!`,
      show: true
    });
  }
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}


