import { NumberSymbol } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

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
  // JSON対象
  color_hue: number = 0;
  color_sat: number = 0;
  color_val: number = 0;
  color_result_hex: string = "";
  // JSON対象外
  color_1_r: number = 0;
  color_1_g: number = 0;
  color_1_b: number = 0;
  color_2_r: number = 0;
  color_2_g: number = 0;
  color_2_b: number = 0;
  color_hue_hex: string = "";
  color_1_r_hex: string = "";
  color_1_g_hex: string = "";
  color_1_b_hex: string = "";
  color_2_r_hex: string = "";
  color_2_g_hex: string = "";
  color_2_b_hex: string = "";
  color_sat_hex: string = "";
  color_val_hex: string = "";

  checkoutForm = this.formBuilder.group({
    color_hue: 0,
    color_sat: 0,
    color_val: 0
  });

  constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe((params: ParamMap) => {
      this.color_hue = Number(params.get('hue'));
      this.color_sat = Number(params.get('sat'));
      this.color_val = Number(params.get('val'));
    });
    this.color_hue = this.color_hue ? this.color_hue : 120;
    this.color_sat = this.color_sat ? this.color_sat : 100;
    this.color_val = this.color_val ? this.color_val : 50;
    this.onChange1();
  }

  onChange1() {
    // SとVは、どちらも100にする
    let rgb = ColorModel.hsvToRgb(this.color_hue, 100, 100);
    this.color_1_r = rgb.r;
    this.color_1_g = rgb.g;
    this.color_1_b = rgb.b;
    this.onChange2();
  }

  onChange2() {
    let rgb = ColorModel.hsvToRgb(this.color_hue, this.color_sat, this.color_val);
    this.color_2_r = rgb.r;
    this.color_2_g = rgb.g;
    this.color_2_b = rgb.b;
    this.rgbUpdate();
  }

  private rgbUpdate() {
    this.color_1_r_hex = ColorModel.rgbToHex(this.color_1_r, 0, 0);
    this.color_1_g_hex = ColorModel.rgbToHex(0, this.color_1_g, 0);
    this.color_1_b_hex = ColorModel.rgbToHex(0, 0, this.color_1_b);
    this.color_hue_hex = ColorModel.rgbToHex(this.color_1_r, this.color_1_g, this.color_1_b);
    this.color_2_r_hex = ColorModel.rgbToHex(this.color_2_r, 0, 0);
    this.color_2_g_hex = ColorModel.rgbToHex(0, this.color_2_g, 0);
    this.color_2_b_hex = ColorModel.rgbToHex(0, 0, this.color_2_b);
    this.color_result_hex = ColorModel.rgbToHex(this.color_2_r, this.color_2_g, this.color_2_b);
    let sat_255 = ColorModel._100To255(this.color_sat);
    this.color_sat_hex = ColorModel.rgbToHex(255, 255 - sat_255, 255 - sat_255);
    let val_255 = ColorModel._100To255(this.color_val);
    this.color_val_hex = ColorModel.rgbToHex(val_255, val_255, 0);
  }

  addHistory() {
    let data = localStorage.getItem("color_history");
    let obj: {
      hue: number,
      sat: number,
      val: number,
      hex: string,
      date: Date
    }[] = [];
    if (data) {
      obj = JSON.parse(data);
    }
    obj.push(ColorModel.createJson(this.color_hue, this.color_sat, this.color_val, this.color_result_hex));
    localStorage.setItem("color_history", JSON.stringify(obj))
  }

  delHistory(date: Date) {
    let data = localStorage.getItem("color_history");
    let obj: {
      hue: number,
      sat: number,
      val: number,
      hex: string,
      date: Date
    }[] = [];
    if (data) {
      obj = JSON.parse(data);
    }
    let newObj = obj.filter(n => n.date !== date);
    localStorage.setItem("color_history", JSON.stringify(newObj))
  }

  listHistory(): ColorModel[] {
    let data = localStorage.getItem("color_history");
    let obj: {
      hue: number,
      sat: number,
      val: number,
      hex: string,
      date: Date
    }[] = [];
    if (data) {
      obj = JSON.parse(data);
    };
    let history: ColorModel[] = [];
    obj.forEach(element => {
      history.push(new ColorModel(
        element["hue"],
        element["sat"],
        element["val"],
        element["hex"],
        element["date"]));
    });
    return history;
  }
}

export class ColorModel {

  constructor(
    public hue: number,
    public sat: number,
    public val: number,
    public hex: string,
    public date: Date) {
  }

  static createJson(
    hue: number,
    sat: number,
    val: number,
    hex: string,
    date?: Date): {
      hue: number,
      sat: number,
      val: number,
      hex: string,
      date: Date
    } {
    if (!date) {
      date = new Date();
    }
    return {
      hue: hue,
      sat: sat,
      val: val,
      hex: hex,
      date: date
    }
  }

  static hsvToRgb(hue: number, sat: number, val: number): { r: number, g: number, b: number } {
    // SとVから、最大値を求める
    let max = Math.round(val * 255 / 100);
    let min = max - Math.round((sat * max / 100));
    let r, g, b;
    if (hue <= 60) {
      r = max;
      g = Math.round((hue / 60) * (max - min)) + min;
      b = min;
    } else if (hue <= 120) {
      r = Math.round((120 - hue) / 60 * (max - min)) + min;
      g = max;
      b = min;
    } else if (hue <= 180) {
      r = min;
      g = max;
      b = Math.round((hue - 120) / 60 * (max - min)) + min;
    } else if (hue <= 240) {
      r = min;
      g = Math.round((240 - hue) / 60 * (max - min)) + min;
      b = max;
    } else if (hue <= 300) {
      r = Math.round((hue - 240) / 60 * (max - min)) + min;
      g = min;
      b = max;
    } else {
      r = max;
      g = min;
      b = Math.round((360 - hue) / 60 * (max - min)) + min;
    }
    return { r: r, g: g, b: b };
  }

  static rgbToHex(r: number, g: number, b: number): string {
    return "#" + ColorModel.toHex(r) + ColorModel.toHex(g) + ColorModel.toHex(b);
  }

  static _100To255(v: number) {
    return Math.round(v * 255 / 100);
  }

  private static toHex(v: number) {
    return (('00' + v.toString(16).toUpperCase()).substr(-2));
  }
}
