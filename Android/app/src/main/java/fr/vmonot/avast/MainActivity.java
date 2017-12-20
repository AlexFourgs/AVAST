package fr.vmonot.avast;

import android.os.Handler;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.Window;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

public class MainActivity extends AppCompatActivity {
	
	private WebView myWebView;
	
	private final static String url = "http://192.168.1.16/avast/client.html";
	
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
		myWebView.loadUrl(url);
		setContentView(myWebView);
	}
	
	@Override
	protected void onResume() {
		super.onResume();
		myWebView.clearCache(true);
		myWebView.loadUrl(url);
	}
}
