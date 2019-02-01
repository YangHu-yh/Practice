import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;
import java.util.Stack;

class Bracket {
    Bracket(char type, int position) {
        this.type = type;
        this.position = position;
    }

    boolean Match(char c) {
        if (this.type == '[' && c == ']')
            return true;
        if (this.type == '{' && c == '}')
            return true;
        if (this.type == '(' && c == ')')
            return true;
        return false;
    }

    char type;
    int position;
}

class check_brackets {
    public static void main(String[] args) throws IOException {
        InputStreamReader input_stream = new InputStreamReader(System.in);
        BufferedReader reader = new BufferedReader(input_stream);
        String text = reader.readLine();

        Stack<Bracket> opening_brackets_stack = new Stack<Bracket>();
        int falseposition = -10;
        for (int position = 0; position < text.length(); ++position) {
            char next = text.charAt(position);

            if (next == '(' || next == '[' || next == '{') {
                // Process opening bracket
                Bracket next_bracket = new Bracket(next, position);
                opening_brackets_stack.push(next_bracket);
                if(position+1 >= text.length()){
                  falseposition = position + 1;
                }
            }

            if (next == ')' || next == ']' || next == '}') {
                // Process closing bracket
                if(opening_brackets_stack.isEmpty()){
                  falseposition = position + 1;
                  break;
                }else
                if(opening_brackets_stack.peek().Match(next)) {
                  opening_brackets_stack.pop();
                  if(position+1 >= text.length() && !opening_brackets_stack.isEmpty()){
                    falseposition = opening_brackets_stack.peek().position + 1;
                  }
                }else{
                  falseposition = position+1;
                  break;
                }
            }
        }

        // Printing answer
        if (falseposition == -10){
          System.out.println("Success");
        }else{
          System.out.println(falseposition);
        }
    }
}
