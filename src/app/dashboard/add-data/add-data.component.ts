import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {BackendService} from 'src/app/shared/backend.service';
import {StoreService} from 'src/app/shared/store.service';

@Component({
  selector: 'app-add-data',
  templateUrl: './add-data.component.html',
  styleUrls: ['./add-data.component.scss']
})
export class AddDataComponent implements OnInit {

  constructor(private formbuilder: FormBuilder, public storeService: StoreService, public backendService: BackendService) {
  }

  @Input() currentPage!: number;
  @Input() currentPageSize!: number;
  @Output() showToast = new EventEmitter<{ title: string, message: string, show: boolean }>();
  public addChildForm: any;

  ngOnInit(): void {
    this.addChildForm = this.formbuilder.group({
      name: ['', [Validators.required]],
      kindergardenId: ['', Validators.required],
      birthDate: [null, Validators.required]
    })
  }

  onSubmit() {
    if (this.addChildForm.valid) {
      const addedChildData = this.addChildForm.value;
      const matchingKindergarden = this.storeService.kindergardens.find(
        kg => kg.id === addedChildData.kindergardenId
      );
      this.backendService.addChildData(addedChildData, this.currentPage, this.currentPageSize);
      this.showToast.emit({
        title: `${addedChildData.name} erfolgreich angemeldet!`,
        message: `${addedChildData.name} erfolgreich im ${matchingKindergarden!.name} angemeldet!`,
        show: true
      });
      this.addChildForm.reset();
    } else {
      console.error("Formular issue: " + this.addChildForm.errors);
    }
  }
}

