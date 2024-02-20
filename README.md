# Java 8 new features samples

**Java 8** language specification: https://docs.oracle.com/javase/specs/jls/se8/html/index.html

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

Let's explore some **more advanced** uses of **Java Lambda Expressions**

### 2.1. Custom Functional Interfaces & Comparators

**Beyond Predefined**: While lambda expressions work seamlessly with predefined functional interfaces (Predicate, Function, Consumer, etc.), you can create your own

```java
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
```

### 2.2. Method References

**Shorthand for Existing Methods**: When a lambda simply calls an existing method, you can replace it with a method reference for further brevity

```java
List<String> names = Arrays.asList("Alice", "Bob", "Charlie");

// Lambda way
names.forEach(name -> System.out.println(name));

// Method reference - more concise
names.forEach(System.out::println); 
```

**Types:**

```
objectName::instanceMethod

ClassName::staticMethod

ClassName::new (constructor reference)
```

### 2.3. Lambdas Within Collections

**Sorting**: Comparator.comparing gives a nice way to use lambdas within sort methods of collections:

```java
List<Person> people = ... // Assume a list of Person objects

people.sort(Comparator.comparing(Person::getName));       // Sort by name
people.sort(Comparator.comparing(Person::getAge).reversed());  // Sort by age descending
```

**Advanced Stream Usage**: Combining operations like filter, map, and reduce with lambdas leads to powerful data manipulation capabilities within Streams

### 2.4. Event Handling (Swing/JavaFX)

**Callback Handlers**: Lambda expressions eliminate the tedium of creating separate classes to handle GUI events:

```java
import javax.swing.*;

JButton button = new JButton("Click Me");
button.addActionListener(e -> System.out.println("Button clicked!"));
```

### 2.5. Higher-Order Functions

Functions as Arguments/Return Values: You can write methods that accept lambda expressions as parameters or return them, enabling the creation of flexible, reusable algorithms

```java
public static <T> List<T> filter(List<T> list, Predicate<T> condition) {
    List<T> result = new ArrayList<>();
    for (T item : list) {
        if (condition.test(item)) {
            result.add(item);
        }
    }
    return result;
}
```

**Notes**

**Performance**: Using lambdas strategically generally doesn't incur performance overhead compared to traditional code

**Debugging**: Sometimes complex lambdas in deep function chains can make debugging a bit less intuitive; strategic naming or refactoring can help here

## 3. Default Methods in Interfaces (JSR 335)

Let's break down Java Default Methods, another key feature introduced alongside Lambda Expressions in JSR 335

**The Problem: Evolving Interfaces**

Traditionally, **adding a new method to an interface** in Java was problematic

All classes implementing the interface would immediately break, as they lacked an implementation for the new method. This hampered interface evolution

**Default Methods to the Rescue**

**Definition**:  A default method is declared within an interface with the default keyword and provides a concrete implementation

```java
interface MyInterface {
    void existingMethod(); 

    default void newDefaultMethod() {
        System.out.println("Default implementation!");
    } 
}
```

**Impact**:

**No Forced Implementation**: Classes implementing MyInterface don't have to provide an implementation for newDefaultMethod. They inherit the default behavior

**Selective Overrides**: Implementing classes can still choose to override the default method to provide a custom implementation if needed

**Why This Matters**

**Evolving APIs**: Default methods let interface designers add new functionality without causing compilation errors in existing code using older versions of the interface

**Mixin-Like Behavior**: You can introduce reusable implementations directly within interfaces, promoting a degree of code reuse somewhat similar to mixins in other languages

**Multiple Inheritance Issues**: While allowing some traits of multiple inheritance of behavior, default methods help Java sidestep a major complexity: the "diamond problem" often associated with full multiple inheritance of both state and behavior.


```java
interface Vehicle {
    void move();

    default void startEngine() {
        System.out.println("Starting engine...");
    }
}

class Car implements Vehicle {
     @Override
    public void move() { 
        System.out.println("Car is moving");
    }   
}

// In your code:
Car myCar = new Car();
myCar.move();          // Calls Car's implementation
myCar.startEngine();   // Uses the default interface implementation
```

**Rules & Nuances**

**Conflicts**: If a class inherits multiple default methods with the same signature, you must explicitly override it and resolve the conflict

**super**: Inside a default method, super.interfaceMethod() lets you access a potentially overridden version in a subclass

Static Interface Methods: Java 8 also introduced static methods in interfaces (not to be confused with default methods)

**JSR 335's Significance**

**Default methods**,  along with lambdas, were integral for adding elements of functional programming paradigms to Java

They also greatly enhanced the ability for libraries and APIs to evolve maintain backward compatibility gracefully

Let's dive into more advanced applications of default methods in Java interfaces.

### 3.1. Simulating "Traits" (with Cautions)

While  Java doesn't have full-fledged traits like some other languages, default methods let you achieve a degree of behavioral mixin:

```java
interface Flyable {
    default void fly() {
        System.out.println("I'm flying!");
    }
}

interface Swimmable {
    default void swim() {
        System.out.println("I'm swimming!");
    }
}

class Bird implements Flyable { 
    // Bird-specific flying implementation if desired
}

class Penguin implements Swimmable, Flyable { 
    // Must override 'fly' even if just to indicate non-flying ability
    @Override
    public void fly() {
        System.out.println("Penguins can't fly.");
    }
}
```

**Caution**: Be mindful of when this simulates traits well vs. introducing complexity if concepts aren't clearly orthogonal

### 3.2. Evolving Collections & Libraries

Observe how several common methods were added to collections as default methods, ensuring backward compatibility:

**Iterable.forEach(Consumer)**: Lets you easily iterate with lambdas:

```java
List<Integer> numbers = Arrays.asList(1, 2, 3);
numbers.forEach(num -> System.out.println(num)); 
```

**List.sort(Comparator)**:  Enables custom sorting using comparators built with lambdas

### 3.3. Design Patterns with Default Methods

**Adapter Pattern**: Default methods streamline creating adapters. Instead of every "adaptee" needing to implement all interface methods, a default version could suffice

**Optional Behavior**: Provide optional extensions as default methods in an interface, giving finer control to client code on what to incorporate

### 3.4. Practical Scenario: Version Upgrading

**Imagine a payment system**:

```java
interface PaymentProcessor {
    void processPayment(double amount); 

    // New features in version 2:
    default void verifyCustomerIdentity() {  
        // Basic common verification
    } 

    default boolean supportsRefunds() { 
        return false; // Most processors didn't
    }
}
```

**Upgrading**: Classes implementing the original PaymentProcessor won't break even without verifyCustomerIdentity and supportsRefunds

Clients needing the enhanced features can selectively call these new methods if present

**Notes**

**Overriding Defaults**: Default methods can break existing complex setups if a class in the chain decides to override a method that used to be the inherited default. Good API design anticipates this

**Diamonds**: Complex hierarchies where a class inherits the same default method through multiple paths often cause the compiler to necessitate an override to disambiguate

## 4. Effectively Final Variables (JSR 335)

Let's break down the concept of effectively final variables, which plays a significant role when working with lambda expressions in Java

**Background: Variable Capture in Lambdas**

Before Java 8, an anonymous inner class could only access variable values from its enclosing scope if those variables were declared final. Java 8 introduced lambda expressions, offering a more concise syntax for similar functionality. However, to ensure consistency and predictability, this rule was adjusted into the concept of "effectively final"

**What is "Effectively Final"?**

Definition: A variable or object reference is considered effectively **final** if, after initial assignment, its **value does not change**. This includes:

- Variables directly declared as final

- Variables that are never reassigned after initialization

**Why Does This Matter for Lambdas?**

**Access from Different Scopes**: Lambda expressions often live beyond the scope where they are initially defined. For example, a lambda passed into a thread executes on a different thread or at a much later time

**Predictability**: The compiler and the JVM assume that any external variables a lambda captures won't change during its lifecycle. Ensuring these variables are effectively final prevents unexpected, hard-to-debug errors if these assumptions are violated

```java
String message = "Hello";

Runnable task = () -> System.out.println(message); 

// Some time later...
message = "World";  // Not allowed: message must be effectively final

new Thread(task).start(); 
```

**Problem**: Attempting to change the value of message later would make it not effectively final, generating a compiler error when you try to use it inside the lambda

**What the Compiler Might do (Simplified)**

The compiler could optimize the above code as if you had done this:

```java
String message = "Hello";

final String messageCopy = message; // Internally the compiler uses a constant variable

Runnable task = () -> System.out.println(messageCopy); // message doesn't change
```

**Key Points**

**Object Properties**: If you capture an object, that object itself is effectively final (its reference can't change). However, its internal fields or properties can be modified even within the lambda

**No Keyword Needed**: "Effectively final" is a compiler rule, not a keyword you use while coding

**Error Messages**: Compiler errors often specifically state "local variable ... must be final or effectively final"

**JSR 335 & Lambdas**

This concept, along with **lambdas**, contributes to  Java's move toward better support for **functional programming** styles by guaranteeing safe, predictable data sharing between nested code blocks

## 5. Type Use Annotations (JEP 104)

https://openjdk.org/jeps/104

Let's delve into Java Type Use Annotations, introduced under JEP 104

**The Problem: Limited Expressiveness & Type Safety**

Before JEP 104, Java annotations could be applied primarily to declarations (methods, classes, fields, etc.)

This left gaps when expressing desired properties or expected uses of types within code

**What are Type Use Annotations?**

**Expansion of Annotations**: They extend the usage of annotations to the places where types  themselves appear:

- Class instance creation (new ArrayList<>())

- Casts ((String) obj)

- implements clauses

- throws clauses

**New Annotation Targets**:  JEP 104 defines ElementType.TYPE_USE and ElementType.TYPE_PARAMETER to support these new annotation locations

**Why This Matters**

**Improved Type Checking**:   Type use annotations let specialized external tools (like pluggable type checkers) perform finer-grained analysis of the code:

**Nullness**: Ensure variables shouldn't hold null values (@NonNull String name;)

**Mutability**: Indicate an object is guaranteed to be immutable (List<@Immutable String> data;)

**Framework Specific**: Help libraries enforce API usage correctness

**Self-Documenting Code**:  Even without external tools, these annotations enhance the readability of code by making  developer intent more explicit

**Example:[@NonNull]**

```java
// Assume @NonNull is defined with ElementType.TYPE_USE
public String formatData(@NonNull Person person) {
    if (person == null) { // Avoid mistakes (tools might even warn here)
        throw new IllegalArgumentException("Person cannot be null");
    }
    return person.getName() + " - " + person.getAddress(); 
    // Compiler/analysis tools could now rely on  person.getName() not returning null  
}
```

**Key Points**

**Tools are Crucial**: The JDK by itself does little with these annotations. It's external checkers and analysis frameworks that provide much of the power. Popular examples include the Checker Framework and IntelliJ's nullability inspections

**Design Your Own**: You can create custom type use annotations if you find recurring design patterns in your codebase that you want to enforce via analysis

**JEP 104's Significance**

While the impact on standard Java APIs was gradual, JEP 104 laid the groundwork for:

**More expressive and self-documenting code**

Stronger type safety mechanisms leveraging tools outside the compiler itself

Potential for more sophisticated code analysis to catch subtle runtime errors earlier

**SAMPLES** to illustrate how you can utilize **Java Type Use Annotations**

For these examples, we'll assume you have a tool like the Checker Framework to process and understand those annotations

**Notations**

Since there aren't standardized annotations built into Java, we'll use these hypothetical ones:

**@NonNull**: Indicates a variable or type mustn't hold a null value

**@ReadOnly**: Specifies that a collection or object won't be mutated through that reference

**Example 1: Variable Declaration**

```java
public void processName(@NonNull String name) {
   // Safe to do since name is guaranteed not null:
   String upperName = name.toUpperCase();  
}
```

**Benefit**: Type-checkers could warn if this method is called with a possibly null value

**Example 2: Collections**

```java
List<@ReadOnly String> cityList = getCities();  
cityList.add("New York"); // Type-checker would flag an error

Collection<@NonNull String> safeAddresses = getAddressList(); 
String first = safeAddresses.iterator().next(); // No null check needed 
```

**Benefit**: The annotations clarify and help enforce intent. Tools can help prevent accidental modification on the cityList and reduce checks with safeAddresses

**Example 3: Casts**

```java
Object obj = ...;
@NonNull String message = (@NonNull String) obj;  // Ensures obj is not null
```

**Benefit**: Explicit cast type ensures the type checker knows this cast should be considered "safe" if obj truly cannot be null

**Example 4: Generic Type Bounds**

```java
public <T extends @NonNull Object> void  doSomething(T value) { 
    // T guaranteed not null
}
```

**Benefit**: The bounded type parameter makes the guarantee on T explicit for users of this method

**Important Things to Consider**

**Tools**: These examples become truly powerful when supported by the Checker Framework (https://checkerframework.org/) or similar analysis tools

**Standard Libraries**: While Java itself didn't immediately ship a standardized set of type-use annotations, various libraries and projects incorporate this approach

**Community Consensus**: It takes time for a wider consensus to grow around a core set of frequently used type use annotations

## 6. Repeating Annotations (JEP 120)

https://openjdk.org/jeps/120

Let's break down Java Repeating Annotations, a useful feature introduced in Java 8 through JEP 120

**The Problem: Verbose Repetition**

**Before Java 8**, if you wanted to apply the same annotation to an element multiple times, you had to wrap it in another annotation to create a container to hold them

This led to unnecessary boilerplate code

**Example (Pre-JEP 120)**

```java
@interface Schedules { 
    Schedule[] value(); // Container annotation to hold repetitions
}

@Schedules({
    @Schedule(day = "Monday"),
    @Schedule(day = "Friday")
})
public void scheduledTask() { 
    // Task executed on Monday and Friday
}
```

**Repeating Annotations**

**Simplification**: With **JEP 120**, you can directly repeat the same annotation without awkward containers.

Here's the cleaner approach:

```java
@Schedule(day = "Monday")
@Schedule(day = "Friday")
public void scheduledTask() { } 
```

**Meta-Annotation @Repeatable**:  To declare an annotation as repeatable, you mark it with the **@Repeatable** meta-annotation:

```Java
import java.lang.annotation.Repeatable; 

@Repeatable(Schedules.class) // Specify the container annotation (see below)
@interface Schedule { 
    String day();
} 

// Invisible Container is magically created
@interface Schedules {
    Schedule[] value();
}
```

**Behind the Scenes**

**Compiler Generated Container**: When the compiler sees repeating annotations, it implicitly creates a containing annotation of the type specified in the @Repeatable declaration

**Accessing Repeated Values**: When you use reflection on the element where the annotations are used, you'll get the container annotation holding the individual values (Schedules in our example)

**Why This Matters**

**Readability**: The reduction in verbosity significantly improves code readability when you apply the same annotation with slightly different attributes multiple times

**Framework Flexibility**: Many libraries use repeating annotations to define configurations more expressively

**JEP 120's Influence**

Repeatable annotations offer a seemingly small, but crucial quality-of-life improvement for Java developers and API designers.

**Examples from Java**

**@SuppressWarnings**: Suppress multiple warning types (@SuppressWarnings({ "unchecked", "rawtypes" }) )

**Testing Libraries**: Frameworks like **JUnit 5** use repeatable annotations for custom test setups

## 7. Streams (java.util.stream) (JEP 107)

https://openjdk.org/jeps/107

**What are Streams?**

**Sequences of Elements**: Streams in Java 8 are sequences of elements taken from a data source (like a collection, array, or I/O resource). You don't directly store data in a stream

**Focus on 'What' Not 'How'**: Streams emphasize what you want to do with the data rather than the exact steps involved in manipulating the data. This leads to a declarative style of programming

**Internal Iteration**: Unlike traditional loops where you explicitly iterate over data, streams handle the iteration internally for you

**Why Use Streams?**

**Concise and Readable Code**: Streams enable creating elegant pipelines of operations, making your code less verbose and easier to understand

**Filtering, Mapping, and More**: Streams provide higher-order functions like filter, map, sorted, and others that transform data without complex loops

**Potential for Parallelism**: The parallelStream() method effortlessly unlocks parallel processing to take advantage of multi-core systems

**Laziness**: Streams generally process data lazily, meaning computations are only executed as needed, potentially improving performance

Java Enhancement Proposal 107 officially brought the idea of bulk data operations (inspired by concepts like filter/map/reduce) into the Java Collections Framework,  leading to the introduction of Streams.

**Basic Example**

Suppose you have a list of numbers and want to double the even numbers and then find their sum:

```java
import java.util.Arrays;
import java.util.List;

public class StreamExample {
    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

        int result = numbers.stream()       // Create a stream
                            .filter(n -> n % 2 == 0) // Filter even numbers
                            .map(n -> n * 2)        // Double the numbers
                            .reduce(0, Integer::sum); // Sum them up

        System.out.println(result);  // Output: 12
    }
}
```

**Key Components**

**Source**: Where the stream gets its data (e.g., numbers.stream())

**Intermediate Operations**: Transformations on the data:

**filter**: Keeps elements matching a condition

**map**: Transforms each element into something else

**sorted**: Sorts the stream

**Terminal Operation**: Triggers the stream processing by producing a result:

**reduce**: Combines elements of the stream (example: sum, maximum, etc.)

**forEach**: Performs an action on each element

**collect**: Collects elements into a container like a list

Let's consider a **more advance sample** to illustrate the power of Java Streams:

**Scenario: Text Analysis**

Suppose you have a file containing customer reviews on a product. You want to perform the following:

Calculate the frequency of each word in the reviews.

Find the most frequently used words, excluding common "stop words."

Calculate the average sentiment score of reviews (assume you have a helper function calculateSentiment(String review) that returns a score between -1.0 and 1.0)

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

public class TextAnalysis {
    private static final List<String> STOP_WORDS = Arrays.asList("a", "the", "and", "of", "is", "to", "in");

    public static void main(String[] args) throws IOException {
        String filePath = "reviews.txt";

        Files.lines(Paths.get(filePath))
             .flatMap(line -> Arrays.stream(line.toLowerCase().split("\\s+"))) // Tokenize into words
             .filter(word -> !STOP_WORDS.contains(word)) // Remove stop words
             .collect(Collectors.groupingBy(Function.identity(), Collectors.counting())) // Word frequencies
             .entrySet().stream()
             .sorted(Map.Entry.<String, Long>comparingByValue().reversed()) // Sort by frequency (descending)
             .limit(10)
             .forEach(entry -> System.out.println(entry.getKey() + ": " + entry.getValue())); 

        // Average sentiment
        double avgSentiment = Files.lines(Paths.get(filePath))
                                   .mapToDouble(TextAnalysis::calculateSentiment)
                                   .average()
                                   .getAsDouble();
        System.out.println("Average Sentiment Score: " + avgSentiment);
    }

    private static double calculateSentiment(String review) {
        // ... Logic to analyze sentiment (for demonstration)
        return Math.random(); // Replace with actual sentiment analysis
    }
}
```

**Explanation**

**Flattening and Tokenizing**: flatMap transforms the stream of lines into a stream of individual words

**Filtering Stop Words**: filter eliminates common words

**Word Counting**: collect with groupingBy and counting creates a map with word frequencies

**Sorting and Top 10**: The resulting stream of map entries is sorted in reverse order based on word count, limited to the top 10, and finally printed

**Sentiment Analysis**: An average sentiment score across all reviews is calculated

**Key Points**

**Stream Chaining**: Multiple stream operations link together, expressing the analysis compactly

**Collectors**: groupingBy and counting are handy collectors for aggregation

**Custom Functions**: The calculateSentiment function (even though stubbed out here) illustrates integration of external logic

## 8. Lambda APIs (java.util.function) (JEP 109)

https://openjdk.org/jeps/109

**What are Lambda Expressions?**

**Concise Functions**: Lambda expressions provide a compact and elegant way to define small, anonymous functions. These functions are not tied to a specific class or method name

**Behavior as Data**:  Lambdas promote the idea of passing behavior as arguments to methods, enabling better code reusability and functional-style patterns

The '**->**' Syntax: A lambda expression typically looks like this:

```java
(parameters) -> { body }
```

**(parameters)**: A comma-separated list of parameters (just like a method)

**->**: The lambda operator (an arrow)

**{ body }**: The code to be executed, can be a single expression or a block of statements

**Functional Interfaces (java.util.function)**

**Interfaces with a Single Abstract Method (SAM)**: Functional interfaces are special interfaces declaring only one abstract method. They are the targets for lambda expressions.

**Common Functional Interfaces**: Java 8's java.util.function package includes many useful functional interfaces:

**Predicate<T>**: Takes one argument (type T) and returns a boolean (used for filtering)

**Consumer<T>**: Takes one argument (type T) and doesn't return anything (used for performing actions)

**Function<T, R>**: Takes one argument (type T) and returns a value (type R) (used for transformations)

**Supplier<T>**: Doesn't take any arguments, but returns a value (type T) (used as a source of values)

**Example**

**Old way (without lambdas):**

```java
Comparator<String> lengthComparator = new Comparator<String>() {
    @Override
    public int compare(String s1, String s2) {
        return Integer.compare(s1.length(), s2.length());
    }
};
Arrays.sort(strings, lengthComparator);
```

**Using lambdas (Java 8 way)**:

```java
Arrays.sort(strings, (s1, s2) -> Integer.compare(s1.length(), s2.length()));
```

**Benefits of Lambda Expressions**

**Less Code**: Lambdas replace bulky anonymous inner classes with concise syntax

**Readable**: Their clarity helps make code more self-explanatory, especially with higher-order functions in Streams

**Treat Functions as Data**: Passing lambdas as arguments empowers flexible patterns and techniques

**Important Notes**

**Type Inference**: The compiler can often determine the types of lambda parameters, so you can omit them for brevity

**Method References**: Using the :: operator, you can create short-hand lambda expressions by referencing existing methods (e.g., String::toLowerCase)

Let's look at simple examples for Predicate, Consumer, Function, and Supplier from Java 8's Lambda APIs:

1. Predicate<T>

Purpose: Tests a condition on a value of type T, returning true or false.
Sample:
Java
Predicate<Integer> isEven = number -> number % 2 == 0;

System.out.println(isEven.test(4));   // Output: true
System.out.println(isEven.test(7));   // Output: false
Usa el código con precaución.

**Consumer<T>**: Performs an action on an object of type T, doesn't return anything

Sample:
Java
Consumer<String> printer = text -> System.out.println(text);

printer.accept("Hello, Lambda!");  // Output: Hello, Lambda!
Usa el código con precaución.

**Function<T, R>**: Transforms a value of type T into a value of (potentially different) type R.

**Sample**:

```java
Function<String, Integer> lengthFinder = str -> str.length(); 

System.out.println(lengthFinder.apply("World")); // Output: 5 
```

**Supplier<T>**: Generates a value of type T. Takes no arguments

**Sample**:

```java
Supplier<Double> randomValue = () -> Math.random();

System.out.println(randomValue.get());  // Output: A random double value (e.g. 0.231231)
```

**Common Use Cases**

**Streams**: Used extensively with Streams operations - filter takes a Predicate, forEach takes a Consumer, map takes a Function

**Higher-order Functions**: You can create methods in your own classes that accept these functional interfaces as arguments

**Notes**

These examples demonstrate the basic patterns. These interfaces come in handy when working with Java 8 additions like Streams and Optional

There are many more specialized variants of these in java.util.function (e.g., BiConsumer, DoubleFunction, etc.) if you need them

## 9. Date Time (java.time) (JSR 310, JEP 150)

https://jcp.org/en/jsr/detail?id=310, https://openjdk.org/jeps/150
