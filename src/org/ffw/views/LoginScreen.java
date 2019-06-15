package org.ffw.views;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;
import org.ffw.utils.Utils;

public class LoginScreen extends Application {

    @Override
    public void start(Stage stage) throws Exception {
        Parent parent = FXMLLoader.load(Utils.getResources("views/dashboard.fxml"));
        stage.setScene(new Scene(parent));
        stage.setAlwaysOnTop(true);
        stage.show();
    }

}
