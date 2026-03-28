package com.example.mobile

import android.content.Intent
import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.android.volley.Request
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.Volley
import com.example.mobile.api.ApiClient
import com.example.mobile.api.SessionManager
import org.json.JSONObject

class AuthActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_auth)

        val tabLogin = findViewById<Button>(R.id.tabLogin)
        val tabSignup = findViewById<Button>(R.id.tabSignup)

        val etEmail = findViewById<EditText>(R.id.etEmail)
        val etPassword = findViewById<EditText>(R.id.etPassword)

        val btnLogin = findViewById<Button>(R.id.btnLoginAction)
        val footerText = findViewById<TextView>(R.id.footerText)

        val session = SessionManager(this)

        // ================= AUTO LOGIN =================
        if (session.getToken() != null) {
            startActivity(Intent(this, DashboardActivity::class.java))
            finish()
        }

        // ================= LOGIN =================
        btnLogin.setOnClickListener {

            val email = etEmail.text.toString().trim()
            val password = etPassword.text.toString().trim()

            if (email.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Please fill all fields", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val json = JSONObject()
            json.put("email", email)
            json.put("password", password)

            val request = JsonObjectRequest(
                Request.Method.POST,
                ApiClient.BASE_URL + "signin",
                json,
                { response ->

                    try {
                        val token = response.getString("accessToken")

                        val user = response.getJSONObject("user")

                        val firstName = if (user.has("user_metadata")) {
                            user.getJSONObject("user_metadata")
                                .optString("first_name", "User")
                        } else {
                            "User"
                        }

                        session.saveToken(token)

                        Toast.makeText(this, "Login Success", Toast.LENGTH_SHORT).show()

                        val intent = Intent(this, DashboardActivity::class.java)
                        intent.putExtra("firstName", firstName)
                        startActivity(intent)
                        finish()

                    } catch (e: Exception) {
                        Toast.makeText(this, "Parsing Error: ${e.message}", Toast.LENGTH_LONG).show()
                    }

                },
                { error ->
                    val msg = error.networkResponse?.data?.let { String(it) } ?: error.message
                    Toast.makeText(this, "Login Error: $msg", Toast.LENGTH_LONG).show()
                }
            )

            Volley.newRequestQueue(this).add(request)
        }

        // ================= SIGNUP TAB =================
        tabSignup.setOnClickListener {
            startActivity(Intent(this, SignupActivity::class.java))
        }

        footerText.setOnClickListener {
            startActivity(Intent(this, SignupActivity::class.java))
        }

        // ================= LOGIN TAB =================
        tabLogin.setOnClickListener {
            Toast.makeText(this, "Already on Login", Toast.LENGTH_SHORT).show()
        }
    }
}