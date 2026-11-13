# Programming in Java (25CSE0202) - Backend Module

This backend is built strictly adhering to the **Programming in Java** syllabus of Chitkara University.

## Concept Mapping to Syllabus
1. **Core OOP & Inheritance (CLO01 & Unit 1)**:
   - `Account` abstract base class with encapsulation and private attributes.
   - `SavingsAccount` & `CurrentAccount` subclasses showcasing inheritance and method overriding.
   - Polymorphic handling of withdrawals (Savings enforces ₹1,000 minimum balance; Current allows ₹25,000 overdraft).
2. **Exception Handling (CLO01 / Unit 1)**:
   - Custom checked exception hierarchy: `BankingException`, `InsufficientBalanceException`, `AccountNotFoundException`, `InvalidAmountException`.
   - Propagated using `throw` and handled using `try-catch-finally`.
3. **Collections Framework (CLO02 / Unit 2)**:
   - `ConcurrentHashMap<String, Account>` for $O(1)$ fast account search by ID.
   - `ArrayList<Account>` and `List<Transaction>` for traversal and storage.
4. **Multithreading & Synchronization (CLO03 / Unit 3)**:
   - `synchronized` methods on `Account` for deposits and withdrawals to prevent race conditions.
   - Atomic inter-account fund transfer with deterministic dual-lock ordering to prevent deadlocks.
5. **Stream API & Lambdas (CLO04 / Unit 5)**:
   - Transaction filtering by type and amount using `.filter(...)`.
   - Dynamic sorting using `Comparator` with method references.
   - Financial summaries and analytics using `mapToDouble(...)`, `summaryStatistics()`, and `collect(Collectors.toList())`.
6. **File I/O (CLO04 / Unit 5)**:
   - `FileExporter` utilizes `try-with-resources`, `BufferedWriter`, and `FileWriter` to generate CSV and formatted text account statements into the `exports/` folder.
7. **REST Server**:
   - Zero external dependency HTTP server powered by JDK's built-in `com.sun.net.httpserver.HttpServer` on port `8080`.
8. **Interactive CLI**:
   - Menu-driven console interface for live viva walkthroughs.

## How to Run
Double-click `compile_and_run.bat` or execute in your terminal:
```bash
cd backend
javac -d bin src/com/bank/model/*.java src/com/bank/exception/*.java src/com/bank/repository/*.java src/com/bank/service/*.java src/com/bank/util/*.java src/com/bank/server/*.java src/com/bank/cli/*.java src/com/bank/*.java
java -cp bin com.bank.BankingApplication
```

