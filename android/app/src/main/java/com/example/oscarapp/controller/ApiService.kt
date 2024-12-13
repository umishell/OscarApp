package com.example.oscarapp.controller

import com.example.oscarapp.model.data.LoginRequest
import com.example.oscarapp.model.data.LoginResponse
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST

interface ApiService {
    @POST("/login")
    fun loginUser(@Body request: LoginRequest): Call<LoginResponse>
}