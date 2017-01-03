Now that we have the initial chats layout and its component, we will take it a step further by providing the chats data from a server instead of having it locally. In this step we will be implementing the API server and we will do so using Meteor with Mongo.

## Collections

In Meteor, we keep data inside `Mongo.Collections`.

This collection is actually a reference to a [MongoDB](http://mongodb.com) collection, and it is provided to us by a Meteor package called [Minimongo](https://guide.meteor.com/collections.html), and it shares almost the same API as a native MongoDB collection.

We can also wrap it with RxJS' `Observables` using [`meteor-rxjs`](http://npmjs.com/package/meteor-rxjs).

That package has been already installed, it's a part of the boilerplate.

Let's create a Collection of Chats:

{{{diff_step 3.1}}}

And also for Messages:

{{{diff_step 3.2}}}


## Data fixtures

Since we have Collections, we can now move on to fill them with data.

{{{diff_step 3.3}}}

Quick overview.
We use `.collection` to get the actual `Mongo.Collection` instance, this way we avoid using Observables.
At the beginning we check if Chats Collection is empty by using `.count()` operator.
Then we provide few chats with one message each.

We also bundled Message with a Chat using `chatId` property.

This requires a small change in the model:

{{{diff_step 3.4}}}

## UI

Since Meteor's API requires us to share some of the code in both client and server, we have to import all the collections on the client-side too.

We also want to provide that data to the component:

{{{diff_step 3.5}}}

As you can see, we moved `chats` property initialization to `ngOnInit`,  one of the Angular's lifehooks.
It's being called when Component is initalized.

Here comes a quick lesson of RxJS.

Since `Chats.find()` returns an `Observable` we can take advantage of that and bundle it with `Messages.find()` to look for last messages of each chat. This way everything will work as a one body, one Observable.

So what's really going on there?

#### Find chats

First thing is to get all the chats by using `Chats.find({})`.

The result of it will be an array of `Chat` objects.

Let's use `map` operator to make a space for adding the last messages.

```js
Chats.find({})
    .map(chats => {
        const chatsWithMessages = chats.map(chat => {
            chat.lastMessage = undefined;
            return chat;
        });
        
        return chatsWithMessages;
    })
```

#### Look for the last message

For each chat we need to find the last message.
We can achieve this by calling `Messages.find` with proper selector and options.

Let's go through each element of the `chats` property to call `Messages.find`.

```js
const chatsWithMessages = chats.map(chat => Chats.find(/* selector, options*/));
```

That returns an array of Observables.

We need to create a selector.
We have to look for a message that is a part of required chat:

```js
{
    chatId: chat._id
}
```

Okay, but we need only one, last message. Let's sort them by `createdAt`:

```js
{
    sort: {
        createdAt: -1
    }
}
```

This way we get them sorted from newest to oldest.

We look for just one, so selector will look like this:

```js
{
    sort: {
        createdAt: -1
    },
    limit: 1
}
```

Now we can add the last message to the chat.

```js
Messages.find(/*...*/)
    .map(messages => {
        if (messages) chat.lastMessage = messages[0];
        return chat;
    })
```

Great! But what if there are no messages? Wouldn't it emit a value at all?

RxJS contains a operator called `startWith`. It allows to emit some value before Messages.find beings to emit messages.
This way we avoid the waiting for non existing message.

The result:

```js
const chatsWithMessages = chats.map(chat => {
    return Messages.find(/*...*/)
        .startWith(null)
        .map(messages => {
            if (messages) chat.lastMessage = messages[0];
            return chat;
        })
})
```

#### Combine those two

Last thing to do is to handle the array of Observables we created (`chatsWithMessages`).

Yet again, RxJS comes with a rescue. We will use `combineLatest` which takes few Observables and combines them into one Observable.

It works like this:

```js
const source1 = /* an Observable */
const source2 = /* an Observable */

Observable.combineLatest(source1, source2);
```

This combination returns an array of both results (`result`). So the first item of that array will come from `source1` (`result[0]`), second from `source2` (`result[1]`).

Let's see how it applies to our example:

```js
Observable.combineLatest(...chatsWithMessages);
```

We used `...array` because `Observable.combineLatest` expects arguments, not a single one that with an array of Observables.

To merge that observable into `Chats.find({})` we need to use `mergeMap` operator instead of `map`:

```js
Chats.find({})
    .mergeMap(chats => Observable.combineLatest(...chatsWithMessages));
```

In Whatsapp we used `chats.map(/*...*/)` directly instead of creating another variables like we did with `chatsWithMessages`.

With all this, we have now Chats with their last messages available in the UI view.
