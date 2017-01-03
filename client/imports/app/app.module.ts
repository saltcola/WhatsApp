import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
//Add IonicModule
import { IonicApp, IonicModule } from "ionic-angular";

import {TabsContainerComponent} from "../pages/tabs-container/tabs-container.component";
import {ChatsComponent} from "../pages/chats/chats.component";
import {MomentModule} from "angular2-moment";



@NgModule({
  // Components, Pipes, Directive
  declarations: [
    AppComponent,
    TabsContainerComponent,
    ChatsComponent
  ],
  // Entry Components
  entryComponents: [
    AppComponent,
    TabsContainerComponent,
    ChatsComponent
  ],
  // Providers
  providers: [
  ],
  // Modules
  //We removed BrowserModule since all the declarations and providers are included in IonicModule.
  imports: [
    IonicModule.forRoot(AppComponent),
    MomentModule
  ],
  // Main Component
  //We also added IonicApp component which is a root component that lives on top of our AppComponent.
  bootstrap: [ IonicApp ]
})

export class AppModule {
  constructor() {

  }
}
