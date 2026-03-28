package com.example.mobile

import android.content.Intent
import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.android.volley.Request
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.Volley
import com.example.mobile.api.ApiClient
import org.json.JSONObject

class SignupActivity : AppCompatActivity() {

    private var selectedRole = "STUDENT"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.layout_role)

        val btnStudent = findViewById<LinearLayout>(R.id.btnStudent)
        val btnTeacher = findViewById<LinearLayout>(R.id.btnTeacher)

        btnStudent.setOnClickListener {
            selectedRole = "STUDENT"
            loadSignup()
        }

        btnTeacher.setOnClickListener {
            selectedRole = "TEACHER"
            loadSignup()
        }
    }

    // ================= LOAD SIGNUP FORM =================
    private fun loadSignup() {
        setContentView(R.layout.layout_signup)

        val etFirstName = findViewById<EditText>(R.id.etFirstName)
        val etLastName = findViewById<EditText>(R.id.etLastName)
        val etEmail = findViewById<EditText>(R.id.etEmail)
        val etPassword = findViewById<EditText>(R.id.etPassword)

        val btnRegister = findViewById<Button>(R.id.btnCreateAccount)
        val tvLogin = findViewById<TextView>(R.id.tvLogin)

        // ================= REGISTER =================
        btnRegister.setOnClickListener {

            val firstName = etFirstName.text.toString().trim()
            val lastName = etLastName.text.toString().trim()
            val email = etEmail.text.toString().trim()
            val password = etPassword.text.toString().trim()

            if (firstName.isEmpty() || lastName.isEmpty() || email.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Please fill all fields", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val json = JSONObject()
            json.put("email", email)
            json.put("password", password)
            json.put("firstName", firstName)
            json.put("lastName", lastName)
            json.put("role", selectedRole) // IMPORTANT

            val request = JsonObjectRequest(
                Request.Method.POST,
                ApiClient.BASE_URL + "signup",
                json,
                {
                    Toast.makeText(this, "Registered Successfully!", Toast.LENGTH_SHORT).show()

                    // go back to login
                    startActivity(Intent(this, AuthActivity::class.java))
                    finish()
                },
                { error ->
                    val msg = error.networkResponse?.data?.let { String(it) } ?: error.message
                    Toast.makeText(this, "Signup Error: $msg", Toast.LENGTH_LONG).show()
                }
            )

            Volley.newRequestQueue(this).add(request)
        }

        // ================= BACK TO LOGIN =================
        tvLogin.setOnClickListener {
            startActivity(Intent(this, AuthActivity::class.java))
            finish()
        }
    }
}