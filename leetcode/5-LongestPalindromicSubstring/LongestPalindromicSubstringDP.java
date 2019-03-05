// 5. Longest Palindromic Substring
//
// Given a string s, find the longest palindromic substring in s. You may assume that the maximum length of s is 1000.
//
// Example 1:
//
// Input: "babad"
// Output: "bab"
// Note: "aba" is also a valid answer.
// Example 2:
//
// Input: "cbbd"
// Output: "bb"

// Reference:
// https://leetcode.com/problems/longest-palindromic-substring/solution/

// Approach 4: ExpandAroundCenter
public class LongestPalindromicSubstringDP{

    public static String longestPalindrome(String s) {
        int len = s.length();
        boolean[][] isPalindrome = new boolean[len][len];
        int longestPalindromeLength = 0;
        int longestPalindromeStart = 1;
        for (int i = 0; i < len; i++) {
            isPalindrome[i][i] = true;
            if (i+1 < len) {
                if (s.charAt(i) == s.charAt(i+1)){
                    isPalindrome[i][i+1] = true;
                    longestPalindromeStart = i;
                    longestPalindromeLength = 2;
                }
            }
        }
        // come back to see why need  +1 and -1
        for (int dist = 3; dist < len; dist++) {
            for (int i = 0; i < (len - dist + 1); i++) {
                int j = dist + i - 1;
                isPalindrome[i][j] = (dist == 0 || dist == 1) ? s.charAt(i) == s.charAt(j) : (s.charAt(i) == s.charAt(j)) && isPalindrome[i + 1][j - 1];
                System.out.println("i = " + i + "; j = " + j + "; "+isPalindrome[i][j] + " ");
                if (isPalindrome[i][j] && j - i + 1 > longestPalindromeLength) {
                    longestPalindromeLength = j - i + 1;
                    longestPalindromeStart = i;
                }
            }
        }
        System.out.println("longestPalindromeStart = "+ longestPalindromeStart + "; longestPalindromeLength = "+ longestPalindromeLength);
        return s.substring(longestPalindromeStart, longestPalindromeStart + longestPalindromeLength);
    }

    public static void main(String arg[]){
        String test = "babad";
        System.out.println(longestPalindrome(test));
    }
}
