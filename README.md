# Java 8 new features samples

Java 8 language specification: https://docs.oracle.com/javase/specs/jls/se8/html/index.html

## 1. Remove Permanent Generation (JEP 122)

https://openjdk.org/jeps/122

**What is the Permanent Generation (PermGen)?**

The Permanent Generation was a distinct section of the Java Heap (the memory where objects are stored) in older Java versions (prior to Java 8).

Specifically,**PermGen stored Java class metadata**:

- Class definitions (names, methods, fields, etc.)

- Internally used string constants ("String Pool")

- Static class variables

**The Problem: OutOfMemoryError: PermGen Space**

**Limited Size**: The PermGen had a fixed size determined at JVM startup

**Class Heavy Application**: Applications loading **many classes** (e.g., web servers, applications using reflection heavily) could fill up the PermGen space

**Result**: This led to the infamous **java.lang.OutOfMemoryError**: PermGen space error, requiring JVM restarts and tuning

**JEP 122: The Solution**

**Goal**: **Remove the PermGen space**, improving memory management and removing a source of difficult-to-tune runtime errors

Introduced as part of Java 8

**How it Works**:

**Metaspace**: **Class metadata** is now stored in a special native memory area called **Metaspace**. Native memory allocation generally scales better with application needs

**String Pool in the Heap**: Interned strings moved from PermGen to the regular Java heap for simplified space management

**Removal of JVM Flags**: Command-line flags like PermSize and MaxPermSize became obsolete as there's no longer a separately sized PermGen to manage

**Key Benefits**

**Simplified Memory**: Removal of a separate generational space makes memory management cleaner and less prone to configuration headaches

**Dynamic Resizing**: Metaspace can dynamically grow or shrink as needed, reducing the occurrence of OutOfMemoryError: PermGen space

**Ease for Developers**: Developers generally no longer need to worry about PermGen sizing issues

**What You Should Know**

**Migration**: Upgrading to Java 8+ typically requires minimal application changes due to the removal of PermGen

**Metaspace is Not Unlimited**: It's possible (but less likely) to still get OutOfMemoryError: Metaspace. Tuning might be needed in extreme cases

**Legacy Apps**: Applications designed for very old Java versions might have some PermGen assumptions built in, potentially requiring adjustment

## 2. Lambda Expressions (JSR 335)

https://jcp.org/en/jsr/detail?id=335

**What are Lambda Expressions?**

**Concise Anonymous Functions**: Lambdas provide a compact syntax for implementing simple functions directly where they are needed

They streamline scenarios where you traditionally used anonymous inner classes

**Functional Programming Touch**: Lambdas make it easier to treat functions as values in Java, encouraging a functional programming style (often used with the Streams API)

**Syntax Basics**

A lambda expression has three parts:

**Parameter List**: Comma-separated variables within parentheses

**(param1, param2)** -> ... 

**Arrow**: The **->** symbol separates the parameters from the function body

**Body**:

**Single Expression**: Its value is implicitly returned

(x, y) -> x + y 

**Code Block**: Use curly braces for multiple statements. Requires an explicit return statement

() -> { System.out.println("Hello"); return 42; } 

**Why Use Lambda Expressions**

**Readability**: They reduce verbosity in the code. Compare creating a named Runnable for a thread vs. a lambda:

```java
// Traditional Runnable
new Thread(new Runnable() {
    @Override
    public void run() {
        System.out.println("In a thread");
    }
}).start();

// With a lambda
new Thread(() -> System.out.println("In a thread")).start();  
```

Passing Code as Data: Lambdas work effortlessly with methods of functional interfaces (interfaces with a single abstract method). This enables elegant techniques like filtering collections

**Streamlined APIs**: Java 8's Streams API  heavily leans on lambdas for operations like filtering, mapping, and sorting collections

**Example with Streams**

```java
import java.util.Arrays;
import java.util.List;

List<Integer> numbers = Arrays.asList(1, 5, 2, 8, 3);

numbers.stream()
       .filter(n -> n % 2 == 0) // Filter even numbers
       .map(n -> n * 2)         // Double each number 
       .forEach(System.out::println);   // Print results  
```

**Key Notes**

**Type Inference**: The compiler can often infer the data types of a lambda's parameters, but you can specify them if needed

**Capturing Variables**: Lambdas can access variables from the enclosing scope as long as they are effectively final (their value isn't modified)

**JSR 335's Impact**. JSR 335  was a significant addition to Java 8

Lambda expressions, along with  other new features like the Streams API, enhanced Java's ability to use concise and expressive code  aligned with functional programming paradigms

Let's explore some more advanced uses of Java Lambda Expressions.

1. Custom Functional Interfaces & Comparators

Beyond Predefined: While lambda expressions work seamlessly with predefined functional interfaces (Predicate, Function, Consumer, etc.), you can create your own.
Java
// Functional interface for checking string validity
@FunctionalInterface
interface StringChecker {
    boolean isValid(String s);
}

public class LambdaAdvanced {
    public static void main(String[] args) {
        StringChecker isEmpty = s -> s.isEmpty();
        System.out.println(isEmpty.isValid(""));     // true
        System.out.println(isEmpty.isValid("hello")); // false

        // Comparator comparing lengths
        Comparator<String> lengthComparator = (s1, s2) -> Integer.compare(s1.length(), s2.length());
    }
}
Usa el código con precaución.
2. Method References

Shorthand for Existing Methods: When a lambda simply calls an existing method, you can replace it with a method reference for further brevity.
Java
List<String> names = Arrays.asList("Alice", "Bob", "Charlie");

// Lambda way
names.forEach(name -> System.out.println(name));

// Method reference - more concise
names.forEach(System.out::println); 
Usa el código con precaución.
Types:
objectName::instanceMethod
ClassName::staticMethod
ClassName::new (constructor reference)
3. Lambdas Within Collections

Sorting: Comparator.comparing gives a nice way to use lambdas within sort methods of collections:
Java
List<Person> people = ... // Assume a list of Person objects

people.sort(Comparator.comparing(Person::getName));       // Sort by name
people.sort(Comparator.comparing(Person::getAge).reversed());  // Sort by age descending
Usa el código con precaución.
Advanced Stream Usage: Combining operations like filter, map, and reduce with lambdas leads to powerful data manipulation capabilities within Streams.
4. Event Handling (Swing/JavaFX)

Callback Handlers: Lambda expressions eliminate the tedium of creating separate classes to handle GUI events:
Java
import javax.swing.*;

JButton button = new JButton("Click Me");
button.addActionListener(e -> System.out.println("Button clicked!"));
Usa el código con precaución.
5. Higher-Order Functions

Functions as Arguments/Return Values: You can write methods that accept lambda expressions as parameters or return them, enabling the creation of flexible, reusable algorithms.
Java
public static <T> List<T> filter(List<T> list, Predicate<T> condition) {
    List<T> result = new ArrayList<>();
    for (T item : list) {
        if (condition.test(item)) {
            result.add(item);
        }
    }
    return result;
}
Usa el código con precaución.
Notes

Performance: Using lambdas strategically generally doesn't incur performance overhead compared to traditional code.
Debugging: Sometimes complex lambdas in deep function chains can make debugging a bit less intuitive; strategic naming or refactoring can help here.

## 3. Default Methods in Interfaces (JSR 335)

## 4. Effectively Final Variables (JSR 335)

## 5. Type Use Annotations (JEP 104)

https://openjdk.org/jeps/104

## 6. Repeating Annotations (JEP 120)

https://openjdk.org/jeps/120

## 7. Streams (java.util.stream) (JEP 107)

https://openjdk.org/jeps/107

## 8. Lambda APIs (java.util.function) (JEP 109)

https://openjdk.org/jeps/109

## 9. Date Time (java.time) (JSR 310, JEP 150)

https://jcp.org/en/jsr/detail?id=310, https://openjdk.org/jeps/150
