import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { Kindergarden } from './interfaces/Kindergarden';
import { StoreService } from './store.service';
import { Child, ChildResponse } from './interfaces/Child';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient, private storeService: StoreService) { }

  public defaultPageSize = 3;

  public getKindergardens() {
    this.http.get<Kindergarden[]>('http://localhost:5000/kindergardens').subscribe(data => {
      this.storeService.kindergardens = data;
    });
  }

  public getChildren(pageIndex: number, pageSize: number) {
    const startIndex = pageIndex * pageSize;
    this.http.get<ChildResponse[]>(`http://localhost:5000/childs?_expand=kindergarden&_start=${startIndex}&_limit=${pageSize}`, { observe: 'response' }).subscribe(data => {
      console.log(data.headers.get('X-Total-Count'));
      this.storeService.children = data.body!;
      this.storeService.childrenTotalCount = Number(data.headers.get('X-Total-Count'));
    });
  }

  public addChildData(child: Child, pageIndex: number, pageSize: number) {
    this.http.post('http://localhost:5000/childs', child).subscribe(data => {
      this.getChildren(pageIndex, pageSize);
    });
  }

  public deleteChild(childId: string, pageIndex: number, pageSize: number) {
    this.http.delete(`http://localhost:5000/childs/${childId}`).subscribe(data => {
      this.getChildren(pageIndex, pageSize);
    });
  }
}
