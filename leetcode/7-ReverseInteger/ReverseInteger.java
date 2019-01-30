/*
 * [Source]
 *
 * https://leetcode.com/problems/reverse-integer/
 *
 * [Problem Description]
 *
 * Reverse digits of an integer.
 *
 * Example1: x = 123, return 321
 * Example2: x = -123, return -321
 *
 */

 import java.util;
 
 public class ReverseInteger{
   // Attemp 1:
   public int reverse(int x) {
     // res - results to return; n - number of digits of x;
     int res = 0;
     int n = x.length();
     // put the last digit of x to the first digit of res
     while(int i=0;x != 0;i++){
       int r = x%(10^n);
       res += r*(10^i);
       x = x/10-x/10%1;
       if(x < 10){
         res = res+r;
       }else if(x == 0){
         res = res/10;
       }
    return res;
  }


  // Accepted:
  public int reverse(int x) {
    // res - results to return;
    int res = 0;

    // put the last digit of x to the first digit of res
    while(x != 0){
      int r = x % 10;
      x /= 10;
      int newres = res*10 + r;
      if((newres-r)/10 != res){
        return 0;
      }
      res = res*10 + r;
    }
    // if(x < 0){
    //   res = -res;
    // }
      return res;
      }
  }
}
