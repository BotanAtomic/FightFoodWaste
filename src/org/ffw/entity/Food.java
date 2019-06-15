package org.ffw.entity;

import org.json.JSONObject;

public class Food {

    private String id;

    private String name;

    private double energy;
    private double fat;
    private double carbohydrates;
    private double protein;
    private double fiber;
    private double salt;
    private double sugar;

    private String image;

    private int weight;

    private int quantity = 1;

    public Food(String id, JSONObject base) {
        this.id = id;

        if (!base.has("product_quantity") || base.getJSONObject("nutriments").isEmpty()) {
            return;
        }

        this.name = base.has("product_name_fr") ?
                base.getString("product_name_fr") :
                base.has("product_name") ? base.getString("product_name") : id;

        JSONObject nutriments = base.getJSONObject("nutriments");
        Object rawQuantity = base.get("product_quantity");

        this.weight = rawQuantity instanceof String ?
                Integer.parseInt(base.getString("product_quantity")) : (int) rawQuantity;

        this.energy = nutriments.has("energy_100g") ?
                nutriments.getDouble("energy_100g") : 0;

        this.fat = nutriments.has("fat") ? nutriments.getDouble("fat") : 0;

        this.carbohydrates = nutriments.has("carbohydrates_100g") ?
                nutriments.getDouble("carbohydrates_100g") : 0;

        this.protein = nutriments.has("proteins_100g") ?
                nutriments.getDouble("proteins_100g") : 0;

        this.fiber = nutriments.has("fiber_100g") ?
                nutriments.getDouble("fiber_100g") : 0;

        this.salt = nutriments.has("salt_100g") ?
                nutriments.getDouble("salt_100g") : 0;

        this.sugar = nutriments.has("sugars_100g") ?
                nutriments.getDouble("sugars_100g") : 0;

        this.image = base.getString("image_front_small_url");
    }

    public double getEnergy() {
        return energy;
    }

    public double getFat() {
        return fat;
    }

    public double getCarbohydrates() {
        return carbohydrates;
    }

    public double getProtein() {
        return protein;
    }

    public double getFiber() {
        return fiber;
    }

    public double getSalt() {
        return salt;
    }

    public double getSugar() {
        return sugar;
    }

    public int getWeight() {
        return weight;
    }

    public String getId() {
        return id;
    }

    public void increment() {
        this.quantity++;
    }

    public String getName() {
        return name;
    }

    public String getImage() {
        return image;
    }
}
