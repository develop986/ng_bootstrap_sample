import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

// FormBuilder: FormControlやFormGroupなどを作成できる
// FormGroup: 複数のフォームを束ねるクラス, FormControlをネストして使用できる
// FormControl: 1個のフォームに相当
// FormArray: 同じ形式のフォームを配列で管理できる
// ReactiveFormsModule: リアクティブスタイルでフォームを作成するためのテクニック

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.scss']
})
export class ColorComponent implements OnInit {
  color_hue: number = 180;
  color_1_r: number = 255;
  color_1_g: number = 0;
  color_1_b: number = 0;
  color_sat: number = 100;
  color_val: number = 100;
  color_2_r: number = 0;
  color_2_g: number = 0;
  color_2_b: number = 0;
  color_hue_hex: string = "#00FFFF";
  color_1_r_hex: string = "#FF0000";
  color_1_g_hex: string = "#000000";
  color_1_b_hex: string = "#000000";
  color_2_r_hex: string = "#FF0000";
  color_2_g_hex: string = "#000000";
  color_2_b_hex: string = "#000000";
  color_sat_hex: string = "#FF0000";
  color_val_hex: string = "#FFFF00";
  color_result_hex: string = "#000000";
  markdown: string;

  checkoutForm = this.formBuilder.group({
    color_hue: 0,
    color_sat: 0,
    color_val: 0
  });

  constructor(private formBuilder: FormBuilder) {
    this.markdown = 'assets/color.component.md';
  }

  ngOnInit(): void {
    this.onChange1();
  }

  onChange1() {
    // SとVは、どちらも100にする
    let max = 255;
    let min = 0;
    if (this.color_hue <= 60) {
      this.color_1_r = max;
      this.color_1_g = Math.round((this.color_hue / 60) * (max - min)) + min;
      this.color_1_b = min;
    } else if (this.color_hue <= 120) {
      this.color_1_r = Math.round((120 - this.color_hue) / 60 * (max - min)) + min;
      this.color_1_g = max;
      this.color_1_b = min;
    } else if (this.color_hue <= 180) {
      this.color_1_r = min;
      this.color_1_g = max;
      this.color_1_b = Math.round((this.color_hue - 120) / 60 * (max - min)) + min;
    } else if (this.color_hue <= 240) {
      this.color_1_r = min;
      this.color_1_g = Math.round((240 - this.color_hue) / 60 * (max - min)) + min;
      this.color_1_b = max;
    } else if (this.color_hue <= 300) {
      this.color_1_r = Math.round((this.color_hue - 240) / 60 * (max - min)) + min;
      this.color_1_g = min;
      this.color_1_b = max;
    } else {
      this.color_1_r = max;
      this.color_1_g = min;
      this.color_1_b = Math.round((360 - this.color_hue) / 60 * (max - min)) + min;
    }
    this.onChange2();
  }

  onChange2() {
    // SとVから、最大値を求める
    let max = Math.round(this.color_val * 255 / 100);
    let min = max - Math.round((this.color_sat * max / 100));
    if (this.color_hue <= 60) {
      this.color_2_r = max;
      this.color_2_g = Math.round((this.color_hue / 60) * (max - min)) + min;
      this.color_2_b = min;
    } else if (this.color_hue <= 120) {
      this.color_2_r = Math.round((120 - this.color_hue) / 60 * (max - min)) + min;
      this.color_2_g = max;
      this.color_2_b = min;
    } else if (this.color_hue <= 180) {
      this.color_2_r = min;
      this.color_2_g = max;
      this.color_2_b = Math.round((this.color_hue - 120) / 60 * (max - min)) + min;
    } else if (this.color_hue <= 240) {
      this.color_2_r = min;
      this.color_2_g = Math.round((240 - this.color_hue) / 60 * (max - min)) + min;
      this.color_2_b = max;
    } else if (this.color_hue <= 300) {
      this.color_2_r = Math.round((this.color_hue - 240) / 60 * (max - min)) + min;
      this.color_2_g = min;
      this.color_2_b = max;
    } else {
      this.color_2_r = max;
      this.color_2_g = min;
      this.color_2_b = Math.round((360 - this.color_hue) / 60 * (max - min)) + min;
    }
    this.rgbUpdate();
  }

  private rgbUpdate() {
    this.color_1_r_hex = "#" + ColorComponent.toHex(this.color_1_r) + "0000";
    this.color_1_g_hex = "#00" + ColorComponent.toHex(this.color_1_g) + "00";
    this.color_1_b_hex = "#0000" + ColorComponent.toHex(this.color_1_b);
    this.color_hue_hex = "#" + ColorComponent.toHex(this.color_1_r)
      + ColorComponent.toHex(this.color_1_g)
      + ColorComponent.toHex(this.color_1_b);
    this.color_2_r_hex = "#" + ColorComponent.toHex(this.color_2_r) + "0000";
    this.color_2_g_hex = "#00" + ColorComponent.toHex(this.color_2_g) + "00";
    this.color_2_b_hex = "#0000" + ColorComponent.toHex(this.color_2_b);
    this.color_result_hex = "#" + ColorComponent.toHex(this.color_2_r)
      + ColorComponent.toHex(this.color_2_g)
      + ColorComponent.toHex(this.color_2_b);
    this.color_sat_hex = "#FF" + ColorComponent.toHex(255 - Math.round(this.color_sat * 255 / 100))
      + ColorComponent.toHex(255 - Math.round(this.color_sat * 255 / 100));
    this.color_val_hex = "#" + ColorComponent.toHex(Math.round(this.color_val * 255 / 100))
      + ColorComponent.toHex(Math.round(this.color_val * 255 / 100)) + "00";
  }

  private static toHex(v: number) {
    return (('00' + v.toString(16).toUpperCase()).substr(-2));
  }
}
