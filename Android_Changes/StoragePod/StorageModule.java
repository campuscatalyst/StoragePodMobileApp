package com.storagepod;

import android.content.ContentResolver;
import android.net.Uri;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

import java.io.InputStream;
import java.io.OutputStream;
import java.io.FileInputStream;
import java.io.File;
import java.io.IOException;

public class StorageModule extends ReactContextBaseJavaModule {
    public StorageModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "StorageModule";
    }

    @ReactMethod
    public void copyToSafFile(String fromPathFile, String contentUriStr, Promise promise) {
        try {
            String fromPath = fromPathFile.replaceFirst("^file://", "");
            File srcFile = new File(fromPath);

            if (!srcFile.exists()) {
                promise.reject("ENOENT", "Source file does not exist: " + fromPath);
                return;
            }

            Uri contentUri = Uri.parse(contentUriStr);
            ContentResolver resolver = getReactApplicationContext().getContentResolver();

            InputStream input = new FileInputStream(srcFile);
            OutputStream output = resolver.openOutputStream(contentUri);

            if (output == null) {
                promise.reject("E_NO_OUTPUT_STREAM", "Could not open output stream for: " + contentUriStr);
                return;
            }

            byte[] buffer = new byte[8192];
            int bytesRead;

            while ((bytesRead = input.read(buffer)) != -1) {
                output.write(buffer, 0, bytesRead);
            }

            input.close();
            output.flush();
            output.close();

            promise.resolve(null); // success
        } catch (IOException e) {
            Log.e("StorageModule", "File copy failed", e);
            promise.reject("E_COPY_FAILED", "Copy failed: " + e.getMessage());
        }
    }
}