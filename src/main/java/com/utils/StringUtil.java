package com.utils;

public class StringUtil {

    public  static boolean isEmpty(String s){
        return s == null || s.equals("") || s.equals("null");
    }

    public  static boolean isNotEmpty(String s){
        return !StringUtil.isEmpty(s);
    }
}
