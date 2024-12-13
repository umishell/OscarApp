package com.example.oscarapp.controller

import android.content.Intent
import android.os.Bundle
import android.view.Menu
import android.view.View
import android.widget.Button
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat.startActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.example.oscarapp.R
import com.example.oscarapp.model.data.LoginRequest
import com.example.oscarapp.model.data.LoginResponse
import okhttp3.OkHttpClient
import org.json.JSONObject
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.io.IOException

class Login : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_login)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        val btnLogin = findViewById<Button>(R.id.btnLogin)
        btnLogin.setOnClickListener {
            loginUser("yourUsername", "yourPassword") { response, error ->
                if (error != null) {
                    // Handle error
                    runOnUiThread {
                        Toast.makeText(this, "Login failed: $error", Toast.LENGTH_SHORT).show()
                    }
                } else if (response != null) {
                    // Handle successful response
                    val token = response.getString("token1") // Extract token
//val issuedAt = response.getString("issuedAt") // Extract issued_at
                    runOnUiThread {
                        Toast.makeText(this, "Login successful. Token: $token", Toast.LENGTH_SHORT).show()
                    }
                }
            }

        }
    }



    fun goMenu(view: View) {
        val intent = Intent(this, Menu::class.java)
        startActivity(intent)
    }



    fun loginUser(username: String, password: String, callback: (JSONObject?, String?) -> Unit) {
        val client = OkHttpClient()

        // URL to your Fastify login endpoint
        val url = "http://your-server-url/login"

        // Create the JSON body for the POST request
        val jsonBody = JSONObject()
        jsonBody.put("username", username)
        jsonBody.put("password", password)

        // Create the RequestBody
        val requestBody = jsonBody.toString().toRequestBody("application/json".toMediaType())

        // Create the POST Request
        val request = Request.Builder()
            .url(url)
            .post(requestBody)
            .build()

        // Make the request asynchronously
        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                e.printStackTrace()
                callback(null, e.message) // Return the error
            }

            override fun onResponse(call: Call, response: Response) {
                if (response.isSuccessful) {
                    val responseBody = response.body?.string()
                    if (!responseBody.isNullOrEmpty()) {
                        val jsonResponse = JSONObject(responseBody)
                        callback(jsonResponse, null) // Return the JSON response
                    } else {
                        callback(null, "Empty response")
                    }
                } else {
                    callback(null, "Failed with code: ${response.code}")
                }
            }
        })
    }


}