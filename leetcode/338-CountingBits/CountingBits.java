// 338. Counting Bits
//
// Given a non negative integer number num. For every numbers i in the range 0 ≤ i ≤ num calculate the number of 1's in their binary representation and return them as an array.
//
// Example 1:
//
// Input: 2
// Output: [0,1,1]
// Example 2:
//
// Input: 5
// Output: [0,1,1,2,1,2]
// Follow up:
//
// It is very easy to come up with a solution with run time O(n*sizeof(integer)). But can you do it in linear time O(n) /possibly in a single pass?
// Space complexity should be O(n).
// Can you do it like a boss? Do it without using any builtin function like __builtin_popcount in c++ or in any other language.
//
// Hint #1:
// You should make use of what you have produced already.
// Hint #2:
// Divide the numbers in ranges like [2-3], [4-7], [8-15] and so on. And try to generate new range from previous.
// Hint #3:
// Or does the odd/even status of the number help you in calculating the number of 1s?

import java.io.*;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.StringTokenizer;

class CountingBits {

    private FastScanner in;
    private PrintWriter out;

    public int[] countBits(int num) {
        int[] output = new int[num+1];
        if (num != 0){
            int currentposition = 1;
            while (currentposition*2 <= num) {
                int presize = currentposition;
                for (int i = presize + 1; i <= 2*presize; i++){
                    output[i-1] = output[i - 1 - presize] + 1;
                    currentposition += 1;
                    // System.out.println(currentposition+" "+presize+" "+output[i - 1]);
                }
            }
            int presize = currentposition;
            for (int i = presize + 1; i <= num + 1; i++){
                output[i-1] = output[i - 1 - presize] + 1;
            }
            return output;
        }
        return output;
    }

    public static void main(String arg[]) throws IOException{
        new CountingBits().solve();
    }

    public void solve() throws IOException {
        in = new FastScanner();
        out = new PrintWriter(new BufferedOutputStream(System.out));
        int num = in.nextInt();
        int[] output = countBits(num);
        outputResult(num, output);
        out.close();
    }

    static class FastScanner {
        private BufferedReader reader;
        private StringTokenizer tokenizer;

        public FastScanner() {
            reader = new BufferedReader(new InputStreamReader(System.in));
            tokenizer = null;
        }

        public String next() throws IOException {
            while (tokenizer == null || !tokenizer.hasMoreTokens()) {
                tokenizer = new StringTokenizer(reader.readLine());
            }
            return tokenizer.nextToken();
        }

        public int nextInt() throws IOException {
            return Integer.parseInt(next());
        }
    }

    private void outputResult(int num, int[] output) throws IOException {
        System.out.print("[");
        for (int i = 0; i < num; ++i) {
            System.out.print(output[i]+", ");
        }
        System.out.println(output[num]+"]");
    }
}
