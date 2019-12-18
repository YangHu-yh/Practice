// 10. Regular Expression Matching

// Given an input string (s) and a pattern (p), implement regular expression matching with support for '.' and '*'.
//
// '.' Matches any single character.
// '*' Matches zero or more of the preceding element.
// The matching should cover the entire input string (not partial).
//
// Note:
//
// s could be empty and contains only lowercase letters a-z.
// p could be empty and contains only lowercase letters a-z, and characters like . or *.
// Example 1:
//
// Input:
// s = "aa"
// p = "a"
// Output: false
// Explanation: "a" does not match the entire string "aa".
// Example 2:
//
// Input:
// s = "aa"
// p = "a*"
// Output: true
// Explanation: '*' means zero or more of the precedeng element, 'a'. Therefore, by repeating 'a' once, it becomes "aa".
// Example 3:
//
// Input:
// s = "ab"
// p = ".*"
// Output: true
// Explanation: ".*" means "zero or more (*) of any character (.)".
// Example 4:
//
// Input:
// s = "aab"
// p = "c*a*b"
// Output: true
// Explanation: c can be repeated 0 times, a can be repeated 1 time. Therefore it matches "aab".
// Example 5:
//
// Input:
// s = "mississippi"
// p = "mis*is*p*."
// Output: false

import java.io.*;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Scanner;


public class RegularExpressionMatchingDP {

    private int[][] memo;
    private String s;
    private String p;

    public static void main(String arg[]) throws IOException{
        new RegularExpressionMatchingDP().solve();
    }

    public void solve() throws IOException {
        // String s = "aa";
        // String p = "a*";
        // String s = "mississippi";
        // String p = "mis*is*p*.";
        readStrings();
        boolean output = isMatch();
        System.out.println(output);
    }

    public void readStrings(){
        Scanner scan = new Scanner(System.in);
        s = scan.nextLine();
        p = scan.nextLine();
        System.out.println(s+' '+p);
    }

    public boolean isMatch(){
        memo = new int[s.length() + 1][p.length() + 1];
        for (int[] array: memo){
            Arrays.fill(array, -1);
        }
        return dp(0,0);
    }

    public boolean dp(int i, int j){
        if (memo[i][j] != -1){
            return memo[i][j] == 1;
        }

        boolean result;

        if (p.length() == j){
            result = s.length() == i;
            System.out.println("result = "+ result+" i = "+i+"j = "+j);
        }else{
            boolean first_match = (s.length() > i && (p.charAt(j) == s.charAt(i) || p.charAt(j) == '.'));

            if (p.length() > j + 1 && '*' == p.charAt(j+1)){
                result = dp(i, j+2) || first_match && dp(i+1, j);
            }else{
                result = first_match &&  dp(i+1, j+1);
            }
            // System.out.println("result = "+ result+" i = "+i+"j = "+j);
        }
        memo[i][j] = result ? 1: 0;
        // System.out.println("memo[i][j] = "+ memo[i][j] +" i = "+i+"j = "+j);
        return result;
    }
}
