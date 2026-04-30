package com.luxero.app;

import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Force all navigation to stay within the WebView
        getBridge().getWebView().setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                // Allow luxero.win and subdomains to load in WebView
                if (url != null && (url.contains("luxero.win") || url.startsWith("https://localhost"))) {
                    return false; // Let WebView handle it
                }
                // For any other URL, open in external browser
                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                startActivity(intent);
                return true;
            }
        });
    }
}
