package com.roadrecorder

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class GeofenceModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val helper = GeofenceHelper(reactContext)

    override fun getName(): String = "GeofenceModule"

    @ReactMethod
    fun addGeofence(id: String, lat: Double, lng: Double, radius: Float) {
        helper.addGeofence(id, lat, lng, radius)
    }

    @ReactMethod
    fun removeGeofence(id: String) {
        helper.removeGeofence(id)
    }
}
