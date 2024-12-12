package com.example.oscarapp.controller

import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.example.oscarapp.R

class Menu : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_menu)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        fun goMovies(view: View) {
            val intent = Intent(this, Movie::class.java)
            startActivity(intent)
        }
        fun goDirectors(view: View) {
            val intent = Intent(this, Menu::class.java)
            startActivity(intent)
        }
        fun goLogin(view: View) {
            val intent = Intent(this, Menu::class.java)
            startActivity(intent)
        }

    }
}