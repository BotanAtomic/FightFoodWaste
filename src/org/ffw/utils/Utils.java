package org.ffw.utils;

import org.ffw.core.Main;

import java.net.URL;

public class Utils {

    public static URL getResources(String path) {
        return Main.class.getClassLoader().getResource(path);
    }


}
