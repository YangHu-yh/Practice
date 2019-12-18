class LongestPalindromeSubstring {
    public String longestPalindrome(String s) {
        String longest = "";
        boolean[][] dp = new boolean[s.length()][s.length()];

        for(int i = 0; i < s.length(); i++){
            for(int j = i; j >= 0; j--){
                String sub = s.substring(j, i+1);
                dp[j][i] = (s.charAt(i) == s.charAt(j)) && (i-j < 2 || dp[j+1][i-1]);
                if (dp[j][i]){
                    if(longest.length() <= sub.length()){
                        longest = sub;
                    }
                }
            }
        }
        return longest;
    }

}
