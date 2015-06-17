
package fr.julienmarcou.smartnotifier;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CallbackContext;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.support.v4.app.NotificationCompat;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.graphics.Color;

public class Notifier extends CordovaPlugin {

	private int currentNotificationId = 1;
	private int ledColor = Color.rgb(60, 255, 160);
	private int ledTimeOn = 800;
	private int ledTimeOff = 400;

	@Override
	public void initialize(CordovaInterface cordova, CordovaWebView webView) {
		super.initialize(cordova, webView);
	}

	@Override
	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
		JSONObject result = new JSONObject();
		if(action.equals("notify")) {
			this.notify(args.getString(0), args.getString(1), args.getString(2));
			callbackContext.success(result);
			return true;
		}
		return false;
	}

	private int getDrawableId(String resource) {
		return this.cordova.getActivity().getResources().getIdentifier(
			resource,
			"drawable",
			cordova.getActivity().getPackageName()
		);
	}

	private void notify(String title, String message, String icon) {
		// Notification content
		NotificationCompat.Builder builder = new NotificationCompat.Builder(this.cordova.getActivity().getApplicationContext());
		//builder.setAutoCancel(true);
		builder.setContentTitle(title);
		builder.setContentText(message);
		builder.setSmallIcon(this.getDrawableId(icon));
		builder.setLights(ledColor, ledTimeOn, ledTimeOff);
		builder.setOngoing(true);

		// Notification behavior
		builder.setContentIntent(PendingIntent.getActivity(
				this.cordova.getActivity().getApplicationContext(),
				0,
				this.cordova.getActivity().getIntent(),
				PendingIntent.FLAG_ONE_SHOT
		));

		// Notification building
		Notification notif = builder.build();

		// Notification issue
		NotificationManager notifier = (NotificationManager) this.cordova.getActivity().getApplicationContext().getSystemService(Context.NOTIFICATION_SERVICE);
		notifier.notify(currentNotificationId, notif);
		//currentNotificationId++;
	}

}
