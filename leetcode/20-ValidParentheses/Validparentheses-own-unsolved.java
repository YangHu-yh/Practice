/*
Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:

Open brackets must be closed by the same type of brackets.
Open brackets must be closed in the correct order.
Note that an empty string is also considered valid.

Example 1:

Input: "()"
Output: true
Example 2:

Input: "()[]{}"
Output: true
Example 3:

Input: "(]"
Output: false
Example 4:

Input: "([)]"
Output: false
Example 5:

Input: "{[]}"
Output: true

*/
import java.util.*;
import java.io.*;

public class Validparentheses{
// }
//
// public class Solution{
  public static boolean isValid(String s){
    // delete every close-by pairs each loop until no pairs
    // true if the string is empty, otherwise false

    boolean res = true;
    boolean st = false;

    while(havepairs(s)){
      for(int i=0; i < s.length()-1; i++){
        if(ispair(s.substring(i,i+1),s.substring(i+1,i+2))){
          st = true;
          s = s.substring(0,i) + s.substring(i+1, s.length()+1);
          // st = s;
          i -= 1;
        // }else{
        //   i += 1;
        }
      }
    }
    System.out.println(st+"1");

    System.out.println(s);
    if(s == ""){
      res = true;
    }else{
      res = false;
    }
    return res;
  }

  public static boolean havepairs(String s){
    boolean str = false;
    s = "()";
    for(int i=0; i<s.length()-1; i++){

      // if(ispair(s.substring(i,i),s.substring(i+1,i+1))){
      if(ispair(s.substring(0,1),s.substring(1,2))){
        str = true;
        return true;
      }
    }
    // String a = s.substring(0,1);
    // String b = s.substring(1,2);
    System.out.println(str+"hp");
    return false;

  }
  public static boolean ispair(String a, String b){
    boolean str = true;
    boolean index = false;
    if(a == "(" && b == ")"){
      index = true;
    }else if(a == "[" && b == "]"){
      index = true;
    }else if(a == "{" && b == "}"){
      index = true;
    }else{
      index = false;
    }
    System.out.println(str+"ispair");
    System.out.println(index+"ispairres");
    return index;
  }

  public static void main(String[] args)
  {
    String s = "()";
    System.out.println(isValid(s));
  }
}
