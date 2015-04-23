var CoolToJS;
(function (CoolToJS) {
    var CoolProgramSources;
    (function (CoolProgramSources) {
        CoolProgramSources.Atoi = '(*\r\n   The class A2I provides integer-to-string and string-to-integer\r\nconversion routines.  To use these routines, either inherit them\r\nin the class where needed, have a dummy variable bound to\r\nsomething of type A2I, or simpl write (new A2I).method(argument).\r\n*)\r\n\r\n\r\n(*\r\n   c2i   Converts a 1-character string to an integer.  Aborts\r\n         if the string is not \"0\" through \"9\"\r\n*)\r\nclass A2I {\r\n\r\n     c2i(char : String) : Int {\r\n\tif char = \"0\" then 0 else\r\n\tif char = \"1\" then 1 else\r\n\tif char = \"2\" then 2 else\r\n        if char = \"3\" then 3 else\r\n        if char = \"4\" then 4 else\r\n        if char = \"5\" then 5 else\r\n        if char = \"6\" then 6 else\r\n        if char = \"7\" then 7 else\r\n        if char = \"8\" then 8 else\r\n        if char = \"9\" then 9 else\r\n        { abort(); 0; }  -- the 0 is needed to satisfy the typchecker\r\n        fi fi fi fi fi fi fi fi fi fi\r\n     };\r\n\r\n(*\r\n   i2c is the inverse of c2i.\r\n*)\r\n     i2c(i : Int) : String {\r\n\tif i = 0 then \"0\" else\r\n\tif i = 1 then \"1\" else\r\n\tif i = 2 then \"2\" else\r\n\tif i = 3 then \"3\" else\r\n\tif i = 4 then \"4\" else\r\n\tif i = 5 then \"5\" else\r\n\tif i = 6 then \"6\" else\r\n\tif i = 7 then \"7\" else\r\n\tif i = 8 then \"8\" else\r\n\tif i = 9 then \"9\" else\r\n\t{ abort(); \"\"; }  -- the \"\" is needed to satisfy the typchecker\r\n        fi fi fi fi fi fi fi fi fi fi\r\n     };\r\n\r\n(*\r\n   a2i converts an ASCII string into an integer.  The empty string\r\nis converted to 0.  Signed and unsigned strings are handled.  The\r\nmethod aborts if the string does not represent an integer.  Very\r\nlong strings of digits produce strange answers because of arithmetic \r\noverflow.\r\n\r\n*)\r\n     a2i(s : String) : Int {\r\n        if s.length() = 0 then 0 else\r\n\tif s.substr(0,1) = \"-\" then ~a2i_aux(s.substr(1,s.length()-1)) else\r\n        if s.substr(0,1) = \"+\" then a2i_aux(s.substr(1,s.length()-1)) else\r\n           a2i_aux(s)\r\n        fi fi fi\r\n     };\r\n\r\n(*\r\n  a2i_aux converts the usigned portion of the string.  As a programming\r\nexample, this method is written iteratively.\r\n*)\r\n     a2i_aux(s : String) : Int {\r\n\t(let int : Int <- 0 in\t\r\n           {\t\r\n               (let j : Int <- s.length() in\r\n\t          (let i : Int <- 0 in\r\n\t\t    while i < j loop\r\n\t\t\t{\r\n\t\t\t    int <- int * 10 + c2i(s.substr(i,1));\r\n\t\t\t    i <- i + 1;\r\n\t\t\t}\r\n\t\t    pool\r\n\t\t  )\r\n\t       );\r\n              int;\r\n\t    }\r\n        )\r\n     };\r\n\r\n(*\r\n    i2a converts an integer to a string.  Positive and negative \r\nnumbers are handled correctly.  \r\n*)\r\n    i2a(i : Int) : String {\r\n\tif i = 0 then \"0\" else \r\n        if 0 < i then i2a_aux(i) else\r\n          \"-\".concat(i2a_aux(i * ~1)) \r\n        fi fi\r\n    };\r\n\t\r\n(*\r\n    i2a_aux is an example using recursion.\r\n*)\t\t\r\n    i2a_aux(i : Int) : String {\r\n        if i = 0 then \"\" else \r\n\t    (let next : Int <- i \/ 10 in\r\n\t\ti2a_aux(next).concat(i2c(i - next * 10))\r\n\t    )\r\n        fi\r\n    };\r\n\r\n};';
        CoolProgramSources.Arith = '(*\n * A contribution from Anne Sheets (sheets@cory)\n *\n * Tests the arithmetic operations and various other things\n *)\n\nclass A {\n\n var : Int <- 0;\n\n value() : Int { var };\n\n set_var(num : Int) : SELF_TYPE {\n {\n var <- num;\n self;\n }\n };\n\n method1(num : Int) : SELF_TYPE { -- same\n self\n };\n\n method2(num1 : Int, num2 : Int) : B { -- plus\n (let x : Int in\n\t {\n x <- num1 + num2;\n\t (new B).set_var(x);\n\t }\n )\n };\n\n method3(num : Int) : C { -- negate\n (let x : Int in\n\t {\n x <- ~num;\n\t (new C).set_var(x);\n\t }\n )\n };\n\n method4(num1 : Int, num2 : Int) : D { -- diff\n if num2 < num1 then\n (let x : Int in\n\t\t {\n x <- num1 - num2;\n\t (new D).set_var(x);\n\t }\n )\n else\n (let x : Int in\n\t\t {\n\t x <- num2 - num1;\n\t (new D).set_var(x);\n\t\t }\n )\n fi\n };\n\n method5(num : Int) : E { -- factorial\n (let x : Int <- 1 in\n\t {\n\t (let y : Int <- 1 in\n\t while y <= num loop\n\t {\n x <- x * y;\n\t y <- y + 1;\n\t }\n\t pool\n\t );\n\t (new E).set_var(x);\n\t }\n )\n };\n\n};\n\nclass B inherits A { -- B is a number squared\n\n method5(num : Int) : E { -- square\n (let x : Int in\n\t {\n x <- num * num;\n\t (new E).set_var(x);\n\t }\n )\n };\n\n};\n\nclass C inherits B {\n\n method6(num : Int) : A { -- negate\n (let x : Int in\n {\n x <- ~num;\n\t (new A).set_var(x);\n }\n )\n };\n\n method5(num : Int) : E { -- cube\n (let x : Int in\n\t {\n x <- num * num * num;\n\t (new E).set_var(x);\n\t }\n )\n };\n\n};\n\nclass D inherits B { \n\t\t\n method7(num : Int) : Bool { -- divisible by 3\n (let x : Int <- num in\n if x < 0 then method7(~x) else\n if 0 = x then true else\n if 1 = x then false else\n\t if 2 = x then false else\n\t method7(x - 3)\n\t fi fi fi fi\n )\n };\n\n};\n\nclass E inherits D {\n\n method6(num : Int) : A { -- division\n (let x : Int in\n {\n x <- num / 8;\n\t (new A).set_var(x);\n }\n )\n };\n\n};\n\n(* The following code is from atoi.cl in ~cs164/examples *)\n\n(*\n The class A2I provides integer-to-string and string-to-integer\nconversion routines. To use these routines, either inherit them\nin the class where needed, have a dummy variable bound to\nsomething of type A2I, or simpl write (new A2I).method(argument).\n*)\n\n\n(*\n c2i Converts a 1-character string to an integer. Aborts\n if the string is not \"0\" through \"9\"\n*)\nclass A2I {\n\n c2i(char : String) : Int {\n\tif char = \"0\" then 0 else\n\tif char = \"1\" then 1 else\n\tif char = \"2\" then 2 else\n if char = \"3\" then 3 else\n if char = \"4\" then 4 else\n if char = \"5\" then 5 else\n if char = \"6\" then 6 else\n if char = \"7\" then 7 else\n if char = \"8\" then 8 else\n if char = \"9\" then 9 else\n { abort(); 0; } (* the 0 is needed to satisfy the\n\t\t\t\t typchecker *)\n fi fi fi fi fi fi fi fi fi fi\n };\n\n(*\n i2c is the inverse of c2i.\n*)\n i2c(i : Int) : String {\n\tif i = 0 then \"0\" else\n\tif i = 1 then \"1\" else\n\tif i = 2 then \"2\" else\n\tif i = 3 then \"3\" else\n\tif i = 4 then \"4\" else\n\tif i = 5 then \"5\" else\n\tif i = 6 then \"6\" else\n\tif i = 7 then \"7\" else\n\tif i = 8 then \"8\" else\n\tif i = 9 then \"9\" else\n\t{ abort(); \"\"; } -- the \"\" is needed to satisfy the typchecker\n fi fi fi fi fi fi fi fi fi fi\n };\n\n(*\n a2i converts an ASCII string into an integer. The empty string\nis converted to 0. Signed and unsigned strings are handled. The\nmethod aborts if the string does not represent an integer. Very\nlong strings of digits produce strange answers because of arithmetic \noverflow.\n\n*)\n a2i(s : String) : Int {\n if s.length() = 0 then 0 else\n\tif s.substr(0,1) = \"-\" then ~a2i_aux(s.substr(1,s.length()-1)) else\n if s.substr(0,1) = \"+\" then a2i_aux(s.substr(1,s.length()-1)) else\n a2i_aux(s)\n fi fi fi\n };\n\n(* a2i_aux converts the usigned portion of the string. As a\n programming example, this method is written iteratively. *)\n\n\n a2i_aux(s : String) : Int {\n\t(let int : Int <- 0 in\t\n {\t\n (let j : Int <- s.length() in\n\t (let i : Int <- 0 in\n\t\t while i < j loop\n\t\t\t{\n\t\t\t int <- int * 10 + c2i(s.substr(i,1));\n\t\t\t i <- i + 1;\n\t\t\t}\n\t\t pool\n\t\t )\n\t );\n int;\n\t }\n )\n };\n\n(* i2a converts an integer to a string. Positive and negative \n numbers are handled correctly. *)\n\n i2a(i : Int) : String {\n\tif i = 0 then \"0\" else \n if 0 < i then i2a_aux(i) else\n \"-\".concat(i2a_aux(i * ~1)) \n fi fi\n };\n\t\n(* i2a_aux is an example using recursion. *)\t\t\n\n i2a_aux(i : Int) : String {\n if i = 0 then \"\" else \n\t (let next : Int <- i / 10 in\n\t\ti2a_aux(next).concat(i2c(i - next * 10))\n\t )\n fi\n };\n\n};\n\nclass Main inherits IO {\n \n char : String;\n avar : A; \n a_var : A;\n flag : Bool <- true;\n\n\n menu() : String {\n {\n out_string(\"\\n\\tTo add a number to \");\n print(avar);\n out_string(\"...enter a:\\n\");\n out_string(\"\\tTo negate \");\n print(avar);\n out_string(\"...enter b:\\n\");\n out_string(\"\\tTo find the difference between \");\n print(avar);\n out_string(\"and another number...enter c:\\n\");\n out_string(\"\\tTo find the factorial of \");\n print(avar);\n out_string(\"...enter d:\\n\");\n out_string(\"\\tTo square \");\n print(avar);\n out_string(\"...enter e:\\n\");\n out_string(\"\\tTo cube \");\n print(avar);\n out_string(\"...enter f:\\n\");\n out_string(\"\\tTo find out if \");\n print(avar);\n out_string(\"is a multiple of 3...enter g:\\n\");\n out_string(\"\\tTo divide \");\n print(avar);\n out_string(\"by 8...enter h:\\n\");\n\t out_string(\"\\tTo get a new number...enter j:\\n\");\n\t out_string(\"\\tTo quit...enter q:\\n\\n\");\n in_string();\n }\n };\n\n prompt() : String {\n {\n out_string(\"\\n\");\n out_string(\"Please enter a number... \");\n in_string();\n }\n };\n\n get_int() : Int {\n {\n\t (let z : A2I <- new A2I in\n\t (let s : String <- prompt() in\n\t z.a2i(s)\n\t )\n );\n }\n };\n\n is_even(num : Int) : Bool {\n (let x : Int <- num in\n if x < 0 then is_even(~x) else\n if 0 = x then true else\n\t if 1 = x then false else\n\t is_even(x - 2)\n\t fi fi fi\n )\n };\n\n class_type(var : A) : SELF_TYPE {\n case var of\n\t a : A => out_string(\"Class type is now A\\n\");\n\t b : B => out_string(\"Class type is now B\\n\");\n\t c : C => out_string(\"Class type is now C\\n\");\n\t d : D => out_string(\"Class type is now D\\n\");\n\t e : E => out_string(\"Class type is now E\\n\");\n\t o : Object => out_string(\"Oooops\\n\");\n esac\n };\n \n print(var : A) : SELF_TYPE {\n (let z : A2I <- new A2I in\n\t{\n\t out_string(z.i2a(var.value()));\n\t out_string(\" \");\n\t}\n )\n };\n\n main() : Object {\n {\n avar <- (new A);\n while flag loop\n {\n\t -- avar <- (new A).set_var(get_int());\n\t out_string(\"number \");\n\t print(avar);\n\t if is_even(avar.value()) then\n\t out_string(\"is even!\\n\")\n\t else\n\t out_string(\"is odd!\\n\")\n\t fi;\n\t -- print(avar); -- prints out answer\n\t class_type(avar);\n\t char <- menu();\n if char = \"a\" then -- add\n {\n a_var <- (new A).set_var(get_int());\n\t avar <- (new B).method2(avar.value(), a_var.value());\n\t } else\n if char = \"b\" then -- negate\n case avar of\n\t c : C => avar <- c.method6(c.value());\n\t a : A => avar <- a.method3(a.value());\n\t o : Object => {\n\t\t out_string(\"Oooops\\n\");\n\t\t abort(); 0;\n\t\t };\n esac else\n if char = \"c\" then -- diff\n {\n a_var <- (new A).set_var(get_int());\n\t avar <- (new D).method4(avar.value(), a_var.value());\n\t } else\n if char = \"d\" then avar <- (new C)@A.method5(avar.value()) else\n\t\t -- factorial\n if char = \"e\" then avar <- (new C)@B.method5(avar.value()) else\n\t\t\t -- square\n if char = \"f\" then avar <- (new C)@C.method5(avar.value()) else\n\t\t\t -- cube\n if char = \"g\" then -- multiple of 3?\n\t\t if ((new D).method7(avar.value()))\n\t\t then -- avar <- (new A).method1(avar.value())\n\t\t\t {\n\t out_string(\"number \");\n\t print(avar);\n\t out_string(\"is divisible by 3.\\n\");\n\t\t\t }\n\t\t\t else -- avar <- (new A).set_var(0)\n\t\t\t {\n\t out_string(\"number \");\n\t print(avar);\n\t out_string(\"is not divisible by 3.\\n\");\n\t\t\t }\n\t\t fi else\n if char = \"h\" then \n\t\t (let x : A in\n\t\t\t {\n\t\t x <- (new E).method6(avar.value());\n\t\t\t (let r : Int <- (avar.value() - (x.value() * 8)) in\n\t\t\t {\n\t\t\t out_string(\"number \");\n\t\t\t print(avar);\n\t\t\t out_string(\"is equal to \");\n\t\t\t print(x);\n\t\t\t out_string(\"times 8 with a remainder of \");\n\t\t\t\t (let a : A2I <- new A2I in\n\t\t\t\t {\n\t\t\t out_string(a.i2a(r));\n\t\t\t out_string(\"\\n\");\n\t\t\t\t }\n\t\t\t\t ); -- end let a:\n\t\t\t }\n ); -- end let r:\n\t\t\t avar <- x;\n\t\t } \n\t\t ) -- end let x:\n\t\t else\n if char = \"j\" then avar <- (new A)\n\t\t else\n if char = \"q\" then flag <- false\n\t\t else\n avar <- (new A).method1(avar.value()) -- divide/8\n fi fi fi fi fi fi fi fi fi fi;\n }\n pool;\n }\n };\n\n};\n';
        CoolProgramSources.BookList = '-- example of static and dynamic type differing for a dispatch\n\nClass Book inherits IO {\n title : String;\n author : String;\n\n initBook(title_p : String, author_p : String) : Book {\n {\n title <- title_p;\n author <- author_p;\n self;\n }\n };\n\n print() : Book {\n {\n out_string(\"title: \").out_string(title).out_string(\"\\n\");\n out_string(\"author: \").out_string(author).out_string(\"\\n\");\n self;\n }\n };\n};\n\nClass Article inherits Book {\n per_title : String;\n\n initArticle(title_p : String, author_p : String,\n\t\tper_title_p : String) : Article {\n {\n initBook(title_p, author_p);\n per_title <- per_title_p;\n self;\n }\n };\n\n print() : Book {\n {\n\t self@Book.print();\n out_string(\"periodical: \").out_string(per_title).out_string(\"\\n\");\n self;\n }\n };\n};\n\nClass BookList inherits IO { \n (* Since abort \"returns\" type Object, we have to add\n an expression of type Bool here to satisfy the typechecker.\n This code is unreachable, since abort() halts the program.\n *)\n isNil() : Bool { { abort(); true; } };\n \n cons(hd : Book) : Cons {\n (let new_cell : Cons <- new Cons in\n new_cell.init(hd,self)\n )\n };\n\n (* Since abort \"returns\" type Object, we have to add\n an expression of type Book here to satisfy the typechecker.\n This code is unreachable, since abort() halts the program.\n *)\n car() : Book { { abort(); new Book; } };\n \n (* Since abort \"returns\" type Object, we have to add\n an expression of type BookList here to satisfy the typechecker.\n This code is unreachable, since abort() halts the program.\n *)\n cdr() : BookList { { abort(); new BookList; } };\n \n print_list() : Object { abort() };\n};\n\nClass Cons inherits BookList {\n xcar : Book; -- We keep the car and cdr in attributes.\n xcdr : BookList; -- Because methods and features must have different names,\n -- we use xcar and xcdr for the attributes and reserve\n -- car and cdr for the features.\n \n isNil() : Bool { false };\n \n init(hd : Book, tl : BookList) : Cons {\n {\n xcar <- hd;\n xcdr <- tl;\n self;\n }\n };\n\n car() : Book { xcar };\n\n cdr() : BookList { xcdr };\n \n print_list() : Object {\n {\n case xcar.print() of\n dummy : Book => out_string(\"- dynamic type was Book -\\n\");\n dummy : Article => out_string(\"- dynamic type was Article -\\n\");\n esac;\n xcdr.print_list();\n }\n };\n};\n\nClass Nil inherits BookList {\n isNil() : Bool { true };\n\n print_list() : Object { true };\n};\n\n\nClass Main {\n\n books : BookList;\n\n main() : Object {\n (let a_book : Book <-\n (new Book).initBook(\"Compilers, Principles, Techniques, and Tools\",\n \"Aho, Sethi, and Ullman\")\n in\n (let an_article : Article <-\n (new Article).initArticle(\"The Top 100 CD_ROMs\",\n \"Ulanoff\",\n \"PC Magazine\")\n in\n {\n books <- (new Nil).cons(a_book).cons(an_article);\n books.print_list();\n }\n ) -- end let an_article\n ) -- end let a_book\n };\n};\n';
        CoolProgramSources.Complex = 'class Main inherits IO {\n main() : SELF_TYPE {\n\t(let c : Complex <- (new Complex).init(1, 1) in\n\t if c.reflect_X().reflect_Y() = c.reflect_0()\n\t then out_string(\"=)\\n\")\n\t else out_string(\"=(\\n\")\n\t fi\n\t)\n };\n};\n\nclass Complex inherits IO {\n x : Int;\n y : Int;\n\n init(a : Int, b : Int) : Complex {\n\t{\n\t x = a;\n\t y = b;\n\t self;\n\t}\n };\n\n print() : Object {\n\tif y = 0\n\tthen out_int(x)\n\telse out_int(x).out_string(\"+\").out_int(y).out_string(\"I\")\n\tfi\n };\n\n reflect_0() : Complex {\n\t{\n\t x = ~x;\n\t y = ~y;\n\t self;\n\t}\n };\n\n reflect_X() : Complex {\n\t{\n\t y = ~y;\n\t self;\n\t}\n };\n\n reflect_Y() : Complex {\n\t{\n\t x = ~x;\n\t self;\n\t}\n };\n};\n';
        CoolProgramSources.Cells = '(* models one-dimensional cellular automaton on a circle of finite radius\n arrays are faked as Strings,\n X\'s respresent live cells, dots represent dead cells, \n no error checking is done *)\nclass CellularAutomaton inherits IO {\n population_map : String; \n \n init(map : String) : SELF_TYPE {\n {\n population_map < - map; \n self; \n } \n }; \n \n print() : SELF_TYPE {\n {\n out_string(population_map.concat(\"\\n\"));\n self;\n }\n };\n \n num_cells() : Int {\n population_map.length()\n };\n \n cell(position : Int) : String {\n population_map.substr(position, 1)\n };\n \n cell_left_neighbor(position : Int) : String {\n if position = 0 then\n cell(num_cells() - 1)\n else\n cell(position - 1)\n fi\n };\n \n cell_right_neighbor(position : Int) : String {\n if position = num_cells() - 1 then\n cell(0)\n else\n cell(position + 1)\n fi\n };\n \n (* a cell will live if exactly 1 of itself and it\'s immediate\n neighbors are alive *)\n cell_at_next_evolution(position : Int) : String {\n if (if cell(position) = \"X\" then 1 else 0 fi\n + if cell_left_neighbor(position) = \"X\" then 1 else 0 fi\n + if cell_right_neighbor(position) = \"X\" then 1 else 0 fi\n = 1)\n then\n \"X\"\n else\n \".\"\n fi\n };\n \n evolve() : SELF_TYPE {\n (let position : Int in\n (let num : Int <- num_cells() in\n (let temp : String in\n {\n while position < num loop\n {\n temp <- temp.concat(cell_at_next_evolution(position));\n position <- position + 1;\n }\n pool;\n population_map <- temp;\n self;\n }\n ) ) )\n };\n};\n\nclass Main {\n cells : CellularAutomaton;\n \n main() : SELF_TYPE {\n {\n cells <- (new CellularAutomaton).init(\" X \");\n cells.print();\n (let countdown : Int <- 20 in\n while 0 < countdown loop\n {\n cells.evolve();\n cells.print();\n countdown <- countdown - 1;\n }\n pool\n );\n self;\n }\n };\n};\n';
        CoolProgramSources.HelloWorld = 'class Main inherits IO {\r\n\tmain() : Object {\r\n\t\tout_string(\"Hello, world.\\n\")\r\n\t};\r\n};';
        CoolProgramSources.HelloWorld2 = 'class Main inherits IO {\r\n    main(): Object {\r\n        let hello: String <- \"Hello, \",\r\n            name: String <- \"\",\r\n            ending: String <- \"!\\n\"\r\n        in {\r\n            out_string(\"Please enter your name:\\n\");\r\n            name <- in_string();\r\n            out_string(hello.concat(name.concat(ending)));\r\n        }\r\n    };\r\n};\r\n';
        CoolProgramSources.List = '(*\r\n *  This file shows how to implement a list data type for lists of integers.\r\n *  It makes use of INHERITANCE and DYNAMIC DISPATCH.\r\n *\r\n *  The List class has 4 operations defined on List objects. If \'l\' is\r\n *  a list, then the methods dispatched on \'l\' have the following effects:\r\n *\r\n *    isNil() : Bool\t\tReturns true if \'l\' is empty, false otherwise.\r\n *    head()  : Int\t\tReturns the integer at the head of \'l\'.\r\n *\t\t\t\tIf \'l\' is empty, execution aborts.\r\n *    tail()  : List\t\tReturns the remainder of the \'l\',\r\n *\t\t\t\ti.e. without the first element.\r\n *    cons(i : Int) : List\tReturn a new list containing i as the\r\n *\t\t\t\tfirst element, followed by the\r\n *\t\t\t\telements in \'l\'.\r\n *\r\n *  There are 2 kinds of lists, the empty list and a non-empty\r\n *  list. We can think of the non-empty list as a specialization of\r\n *  the empty list.\r\n *  The class List defines the operations on empty list. The class\r\n *  Cons inherits from List and redefines things to handle non-empty\r\n *  lists.\r\n *)\r\n\r\n\r\nclass List {\r\n   -- Define operations on empty lists.\r\n\r\n   isNil() : Bool { true };\r\n\r\n   -- Since abort() has return type Object and head() has return type\r\n   -- Int, we need to have an Int as the result of the method body,\r\n   -- even though abort() never returns.\r\n\r\n   head()  : Int { { abort(); 0; } };\r\n\r\n   -- As for head(), the self is just to make sure the return type of\r\n   -- tail() is correct.\r\n\r\n   tail()  : List { { abort(); self; } };\r\n\r\n   -- When we cons and element onto the empty list we get a non-empty\r\n   -- list. The (new Cons) expression creates a new list cell of class\r\n   -- Cons, which is initialized by a dispatch to init().\r\n   -- The result of init() is an element of class Cons, but it\r\n   -- conforms to the return type List, because Cons is a subclass of\r\n   -- List.\r\n\r\n   cons(i : Int) : List {\r\n      (new Cons).init(i, self)\r\n   };\r\n\r\n};\r\n\r\n\r\n(*\r\n *  Cons inherits all operations from List. We can reuse only the cons\r\n *  method though, because adding an element to the front of an emtpy\r\n *  list is the same as adding it to the front of a non empty\r\n *  list. All other methods have to be redefined, since the behaviour\r\n *  for them is different from the empty list.\r\n *\r\n *  Cons needs two attributes to hold the integer of this list\r\n *  cell and to hold the rest of the list.\r\n *\r\n *  The init() method is used by the cons() method to initialize the\r\n *  cell.\r\n *)\r\n\r\nclass Cons inherits List {\r\n\r\n   car : Int;\t-- The element in this list cell\r\n\r\n   cdr : List;\t-- The rest of the list\r\n\r\n   isNil() : Bool { false };\r\n\r\n   head()  : Int { car };\r\n\r\n   tail()  : List { cdr };\r\n\r\n   init(i : Int, rest : List) : List {\r\n      {\r\n\t car <- i;\r\n\t cdr <- rest;\r\n\t self;\r\n      }\r\n   };\r\n\r\n};\r\n\r\n\r\n\r\n(*\r\n *  The Main class shows how to use the List class. It creates a small\r\n *  list and then repeatedly prints out its elements and takes off the\r\n *  first element of the list.\r\n *)\r\n\r\nclass Main inherits IO {\r\n\r\n   mylist : List;\r\n\r\n   -- Print all elements of the list. Calls itself recursively with\r\n   -- the tail of the list, until the end of the list is reached.\r\n\r\n   print_list(l : List) : Object {\r\n      if l.isNil() then out_string(\"\\n\")\r\n                   else {\r\n\t\t\t   out_int(l.head());\r\n\t\t\t   out_string(\" \");\r\n\t\t\t   print_list(l.tail());\r\n\t\t        }\r\n      fi\r\n   };\r\n\r\n   -- Note how the dynamic dispatch mechanism is responsible to end\r\n   -- the while loop. As long as mylist is bound to an object of \r\n   -- dynamic type Cons, the dispatch to isNil calls the isNil method of\r\n   -- the Cons class, which returns false. However when we reach the\r\n   -- end of the list, mylist gets bound to the object that was\r\n   -- created by the (new List) expression. This object is of dynamic type\r\n   -- List, and thus the method isNil in the List class is called and\r\n   -- returns true.\r\n\r\n   main() : Object {\r\n      {\r\n\t mylist <- new List.cons(1).cons(2).cons(3).cons(4).cons(5);\r\n\t while (not mylist.isNil()) loop\r\n\t    {\r\n\t       print_list(mylist);\r\n\t       mylist <- mylist.tail();\r\n\t    }\r\n\t pool;\r\n      }\r\n   };\r\n\r\n};';
        CoolProgramSources.Cool = 'class Main inherits IO {\n main() : SELF_TYPE {\n {\n out_string((new Object).type_name().substr(4,1)).\n out_string((isvoid self).type_name().substr(1,3));\n out_string(\"\\n\");\n }\n };\n};\n';
        CoolProgramSources.Graph = '(*\n * Cool program reading descriptions of weighted directed graphs\n * from stdin. It builds up a graph objects with a list of vertices\n * and a list of edges. Every vertice has a list of outgoing edges.\n *\n * INPUT FORMAT\n * Every line has the form\t\tvertice successor*\n * Where vertice is an int, and successor is vertice,weight\n *\n * An empty line or EOF terminates the input.\n *\n * The list of vertices and the edge list is printed out by the Main\n * class. \n *\n * TEST\n * Once compiled, the file g1.graph can be fed to the program.\n * The output should look like this:\n\nnautilus.CS.Berkeley.EDU 53# spim -file graph.s <g1.graph \nSPIM Version 5.4 of Jan. 17, 1994\nCopyright 1990-1994 by James R. Larus (larus@cs.wisc.edu).\nAll Rights Reserved.\nSee the file README a full copyright notice.\nLoaded: /home/n/cs164/lib/trap.handler\n5 (5,5)5 (5,4)4 (5,3)3 (5,2)2 (5,1)1\n4 (4,5)100 (4,3)55\n3 (3,2)10\n2 (2,1)150 (2,3)200\n1 (1,2)100\n\n (5,5)5 (5,4)4 (5,3)3 (5,2)2 (5,1)1 (4,5)100 (4,3)55 (3,2)10 (2,1)150 (2,3)200 (1,2)100\nCOOL program successfully executed\n\n *)\n\n\n\nclass Graph {\n\n vertices : VList <- new VList;\n edges : EList <- new EList;\n\n add_vertice(v : Vertice) : Object { {\n edges <- v.outgoing().append(edges);\n vertices <- vertices.cons(v);\n } };\n\n print_E() : Object { edges.print() };\n print_V() : Object { vertices.print() };\n\n};\n\nclass Vertice inherits IO { \n\n num : Int;\n out : EList <- new EList;\n\n outgoing() : EList { out };\n\n number() : Int { num };\n\n init(n : Int) : SELF_TYPE {\n {\n num <- n;\n self;\n }\n };\n\n\n add_out(s : Edge) : SELF_TYPE {\n {\n\t out <- out.cons(s);\n self;\n }\n };\n\n print() : Object {\n {\n out_int(num);\n\t out.print();\n }\n };\n\n};\n\nclass Edge inherits IO {\n\n from : Int;\n to : Int;\n weight : Int;\n\n init(f : Int, t : Int, w : Int) : SELF_TYPE {\n {\n from <- f;\n\t to <- t;\n\t weight <- w;\n\t self;\n }\n };\n\n print() : Object {\n {\n out_string(\" (\");\n\t out_int(from);\n\t out_string(\",\");\n\t out_int(to);\n\t out_string(\")\");\n\t out_int(weight);\n }\n };\n\n};\n\n\n\nclass EList inherits IO {\n -- Define operations on empty lists of Edges.\n\n car : Edge;\n\n isNil() : Bool { true };\n\n head() : Edge { { abort(); car; } };\n\n tail() : EList { { abort(); self; } };\n\n -- When we cons and element onto the empty list we get a non-empty\n -- list. The (new Cons) expression creates a new list cell of class\n -- Cons, which is initialized by a dispatch to init().\n -- The result of init() is an element of class Cons, but it\n -- conforms to the return type List, because Cons is a subclass of\n -- List.\n\n cons(e : Edge) : EList {\n (new ECons).init(e, self)\n };\n\n append(l : EList) : EList {\n if self.isNil() then l\n else tail().append(l).cons(head())\n fi\n };\n\n print() : Object {\n out_string(\"\\n\")\n };\n\n};\n\n\n(*\n * Cons inherits all operations from List. We can reuse only the cons\n * method though, because adding an element to the front of an emtpy\n * list is the same as adding it to the front of a non empty\n * list. All other methods have to be redefined, since the behaviour\n * for them is different from the empty list.\n *\n * Cons needs an extra attribute to hold the rest of the list.\n *\n * The init() method is used by the cons() method to initialize the\n * cell.\n *)\n\nclass ECons inherits EList {\n\n cdr : EList;\t-- The rest of the list\n\n isNil() : Bool { false };\n\n head() : Edge { car };\n\n tail() : EList { cdr };\n\n init(e : Edge, rest : EList) : EList {\n {\n\t car <- e;\n\t cdr <- rest;\n\t self;\n }\n };\n\n print() : Object {\n {\n car.print();\n cdr.print();\n } \n };\n\n};\n\n\n\n\nclass VList inherits IO {\n -- Define operations on empty lists of vertices.\n\n car : Vertice;\n\n isNil() : Bool { true };\n\n head() : Vertice { { abort(); car; } };\n\n tail() : VList { { abort(); self; } };\n\n -- When we cons and element onto the empty list we get a non-empty\n -- list. The (new Cons) expression creates a new list cell of class\n -- ECons, which is initialized by a dispatch to init().\n -- The result of init() is an element of class Cons, but it\n -- conforms to the return type List, because Cons is a subclass of\n -- List.\n\n cons(v : Vertice) : VList {\n (new VCons).init(v, self)\n };\n\n print() : Object { out_string(\"\\n\") };\n\n};\n\n\nclass VCons inherits VList {\n\n cdr : VList;\t-- The rest of the list\n\n isNil() : Bool { false };\n\n head() : Vertice { car };\n\n tail() : VList { cdr };\n\n init(v : Vertice, rest : VList) : VList {\n {\n\t car <- v;\n\t cdr <- rest;\n\t self;\n }\n };\n\n print() : Object {\n {\n car.print();\n cdr.print();\n } \n };\n\n};\n\n\nclass Parse inherits IO {\n\n\n boolop : BoolOp <- new BoolOp;\n\n -- Reads the input and parses the fields\n\n read_input() : Graph {\n\n (let g : Graph <- new Graph in {\n (let line : String <- in_string() in\n while (boolop.and(not line=\"\\n\", not line=\"\")) loop {\n\t\t-- out_string(line);\n\t\t-- out_string(\"\\n\");\n\t\tg.add_vertice(parse_line(line));\n\t\tline <- in_string();\n\t } pool\n );\n\t g;\n } )\n };\n\n\n parse_line(s : String) : Vertice {\n (let v : Vertice <- (new Vertice).init(a2i(s)) in {\n\t while (not rest.length() = 0) loop {\n\t -- out_string(rest);\n\t -- out_string(\"\\n\");\n\t (let succ : Int <- a2i(rest) in (let\n\t weight : Int <- a2i(rest)\n in\n\t v.add_out(new Edge.init(v.number(), \n succ,\n\t\t\t\t\t weight))\n\t ) );\n\t } pool;\n\t v;\n }\n )\n };\n\n c2i(char : String) : Int {\n\tif char = \"0\" then 0 else\n\tif char = \"1\" then 1 else\n\tif char = \"2\" then 2 else\n if char = \"3\" then 3 else\n if char = \"4\" then 4 else\n if char = \"5\" then 5 else\n if char = \"6\" then 6 else\n if char = \"7\" then 7 else\n if char = \"8\" then 8 else\n if char = \"9\" then 9 else\n { abort(); 0; } -- the 0 is needed to satisfy the typchecker\n fi fi fi fi fi fi fi fi fi fi\n };\n\n rest : String;\n\n a2i(s : String) : Int {\n if s.length() = 0 then 0 else\n\tif s.substr(0,1) = \"-\" then ~a2i_aux(s.substr(1,s.length()-1)) else\n if s.substr(0,1) = \" \" then a2i(s.substr(1,s.length()-1)) else\n a2i_aux(s)\n fi fi fi\n };\n\n(*\n a2i_aux converts the usigned portion of the string. As a programming\nexample, this method is written iteratively.\n The conversion stops at a space or comma.\n As a side effect, r is set to the remaining string (without the comma).\n*)\n a2i_aux(s : String) : Int {\n\t(let int : Int <- 0 in\t\n {\t\n (let j : Int <- s.length() in\n\t (let i : Int <- 0 in\n\t\t while i < j loop\n\t\t\t(let c : String <- s.substr(i,1) in\n\t\t\t if (c = \" \") then\n\t\t\t {\n\t\t\t\t rest <- s.substr(i+1,s.length()-i-1);\n\t\t\t\t i <- j;\n\t\t\t }\n\t\t\t else if (c = \",\") then\n\t\t {\n\t\t\t\t rest <- s.substr(i+1, s.length()-i-1);\n\t\t\t\t i <- j;\n\t\t }\n\t\t\t else\n\t\t\t {\n\t\t\t\t int <- int * 10 + c2i(s.substr(i,1));\n\t\t\t\t i <- i + 1;\n\t\t\t\t if i=j then rest <- \"\" else \"\" fi;\n\t\t\t }\n\t\t\t fi fi\n\t\t\t)\n\t\t pool\n\t\t )\n\t );\n int;\n\t }\n )\n };\n\n};\n\n\nclass Main inherits Parse {\n\n g : Graph <- read_input();\n\n main() : Object {\n {\n\t g.print_V();\n g.print_E();\n }\n };\n\n};\n\nclass BoolOp {\n\n and(b1 : Bool, b2 : Bool) : Bool {\n if b1 then b2 else false fi\n };\n\n\n or(b1 : Bool, b2 : Bool) : Bool {\n if b1 then true else b2 fi\n };\n\n};\n';
        CoolProgramSources.Hs = '(* hairy . . .*)\n\nclass Foo inherits Bazz {\n a : Razz <- case self of\n\t\t n : Razz => (new Bar);\n\t\t n : Foo => (new Razz);\n\t\t n : Bar => n;\n \t esac;\n\n b : Int <- a.doh() + g.doh() + doh() + printh();\n\n doh() : Int { (let i : Int <- h in { h <- h + 2; i; } ) };\n\n};\n\nclass Bar inherits Razz {\n\n c : Int <- doh();\n\n d : Object <- printh();\n};\n\n\nclass Razz inherits Foo {\n\n e : Bar <- case self of\n\t\t n : Razz => (new Bar);\n\t\t n : Bar => n;\n\t\tesac;\n\n f : Int <- a@Bazz.doh() + g.doh() + e.doh() + doh() + printh();\n\n};\n\nclass Bazz inherits IO {\n\n h : Int <- 1;\n\n g : Foo <- case self of\n\t\t \tn : Bazz => (new Foo);\n\t\t \tn : Razz => (new Bar);\n\t\t\tn : Foo => (new Razz);\n\t\t\tn : Bar => n;\n\t\t esac;\n\n i : Object <- printh();\n\n printh() : Int { { out_int(h); 0; } };\n\n doh() : Int { (let i: Int <- h in { h <- h + 1; i; } ) };\n};\n\n(* scary . . . *)\nclass Main inherits IO {\n a : Bazz <- new Bazz;\n b : Foo <- new Foo;\n c : Razz <- new Razz;\n d : Bar <- new Bar;\n\n main(): String { { out_string(\"\\n\") ; \"do nothing\" ; } };\n\n};\n\n\n\n\n\n';
        CoolProgramSources.Life = '(* The Game of Life \n Tendo Kayiira, Summer \'95\n With code taken from / private / cool /class/examples/cells.cl\n\n This introduction was taken off the internet.It gives a brief \n description of the Game Of Life.It also gives the rules by which \n this particular game follows.\n\n\tIntroduction\n\n John Conway\'s Game of Life is a mathematical amusement, but it \n is also much more: an insight into how a system of simple \n cellualar automata can create complex, odd, and often aesthetically \n pleasing patterns. It is played on a cartesian grid of cells\n which are either \'on\' or \'off\' The game gets it\'s name from the \n similarity between the behaviour of these cells and the behaviour \n of living organisms.\n\n The Rules\n\n The playfield is a cartesian grid of arbitrary size.Each cell in \n this grid can be in an \'on\' state or an \'off\' state.On each \'turn\' \n(called a generation, ) the state of each cell changes simultaneously \n depending on it\'s state and the state of all cells adjacent to it.\n\n For \'on\' cells, \n If the cell has 0 or 1 neighbours which are \'on\', the cell turns \n \'off\'. (\'dies of loneliness\') \n If the cell has 2 or 3 neighbours which are \'on\', the cell stays \n \'on\'. (nothing happens to that cell) \n If the cell has 4, 5, 6, 7, 8, or 9 neighbours which are \'on\', \n the cell turns \'off\'. (\'dies of overcrowding\') \n\n For \'off\' cells, \n If the cell has 0, 1, 2, 4, 5, 6, 7, 8, or 9 neighbours which \n are \'on\', the cell stays \'off\'. (nothing happens to that cell) \n If the cell has 3 neighbours which are \'on\', the cell turns \n \'on\'. (3 neighbouring \'alive\' cells \'give birth\' to a fourth.) \n\n Repeat for as many generations as desired. \n\n *)\n \n\nclass Board inherits IO { \n \n rows : Int;\n columns : Int;\n board_size : Int;\n\n size_of_board(initial : String) : Int {\n initial.length()\n };\n\n board_init(start : String) : SELF_TYPE {\n (let size :Int <- size_of_board(start) in\n {\n\tif size = 15 then\n\t {\n\t rows <- 3;\n\t columns <- 5;\n\t board_size <- size;\n\t }\n\telse if size = 16 then\n\t {\n\t rows <- 4;\n\t columns <- 4;\n\t board_size <- size;\n\t }\n\telse if size = 20 then\n\t {\n\t rows <- 4;\n\t columns <- 5;\n\t board_size <- size;\n\t }\n\telse if size = 21 then\n\t {\n\t rows <- 3;\n\t columns <- 7;\n\t board_size <- size;\n\t }\n\telse if size = 25 then\n\t {\n\t rows <- 5;\n\t columns <- 5;\n\t board_size <- size;\n\t }\n\telse if size = 28 then\n\t {\n\t rows <- 7;\n\t columns <- 4;\n\t board_size <- size;\n\t }\n\telse \t-- If none of the above fit, then just give \n\t { -- the configuration of the most common board\n\t rows <- 5;\n\t columns <- 5;\n\t board_size <- size;\n\t }\n\tfi fi fi fi fi fi;\n\tself;\n }\n )\n };\n\n};\n\n\n\nclass CellularAutomaton inherits Board {\n population_map : String;\n \n init(map : String) : SELF_TYPE {\n {\n population_map <- map;\n\t board_init(map);\n self;\n }\n };\n\n\n\n \n print() : SELF_TYPE {\n \n\t(let i : Int <- 0 in\n\t(let num : Int <- board_size in\n\t{\n \tout_string(\"\\n\");\n\t while i < num loop\n {\n\t out_string(population_map.substr(i,columns));\n\t out_string(\"\\n\"); \n\t i <- i + columns;\n\t }\n\t pool;\n \tout_string(\"\\n\");\n\tself;\n\t}\n\t) ) \n };\n \n num_cells() : Int {\n population_map.length()\n };\n \n cell(position : Int) : String {\n\tif board_size - 1 < position then\n\t\t\" \"\n\telse \n \tpopulation_map.substr(position, 1)\n\tfi\n };\n \n north(position : Int): String {\n\tif (position - columns) < 0 then\n\t \" \"\t \n\telse\n\t cell(position - columns)\n\tfi\n };\n\n south(position : Int): String {\n\tif board_size < (position + columns) then\n\t \" \" \n\telse\n\t cell(position + columns)\n\tfi\n };\n\n east(position : Int): String {\n\tif (((position + 1) /columns ) * columns) = (position + 1) then\n\t \" \" \n\telse\n\t cell(position + 1)\n\tfi \n };\n\n west(position : Int): String {\n\tif position = 0 then\n\t \" \"\n\telse \n\t if ((position / columns) * columns) = position then\n\t \" \"\n\t else\n\t cell(position - 1)\n\tfi fi\n };\n\n northwest(position : Int): String {\n\tif (position - columns) < 0 then\n\t \" \"\t \n\telse if ((position / columns) * columns) = position then\n\t \" \"\n\t else\n\t\tnorth(position - 1)\n\tfi fi\n };\n\n northeast(position : Int): String {\n\tif (position - columns) < 0 then\n\t \" \"\t\n\telse if (((position + 1) /columns ) * columns) = (position + 1) then\n\t \" \" \n\t else\n\t north(position + 1)\n\tfi fi\n };\n\n southeast(position : Int): String {\n\tif board_size < (position + columns) then\n\t \" \" \n\telse if (((position + 1) /columns ) * columns) = (position + 1) then\n\t \" \" \n\t else\n\t south(position + 1)\n\tfi fi\n };\n\n southwest(position : Int): String {\n\tif board_size < (position + columns) then\n\t \" \" \n\telse if ((position / columns) * columns) = position then\n\t \" \"\n\t else\n\t south(position - 1)\n\tfi fi\n };\n\n neighbors(position: Int): Int { \n \t{\n\t if north(position) = \"X\" then 1 else 0 fi\n\t + if south(position) = \"X\" then 1 else 0 fi\n \t + if east(position) = \"X\" then 1 else 0 fi\n \t + if west(position) = \"X\" then 1 else 0 fi\n\t + if northeast(position) = \"X\" then 1 else 0 fi\n\t + if northwest(position) = \"X\" then 1 else 0 fi\n \t + if southeast(position) = \"X\" then 1 else 0 fi\n\t + if southwest(position) = \"X\" then 1 else 0 fi;\n\t }\n };\n\n \n(* A cell will live if 2 or 3 of it\'s neighbors are alive.It dies \n otherwise.A cell is born if only 3 of it\'s neighbors are alive. *)\n \n cell_at_next_evolution(position : Int) : String {\n\n\tif neighbors(position) = 3 then\n\t\t\"X\"\n\telse\n\t if neighbors(position) = 2 then\n\t\tif cell(position) = \"X\" then\n\t\t\t\"X\"\n\t\telse\n\t\t\t\"-\"\n\t fi\n\t else\n\t\t\"-\"\n\tfi fi\n };\n \n\n evolve() : SELF_TYPE {\n (let position : Int <- 0 in\n (let num : Int <- num_cells() in\n (let temp : String in\n {\n while position < num loop\n {\n temp <- temp.concat(cell_at_next_evolution(position));\n position <- position + 1;\n }\n pool;\n population_map <- temp;\n self;\n }\n ) ) )\n };\n\n(* This is where the background pattern is detremined by the user. More \n patterns can be added as long as whoever adds keeps the board either\n 3x5, 4x5, 5x5, 3x7, 7x4, 4x4 with the row first then column. *) \n option(): String {\n {\n (let num : Int in\n {\n out_string(\"\\nPlease chose a number:\\n\");\n out_string(\"\\t1: A cross\\n\"); \n out_string(\"\\t2: A slash from the upper left to lower right\\n\");\n out_string(\"\\t3: A slash from the upper right to lower left\\n\"); \n out_string(\"\\t4: An X\\n\"); \n out_string(\"\\t5: A greater than sign \\n\"); \n out_string(\"\\t6: A less than sign\\n\"); \n out_string(\"\\t7: Two greater than signs\\n\"); \n out_string(\"\\t8: Two less than signs\\n\"); \n out_string(\"\\t9: A \'V\'\\n\"); \n out_string(\"\\t10: An inverse \'V\'\\n\"); \n out_string(\"\\t11: Numbers 9 and 10 combined\\n\"); \n out_string(\"\\t12: A full grid\\n\"); \n out_string(\"\\t13: A \'T\'\\n\");\n out_string(\"\\t14: A plus \'+ \'\\n\");\n out_string(\"\\t15: A \'W\'\\n\");\n out_string(\"\\t16: An \'M\'\\n\");\n out_string(\"\\t17: An \'E\'\\n\");\n out_string(\"\\t18: A \'3\'\\n\");\n out_string(\"\\t19: An \'O\'\\n\");\n out_string(\"\\t20: An \'8\'\\n\");\n out_string(\"\\t21: An \'S\'\\n\");\n out_string(\"Your choice => \");\n num <- in_int();\n out_string(\"\\n\");\n if num = 1 then\n \t\" XX XXXX XXXX XX \"\n else if num = 2 then\n \t\" X X X X X \"\n else if num = 3 then\n \t\"X X X X X\"\n else if num = 4 then\n\t\"X X X X X X X X X\"\n else if num = 5 then\n\t\"X X X X X \"\n else if num = 6 then\n\t\" X X X X X\"\n else if num = 7 then\n\t\"X X X XX X \"\n else if num = 8 then\n\t\" X XX X X X \"\n else if num = 9 then\n\t\"X X X X X \"\n else if num = 10 then\n\t\" X X X X X\"\n else if num = 11 then\n\t\"X X X X X X X X\"\n else if num = 12 then\n\t\"XXXXXXXXXXXXXXXXXXXXXXXXX\"\n else if num = 13 then\n \t\"XXXXX X X X X \"\n else if num = 14 then\n \t\" X X XXXXX X X \"\n else if num = 15 then\n \t\"X X X X X X X \"\n else if num = 16 then\n \t\" X X X X X X X\"\n else if num = 17 then\n\t\"XXXXX X XXXXX X XXXX\"\n else if num = 18 then\n\t\"XXX X X X X XXXX \"\n else if num = 19 then\n\t\" XX X XX X XX \"\n else if num = 20 then\n\t\" XX X XX X XX X XX X XX \"\n else if num = 21 then\n\t\" XXXX X XX X XXXX \"\n else\n\t\" \"\n fi fi fi fi fi fi fi fi fi fi fi fi fi fi fi fi fi fi fi fi fi;\n }\n );\n }\n };\n\n\n\n\n prompt() : Bool { \n {\n (let ans : String in\n {\n out_string(\"Would you like to continue with the next generation? \\n\");\n out_string(\"Please use lowercase y or n for your answer [y]: \");\n ans <- in_string();\n out_string(\"\\n\");\n if ans = \"n\" then \n\tfalse\n else\n\ttrue\n fi;\n }\n );\n }\n };\n\n\n prompt2() : Bool { \n (let ans : String in\n {\n out_string(\"\\n\\n\");\n out_string(\"Would you like to choose a background pattern? \\n\");\n out_string(\"Please use lowercase y or n for your answer [n]: \");\n ans <- in_string();\n if ans = \"y\" then \n\ttrue\n else\n\tfalse\n fi;\n }\n )\n };\n\n\n};\n\nclass Main inherits CellularAutomaton {\n cells : CellularAutomaton;\n \n main() : SELF_TYPE {\n {\n\t (let continue : Bool in\n\t (let choice : String in\n\t {\n\t out_string(\"Welcome to the Game of Life.\\n\");\n\t out_string(\"There are many initial states to choose from. \\n\");\n\t while prompt2() loop\n\t {\n\t continue <- true;\n\t choice <- option();\n\t cells <- (new CellularAutomaton).init(choice);\n\t cells.print();\n while continue loop\n\t\tif prompt() then\n {\n cells.evolve();\n cells.print();\n }\n\t\telse\n\t\t continue <- false\n\t fi \n pool;\n }\n pool;\n\t self;\n } ) ); }\n };\n};\n\n';
        CoolProgramSources.NewComplex = 'class Main inherits IO {\n main() : SELF_TYPE {\n\t(let c : Complex <- (new Complex).init(1, 1) in\n\t {\n\t -- trivially equal (see CoolAid)\n\t if c.reflect_X() = c.reflect_0()\n\t then out_string(\"passed\\n\")\n\t else out_string(\"failed\\n\")\n\t fi;\n\t\t-- equal\n\t if c.reflect_X().reflect_Y().equal(c.reflect_0())\n\t then out_string(\"passed\\n\")\n\t else out_string(\"failed\\n\")\n\t fi;\n\t }\n\t)\n };\n};\n\nclass Complex inherits IO {\n x : Int;\n y : Int;\n\n init(a : Int, b : Int) : Complex {\n\t{\n\t x <- a;\n\t y <- b;\n\t self;\n\t}\n };\n\n print() : Object {\n\tif y = 0\n\tthen out_int(x)\n\telse out_int(x).out_string(\"+\").out_int(y).out_string(\"I\")\n\tfi\n };\n\n reflect_0() : Complex {\n\t{\n\t x <- ~x;\n\t y <- ~y;\n\t self;\n\t}\n };\n\n reflect_X() : Complex {\n\t{\n\t y <- ~y;\n\t self;\n\t}\n };\n\n reflect_Y() : Complex {\n\t{\n\t x <- ~x;\n\t self;\n\t}\n };\n\n equal(d : Complex) : Bool {\n\tif x = d.x_value()\n\tthen\n\t if y = d.y_value()\n\t then true\n\t else false\n\t fi\n\telse false\n\tfi\n };\n\n x_value() : Int {\n\tx\n };\n\n y_value() : Int {\n\ty\n };\n};\n';
        CoolProgramSources.Primes = '\n(*\n * methodless-primes.cl\n *\n * Designed by Jesse H. Willett, jhw@cory, 11103234, with \n * Istvan Siposs, isiposs@cory, 12342921.\n *\n * This program generates primes in order without using any methods.\n * Actually, it does use three methods: those of IO to print out each\n * prime, and abort() to halt the program. These methods are incidental,\n * however, to the information-processing functionality of the program. We\n * could regard the attribute \'out\'s sequential values as our output, and\n * the string \"halt\" as our terminate signal.\n *\n * Naturally, using Cool this way is a real waste, basically reducing it \n * to assembly without the benefit of compilation. \n *\n * There could even be a subroutine-like construction, in that different\n * code could be in the assign fields of attributes of other classes,\n * and it could be executed by calling \'new Sub\', but no parameters\n * could be passed to the subroutine, and it could only return itself.\n * but returning itself would be useless since we couldn\'t call methods\n * and the only operators we have are for Int and Bool, which do nothing\n * interesting when we initialize them!\n *)\n\nclass Main inherits IO {\n\n main() : Int {\t-- main() is an atrophied method so we can parse.\n 0 \n }; \n\n out : Int < -\t\t-- out is our \'output\'.Its values are the primes.\n {\n out_string(\"2 is trivially prime.\\n\");\n 2;\n };\n\n testee : Int <- out;\t-- testee is a number to be tested for primeness. \n\n divisor : Int;\t-- divisor is a number which may factor testee.\n\n stop : Int <- 500;\t-- stop is an arbitrary value limiting testee. \t\n\n m : Object <-\t\t-- m supplants the main method.\n while true loop \n {\n\n testee <- testee + 1;\n divisor <- 2;\n\n while \n if testee < divisor * divisor \n then false \t\t-- can stop if divisor > sqrt(testee).\n\t else if testee - divisor*(testee/divisor) = 0 \n then false \t\t-- can stop if divisor divides testee. \n else true\n fi fi \n loop \n divisor <- divisor + 1\n pool; \n\n if testee < divisor * divisor\t-- which reason did we stop for?\n then \t-- testee has no factors less than sqrt(testee).\n {\n out <- testee;\t-- we could think of out itself as the output.\n out_int(out); \n out_string(\" is prime.\\n\");\n }\n else\t-- the loop halted on testee/divisor = 0, testee isn\'t prime.\n 0\t-- testee isn\'t prime, do nothing.\n\tfi; \t\n\n if stop <= testee then \n \"halt\".abort()\t-- we could think of \"halt\" as SIGTERM.\n else \n \"continue\"\n fi; \n\n } \n pool;\n\n}; (* end of Main *)\n\n';
        CoolProgramSources.SortList = '(*\n This file presents a fairly large example of Cool programming. The\nclass List defines the names of standard list operations ala Scheme:\ncar, cdr, cons, isNil, rev, sort, rcons (add an element to the end of\nthe list), and print_list. In the List class most of these functions\nare just stubs that abort if ever called. The classes Nil and Cons\ninherit from List and define the same operations, but now as\nappropriate to the empty list (for the Nil class) and for cons cells (for\nthe Cons class).\n\nThe Main class puts all of this code through the following silly \ntest exercise:\n\n 1. prompt for a number N\n 2. generate a list of numbers 0..N-1\n 3. reverse the list\n 4. sort the list\n 5. print the sorted list\n\nBecause the sort used is a quadratic space insertion sort, sorting\nmoderately large lists can be quite slow. \n*)\n\nClass List inherits IO { \n (* Since abort() returns Object, we need something of\n\t type Bool at the end of the block to satisfy the typechecker. \n This code is unreachable, since abort() halts the program. *)\n\tisNil() : Bool { { abort(); true; } };\n\n\tcons(hd : Int) : Cons {\n\t (let new_cell : Cons <- new Cons in\n\t\tnew_cell.init(hd,self)\n\t )\n\t};\n\n\t(* \n\t Since abort \"returns\" type Object, we have to add\n\t an expression of type Int here to satisfy the typechecker.\n\t This code is, of course, unreachable.\n *)\n\tcar() : Int { { abort(); new Int; } };\n\n\tcdr() : List { { abort(); new List; } };\n\n\trev() : List { cdr() };\n\n\tsort() : List { cdr() };\n\n\tinsert(i : Int) : List { cdr() };\n\n\trcons(i : Int) : List { cdr() };\n\t\n\tprint_list() : Object { abort() };\n};\n\nClass Cons inherits List {\n\txcar : Int; -- We keep the car in cdr in attributes.\n\txcdr : List; \n\n\tisNil() : Bool { false };\n\n\tinit(hd : Int, tl : List) : Cons {\n\t {\n\t xcar <- hd;\n\t xcdr <- tl;\n\t self;\n\t }\n\t};\n\t \n\tcar() : Int { xcar };\n\n\tcdr() : List { xcdr };\n\n\trev() : List { (xcdr.rev()).rcons(xcar) };\n\n\tsort() : List { (xcdr.sort()).insert(xcar) };\n\n\tinsert(i : Int) : List {\n\t\tif i < xcar then\n\t\t\t(new Cons).init(i,self)\n\t\telse\n\t\t\t(new Cons).init(xcar,xcdr.insert(i))\n\t\tfi\n\t};\n\n\n\trcons(i : Int) : List { (new Cons).init(xcar, xcdr.rcons(i)) };\n\n\tprint_list() : Object {\n\t\t{\n\t\t out_int(xcar);\n\t\t out_string(\"\\n\");\n\t\t xcdr.print_list();\n\t\t}\n\t};\n};\n\nClass Nil inherits List {\n\tisNil() : Bool { true };\n\n rev() : List { self };\n\n\tsort() : List { self };\n\n\tinsert(i : Int) : List { rcons(i) };\n\n\trcons(i : Int) : List { (new Cons).init(i,self) };\n\n\tprint_list() : Object { true };\n\n};\n\n\nClass Main inherits IO {\n\n\tl : List;\n\n\t(* iota maps its integer argument n into the list 0..n-1 *)\n\tiota(i : Int) : List {\n\t {\n\t\tl <- new Nil;\n\t\t(let j : Int <- 0 in\n\t\t while j < i \n\t\t loop \n\t\t {\n\t\t l <- (new Cons).init(j,l);\n\t\t j <- j + 1;\n\t\t } \n\t\t pool\n\t\t);\n\t\tl;\n\t }\n\t};\t\t\n\n\tmain() : Object {\n\t {\n\t out_string(\"How many numbers to sort? \");\n\t iota(in_int()).rev().sort().print_list();\n\t }\n\t};\n};\t\t\t \n\n\n\n\n\n';
    })(CoolProgramSources = CoolToJS.CoolProgramSources || (CoolToJS.CoolProgramSources = {}));
})(CoolToJS || (CoolToJS = {}));
var CoolToJS;
(function (CoolToJS) {
    // finds all Cool program sources referenced in 
    // <script type="text/cool"> elements and returns 
    // them asynchonously via the completedCallback
    function GetReferencedCoolSources(completedCallback) {
        // get all <script> elements of type "text/cool" and get the script's source as a string
        var coolProgramReferences = document.querySelectorAll('script[type="text/cool"]');
        var coolPrograms = [];
        for (var i = 0; i < coolProgramReferences.length; i++) {
            var filename = coolProgramReferences[i].attributes['src'].value;
            // call a separate function here to avoid closure problem
            getCoolProgramText(i, filename);
        }
        function getCoolProgramText(index, filename) {
            makeAjaxRequest(filename, function (responseText) {
                coolPrograms[index] = ({ filename: filename, program: responseText });
                // if all ajax calls have returned, execute the callback with the Cool source 
                if (coolPrograms.length == coolProgramReferences.length) {
                    completedCallback(coolPrograms.map(function (x) {
                        return x.program;
                    }));
                }
            });
        }
        // generic function to make AJAX call
        function makeAjaxRequest(url, successCallback, errorCallback) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                    if (xmlhttp.status == 200) {
                        successCallback(xmlhttp.responseText);
                    }
                    else {
                        if (errorCallback) {
                            errorCallback();
                        }
                    }
                }
            };
            xmlhttp.open('GET', url, true);
            xmlhttp.send();
        }
    }
    CoolToJS.GetReferencedCoolSources = GetReferencedCoolSources;
})(CoolToJS || (CoolToJS = {}));
var CoolToJS;
(function (CoolToJS) {
    var LexicalAnalyzer = (function () {
        function LexicalAnalyzer() {
            var _this = this;
            this.tabLength = 4;
            this.Analyze = function (coolProgramSource) {
                var tokens = [], currentLineNumber = 1, currentColumnNumber = 1, errorMessages = [];
                while (coolProgramSource.length > 0) {
                    var longestMatch = null;
                    for (var i = 0; i < CoolToJS.TokenLookup.length; i++) {
                        var currentTokenOption = CoolToJS.TokenLookup[i], matchIsKeyword = CoolToJS.isKeyword(currentTokenOption.token), matchString = null;
                        if (currentTokenOption.matchFunction) {
                            matchString = currentTokenOption.matchFunction(coolProgramSource);
                        }
                        else {
                            var match = currentTokenOption.regex.exec(coolProgramSource);
                            if (match !== null && typeof match[1] !== 'undefined') {
                                matchString = match[1];
                            }
                            else {
                                matchString = null;
                            }
                        }
                        if (!matchString) {
                            continue;
                        }
                        if (!longestMatch || matchString.length > longestMatch.match.length) {
                            longestMatch = {
                                token: currentTokenOption.token,
                                match: matchString,
                                location: {
                                    line: currentLineNumber,
                                    column: currentColumnNumber,
                                    length: matchString.length
                                }
                            };
                        }
                    }
                    if (longestMatch) {
                        // we successfully found a match
                        if (longestMatch.token === 24 /* NewLine */) {
                            currentLineNumber++;
                            currentColumnNumber = 1;
                        }
                        else if (longestMatch.token === 19 /* String */ || longestMatch.token === 26 /* Comment */) {
                            // strings and comments can also have newlines 
                            // in them, if they're multi-line
                            var lines = longestMatch.match.split('\n');
                            currentLineNumber += lines.length - 1;
                            if (lines.length > 1) {
                                currentColumnNumber = lines[lines.length - 1].length + 1;
                            }
                        }
                        else if (longestMatch.token === 25 /* Tab */) {
                            currentColumnNumber += _this.tabLength;
                        }
                        else if (longestMatch.token !== 23 /* CarriageReturn */) {
                            // update the column counter
                            currentColumnNumber += longestMatch.match.length;
                        }
                        tokens.push(longestMatch);
                        coolProgramSource = coolProgramSource.slice(longestMatch.match.length);
                    }
                    else {
                        // we weren't able to find a match
                        var errorMessage = 'Line ' + currentLineNumber + ', column ' + currentColumnNumber + ':\tSyntax error: Unexpected character sequence near "' + coolProgramSource.slice(0, 20).replace(/\r\n|\r|\n|\t|[\s]+/g, ' ') + '..."';
                        // figure out an approximate length of the error token
                        var untilWhitespaceMatch = /^([^\s]*)/.exec(coolProgramSource);
                        if (untilWhitespaceMatch === null || typeof untilWhitespaceMatch[1] === 'undefined') {
                            var length = 1;
                        }
                        else {
                            var length = untilWhitespaceMatch[1].length;
                        }
                        errorMessages.push({
                            message: errorMessage,
                            location: {
                                line: currentLineNumber,
                                column: currentColumnNumber,
                                length: length
                            }
                        });
                        // chop off the problematic chunk of input and try to keep analyzing
                        coolProgramSource = coolProgramSource.slice(length);
                        currentColumnNumber += length;
                    }
                }
                //for (var i = 0; i < tokens.length; i++) {
                //    console.log(TokenType[tokens[i].token] + ': "' + tokens[i].match + '", line: ' + tokens[i].location.line + ', column: ' + tokens[i].location.column);
                //}
                return {
                    success: errorMessages.length === 0,
                    tokens: tokens,
                    errorMessages: errorMessages
                };
            };
        }
        return LexicalAnalyzer;
    })();
    CoolToJS.LexicalAnalyzer = LexicalAnalyzer;
})(CoolToJS || (CoolToJS = {}));
var CoolToJS;
(function (CoolToJS) {
    var Parser = (function () {
        function Parser() {
            this.Parse = function (tokens) {
                return {
                    success: true,
                    parseTree: {}
                };
            };
        }
        return Parser;
    })();
    CoolToJS.Parser = Parser;
})(CoolToJS || (CoolToJS = {}));
var CoolToJS;
(function (CoolToJS) {
    (function (TokenType) {
        TokenType[TokenType["ClassKeyword"] = 0] = "ClassKeyword";
        TokenType[TokenType["ElseKeyword"] = 1] = "ElseKeyword";
        TokenType[TokenType["FalseKeyword"] = 2] = "FalseKeyword";
        TokenType[TokenType["FiKeyword"] = 3] = "FiKeyword";
        TokenType[TokenType["IfKeyword"] = 4] = "IfKeyword";
        TokenType[TokenType["InheritsKeyword"] = 5] = "InheritsKeyword";
        TokenType[TokenType["IsvoidKeyword"] = 6] = "IsvoidKeyword";
        TokenType[TokenType["LetKeyword"] = 7] = "LetKeyword";
        TokenType[TokenType["LoopKeyword"] = 8] = "LoopKeyword";
        TokenType[TokenType["PoolKeyword"] = 9] = "PoolKeyword";
        TokenType[TokenType["ThenKeyword"] = 10] = "ThenKeyword";
        TokenType[TokenType["WhileKeyword"] = 11] = "WhileKeyword";
        TokenType[TokenType["CaseKeyword"] = 12] = "CaseKeyword";
        TokenType[TokenType["EsacKeyword"] = 13] = "EsacKeyword";
        TokenType[TokenType["NewKeyword"] = 14] = "NewKeyword";
        TokenType[TokenType["OfKeyword"] = 15] = "OfKeyword";
        TokenType[TokenType["NotKeyword"] = 16] = "NotKeyword";
        TokenType[TokenType["TrueKeyword"] = 17] = "TrueKeyword";
        TokenType[TokenType["Integer"] = 18] = "Integer";
        TokenType[TokenType["String"] = 19] = "String";
        TokenType[TokenType["ObjectIdentifier"] = 20] = "ObjectIdentifier";
        TokenType[TokenType["TypeIdentifier"] = 21] = "TypeIdentifier";
        TokenType[TokenType["WhiteSpace"] = 22] = "WhiteSpace";
        TokenType[TokenType["CarriageReturn"] = 23] = "CarriageReturn";
        TokenType[TokenType["NewLine"] = 24] = "NewLine";
        TokenType[TokenType["Tab"] = 25] = "Tab";
        TokenType[TokenType["Comment"] = 26] = "Comment";
        TokenType[TokenType["DotOperator"] = 27] = "DotOperator";
        TokenType[TokenType["AtSignOperator"] = 28] = "AtSignOperator";
        TokenType[TokenType["TildeOperator"] = 29] = "TildeOperator";
        TokenType[TokenType["MultiplationOperator"] = 30] = "MultiplationOperator";
        TokenType[TokenType["DivisionOperator"] = 31] = "DivisionOperator";
        TokenType[TokenType["AdditionOperator"] = 32] = "AdditionOperator";
        TokenType[TokenType["SubtrationOperator"] = 33] = "SubtrationOperator";
        TokenType[TokenType["LessThanOrEqualsOperator"] = 34] = "LessThanOrEqualsOperator";
        TokenType[TokenType["LessThanOperator"] = 35] = "LessThanOperator";
        TokenType[TokenType["EqualsOperator"] = 36] = "EqualsOperator";
        TokenType[TokenType["AssignmentOperator"] = 37] = "AssignmentOperator";
        TokenType[TokenType["FatArrowOperator"] = 38] = "FatArrowOperator";
        TokenType[TokenType["OpenParenthesis"] = 39] = "OpenParenthesis";
        TokenType[TokenType["ClosedParenthesis"] = 40] = "ClosedParenthesis";
        TokenType[TokenType["OpenCurlyBracket"] = 41] = "OpenCurlyBracket";
        TokenType[TokenType["ClosedCurlyBracket"] = 42] = "ClosedCurlyBracket";
        TokenType[TokenType["Colon"] = 43] = "Colon";
        TokenType[TokenType["SemiColon"] = 44] = "SemiColon";
        TokenType[TokenType["Comma"] = 45] = "Comma";
    })(CoolToJS.TokenType || (CoolToJS.TokenType = {}));
    var TokenType = CoolToJS.TokenType;
    // order signifies priority (keywords are listed first)
    CoolToJS.TokenLookup = [
        {
            token: 0 /* ClassKeyword */,
            regex: /^(class)\b/i,
        },
        {
            token: 1 /* ElseKeyword */,
            regex: /^(else)\b/i,
        },
        {
            token: 2 /* FalseKeyword */,
            regex: /^(f[aA][lL][sS][eE])\b/,
        },
        {
            token: 17 /* TrueKeyword */,
            regex: /^(t[rR][uU][eE])\b/,
        },
        {
            token: 3 /* FiKeyword */,
            regex: /^(fi)\b/i,
        },
        {
            token: 4 /* IfKeyword */,
            regex: /^(if)\b/i,
        },
        {
            token: 5 /* InheritsKeyword */,
            regex: /^(inherits)\b/i,
        },
        {
            token: 6 /* IsvoidKeyword */,
            regex: /^(isvoid)\b/i,
        },
        {
            token: 7 /* LetKeyword */,
            regex: /^(let)\b/i,
        },
        {
            token: 8 /* LoopKeyword */,
            regex: /^(loop)\b/i,
        },
        {
            token: 9 /* PoolKeyword */,
            regex: /^(pool)\b/i,
        },
        {
            token: 10 /* ThenKeyword */,
            regex: /^(then)\b/i,
        },
        {
            token: 11 /* WhileKeyword */,
            regex: /^(while)\b/i,
        },
        {
            token: 12 /* CaseKeyword */,
            regex: /^(case)\b/i,
        },
        {
            token: 13 /* EsacKeyword */,
            regex: /^(esac)\b/i,
        },
        {
            token: 14 /* NewKeyword */,
            regex: /^(new)\b/i,
        },
        {
            token: 15 /* OfKeyword */,
            regex: /^(of)\b/i,
        },
        {
            token: 16 /* NotKeyword */,
            regex: /^(not)\b/i,
        },
        {
            token: 18 /* Integer */,
            regex: /^([0-9]+)\b/,
        },
        {
            token: 19 /* String */,
            matchFunction: function (input) {
                if (input.indexOf('"Hello') === 0) {
                    console.log('sdfsd');
                }
                // for a single-line string
                var singleLineMatch = /^("(?:[^\\]|\\.)*?")/.exec(input);
                if (singleLineMatch !== null && typeof singleLineMatch[1] !== 'undefined') {
                    return singleLineMatch[1];
                }
                // for a multi-line string
                var fullMatch = null;
                var firstLineMatch = /^(".*\\[\s]*\n)/.exec(input);
                if (firstLineMatch !== null && typeof firstLineMatch[1] !== 'undefined') {
                    if (stringContainsUnescapedQuotes(firstLineMatch[1])) {
                        return null;
                    }
                    fullMatch = firstLineMatch[1];
                    input = input.slice(firstLineMatch[1].length);
                    var middleLineRegex = /^(.*\\[\s]*\n)/;
                    var middleLineMatch = middleLineRegex.exec(input);
                    while (middleLineMatch !== null && typeof middleLineMatch[1] !== 'undefined' && !(stringContainsUnescapedQuotes(middleLineMatch[1]))) {
                        fullMatch += middleLineMatch[1];
                        input = input.slice(middleLineMatch[1].length);
                        middleLineMatch = middleLineRegex.exec(input);
                    }
                    var lastLineMatch = /^(.*?[^\\]")/.exec(input);
                    if (lastLineMatch !== null && lastLineMatch[1] !== 'undefined') {
                        fullMatch += lastLineMatch[1];
                        return fullMatch;
                    }
                    else {
                        return null;
                    }
                }
                else {
                    return null;
                }
            }
        },
        {
            token: 20 /* ObjectIdentifier */,
            regex: /^([a-z][a-zA-Z0-9_]*)\b/,
        },
        {
            token: 21 /* TypeIdentifier */,
            regex: /^([A-Z][a-zA-Z0-9_]*)\b/,
        },
        {
            token: 22 /* WhiteSpace */,
            regex: /^( +)/,
        },
        {
            token: 23 /* CarriageReturn */,
            regex: /^(\r)/,
        },
        {
            token: 24 /* NewLine */,
            regex: /^(\n)/,
        },
        {
            token: 25 /* Tab */,
            regex: /^(\t)/,
        },
        {
            token: 26 /* Comment */,
            regex: /^((?:--.*)|(?:\(\*(?:(?!\*\))[\s\S])*\*\)))/,
        },
        {
            token: 27 /* DotOperator */,
            regex: /^(\.)/
        },
        {
            token: 28 /* AtSignOperator */,
            regex: /^(\@)/
        },
        {
            token: 29 /* TildeOperator */,
            regex: /^(~)/
        },
        {
            token: 30 /* MultiplationOperator */,
            regex: /^(\*)/
        },
        {
            token: 31 /* DivisionOperator */,
            regex: /^(\/)/
        },
        {
            token: 32 /* AdditionOperator */,
            regex: /^(\+)/
        },
        {
            token: 33 /* SubtrationOperator */,
            regex: /^(-)/
        },
        {
            token: 34 /* LessThanOrEqualsOperator */,
            regex: /^(<=)/
        },
        {
            token: 35 /* LessThanOperator */,
            regex: /^(<)/
        },
        {
            token: 36 /* EqualsOperator */,
            regex: /^(=)/
        },
        {
            token: 37 /* AssignmentOperator */,
            regex: /^(<-)/
        },
        {
            token: 38 /* FatArrowOperator */,
            regex: /^(=>)/
        },
        {
            token: 39 /* OpenParenthesis */,
            regex: /^(\()/
        },
        {
            token: 40 /* ClosedParenthesis */,
            regex: /^(\))/
        },
        {
            token: 41 /* OpenCurlyBracket */,
            regex: /^(\{)/
        },
        {
            token: 42 /* ClosedCurlyBracket */,
            regex: /^(\})/
        },
        {
            token: 43 /* Colon */,
            regex: /^(:)/
        },
        {
            token: 44 /* SemiColon */,
            regex: /^(;)/
        },
        {
            token: 45 /* Comma */,
            regex: /^(,)/
        }
    ];
    function isKeyword(tokenType) {
        return (tokenType == 0 /* ClassKeyword */ || tokenType == 1 /* ElseKeyword */ || tokenType == 2 /* FalseKeyword */ || tokenType == 3 /* FiKeyword */ || tokenType == 4 /* IfKeyword */ || tokenType == 5 /* InheritsKeyword */ || tokenType == 6 /* IsvoidKeyword */ || tokenType == 7 /* LetKeyword */ || tokenType == 8 /* LoopKeyword */ || tokenType == 9 /* PoolKeyword */ || tokenType == 10 /* ThenKeyword */ || tokenType == 11 /* WhileKeyword */ || tokenType == 12 /* CaseKeyword */ || tokenType == 13 /* EsacKeyword */ || tokenType == 14 /* NewKeyword */ || tokenType == 15 /* OfKeyword */ || tokenType == 16 /* NotKeyword */ || tokenType == 17 /* TrueKeyword */);
    }
    CoolToJS.isKeyword = isKeyword;
    function stringContainsUnescapedQuotes(input, ignoreFinalQuote) {
        if (ignoreFinalQuote === void 0) { ignoreFinalQuote = false; }
        if (ignoreFinalQuote) {
            return /[^\\]".+/.test(input);
        }
        else {
            return /[^\\]"/.test(input);
        }
    }
})(CoolToJS || (CoolToJS = {}));
var CoolToJS;
(function (CoolToJS) {
    // temporary
    var generatedJavaScriptExample = '\
// note that this generated code is currently hardcoded\n\
// while the transpiler is being built\n\
\n\
function _out_string(output) {\n\
    window.consoleController.report([{\n\
        msg: output,\n\
        className: "jquery-console-output"\n\
    }]);\n\
}\n\
\n\
function _in_string(callback) {\n\
    window.inputFunction = function(input) {\n\
        callback(input);\n\
    };\n\
}\n\
\n\
var hello = "Hello, ",\n\
	name = "",\n\
    ending = "!\\n";\n\
\n\
_out_string("Please enter your name:\\n");\n\
_in_string(function(input) {\n\
    name = input;\n\
    _out_string(hello + name + ending);\n\
});\n\
';
    function Transpile(transpilerOptions) {
        var coolProgramSources = transpilerOptions.coolProgramSources;
        if (typeof coolProgramSources === 'string') {
            var concatenatedCoolProgram = coolProgramSources;
        }
        else {
            var concatenatedCoolProgram = coolProgramSources.join('\n');
        }
        if (transpilerOptions.out_string) {
            var out_string = transpilerOptions.out_string;
        }
        else {
            var out_string = function (output) {
                console.log(output);
            };
        }
        if (transpilerOptions.out_int) {
            var out_int = transpilerOptions.out_int;
        }
        else {
            var out_int = function (output) {
                console.log(output);
            };
        }
        if (transpilerOptions.in_string) {
            var in_string = transpilerOptions.in_string;
        }
        else {
            var in_string = function (onInput) {
            };
        }
        if (transpilerOptions.in_int) {
            var in_int = transpilerOptions.in_int;
        }
        else {
            var in_int = function (onInput) {
            };
        }
        var lexicalAnalyzer = new CoolToJS.LexicalAnalyzer();
        var lexicalAnalyzerOutput = lexicalAnalyzer.Analyze(concatenatedCoolProgram);
        if (!lexicalAnalyzerOutput.success) {
            return {
                success: false,
                errorMessages: lexicalAnalyzerOutput.errorMessages
            };
        }
        var parser = new CoolToJS.Parser();
        var parserOutput = parser.Parse(lexicalAnalyzerOutput.tokens);
        if (!parserOutput.success) {
            return {
                success: false,
                errorMessages: parserOutput.errorMessages
            };
        }
        return {
            success: true,
            generatedJavaScript: generatedJavaScriptExample
        };
    }
    CoolToJS.Transpile = Transpile;
})(CoolToJS || (CoolToJS = {}));
//# sourceMappingURL=cooltojs-0.0.1.js.map