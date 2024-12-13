package com.example.oscarapp.controller

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Button
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.example.oscarapp.R

class Menu : AppCompatActivity() {

    lateinit var btnFilmes: Button
    lateinit var btnDiretores: Button
    lateinit var btnFinalizarVoto: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_menu)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        btnFilmes = findViewById<Button>(R.id.btnFilmes)
        btnFilmes.setOnClickListener {
            goMovies(it)
        }
        btnDiretores = findViewById<Button>(R.id.btnDiretores)
        btnDiretores.setOnClickListener {
            goDirectors(it)
        }
        btnFinalizarVoto = findViewById<Button>(R.id.btnFinalizarVoto)
        btnFinalizarVoto.setOnClickListener(){
            //...
            finish()
        }

    }
    private fun goMovies(view: View) {
        val intent = Intent(this, Movies::class.java)
        startActivity(intent)
    }

    private fun goDirectors(view: View) {
        val intent = Intent(this, Directors::class.java)
        startActivity(intent)
    }

    fun goLogin(view: View) {
        val intent = Intent(this, Login::class.java)
        startActivity(intent)
    }
}