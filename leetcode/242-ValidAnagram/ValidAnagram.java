// 242. Valid Anagram
// Given two strings s and t , write a function to determine if t is an anagram of s.
//
// Example 1:
//
// Input: s = "anagram", t = "nagaram"
// Output: true
// Example 2:
//
// Input: s = "rat", t = "car"
// Output: false
// Note:
// You may assume the string contains only lowercase alphabets.
//
// Follow up:
// What if the inputs contain unicode characters? How would you adapt your solution to such case?

//30ms HashMap
class Solution {
    public boolean isAnagram(String s, String t) {
        if(s.length() != t.length()){
            return false;
        }
        HashMap<Character, Integer> det1 = new HashMap<Character, Integer>();
        HashMap<Character, Integer> det2 = new HashMap<Character, Integer>();
        for(int i = 0; i < s.length(); i++){
            if(det1.containsKey(s.charAt(i))){
                det1.put(s.charAt(i), det1.get(s.charAt(i))+1);
            }else if(!det1.containsKey(s.charAt(i))){
                det1.put(s.charAt(i), 1);
            }
            if(det2.containsKey(t.charAt(i))){
                det2.put(t.charAt(i), det2.get(t.charAt(i))+1);
            }else{
                det2.put(t.charAt(i), 1);
            }
        }
        // System.out.println(det1);
        // System.out.println(det2);
        boolean res = false;
        for(char c : det1.keySet()){
            if(!det2.containsKey(c)){
                // System.out.println("no key:"+c);
                return false;
            }
            if(!det1.get(c).equals(det2.get(c))){
                // System.out.println("not equal: "+c);
                return false;
            }
        }
        return true;
    }
}

// ;
// s.length()
// type: Character Integer String
// HashMap containsKey
// equals() includes more cases than ==


// Reference:
// https://leetcode.com/articles/valid-anagram/
// 5ms
class Solution {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) {
            return false;
        }
        int[] table = new int[26];
        for (int i = 0; i < s.length(); i++) {
            table[s.charAt(i) - 'a']++;
        }
        for (int i = 0; i < t.length(); i++) {
            table[t.charAt(i) - 'a']--;
            if (table[t.charAt(i) - 'a'] < 0) {
                return false;
            }
        }
        return true;
    }
}
