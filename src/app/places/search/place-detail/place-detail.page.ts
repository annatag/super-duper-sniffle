import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  ActionSheetController,
  ModalController,
  NavController,
} from "@ionic/angular";
import { CreateBookingComponent } from "../../../bookings/create-booking/create-booking.component";
import { Place } from "../../place.model";
import { PlacesService } from "../../places.service";

@Component({
  selector: "app-place-detail",
  templateUrl: "./place-detail.page.html",
  styleUrls: ["./place-detail.page.scss"],
})
export class PlaceDetailPage implements OnInit {
  place: Place;
  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private placesService: PlacesService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has("placeId")) {
        this.navCtrl.navigateBack("/places/tabs/search");
        return;
      }
      this.place = this.placesService.getPlace(paramMap.get("placeId"));
    });
  }
  onBookPlace() {
    //this.router.navigateByUrl('/places/tabs/search');
    // this.navCtrl.navigateBack('/places/tabs/search');
    //this.navCtrl.pop();
    this.actionSheetCtrl.create({
      header: "Choose an Action",
      buttons: [
        { text: "Select Date", handler: () => {
          this.openBookingModal('select');
        } },
        { text: "Random Date", handler: () => {
          this.openBookingModal('random');
        } },
        { text: "Cancel", role: "cancel" },
      ]
    }).then(actionSheetEl => {
      actionSheetEl.present();
    }); 
  }

  openBookingModal(mode: "select" | "random") {
    console.log(mode);
    this.modalCtrl
      .create({
        component: CreateBookingComponent,
        componentProps: { selectedPlace: this.place },
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then((resultData) => {
        console.log(resultData.data, resultData.role);
        if (resultData.role === "confirm") {
          console.log("BOOKED!");
        }
      });
  }
}