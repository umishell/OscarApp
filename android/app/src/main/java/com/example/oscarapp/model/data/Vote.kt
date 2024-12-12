package com.example.oscarapp.model.data

import android.os.Parcelable
import com.google.gson.Gson
import kotlinx.parcelize.Parcelize

@Parcelize
data class Vote(val userId: Int, val token: String, val movieId: Int, val directorId: Int):
    Parcelable {

    fun toJsonString(): String {
        val gson = Gson()
        return try {
            gson.toJson(this)
        } catch (e: Exception) {
            // Handle JSON conversion error (e.g., log the error)
            ""
        }
    }
}