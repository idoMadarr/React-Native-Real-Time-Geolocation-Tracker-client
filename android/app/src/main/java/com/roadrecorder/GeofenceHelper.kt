package com.roadrecorder


import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import com.google.android.gms.location.Geofence
import com.google.android.gms.location.GeofencingClient
import com.google.android.gms.location.LocationServices

class GeofenceHelper(private val context: Context) {
    private val geofencingClient: GeofencingClient = LocationServices.getGeofencingClient(context)

    fun addGeofence(id: String, lat: Double, lng: Double, radius: Float) {
        val geofence = Geofence.Builder()
            .setRequestId(id)
            .setCircularRegion(lat, lng, radius)
            .setExpirationDuration(Geofence.NEVER_EXPIRE)
            .setTransitionTypes(Geofence.GEOFENCE_TRANSITION_ENTER)
//          .setTransitionTypes(Geofence.GEOFENCE_TRANSITION_ENTER or Geofence.GEOFENCE_TRANSITION_EXIT)
            .build()

        val geofenceRequest = com.google.android.gms.location.GeofencingRequest.Builder()
            .setInitialTrigger(com.google.android.gms.location.GeofencingRequest.INITIAL_TRIGGER_ENTER)
            .addGeofence(geofence)
            .build()

        geofencingClient.addGeofences(geofenceRequest, getGeofencePendingIntent())
            .addOnSuccessListener {
                // ✅ This confirms the geofence was successfully added
                println("Geofence added: $id")
            }
            .addOnFailureListener { e ->
                println("Failed to add geofence: $id, ${e.message}")
            }
    }

    private fun getGeofencePendingIntent(): PendingIntent {
        val intent = Intent(context, GeofenceBroadcastReceiver::class.java)
        return PendingIntent.getBroadcast(
            context,
            0,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_MUTABLE
        )
    }

    fun removeGeofence(id: String) {
        geofencingClient.removeGeofences(listOf(id))
    }
}
