import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() isActive! : boolean;
  @Output() sendState = new EventEmitter();

  setVisability(){
    this.isActive = !this.isActive;
    this.sendState.emit(this.isActive); 
  }

}
