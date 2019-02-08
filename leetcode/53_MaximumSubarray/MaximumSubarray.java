// Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.
//
// Example:
//
// Input: [-2,1,-3,4,-1,2,1,-5,4],
// Output: 6
// Explanation: [4,-1,2,1] has the largest sum = 6.
// Follow up:
//
// If you have figured out the O(n) solution, try coding another solution using the divide and conquer approach, which is more subtle.


// Dynamic Programming Solution
class MaximumSubarray {
    public static int maxSubArray(int[] A) {
        System.out.println( A );
        int n = A.length;
        int max_endinghere = 0;
        max_endinghere = A[0];
        int max = max_endinghere;
        System.out.println("Start with: n = "+ n +"; max = max_endinghere = "+ max_endinghere);
        for(int i = 1; i < n; i++){
            max_endinghere = Math.max(max_endinghere + A[i], A[i]);
            max = Math.max(max, max_endinghere);
            System.out.println("i = "+ i +"; max_endinghere = " + max_endinghere + "; max = " + max);
        }
        return max;
    }

    public static void main(String[] args){
        int[] MainArray = new int[]{-2,1,-3,4,-1,-1,2,1,-5,4};
        System.out.println(maxSubArray(MainArray));
    }
}
