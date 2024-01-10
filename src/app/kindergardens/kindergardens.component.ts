import { Component } from '@angular/core';

@Component({
  selector: 'app-kindergardens',
  templateUrl: './kindergardens.component.html',
  styleUrls: ['./kindergardens.component.scss']
})
export class KindergardensComponent {

  public imagePath_kindergarden1: string = "./../assets/images/Kindergarten_1.jpg";
  public imagePath_kindergarden2: string = "./../assets/images/Kindergarten_2.jpg";
  public imagePath_kindergarden3: string = "./../assets/images/Kindergarten_3.jpeg";
  public imagePath_kindergarden4: string = "./../assets/images/Kindergarten_4.jpg";
  public imagePath_kindergarden5: string = "./../assets/images/Kindergarten_5.jpg";
  public imagePath_kindergarden1acc: string = "./../assets/images/kindergarten1acc.jpg";
  public imagePath_kindergarden2acc: string = "./../assets/images/kindergarten2acc.jpeg";
  public imagePath_kindergarden3acc: string = "./../assets/images/kindergarten3acc.jpg";
  public imagePath_kindergarden4acc: string = "./../assets/images/kindergarten4acc.jpg";
  public imagePath_kindergarden5acc: string = "./../assets/images/kindergarten5acc.jpg";
  public imageSlideNumber: number = 1;

  updateSlideNumber(event: any): void {
    this.imageSlideNumber = event.to + 1;
    console.log(this.imageSlideNumber);
  }
}
