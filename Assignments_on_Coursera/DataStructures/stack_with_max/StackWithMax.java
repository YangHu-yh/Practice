// A Starter file was provided by the Data Structures courses
// inside the series Data Structures and Algorithms through
// University of California San Diego - National Research University
// Higher School of Economics on Coursera.
// The original document contain a naive solution.
// Modifications are applied in order to improve the part that finds the maximum.


// Sample 1.
// Input
// 5
// push 2
// push 1
// max
// pop
// max
// Output:
// 2
// 2
// Explanation:
// After the first two push queries, the stack contains elements 1 and 2.
// After the pop query, the element 1 is removed.

import java.util.*;
import java.io.*;

public class StackWithMax {
    class FastScanner {
        StringTokenizer tok = new StringTokenizer("");
        BufferedReader in;

        FastScanner() {
            in = new BufferedReader(new InputStreamReader(System.in));
        }

        String next() throws IOException {
            while (!tok.hasMoreElements())
                tok = new StringTokenizer(in.readLine());
            return tok.nextToken();
        }
        int nextInt() throws IOException {
            return Integer.parseInt(next());
        }
    }

    public void solve() throws IOException {
        FastScanner scanner = new FastScanner();
        int queries = scanner.nextInt();
        Stack<Integer> stack = new Stack<Integer>();

        // add stack level
        int stacklevel = 0;
        // add an array of maximums at each level to keep track
        int[] maxs = new int[queries+1];
        maxs[0] = 0;
        for (int qi = 0; qi < queries; ++qi) {
            String operation = scanner.next();
            if ("push".equals(operation)) {
                int value = scanner.nextInt();
                // store the maximum until the current stack level
                stacklevel += 1;
                // compare the current value to previous ones.
                maxs[stacklevel] = Math.max(value, maxs[stacklevel-1]);
                stack.push(value);
            } else if ("pop".equals(operation)) {
                stack.pop();
                // since the current value is not availale any more,
                // reduce the stacklevel to keep up.
                stacklevel -= 1;
            } else if ("max".equals(operation)) {
                System.out.println(maxs[stacklevel]);
            }
        }
    }

    static public void main(String[] args) throws IOException {
        new StackWithMax().solve();
    }
}
