package org.ffw.core;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;
import org.ffw.config.NutrimentConfiguration;
import org.ffw.entity.Food;
import org.ffw.network.HttpRequest;
import org.ffw.utils.Utils;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.*;

public class Main extends Application {

    public static JSONObject user;
    public static String token;

    public static Map<String, Food> items = new HashMap<>();

    public static void main(String[] args) throws Exception {
        user = HttpRequest.loginRequest("ahmed.botan94@gmail.com", "123");
        token = user.getString("token");

        JSONArray array = user.getJSONObject("warehouse").getJSONArray("stock");

        array.forEach(o -> {
            JSONArray packages = ((JSONObject) o).getJSONArray("package");

            packages.forEach(rawData -> {
                String objId = (String) rawData;
                try {
                    if (items.containsKey(objId)) {
                        items.get(objId).increment();
                    } else {
                        Food food = new Food(objId, HttpRequest.getFoodInformation(objId).getJSONObject("product"));

                        if (food.getEnergy() > 0)
                            items.put(objId, food);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }

            });
        });

        launch(args);
    }

    @Override
    public void start(Stage stage) throws Exception {
        Parent parent = FXMLLoader.load(Utils.getResources("views/dashboard.fxml"));
        stage.setScene(new Scene(parent));
        stage.show();
    }
}
