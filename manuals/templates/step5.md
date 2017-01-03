In this step we will authenticate and identify users in our app.

Before we go ahead and start extending our app, we will add a few packages which will make our lives a bit less complex when it comes to authentication and users management.

Firt we will update our Meteor server and add few Meteor packages called `accounts-base` and `accounts-phone` which will give us the ability to verify a user using an SMS code:

    $ meteor add npm-bcrypt
    $ meteor add accounts-base
    $ meteor add mys:accounts-phone

We will also need to install their decleration files so Typescript know how to handle them:

    $ typings install dt~meteor-accounts-phone --save --global

For the sake of debugging we gonna write an authentication settings file (`private/settings.json`) which might make our life easier, but once your'e in production mode you *shouldn't* use this configuration:

{{{diff_step 5.3}}}

Now anytime we run our app we should provide it with a `settings.json`:

    $ meteor run --settings private/settings.json

To make it simpler we can add `start` script to `package.json`:

{{{diff_step 5.4}}}

> *NOTE*: If you would like to test the verification with a real phone number, `accounts-phone` provides an easy access for [twilio's API](https://www.twilio.com/), for more information see [accounts-phone's repo](https://github.com/okland/accounts-phone).

We will now apply the settings file we've just created so it can actually take effect:

{{{diff_step 5.5}}}

We created `server/imports/api/sms.ts` file, now we have to import it inside `main.ts`:

{{{diff_step 5.6}}}

For authentication we're going to create the following flow in our app:

- login - The initial page. Ask for the user's phone number.
- verification - Verify a user's phone number by an SMS authentication.
- profile - Ask a user to pickup its name. Afterwards he will be promoted to the tabs page.

Before we implement these page, we need to identify if a user is currently logged in. If so, he will be automatically promoted to the chats view, if not, he is going to be promoted to the login view and enter a phone number.

Let's apply this feature to our app's main component:

{{{diff_step 5.7}}}

We don't have yet a proper component with auth logic but let's add it anyway as `LoginComponent`:

{{{diff_step 5.8}}}

Great, now that we're set, let's start implementing the views we mentioned earlier. We will start with the login component.

In this component we will request an SMS verification right after a phone number has been entered:

{{{diff_step 5.9}}}

Few things to be explained:

- `onInputKeypress` is to catch Enter key press
- `login` method creates an alert (see [documentation](http://ionicframework.com/docs/v2/components/#alert)) to confirm the action
- `handleError` creates an alert with an error message
- `handleLogin` calls `Accounts.requestPhoneVerification` request an SMS verification and moves to verification view.

Okay, the logic is clear. Let's move to the template:

{{{diff_step 5.10}}}

And styles:

{{{diff_step 5.11}}}

Our new component is not available yet:

{{{diff_step 5.12}}}

That's great, everything is set up. We can now move to verification page.

Let's create a component called `VerificationComponent`:

{{{diff_step 5.13}}}

Logic is pretty much the same as in LoginComponent. When verification succeed we redirect user to the `ProfileComponent`.

So let's add the view and the styles:

{{{diff_step 5.14}}}

{{{diff_step 5.15}}}

Make it available to AppModule:

{{{diff_step 5.16}}}

Last step of our authentication pattern is to pickup a name.

Let's add a Method that updates user's profile:

{{{diff_step 5.17}}}


It would be nice to define a separate model for a profile:

{{{diff_step 5.18}}}

Now we can create the `ProfileComponent`:

{{{diff_step 5.19}}}

The logic is simple, call `updateProfile` and redirect to `TabsContainerComponent` which is our main view if the action succeed.

If you'll take a look at the constructor's logic we set the default profile picture to be one of ionicon's svgs. We need to make sure there is an access point available through the network to that asset. If we'd like to serve files as-is we simply gonna add them to the `assets` dir; So let's add a symlink to `ionicons` in that dir:

    public/assets$ ln -s ../../node_modules/ionicons

There's no component without a view:

{{{diff_step 5.21}}}

There's no good looking view without a stylesheet:

{{{diff_step 5.22}}}

There's no access to the component without a declaration inside AppModule:

{{{diff_step 5.23}}}

Our authentication flow is complete! However there are some few adjustments we need to make before we proceed to the next step.

For the messaging system, each message should have an owner. If a user is logged-in a message document should be inserted with an additional `senderId` field:

{{{diff_step 5.24}}}

{{{diff_step 5.25}}}

We can determine message ownership inside the component:

{{{diff_step 5.26}}}

Now we're going to add the abilities to log-out and edit our profile as well, which are going to be presented to us using a popover. 
Let's show a popover any time we press on the options icon in the top right corner of the chats view:

{{{diff_step 5.27}}}

{{{diff_step 5.28}}}

It uses popover functionality from Ionic ([see documentation](http://ionicframework.com/docs/v2/components/#popovers)).

As you can see, we used `ChatsOptionsComponent`.

Now let's implement the component for the chats options which will handle the profile editing and logging-out:

{{{diff_step 5.29}}}

Add a template and styles:

{{{diff_step 5.30}}}

{{{diff_step 5.31}}}

Add it to AppModule:

{{{diff_step 5.32}}}

As for now, once you click on the options icon in the chats view, the popover should appear in the middle of the screen. To fix it, we simply gonna add the following `scss` file to the `styles` dir:

{{{diff_step 5.33}}}

Note that this style-sheet is not a component specific, so it has to be loaded as a global asset rather then provide it to the component during its initialization.