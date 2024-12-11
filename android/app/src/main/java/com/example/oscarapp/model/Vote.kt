package com.example.oscarapp.model

data class Vote(val userId: Int, val movieId: Int, val directorId: Int) {

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