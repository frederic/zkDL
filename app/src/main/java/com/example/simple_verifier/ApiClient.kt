package com.example.simple_verifier

import com.android.identity.internal.Util.toHex
import com.android.identity.mdoc.response.DeviceResponseParser
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

interface ApiClient {
        @POST("callback")
        fun sendJson(@Body jsonData: ApiRequest): Call<ApiResponse>
}

fun makeApiCall(callbackUrl: String, issuerData: DeviceResponseParser.IssuerSignedData, issuerSigned: ByteArray) {
        val retrofit = Retrofit.Builder()
                .baseUrl(callbackUrl)
                .addConverterFactory(GsonConverterFactory.create())
                .build()

        val apiService = retrofit.create(ApiClient::class.java)

        val issuerData = ApiRequest(toHex(issuerData.getmPublicKey()), toHex(issuerData.getmIssuerData()), toHex(issuerData.getDerSignature()), toHex(issuerSigned))
        val call = apiService.sendJson(issuerData)

        call.enqueue(object : retrofit2.Callback<ApiResponse> {
                override fun onResponse(
                        call: retrofit2.Call<ApiResponse>,
                        response: retrofit2.Response<ApiResponse>
                ) {
                        if (response.isSuccessful) {
                                // Handle successful response
                                val responseBody = response.body()
                                println("Response: ${responseBody?.responseKey1}")
                        } else {
                                // Handle request errors depending on status code
                                println("Request error: ${response.code()}")
                        }
                }

                override fun onFailure(call: retrofit2.Call<ApiResponse>, t: Throwable) {
                        // Handle call failure, e.g., no internet, or server down
                        println("Call failed: ${t.message}")
                }
        })
}

data class ApiRequest(
        val publicKey: String,
        val coseSign: String,
        val derSignature: String,
        val issuerData: String,
)

data class ApiResponse(
        val responseKey1: String
)