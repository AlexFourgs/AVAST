package fr.vmonot.avast;

import android.annotation.SuppressLint;
import android.content.Context;
import android.os.Environment;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

public class MainActivity extends AppCompatActivity {
	
	private WebView myWebView;
	
	private static final String originalURL = "http://192.168.1.16/avast/client.html";
	private String url = originalURL;
	
	@SuppressLint("SetJavaScriptEnabled")
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);
		
		myWebView = (WebView) findViewById(R.id.webview);
		WebSettings webSettings = myWebView.getSettings();
		webSettings.setJavaScriptEnabled(true);
		
		myWebView.setWebViewClient(new WebViewClient() {
			public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
				Toast.makeText(MainActivity.this, description, Toast.LENGTH_SHORT).show();
			}
		});
		setContentView(myWebView);
	}
	
	@Override
	protected void onResume() {
		super.onResume();
		
		File ipFile = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOCUMENTS), "ip.txt");
		Toast.makeText(this, ipFile.getAbsolutePath(), Toast.LENGTH_LONG).show();
		
		if(ipFile.exists()) {
			Log.d("MainActivity", ipFile.getAbsolutePath()+" exists");
			try {
				InputStream is = new FileInputStream(ipFile);
				BufferedReader reader = new BufferedReader(new InputStreamReader(is));
				url = reader.readLine();
				
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		else {
			Log.d("MainActivity", ipFile.getAbsolutePath()+" doesn't exist");
			url = originalURL;
			try {
				FileOutputStream fos = new FileOutputStream(ipFile);
				fos.write(url.getBytes());
				fos.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		
		Log.d("MainActivity", "Accessing "+url);
		Toast.makeText(this, "Accessing "+url, Toast.LENGTH_LONG).show();
		
		myWebView.clearCache(true);
		myWebView.loadUrl(url);
	}
}
