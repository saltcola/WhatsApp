import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
//Add IonicModule
import { IonicApp, IonicModule } from "ionic-angular";

import {TabsContainerComponent} from "../pages/tabs-container/tabs-container.component";
import {ChatsComponent} from "../pages/chats/chats.component";
import {MomentModule} from "angular2-moment";
import {MessagesPage} from "../pages/chat/messages-page.component";
import {LoginComponent} from '../pages/auth/login.component';
import {VerificationComponent} from '../pages/auth/verification.component';
import {ProfileComponent} from '../pages/auth/profile.component';
import {ChatsOptionsComponent} from '../pages/chats/chats-options.component';






@NgModule({
  // Components, Pipes, Directive
  declarations: [
    AppComponent,
    TabsContainerComponent,
    ChatsComponent,
    MessagesPage,
    LoginComponent,
    VerificationComponent,
    ProfileComponent,
    ChatsOptionsComponent
  ],
  // Entry Components
  entryComponents: [
    AppComponent,
    TabsContainerComponent,
    ChatsComponent,
    MessagesPage,
    LoginComponent,
    VerificationComponent,
    ProfileComponent,
    ChatsOptionsComponent
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
