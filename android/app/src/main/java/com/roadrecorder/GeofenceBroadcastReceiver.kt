package com.roadrecorder


import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build
import androidx.core.app.NotificationCompat
import com.google.android.gms.location.Geofence
import com.google.android.gms.location.GeofencingEvent
import com.google.android.gms.location.LocationServices
import com.reactnativecommunity.asyncstorage.ReactDatabaseSupplier

class GeofenceBroadcastReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        val geofencingEvent = GeofencingEvent.fromIntent(intent) ?: return
        if (geofencingEvent.hasError()) {
            return
        }

        val geofenceTransition = geofencingEvent.geofenceTransition
        val geofenceIds = geofencingEvent.triggeringGeofences?.map { it.requestId }

        val message = when (geofenceTransition) {
            Geofence.GEOFENCE_TRANSITION_ENTER -> {
                // Remove AsyncStorage key saved from JS once entered
                removeAsyncStorageKey(context, "geofence")

                // ✅ Remove the geofence once entered
                geofenceIds?.let { ids ->
                    val geofencingClient = LocationServices.getGeofencingClient(context)
                    geofencingClient.removeGeofences(ids)
                        .addOnSuccessListener {
                            println("🗑️ Removed geofences: $ids")
                        }
                        .addOnFailureListener {
                            println("❌ Failed to remove geofences: ${it.message}")
                        }
                }
                "Entered geofence: ${geofenceIds?.joinToString()}"
            }
//            We can add more geofence transitions here like on EXIT / DWELL
//            Geofence.GEOFENCE_TRANSITION_EXIT -> "Exited geofence: ${geofenceIds?.joinToString()}"
            else -> null
        }

        message?.let { sendNotification(context, it) }
    }

    private fun sendNotification(context: Context, message: String) {
        val channelId = "geofence_channel"
        val notificationManager =
            context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(channelId, "Geofence Alerts", NotificationManager.IMPORTANCE_HIGH)
            notificationManager.createNotificationChannel(channel)
        }

        val notification = NotificationCompat.Builder(context, channelId)
            .setSmallIcon(android.R.drawable.ic_dialog_map)
            .setContentTitle("Geofence Event")
            .setContentText(message)
            .setAutoCancel(true)
            .build()

        notificationManager.notify(System.currentTimeMillis().toInt(), notification)
    }

    private fun removeAsyncStorageKey(context: Context, key: String) {
        try {
            val db = ReactDatabaseSupplier.getInstance(context).get()
            db.delete(
                "catalystLocalStorage", // AsyncStorage storage
                "key = ?",               // WHERE clause
                arrayOf(key)             // key to delete
            )
            println("🗑️ Removed AsyncStorage key: $key")
        } catch (e: Exception) {
            println("❌ Failed to remove AsyncStorage key: ${e.message}")
        }
    }
}
