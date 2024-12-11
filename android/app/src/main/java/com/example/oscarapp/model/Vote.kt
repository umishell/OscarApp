package com.example.oscarapp.model

import com.google.gson.Gson

data class Vote(val userId: Int, val movieId: Int, val directorId: Int, val token: String) {

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