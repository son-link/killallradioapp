Smart-Notifier
==============

An Apache Cordova Plugin to push notifications into the notifications area of your smartphone.


How to install
--------------

Using the Cordova CLI

    cordova plugin add https://github.com/Julien-Marcou/Smart-Notifier.git


How to remove
--------------

Using the Cordova CLI

    cordova plugin rm fr.julienmarcou.smartnotifier


How it works
--------------

Simply type

    Notifier.notify("Title", "Message");

You can also customize the icon

    Notifier.notify("Title", "Message", "error");

There are 4 available icons <code>default</code>, <code>success</code>, <code>error</code> and <code>calendar</code>.

When the user click on the notification, he is redirected to your App and the notification is destroy. You can only have one notification at a time, if you add another notification, the last will be destroyed.


Upcoming features
--------------

Customizable notifications
