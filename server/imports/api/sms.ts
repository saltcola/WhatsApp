import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import{ SMS } from 'meteor/mys:accounts-phone';
 
 
if (Meteor.settings) {
  Object.assign(Accounts._options, Meteor.settings['accounts-phone']);
  SMS.twilio = Meteor.settings['twilio'];
}