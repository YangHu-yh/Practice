# SOLUTION #
## Approach 1 - Brute Force: ##
### Idea ###
1. calculate all pairs difference(the later price - the earlier price) and find the maximum profit.
2. If the profit found was smaller than zero, than no transaction is done, where maximum profit is zero.

### Complexity Analysis: ###
Time complexity : O(n^2), Loop runs [n*(n-1)]/2 times.
Space complexity : O(1), Only two variables - maxprofit and profit are used.

## Approach 2 - One Pass ##

### Idea ###
We need to find the largest peak following the smallest valley. Therefore, we loop through all values and set the minimum price each time while find the maximum profit using this minimum price.

### Complexity Analysis ###

Time complexity : O(n). Only a single pass is needed.
Space complexity : O(1). Only two variables are used.
