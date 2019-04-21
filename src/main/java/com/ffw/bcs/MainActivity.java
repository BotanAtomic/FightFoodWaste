package com.ffw.bcs;

import android.content.Intent;
import android.os.Handler;
import android.os.StrictMode;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;

import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.InterfaceAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;


public class MainActivity extends AppCompatActivity {

    public static InetAddress serverAddress;


    private List<InetAddress> listAllBroadcastAddresses() throws SocketException {
        List<InetAddress> broadcastList = new ArrayList<>();
        Enumeration<NetworkInterface> interfaces = NetworkInterface.getNetworkInterfaces();

        while (interfaces.hasMoreElements()) {
            NetworkInterface networkInterface = interfaces.nextElement();

            if (networkInterface.isLoopback() || !networkInterface.isUp()) {
                continue;
            }

            for (InterfaceAddress interfaceAddress : networkInterface.getInterfaceAddresses()) {
                if (interfaceAddress.getBroadcast() != null) {
                    broadcastList.add(interfaceAddress.getBroadcast());
                }
            }
        }
        return broadcastList;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        StrictMode.setThreadPolicy(new StrictMode.ThreadPolicy.Builder().permitAll().build());
    }

    @Override
    protected void onPostCreate(Bundle savedInstanceState) {
        super.onPostCreate(savedInstanceState);

        final Handler handler = new Handler(getMainLooper());

        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    DatagramSocket server = new DatagramSocket();


                    for (InetAddress inetAddress : listAllBroadcastAddresses()) {
                        DatagramPacket packet = new DatagramPacket("H".getBytes(), 1,
                                inetAddress,
                                6789);

                        server.send(packet);
                    }

                    byte[] buffer = new byte[1];
                    DatagramPacket reception = new DatagramPacket(buffer, 1);
                    server.receive(reception);

                    serverAddress = reception.getAddress();


                    Log.i("FFW", "Server address " + serverAddress.toString());

                    handler.postDelayed(new Runnable() {
                        @Override
                        public void run() {
                            Log.i("FFW", "LOLza ezfeezfezfzefzefs " + serverAddress.toString());
                            Intent intent = new Intent(MainActivity.this, BCScanner.class);
                            MainActivity.this.startActivity(intent);
                        }
                    }, 1500);

                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }).start();


    }

}
