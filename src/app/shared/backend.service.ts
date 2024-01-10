import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { Kindergarden } from './interfaces/Kindergarden';
import { StoreService } from './store.service';
import { Child, ChildResponse } from './interfaces/Child';
import {catchError, map, Observable, switchMap, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient, private storeService: StoreService) { }

  public defaultPageSize = 5;

  public getKindergardens() {
    this.http.get<Kindergarden[]>('http://localhost:5000/kindergardens').subscribe(data => {
      this.storeService.kindergardens = data;
      this.storeService.isLoading = false;
    });
  }
  public getAllChildren(){
    return this.http.get<ChildResponse[]>(`http://localhost:5000/childs?_expand=kindergarden`);
  }
  public getChildren(pageIndex: number, pageSize: number): Observable<ChildResponse[]>{
    const startIndex = pageIndex * pageSize;
    return this.http.get<ChildResponse[]>(`http://localhost:5000/childs?_expand=kindergarden&_start=${startIndex}&_limit=${pageSize}`, { observe: 'response' })
      .pipe(map(data => {
      console.log(data.headers.get('X-Total-Count'));
      this.storeService.children = data.body!;
      this.storeService.childrenTotalCount = Number(data.headers.get('X-Total-Count'));
      return this.storeService.children;
    }));
  }

  public addChildData(child: Child, pageIndex: number, pageSize: number) {
    return this.http.post('http://localhost:5000/childs', child).pipe(
      switchMap(() => this.getChildren(pageIndex, pageSize))
    );
  }

  public deleteChild(childId: string, pageIndex: number, pageSize: number) {
    return this.http.delete(`http://localhost:5000/childs/${childId}`);
  }
}
