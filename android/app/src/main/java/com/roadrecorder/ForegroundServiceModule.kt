package com.roadrecorder

import android.content.Intent
import android.os.Build
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class ForegroundServiceModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    companion object {
        var globalReactContext: ReactApplicationContext? = null
    }

    init {
        globalReactContext = reactContext
    }

    override fun getName() = "ForegroundServiceModule"

    @ReactMethod
    fun initForegroundService() {
        Log.d("ForegroundService", "Foreground Service Started")
        val intent = Intent(reactContext, ForegroundService::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            reactContext.startForegroundService(intent)
        } else {
            reactContext.startService(intent)
        }
    }

    @ReactMethod
    fun stopForegroundService() {
        Log.d("ForegroundService", "Foreground Service Stopped")
        val intent = Intent(reactContext, ForegroundService::class.java)
        reactContext.stopService(intent)
    }

    @ReactMethod
    fun addListener(eventName: String) {
        // Required by RN
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // Required by RN
    }
}
