package com.roadrecorder

import android.app.Service
import android.content.Intent
import android.os.IBinder
import android.util.Log
import android.os.Looper

import androidx.core.app.NotificationCompat
import com.google.android.gms.location.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments

class ForegroundService : Service() {
    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private lateinit var locationCallback: LocationCallback

    companion object {
        const val ACTION_APP_OPENED_FROM_BUBBLE = "APP_OPENED_FROM_BUBBLE"
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (intent?.action == ACTION_APP_OPENED_FROM_BUBBLE) {
            updateBubbleVisibility()
            return START_STICKY
        }

        val notification = NotificationCompat.Builder(this, "trip_channel")
            .setContentTitle("Trip in Progress")
            .setContentText("We’re recording your trip to provide insights and stats")
            .setSmallIcon(R.mipmap.ic_launcher) // replace with your own icon
            .setOngoing(true)
            .build()

        startForeground(1, notification)

        // Do any background work here (e.g., start tracking)
        startBubbleHead()
        startLocationUpdates()
        updateBubbleVisibility()

        // START_STICKY ensures that the service is restarted if it's killed by the system
        return START_STICKY
    }

    // Remove notification and stop service when user kill the app
    override fun onTaskRemoved(rootIntent: Intent?) {
        super.onTaskRemoved(rootIntent)
        stopBubbleHead()
        stopSelf()
    }

    private fun startBubbleHead() {
        Log.d("BubbleHeadService", "onCreate called");
        val intent = Intent(this, BubbleHeadService::class.java)
        startService(intent)
    }

    private fun stopBubbleHead() {
        val intent = Intent(this, BubbleHeadService::class.java)
        intent.action = BubbleHeadService.ACTION_CLOSE_WITH_ANIMATION
        startService(intent)
    }

    private var bubbleVisible = false

    private fun updateBubbleVisibility() {
        if (AppLifecycle.isAppInForeground) {
            if (bubbleVisible) {
                stopBubbleHead()
                bubbleVisible = false
            }
        } else {
            if (!bubbleVisible) {
                startBubbleHead()
                bubbleVisible = true
            }
        }
    }


    private fun startLocationUpdates() {
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)

        val locationRequest = LocationRequest.Builder(
            Priority.PRIORITY_HIGH_ACCURACY,
            3000L // 5 seconds interval
        ).setMinUpdateDistanceMeters(0f)
            .build()

        locationCallback = object : LocationCallback() {
            override fun onLocationResult(locationResult: LocationResult) {
                updateBubbleVisibility()

                for (location in locationResult.locations) {
                    Log.d("ForegroundService", "New location: $location")
                    sendLocationToJS(location)
                }
            }
        }

        fusedLocationClient.requestLocationUpdates(
            locationRequest,
            locationCallback,
            Looper.getMainLooper()
        )
    }

    private fun stopLocationUpdates() {
        if (::fusedLocationClient.isInitialized && ::locationCallback.isInitialized) {
            fusedLocationClient.removeLocationUpdates(locationCallback)
            Log.d("ForegroundService", "Location updates stopped")
        }
    }

    private fun sendLocationToJS(location: android.location.Location) {
        // Make sure reactContext is accessible here
        val reactContext = ForegroundServiceModule.globalReactContext ?: return


        // Map native Location -> JS GeolocationResponse
        val params: WritableMap = Arguments.createMap()

        val coords: WritableMap = Arguments.createMap()
        coords.putDouble("latitude", location.latitude)
        coords.putDouble("longitude", location.longitude)
        coords.putDouble("altitude", location.altitude)
        coords.putDouble("accuracy", location.accuracy.toDouble())
        coords.putDouble("altitudeAccuracy", 0.0) // Android doesn't have separate altitudeAccuracy
        coords.putDouble("heading", location.bearing.toDouble())
        coords.putDouble("speed", location.speed.toDouble())

        params.putMap("coords", coords)
        params.putDouble("timestamp", System.currentTimeMillis().toDouble())

        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("onLocationUpdate", params)
    }

    // Fire when JS calls stopForegroundService()
    override fun onDestroy() {
        super.onDestroy()
        stopLocationUpdates()
        fusedLocationClient.removeLocationUpdates(locationCallback)
        stopBubbleHead()
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
