package org.ffw.network;

import org.ffw.core.Main;
import org.ffw.entity.Food;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.util.List;

public class HttpRequest {

    public static JSONObject loginRequest(String email, String password) throws Exception {
        URL url = new URL("http://51.75.203.112/api/user/login/");
        HttpURLConnection con = (HttpURLConnection) url.openConnection();
        con.setRequestMethod("POST");
        con.setDoOutput(true);

        JSONObject params = new JSONObject();
        params.put("email", email);
        params.put("password", password);

        con.getOutputStream().write(params.toString().getBytes());
        con.getOutputStream().flush();
        con.getOutputStream().close();

        if (con.getResponseCode() == 200) {
            BufferedReader stream = new BufferedReader
                    (new InputStreamReader(con.getInputStream()));

            String data = "";

            String temp;
            while ((temp = stream.readLine()) != null) {
                data += temp;
            }
            return new JSONObject(data);
        }

        return null;
    }

    public static JSONObject getFoodInformation(String id) throws Exception {
        System.out.print("Start request " + id + " :");
        URL url = new URL("https://ssl-api.openfoodfacts.org/api/product/produit/" + id + ".json");
        URLConnection connection = url.openConnection();

        BufferedReader stream = new BufferedReader
                (new InputStreamReader(connection.getInputStream()));

        String data = "";

        String temp;
        while ((temp = stream.readLine()) != null) {
            data += temp;
        }
        System.out.println("OK");
        return new JSONObject(data);
    }

    public static boolean sendPackage(List<Food> menu) {
        try {
            URL url = new URL("http://51.75.203.112/api/delivery/create/");
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("POST");
            con.setDoOutput(true);

            JSONObject params = new JSONObject();
            params.put("token", Main.token);
            params.put("reception", false);
            params.put("package", new JSONArray() {{
                for (Food food : menu) {
                    put(food.getId());
                }
            }});

            con.getOutputStream().write(params.toString().getBytes());
            con.getOutputStream().flush();
            con.getOutputStream().close();
            return con.getResponseCode() == 200;
        } catch (Exception e) {
            return false;
        }
    }

}
