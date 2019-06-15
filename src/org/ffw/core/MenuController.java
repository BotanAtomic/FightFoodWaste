package org.ffw.core;

import javafx.fxml.FXML;
import javafx.scene.control.Alert;
import javafx.scene.control.Label;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.HBox;
import org.ffw.config.NutrimentConfiguration;
import org.ffw.entity.Food;
import org.ffw.network.HttpRequest;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class MenuController {

    @FXML
    private Label nutrimentsText;

    @FXML
    private HBox imageContainer;

    @FXML
    private Label menuText;

    private List<Food> menu = new ArrayList<>();

    @FXML
    public void initialize() {
        System.out.println("OK");
    }

    @FXML
    public void generateMenu(MouseEvent event) {
        double energy = 0;
        double carbohydrates = 0;
        double protein = 0;
        double fiber = 0;
        double salt = 0;
        double fat = 0;
        double sugar = 0;

        menu.clear();

        ArrayList<Food> foods = new ArrayList<>(Main.items.values());

        while (foods.size() > 0) {

            Food food = foods.get((int) (System.nanoTime() % foods.size()));

            if (food != null) {

                if ((energy + food.getEnergy()) < NutrimentConfiguration.energy / 2
                        || (carbohydrates) < NutrimentConfiguration.carbohydrates / 4
                        || (protein) < NutrimentConfiguration.protein / 4
                        || (fiber) < NutrimentConfiguration.fiber / 4) {

                    Food extraFood = null;

                    if ((energy) > NutrimentConfiguration.energy / 1.3) {
                        extraFood = menu.stream().max(Comparator.comparingDouble(Food::getEnergy)).orElse(null);
                    } else if ((carbohydrates) > NutrimentConfiguration.carbohydrates / 4) {
                        extraFood = menu.stream().max(Comparator.comparingDouble(Food::getCarbohydrates)).orElse(null);
                    } else if ((salt) > NutrimentConfiguration.salt) {
                        extraFood = menu.stream().max(Comparator.comparingDouble(Food::getSalt)).orElse(null);
                    } else if (fat > NutrimentConfiguration.fat) {
                        extraFood = menu.stream().max(Comparator.comparingDouble(Food::getFat)).orElse(null);
                    }

                    if (extraFood != null) {
                        menu.remove(extraFood);
                        energy -= extraFood.getEnergy();
                        carbohydrates -= extraFood.getCarbohydrates();
                        protein -= extraFood.getProtein();
                        fiber -= extraFood.getFiber();
                        salt -= extraFood.getSalt();
                        fat -= extraFood.getFat();
                        sugar -= extraFood.getSugar();
                        foods.add(extraFood);
                    }

                    energy += food.getEnergy();
                    carbohydrates += food.getCarbohydrates();
                    protein += food.getProtein();
                    fiber += food.getFiber();
                    salt += food.getSalt();
                    fat += food.getFat();
                    sugar += food.getSugar();

                    foods.remove(food);
                    menu.add(food);
                } else {
                    break;
                }

            } else {
                break;
            }
        }
        imageContainer.getChildren().clear();

        menuText.setText("MENU (" + menu.size() + " items)\n");

        int i = 0;
        for (Food food : menu) {
            menuText.setText(menuText.getText() + ++i + " - " + food.getName() + "\n");
            imageContainer.getChildren().add(new ImageView() {{
                setImage(new Image(food.getImage()));
                setFitHeight(100);
                setFitWidth(133);
                setPreserveRatio(true);
            }});
        }

        nutrimentsText.setText(String.format("Energy: %s kJ\n" +
                        "Fat: %sg\n" +
                        "Carbohydrates: %sg\n" +
                        "Protein: %sg\n" +
                        "Fiber: %sg\n" +
                        "Salt: %sd\n" +
                        "Sugar: %sg", (int) energy, (int) fat, (int) carbohydrates,
                (int) protein, (int) fiber, (int) salt, (int) sugar));


    }

    @FXML
    void validate(MouseEvent event) {
        if (!menu.isEmpty()) {
            nutrimentsText.setText("Energy: 0 kJ\n" +
                    "Fat: 0g\n" +
                    "Carbohydrates: 0g\n" +
                    "Protein: 0g\n" +
                    "Fiber: 0g\n" +
                    "Salt: 0d\n" +
                    "Sugar: 0g");

            menuText.setText("");
            imageContainer.getChildren().clear();

            if(HttpRequest.sendPackage(menu)) {
                Alert alert = new Alert(Alert.AlertType.INFORMATION);
                alert.setTitle("Success !");
                alert.setContentText("Your request will be processed\nby our services within 24h");
                alert.showAndWait();
            } else {
                Alert alert = new Alert(Alert.AlertType.ERROR);
                alert.setContentText("Cannot connect to server.\nPlease check your internet connexion");
                alert.showAndWait();
            }

            menu.clear();
        }
    }

}
