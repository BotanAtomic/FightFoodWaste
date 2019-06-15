package org.ffw.core;

import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.control.Label;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.GridPane;
import org.ffw.utils.Utils;

import java.io.IOException;


public class Controller {

    @FXML
    private BorderPane borderPane;

    @FXML
    private GridPane mainMenu;

    @FXML
    private Label title;

    @FXML
    public void initialize() {
    }

    @FXML
    private void onAccountClick() {

    }

    @FXML
    private void onMenuClick() {
        try {
            title.setText("Menu generator");
            Parent parent = FXMLLoader.load(Utils.getResources("views/menu.fxml"));
            borderPane.setCenter(parent);
        } catch (IOException e) {
            e.printStackTrace();
        }


    }

    @FXML
    private void onServiceClick() {

    }

    @FXML
    private void goBack() {
        title.setText("Dashboard");
        borderPane.setCenter(mainMenu);
    }

}
