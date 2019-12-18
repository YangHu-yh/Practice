// Record Accepted:
// Runtime: 1 ms, faster than 98.98% of Java online submissions for String Compression.
// Memory Usage: 37.7 MB, less than 27.47% of Java online submissions for String Compression.

class Solution {
    public int compress(char[] chars) {
        if(chars.length == 2){
            if(chars[1] == chars[0]){
                chars[1] = '2';
                return 2;
            }else{
                return 2;
            }
        }

        char[] ccopy = new char[chars.length];
        for(int i = 0; i < chars.length; i++){
            ccopy[i] = chars[i];
        }
        int read = 1, write = 1, count = 1;
        while(read < chars.length - 1){
            if(ccopy[read] == ccopy[read-1] && ccopy[read] != ccopy[read+1]){
                count += 1;
                if(Integer.toString(count).toCharArray().length > 1){
                    for(char c : Integer.toString(count).toCharArray()){
                    chars[write] = c;
                    write += 1;
                    }
                }else{
                    chars[write] = Integer.toString(count).charAt(0);
                    write += 1;
                }
                read += 1;

                if(read == chars.length - 1){
                    chars[write] = ccopy[read];
                    write += 1;
                }
                //System.out.println("Read"+chars[read] + chars[write]+Integer.toString(count));
            }else if(ccopy[read] == ccopy[read-1] && ccopy[read] == ccopy[read+1]){
                count += 1;
                read += 1;
                if(read == chars.length - 1){
                    count += 1;
                    if(Integer.toString(count).toCharArray().length > 1){
                        for(char c : Integer.toString(count).toCharArray()){
                            chars[write] = c;
                            write += 1;
                        }
                    }else{
                        chars[write] = Integer.toString(count).charAt(0);
                        write += 1;
                    }
                }
                //System.out.println("Read"+ccopy[read] + chars[write]+Integer.toString(count));
            }else if(ccopy[read] != ccopy[read-1]){
                chars[write] = ccopy[read];
                write += 1;
                read += 1;
                count = 1;
                if(read == chars.length - 1){
                    if(ccopy[read] == ccopy[read-1]){
                        count += 1;
                        if(Integer.toString(count).toCharArray().length > 1){
                            for(char c : Integer.toString(count).toCharArray()){
                                chars[write] = c;
                                write += 1;
                            }
                        }else{
                            chars[write] = Integer.toString(count).charAt(0);
                            write += 1;
                        }
                    }else{
                        chars[write] = ccopy[read];
                        write += 1;
                    }
                }
                //System.out.println("Read"+chars[read] + chars[write]+Integer.toString(count)+" "+ccopy[read] + ccopy[read-1]);
            }
        }

        return write;
    }
}
