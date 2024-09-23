package com.roadrecorder

import android.content.Context
import android.content.Intent
import android.os.PowerManager
import android.provider.Settings
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod


class BatteryOptimizationModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(
        reactContext
    ) {
    override fun getName(): String {
        return "BatteryOptimizationModule"
    }

    @ReactMethod
    fun checkBatteryOptimization(promise: Promise) {
        val pm = reactContext.getSystemService(Context.POWER_SERVICE) as PowerManager
        val packageName = reactContext.packageName
        if (pm.isIgnoringBatteryOptimizations(packageName)) {
            promise.resolve("unrestricted")
        } else {
            promise.resolve("restricted")
        }
    }

    @ReactMethod
    fun openBatterySettings() {
        val intent = Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS)
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        reactContext.startActivity(intent)
    }
}
