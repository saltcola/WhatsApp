import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
//Add IonicModule
import { IonicApp, IonicModule } from "ionic-angular";


@NgModule({
  // Components, Pipes, Directive
  declarations: [
    AppComponent
  ],
  // Entry Components
  entryComponents: [
    AppComponent
  ],
  // Providers
  providers: [
  ],
  // Modules
  //We removed BrowserModule since all the declarations and providers are included in IonicModule.
  imports: [
    IonicModule.forRoot(AppComponent)
  ],
  // Main Component
  //We also added IonicApp component which is a root component that lives on top of our AppComponent.
  bootstrap: [ IonicApp ]
})

export class AppModule {
  constructor() {

  }
}
