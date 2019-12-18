/*
 * [Source]
 *
 * https://leetcode.com/problems/two-sum/
 *
 * [Problem Description]
 * Given an array of integers, return indices of the two numbers such that they add up to a specific target.
 * You may assume that each input would have exactly one solution, and you may not use the same element twice.

 Example:

 Given nums = [2, 7, 11, 15], target = 9,

 Because nums[0] + nums[1] = 2 + 7 = 9,
 return [0, 1].

 */

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

public class TwoSum{
  // Method 1
  // Brute Force
  // Time Complexity:O(n^2)

  public int[] twoSum(int[] nums, int target) {
    int sum=0;
    int[] res = {0,1};
    for(int i=0; i<nums.length-1; i++){
        for(int j=i+1; j<nums.length; j++){
            sum = nums[i] + nums[j];
            if(sum == target){
                res[0] = i;
                res[1] = j;
                break;
            }
        }
    }
    return res;
  }

  // Method 2
  // Two-pass Hash Table
  // Time Complexity: O(n)
  public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        map.put(nums[i], i);
    }
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement) && map.get(complement) != i) {
            return new int[] { i, map.get(complement) };
        }
    }
    throw new IllegalArgumentException("No two sum solution");
  }

  // Method 3:
  // One-pass Hash Table
  // We use a dictionary ADT (hash map) that contains <idx, value> pairs
  // to reduce the look up time of a value to O(1).
  // Time Complexity: O(n)
  public static int[] twoSum(int[] numbers, int target)
  {
    Map<Integer, Integer> dict = new HashMap<>();
    for (int i = 0; i < numbers.length; i++)
    {
      int x = numbers[i];
      if (dict.containsKey(target - x))
      {
        return new int[] {dict.get(target - x), i};
      }
      dict.put(x, i);
    }
    throw new IllegalArgumentException("No two sum solution");
  }

  public static void main(String[] args)
  {
    int[] num = {2,7,11,15};
    int target = 9;
    System.out.println(Arrays.toString(twoSum(num, target)));
  }
}
