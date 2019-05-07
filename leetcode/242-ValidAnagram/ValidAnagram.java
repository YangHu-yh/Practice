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
