package com.ffw.bcs;

import android.Manifest;
import android.content.DialogInterface;
import android.content.pm.ActivityInfo;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.widget.Toast;

import com.google.android.gms.vision.CameraSource;
import com.google.android.gms.vision.Detector;
import com.google.android.gms.vision.barcode.Barcode;
import com.google.android.gms.vision.barcode.BarcodeDetector;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.util.concurrent.atomic.AtomicBoolean;

import static com.google.android.gms.vision.CameraSource.CAMERA_FACING_BACK;

public class BCScanner extends AppCompatActivity {

    private CameraSource cameraSource;

    private String lastScannedCode;

    private AtomicBoolean dialogOpen = new AtomicBoolean(false);

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_bcscanner);

        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);

        SurfaceView surfaceView = findViewById(R.id.surfaceView);

        BarcodeDetector detector = new BarcodeDetector.Builder(getApplicationContext())
                .setBarcodeFormats(Barcode.ALL_FORMATS)
                .build();

        cameraSource = new CameraSource.Builder(this, detector).setAutoFocusEnabled(true).setFacing(CAMERA_FACING_BACK).build();

        surfaceView.getHolder().addCallback(new SurfaceHolder.Callback() {
            @Override
            public void surfaceCreated(SurfaceHolder holder) {
                if (ActivityCompat.checkSelfPermission(BCScanner.this, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED) {
                    try {
                        cameraSource.start(holder);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }

            }

            @Override
            public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {

            }

            @Override
            public void surfaceDestroyed(SurfaceHolder holder) {

            }
        });

        detector.setProcessor(new Detector.Processor<Barcode>() {
            @Override
            public void release() {
            }

            @Override
            public void receiveDetections(Detector.Detections<Barcode> detections) {
                if (detections.getDetectedItems().size() > 0) {
                    try {
                        final String value = detections.getDetectedItems().valueAt(0).displayValue;
                        lastScannedCode = value;
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                Toast.makeText(getApplicationContext(), lastScannedCode, Toast.LENGTH_SHORT).show();
                                if (!dialogOpen.get()) {
                                    new AlertDialog.Builder(BCScanner.this).setTitle("Transmission to server")
                                            .setNegativeButton("Cancel", null)
                                            .setPositiveButton("Send", new DialogInterface.OnClickListener() {
                                                @Override
                                                public void onClick(DialogInterface dialog, int which) {
                                                    dialogOpen.set(false);

                                                    try {
                                                        DatagramPacket packet = new DatagramPacket(value.getBytes(), value.length(),
                                                                MainActivity.serverAddress,
                                                                7890);

                                                        new DatagramSocket().send(packet);
                                                    } catch (Exception e) {
                                                        Toast.makeText(BCScanner.this, "Error: " + e.getMessage(), Toast.LENGTH_LONG).show();
                                                    }
                                                }
                                            })
                                            .setCancelable(false)
                                            .setMessage("Add [" + value + "] to your package ?")
                                            .setOnCancelListener(new DialogInterface.OnCancelListener() {
                                                @Override
                                                public void onCancel(DialogInterface dialog) {
                                                    dialogOpen.set(false);
                                                }
                                            })
                                            .show();
                                    dialogOpen.set(true);
                                }
                            }
                        });
                    } catch (Exception e) {
                        Log.e("FFW", e.getMessage());
                    }

                }
            }
        });
    }

}
