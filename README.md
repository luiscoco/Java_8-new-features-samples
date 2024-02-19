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
