import {Component, OnInit} from "@angular/core";
import template from "./chats.component.html"
import {Observable} from "rxjs";
import {Chat} from "../../../../both/models/chat.model";
import * as moment from "moment";
import style from "./chats.component.scss";
import {Chats} from "../../../../both/collections/chats.collection";
import {Message} from "../../../../both/models/message.model";
import {Messages} from "../../../../both/collections/messages.collection";
import {NavController} from "ionic-angular";
import {MessagesPage} from "../chat/messages-page.component";


@Component({
  selector: "chats",
  template,
  styles: [
    style
  ]
})
export class ChatsComponent implements OnInit {
  chats: Observable<Chat[]>;

  constructor(private navCtrl: NavController) {
 
  }

  ngOnInit() {
    this.chats = Chats
      .find({})
      .mergeMap<Chat[]>(chats =>
        Observable.combineLatest(
          ...chats.map(chat =>

            Messages.find({ chatId: chat._id }, { sort: { createdAt: -1 }, limit: 1 })
              .startWith(null)
              .map(messages => {
                if (messages) chat.lastMessage = messages[0];
                return chat;
              })

          )
        )
      ).zone();
  }

  showMessages(chat): void {
    this.navCtrl.push(MessagesPage, {chat});
  }
}