import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-google-maps',
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.scss']
})
export class GoogleMapsComponent implements OnInit {
  //apiLoaded: Observable<boolean>;

  zoom = 16;
  center: google.maps.LatLngLiteral = {
    lat: 35.697695,
    lng: 139.707354
  };
  options: google.maps.MapOptions = {
    disableDefaultUI: true
  };

  // 現在位置マーカーの座標
  currentPosition: google.maps.LatLngLiteral = {
    lat: 35.697695,
    lng: 139.707354
  };
  // 現在位置マーカーのオプション
  currentPositionMarkerOption: google.maps.MarkerOptions = {
    icon: {
      url: "assets/point.png",
      scaledSize: new google.maps.Size(32, 32)
    }
  };


  constructor() {
  }


  ngOnInit() {
    // 現在位置を取得する。
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.currentPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      });
    }
  }
}
