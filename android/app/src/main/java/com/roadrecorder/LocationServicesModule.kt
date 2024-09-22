package com.roadrecorder

import android.content.Context
import android.location.LocationManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import android.content.Intent
import android.provider.Settings

class LocationServicesModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "LocationServices"
    }

    @ReactMethod
    fun isGPSEnabled(promise: Promise) {
        try {
            val locationManager = reactApplicationContext.getSystemService(Context.LOCATION_SERVICE) as LocationManager
            val isGPSEnabled = locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)
            promise.resolve(isGPSEnabled)
        } catch (e: Exception) {
            promise.reject("ERROR", "Unable to check GPS status", e)
        }
    }

    @ReactMethod
    fun openGPSSettings() {
        try {
            val intent = Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS)
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)  // Ensure the intent is launched from outside of the app context
            reactApplicationContext.startActivity(intent)
        } catch (e: Exception) {
            // Handle error, if needed
        }
    }
}
